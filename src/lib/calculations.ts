import type { ItemOS } from '../types/schema'

/**
 * Calcula a largura total necessária para um conjunto de itens em uma bobina.
 * A regra é: soma(largura_item * repeticoes_item) + folgas.
 * Assumimos uma folga padrão de 10mm por item para este exemplo, ou configurável.
 */
export function calculateRequiredWidth(itens: ItemOS[], folgaLateralMm: number = 20): number {
  const larguraItens = itens.reduce((acc, item) => {
    return acc + (item.largura_mm * item.repeticoes)
  }, 0)
  
  return larguraItens + folgaLateralMm
}

/**
 * Sugere a melhor bobina (menor largura possível) entre as disponíveis.
 */
export function suggestBestBobina(larguraNecessaria: number, bobinasDisponiveis: number[]): number | null {
  const bobinasPossiveis = bobinasDisponiveis
    .filter(largura => largura >= larguraNecessaria)
    .sort((a, b) => a - b)
  
  return bobinasPossiveis.length > 0 ? bobinasPossiveis[0] : null
}

/**
 * Calcula o aproveitamento da bobina em porcentagem.
 */
export function calculateAproveitamento(larguraNecessaria: number, larguraBobina: number): number {
  if (larguraBobina === 0) return 0
  return Math.min(Math.round((larguraNecessaria / larguraBobina) * 100), 100)
}

/**
 * Retorna a cor semântica baseada no aproveitamento.
 * verde >85%, amarelo 70–85%, vermelho <70%
 */
export function getAproveitamentoColor(pct: number): string {
  if (pct >= 85) return 'text-green-600 dark:text-green-400'
  if (pct >= 70) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

export function getAproveitamentoBgColor(pct: number): string {
  if (pct >= 85) return 'bg-green-600 dark:bg-green-400'
  if (pct >= 70) return 'bg-yellow-600 dark:bg-yellow-400'
  return 'bg-red-600 dark:bg-red-400'
}
