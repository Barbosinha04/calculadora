import type { OrdemServico, ItemOS } from '../types/schema'

export function validateOS(os: Partial<OrdemServico>): string | null {
  // Apenas o número da OS é essencial para identificação básica
  if (!os.numero_os) return 'Número da OS é necessário'
  return null
}

export function validateItem(item: Partial<ItemOS>): string | null {
  // Deixando livre para salvar mesmo sem descrição ou medidas completas
  // O sistema apenas garante que números sejam válidos se preenchidos
  if (item.largura_mm !== undefined && item.largura_mm < 0) return 'Largura não pode ser negativa'
  if (item.repeticoes !== undefined && item.repeticoes <= 0) return 'Repetições devem ser pelo menos 1'
  return null
}

export function isOSEditable(os: OrdemServico): boolean {
  // Permite editar qualquer OS a menos que esteja explicitamente cancelada
  return os.status !== 'cancelada'
}
