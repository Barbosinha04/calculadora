import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Função para validar se a URL é válida
const isValidUrl = (url: string) => {
  try {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
  } catch {
    return false
  }
}

// Inicializa o cliente apenas se as variáveis forem válidas
// Caso contrário, exporta um proxy que avisa sobre a configuração pendente
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key'
  ? createClient<any>(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: () => {
        console.warn('Supabase não configurado. Verifique as variáveis de ambiente no arquivo .env')
        return () => Promise.resolve({ data: null, error: { message: 'Supabase não configurado' } })
      }
    })
