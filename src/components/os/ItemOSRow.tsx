import type { ItemOS } from '../../types/schema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Trash2 } from 'lucide-react'

interface ItemOSRowProps {
  item: ItemOS
  onUpdate: (id: string, updates: Partial<ItemOS>) => void
  onDelete: (id: string) => void
  disabled?: boolean
}

export function ItemOSRow({ item, onUpdate, onDelete, disabled }: ItemOSRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
      <div className="md:col-span-2">
        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block md:hidden">Descrição</label>
        <Input
          value={item.descricao}
          onChange={(e) => onUpdate(item.id, { descricao: e.target.value })}
          placeholder="Descrição do item"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block md:hidden">Largura (mm)</label>
        <Input
          type="number"
          value={item.largura_mm}
          onChange={(e) => onUpdate(item.id, { largura_mm: Number(e.target.value) })}
          placeholder="Largura"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block md:hidden">Repetições</label>
        <Input
          type="number"
          value={item.repeticoes}
          onChange={(e) => onUpdate(item.id, { repeticoes: Number(e.target.value) })}
          placeholder="Repetições"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block md:hidden">Qtd</label>
        <Input
          type="number"
          value={item.quantidade}
          onChange={(e) => onUpdate(item.id, { quantidade: Number(e.target.value) })}
          placeholder="Quantidade"
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDelete(item.id)}
          disabled={disabled}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
