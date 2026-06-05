export interface Database {
  public: {
    Tables: {
      ordem_servico: {
        Row: {
          id: string
          numero_os: string
          cliente: string
          data_criacao: string
          status: 'aberta' | 'fechada' | 'cancelada'
          user_id: string
        }
        Insert: {
          id?: string
          numero_os: string
          cliente: string
          data_criacao?: string
          status?: 'aberta' | 'fechada' | 'cancelada'
          user_id: string
        }
        Update: {
          id?: string
          numero_os?: string
          cliente?: string
          data_criacao?: string
          status?: 'aberta' | 'fechada' | 'cancelada'
          user_id?: string
        }
      }
      item_os: {
        Row: {
          id: string
          os_id: string
          descricao: string
          largura_mm: number
          comprimento_mm: number
          repeticoes: number
          quantidade: number
        }
        Insert: {
          id?: string
          os_id: string
          descricao: string
          largura_mm: number
          comprimento_mm: number
          repeticoes: number
          quantidade: number
        }
        Update: {
          id?: string
          os_id?: string
          descricao?: string
          largura_mm?: number
          comprimento_mm?: number
          repeticoes?: number
          quantidade?: number
        }
      }
    }
  }
}
