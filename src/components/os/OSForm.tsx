import { useState, useEffect } from 'react'
import type { OrdemServico, ItemOS } from '../../types/schema'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { ItemOSRow } from './ItemOSRow'
import { BobinaResult } from '../bobina/BobinaResult'
import { calculateRequiredWidth, suggestBestBobina } from '../../lib/calculations'
import { Plus, Save, ArrowLeft } from 'lucide-react'

// Bobinas padrão da gráfica
const BOBINAS_DISPONIVEIS = [200, 300, 400, 500, 600, 800, 1000]

interface OSFormProps {
  initialData?: Partial<OrdemServico>
  initialItems?: ItemOS[]
  onSave: (os: Partial<OrdemServico>, items: ItemOS[]) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function OSForm({ initialData, initialItems = [], onSave, onCancel, isSubmitting }: OSFormProps) {
  const [os, setOs] = useState<Partial<OrdemServico>>(initialData || {
    numero_os: '',
    cliente: '',
    status: 'aberta'
  })
  
  const [items, setItems] = useState<ItemOS[]>(initialItems)
  const [larguraNecessaria, setLarguraNecessaria] = useState(0)
  const [larguraBobina, setLarguraBobina] = useState(0)

  useEffect(() => {
    const width = calculateRequiredWidth(items)
    setLarguraNecessaria(width)
    
    const suggested = suggestBestBobina(width, BOBINAS_DISPONIVEIS)
    setLarguraBobina(suggested || 0)
  }, [items])

  const addItem = () => {
    const newItem: ItemOS = {
      id: crypto.randomUUID(),
      os_id: os.id || '',
      descricao: '',
      largura_mm: 0,
      comprimento_mm: 0,
      repeticoes: 1,
      quantidade: 0
    }
    setItems([...items, newItem])
  }

  const updateItem = (id: string, updates: Partial<ItemOS>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button onClick={() => onSave(os, items)} disabled={isSubmitting} className="gap-2">
          <Save className="w-4 h-4" /> Salvar OS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <label className="text-sm font-medium">Número da OS</label>
          <Input 
            value={os.numero_os} 
            onChange={e => setOs({...os, numero_os: e.target.value})}
            placeholder="Ex: OS-2024-001"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cliente</label>
          <Input 
            value={os.cliente} 
            onChange={e => setOs({...os, cliente: e.target.value})}
            placeholder="Nome do cliente"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Itens da OS</h2>
          <Button variant="outline" size="sm" onClick={addItem} className="gap-2">
            <Plus className="w-4 h-4" /> Adicionar Item
          </Button>
        </div>

        <div className="space-y-2">
          {items.map(item => (
            <ItemOSRow 
              key={item.id} 
              item={item} 
              onUpdate={updateItem} 
              onDelete={deleteItem}
              disabled={os.status === 'fechada'}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500">
              Nenhum item adicionado.
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-4">
        <BobinaResult 
          larguraNecessaria={larguraNecessaria} 
          larguraBobina={larguraBobina}
        />
      </div>
    </div>
  )
}
