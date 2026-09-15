import { ref } from 'vue'
import { supabase } from '/src/boot/supabase'

export function useValkyrie() {
  const userRole = ref('admin') // Alternável mockado para 'admin' ou 'staff' na UI

  const getRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('block')
        .order('name')
      if (error) {
        console.error('Erro no Supabase:', error.message)
        return [] // Retorna array vazio em caso de erro
      }
      return data || [] // Garante que nunca retornará null
    } catch (err) {
      console.error('Falha na requisição:', err)
      return []
    }
  }

  const getAssetsByRoom = async roomId => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Erro ao buscar ativos:', err)
      return []
    }
  }

  const moveAsset = async (assetId, newRoomId) => {
    const { error } = await supabase
      .from('assets')
      .update({ room_id: newRoomId })
      .eq('id', assetId)
    if (error) throw error
  }

  const addAsset = async assetData => {
    const { error } = await supabase.from('assets').insert([assetData])
    if (error) throw error
  }

  const updateRoom = async (roomId, updates) => {
    const { error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', roomId)
    if (error) throw error
  }

  // Adicione estas duas funções ao composable
  const createRoom = async roomData => {
    const { error } = await supabase.from('rooms').insert([roomData])
    if (error) throw error
  }

  const deleteRoom = async roomId => {
    const { error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (error) throw error
  }

  const updateAsset = async (assetId, updates) => {
    const { error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', assetId)
    if (error) throw error
  }

  const deleteAsset = async assetId => {
    const { error } = await supabase.from('assets').delete().eq('id', assetId)
    if (error) throw error
  }

  const getAllAssets = async () => {
    try {
      // Faz o "Join" entre assets e rooms para trazermos o nome e bloco da sala junto
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          rooms (name, block, category)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Erro ao buscar todos os patrimônios:', err)
      return []
    }
  }

  // Regras estritas: Apenas admin pode criar/deletar salas ou mudar categoria
  const canEditRooms = () => userRole.value === 'admin'

  return {
    userRole,
    getRooms,
    getAssetsByRoom,
    moveAsset,
    addAsset,
    updateRoom,
    canEditRooms,
    createRoom,
    deleteRoom,
    updateAsset,
    deleteAsset,
    getAllAssets
  }
}
