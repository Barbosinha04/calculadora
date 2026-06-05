export type OSStatus = 'aberta' | 'fechada' | 'cancelada';

export interface OrdemServico {
  id: string;
  numero_os: string;
  cliente: string;
  data_criacao: string;
  status: OSStatus;
  user_id: string;
}

export type ItemOS = {
  id: string;
  os_id: string;
  descricao: string;
  largura_mm: number;
  comprimento_mm: number;
  repeticoes: number;
  quantidade: number;
}

export interface Bobina {
  id: string;
  os_id: string;
  largura_mm: number;
  tipo_substrato: string;
  gramatura: number;
  resultado_calculado: any; // Ajustar conforme a lógica de cálculo
}

export interface LayoutCalculo {
  id: string;
  os_id: string;
  largura_bobina_mm: number;
  itens: ItemOS[];
  resultado: {
    aproveitamento_pct: number;
    sobras_mm: number;
    ordem_corte: string[];
  };
}

export interface User {
  id: string;
  email: string;
}
