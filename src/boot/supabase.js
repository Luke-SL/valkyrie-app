import { createClient } from '@supabase/supabase-js'
import { boot } from 'quasar/wrappers'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Falha alto e cedo: melhor um erro claro no console do que um 401 confuso depois.
  console.error(
    '[Valkyrie] Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não encontradas. ' +
      'Certifique-se de que o arquivo .env existe na raiz do projeto com estas chaves.'
  )
}

// Guarda contra HMR do Vite: sem isso, cada vez que este módulo é
// re-executado durante o `quasar dev` (ao salvar qualquer arquivo), um novo
// GoTrueClient é criado. O cliente antigo continua com o auto-refresh
// rodando em segundo plano e passa a competir com o novo pelo mesmo refresh
// token no localStorage — daí o 400 em
// "/auth/v1/token?grant_type=refresh_token" mesmo sem nada de errado com a
// sessão do usuário. Guardamos a instância em import.meta.hot.data, que
// sobrevive entre recargas de HMR (mas não existe em produção, onde o
// problema não ocorre por não haver HMR).
function createSupabaseClient() {
  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      // Chave própria evita colisão no localStorage caso, em algum
      // momento, mais de um client/projeto Supabase seja usado no mesmo
      // domínio (ex: ambiente de preview compartilhado).
      storageKey: 'valkyrie-auth'
    }
  })
}

export const supabase = import.meta.hot?.data.supabase ?? createSupabaseClient()

if (import.meta.hot) {
  import.meta.hot.data.supabase = supabase
}

export default boot(({ app }) => {
  // Disponível em templates como this.$supabase, se precisar.
  // Nos composables, importe { supabase } diretamente deste arquivo.
  app.config.globalProperties.$supabase = supabase
})
