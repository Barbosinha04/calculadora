import { supabase } from '../lib/supabase'
import { useOSStore } from '../stores/osStore'
import type { OrdemServico, ItemOS } from '../types/schema'

export function useOS() {
  const { setOrders, setLoading, setError, addOrder, updateOrder, deleteOrder, setItems } = useOSStore()

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ordem_servico' as any)
        .select('*')
        .order('data_criacao', { ascending: false })
      
      if (error) throw error
      setOrders((data as OrdemServico[]) || [])
    } catch (err: any) {
      const message = err.code === '42P01' 
        ? 'Tabela "ordem_servico" não encontrada. Execute o script SQL de migração.' 
        : err.message
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchOSItems = async (osId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('item_os' as any)
        .select('*')
        .eq('os_id', osId)
      
      if (error) throw error
      setItems(data || [])
      return data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createOS = async (os: Partial<OrdemServico>, items: ItemOS[]) => {
    setLoading(true)
    try {
      // Usando upsert para evitar erros de conflito e ser mais flexível
      const { data: osData, error: osError } = await supabase
        .from('ordem_servico' as any)
        .upsert([os as any])
        .select()
        .single()
      
      if (osError) throw osError

      const itemsToInsert = items.map(item => ({
        ...item,
        os_id: (osData as any).id,
        id: undefined
      }))

      // Limpa itens se existirem (caso seja um re-save acidental)
      await supabase.from('item_os' as any).delete().eq('os_id', (osData as any).id)

      const { error: itemsError } = await supabase
        .from('item_os' as any)
        .insert(itemsToInsert as any)
      
      if (itemsError) throw itemsError

      addOrder(osData as OrdemServico)
      fetchOrders() // Recarrega para garantir sincronia
      return osData
    } catch (err: any) {
      const message = err.code === '23505' 
        ? 'Este número de OS já existe. Remova a restrição UNIQUE no Supabase para permitir duplicatas.'
        : err.message
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateOS = async (osId: string, os: Partial<OrdemServico>, items: ItemOS[]) => {
    setLoading(true)
    try {
      const { error: osError } = await supabase
        .from('ordem_servico' as any)
        .update(os as any)
        .eq('id', osId)
      
      if (osError) throw osError

      await supabase
        .from('item_os' as any)
        .delete()
        .eq('os_id', osId)

      const itemsToInsert = items.map(item => ({
        ...item,
        os_id: osId,
        id: undefined
      }))

      const { error: itemsError } = await supabase
        .from('item_os' as any)
        .insert(itemsToInsert as any)
      
      if (itemsError) throw itemsError

      updateOrder(osId, os)
      return true
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeOS = async (osId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('ordem_servico' as any)
        .delete()
        .eq('id', osId)
      
      if (error) throw error
      deleteOrder(osId)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateOSStatus = async (osId: string, status: OrdemServico['status']) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('ordem_servico' as any)
        .update({ status } as any)
        .eq('id', osId)
      
      if (error) throw error
      updateOrder(osId, { status })
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchOrders,
    fetchOSItems,
    createOS,
    updateOS,
    removeOS,
    updateOSStatus,
  }
}
