import { useEffect, useState } from 'react'
import { useOS } from '../hooks/useOS'
import { useOSStore } from '../stores/osStore'
import { OSTable } from '../components/os/OSTable'
import { OSForm } from '../components/os/OSForm'
import { Button } from '../components/ui/Button'
import { Plus, BarChart3, Clock, CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react'
import { Spinner } from '../components/ui/Spinner'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import type { OrdemServico } from '../types/schema'

export function Dashboard() {
  const { fetchOrders, fetchOSItems, createOS, updateOS, removeOS, updateOSStatus } = useOS()
  const { orders, items, isLoading, error, setError } = useOSStore()
  const [isCreating, setIsCreating] = useState(false)
  const [editingOS, setEditingOS] = useState<OrdemServico | null>(null)
  const [viewingOS, setViewingOS] = useState<OrdemServico | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const displayedOrders = showAll ? orders : orders.slice(0, 5)

  const stats = [
    { label: 'OS Abertas', value: orders.filter(o => o.status === 'aberta').length, icon: Clock, color: 'text-blue-600' },
    { label: 'Concluídas', value: orders.filter(o => o.status === 'fechada').length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Total Mês', value: orders.length, icon: BarChart3, color: 'text-purple-600' },
  ]

  const handleView = async (id: string) => {
    const os = orders.find(o => o.id === id)
    if (os) {
      await fetchOSItems(id)
      setViewingOS(os)
    }
  }

  const handleEdit = async (id: string) => {
    const os = orders.find(o => o.id === id)
    if (os) {
      await fetchOSItems(id)
      setEditingOS(os)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta Ordem de Serviço?')) {
      try {
        await removeOS(id)
      } catch (err) {
        console.error('Erro ao deletar OS:', err)
      }
    }
  }

  const handleComplete = async (id: string) => {
    try {
      await updateOSStatus(id, 'fechada')
    } catch (err) {
      console.error('Erro ao concluir OS:', err)
    }
  }

  if (isCreating || editingOS) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">
          {editingOS ? `Editando OS: ${editingOS.numero_os}` : 'Nova Ordem de Serviço'}
        </h1>
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto">
              Fechar
            </Button>
          </div>
        )}
        <OSForm 
          initialData={editingOS || undefined}
          initialItems={editingOS ? items : []}
          onSave={async (osData, itemData) => {
            try {
              if (editingOS) {
                await updateOS(editingOS.id, osData, itemData)
                setEditingOS(null)
              } else {
                await createOS(osData, itemData)
                setIsCreating(false)
              }
            } catch (err) {
              console.error('Erro ao salvar OS:', err)
            }
          }}
          onCancel={() => {
            setIsCreating(false)
            setEditingOS(null)
            setError(null)
          }}
          isSubmitting={isLoading}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-500">Gerenciamento de Ordens de Serviço e Cálculos</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Nova OS
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex flex-col md:flex-row md:items-center gap-4 text-amber-800 dark:text-amber-400">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Problema de Conexão ou Configuração</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={() => fetchOrders()}>Tentar Novamente</Button>
            <Button size="sm" variant="ghost" onClick={() => setError(null)}>Ignorar</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {showAll ? 'Todas as Ordens' : 'Ordens Recentes'}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Ver Menos' : 'Ver Tudo'}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <OSTable 
            orders={displayedOrders} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        )}
      </div>

      <Modal
        isOpen={!!viewingOS}
        onClose={() => setViewingOS(null)}
        title={`Detalhes da OS: ${viewingOS?.numero_os}`}
      >
        {viewingOS && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Cliente</p>
                <p className="text-lg font-medium">{viewingOS.cliente || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                <Badge variant={viewingOS.status === 'aberta' ? 'info' : viewingOS.status === 'fechada' ? 'success' : 'error'}>
                  {viewingOS.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Data de Criação</p>
                <p>{new Date(viewingOS.data_criacao).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Itens da Ordem
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="py-2 px-3 text-left">Descrição</th>
                      <th className="py-2 px-3 text-right">Largura</th>
                      <th className="py-2 px-3 text-right">Rep.</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {items.map(item => (
                      <tr key={item.id}>
                        <td className="py-2 px-3">{item.descricao || 'Item sem nome'}</td>
                        <td className="py-2 px-3 text-right">{item.largura_mm}mm</td>
                        <td className="py-2 px-3 text-right">{item.repeticoes}x</td>
                        <td className="py-2 px-3 text-right font-medium">{item.largura_mm * item.repeticoes}mm</td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-500 italic">
                          Nenhum item cadastrado nesta OS.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
