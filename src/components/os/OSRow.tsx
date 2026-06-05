import type { OrdemServico } from '../../types/schema'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react'

interface OSRowProps {
  os: OrdemServico
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
}

export function OSRow({ os, onView, onEdit, onDelete, onComplete }: OSRowProps) {
  const statusVariants: Record<string, any> = {
    aberta: 'info',
    fechada: 'success',
    cancelada: 'error',
  }

  return (
    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
      <td className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100">{os.numero_os}</td>
      <td className="py-4 px-4">{os.cliente}</td>
      <td className="py-4 px-4">
        <Badge variant={statusVariants[os.status]}>{os.status}</Badge>
      </td>
      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
        {new Date(os.data_criacao).toLocaleDateString()}
      </td>
      <td className="py-4 px-4 text-right space-x-2">
        {os.status === 'aberta' && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20" 
            onClick={() => onComplete(os.id)}
            title="Marcar como Concluída"
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onView(os.id)}>
          <Eye className="w-4 h-4" />
        </Button>
        {os.status === 'aberta' && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(os.id)}>
            <Edit className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => onDelete(os.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  )
}
