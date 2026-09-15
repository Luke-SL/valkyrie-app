import { createClient } from '@supabase/supabase-js'
import { boot } from 'quasar/wrappers'

// ADICIONE ESTA LINHA:
// console.log('[Debug Vite Env]:', import.meta.env)

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Falha alto e cedo: melhor um erro claro no console do que um 401 confuso depois.
  console.error(
    '[Valkyrie] Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não encontradas. ' +
      'Certifique-se de que o arquivo .env existe na raiz do projeto com estas chaves.'
  )
}

export const supabase = createClient(url, anonKey)

export default boot(({ app }) => {
  // Disponível em templates como this.$supabase, se precisar.
  // Nos composables, importe { supabase } diretamente deste arquivo.
  app.config.globalProperties.$supabase = supabase
})
