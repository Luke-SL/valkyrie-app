import { ref } from 'vue'
import { supabase } from '/src/boot/supabase'
import { useRouter } from 'vue-router'

const currentUser = ref(null)
const userRole = ref(null)

export function useAuth() {
  const router = useRouter()

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error

    currentUser.value = data.user
    await fetchProfile(data.user.id)
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    currentUser.value = null
    userRole.value = null
    router.push('/login')
  }

  const fetchProfile = async userId => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (data) {
      userRole.value = data.role
    } else if (error) {
      console.error('Erro ao buscar perfil:', error)
    }
  }

  const checkSession = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    if (session) {
      currentUser.value = session.user
      await fetchProfile(session.user.id)
    }
    return session
  }

  return {
    currentUser,
    userRole,
    login,
    logout,
    checkSession
  }
}
