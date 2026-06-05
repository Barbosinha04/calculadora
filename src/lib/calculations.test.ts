import { describe, it, expect } from 'vitest'
import { calculateRequiredWidth, suggestBestBobina, calculateAproveitamento } from './calculations'
import type { ItemOS } from '../types/schema'

describe('Cálculos de Bobina', () => {
  const mockItens: ItemOS[] = [
    { id: '1', os_id: 'os1', descricao: 'Item 1', largura_mm: 100, comprimento_mm: 200, repeticoes: 2, quantidade: 1000 },
    { id: '2', os_id: 'os1', descricao: 'Item 2', largura_mm: 50, comprimento_mm: 200, repeticoes: 3, quantidade: 1000 },
  ]

  it('deve calcular a largura necessária corretamente', () => {
    // (100 * 2) + (50 * 3) + 20 (folga) = 200 + 150 + 20 = 370
    const result = calculateRequiredWidth(mockItens, 20)
    expect(result).toBe(370)
  })

  it('deve sugerir a melhor bobina disponível', () => {
    const disponiveis = [300, 400, 500, 600]
    const larguraNecessaria = 370
    const sugerida = suggestBestBobina(larguraNecessaria, disponiveis)
    expect(sugerida).toBe(400)
  })

  it('deve retornar null se nenhuma bobina couber', () => {
    const disponiveis = [200, 300]
    const larguraNecessaria = 370
    const sugerida = suggestBestBobina(larguraNecessaria, disponiveis)
    expect(sugerida).toBeNull()
  })

  it('deve calcular o aproveitamento corretamente', () => {
    expect(calculateAproveitamento(370, 400)).toBe(93) // (370/400)*100 = 92.5 -> 93
    expect(calculateAproveitamento(370, 500)).toBe(74) // (370/500)*100 = 74
  })
})
