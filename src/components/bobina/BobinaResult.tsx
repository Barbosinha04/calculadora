import { calculateAproveitamento, getAproveitamentoBgColor, getAproveitamentoColor } from '../../lib/calculations'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { AlertCircle } from 'lucide-react'

interface BobinaResultProps {
  larguraNecessaria: number
  larguraBobina: number
}

export function BobinaResult({ larguraNecessaria, larguraBobina }: BobinaResultProps) {
  const aproveitamento = calculateAproveitamento(larguraNecessaria, larguraBobina)
  const colorClass = getAproveitamentoColor(aproveitamento)
  const bgColorClass = getAproveitamentoBgColor(aproveitamento)
  const isOverLimit = larguraBobina === 0 && larguraNecessaria > 0

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-colors shadow-lg backdrop-blur-md",
      isOverLimit 
        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
        : "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800"
    )}>
      {isOverLimit ? (
        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-bold">Largura excedida!</p>
            <p className="text-sm">Nenhuma bobina disponível para {larguraNecessaria}mm. Reduza os itens ou repetições.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Largura Necessária</p>
              <p className="text-2xl font-black">{larguraNecessaria} mm</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Aproveitamento</p>
              <p className={cn("text-2xl font-black", colorClass)}>{aproveitamento}%</p>
            </div>
          </div>
          
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
            <div 
              className={cn("h-full transition-all duration-500 ease-out", bgColorClass)}
              style={{ width: `${aproveitamento}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {larguraBobina > 0 ? (
              <Badge variant="info" className="px-3 py-1 text-sm font-bold">
                Bobina Sugerida: {larguraBobina}mm
              </Badge>
            ) : larguraNecessaria > 0 && (
              <Badge variant="error">Sem bobina compatível</Badge>
            )}
            
            {aproveitamento >= 85 && larguraBobina > 0 && (
              <Badge variant="success">Ótimo Aproveitamento</Badge>
            )}
            {aproveitamento < 70 && larguraBobina > 0 && (
              <Badge variant="warning">Ajuste o layout para economizar</Badge>
            )}
          </div>
        </>
      )}
    </div>
  )
}
