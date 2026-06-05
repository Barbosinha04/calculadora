import type { OrdemServico } from '../../types/schema'
import { OSRow } from './OSRow'

interface OSTableProps {
  orders: OrdemServico[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
}

export function OSTable({ orders, onView, onEdit, onDelete, onComplete }: OSTableProps) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
            <th className="py-3 px-4">Nº OS</th>
            <th className="py-3 px-4">Cliente</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Data</th>
            <th className="py-3 px-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(os => (
            <OSRow 
              key={os.id} 
              os={os} 
              onView={onView} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onComplete={onComplete}
            />
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-slate-500">
                Nenhuma ordem de serviço encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
