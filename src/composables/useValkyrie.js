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

  // Buscar todos os patrimônios (já inclui salas via LEFT JOIN implicitamente no Supabase)
  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from('assets')
      .select('*, rooms(id, name, block)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Mover patrimônio (aceita roomId nulo)
  const moveAsset = async (assetId, newRoomId) => {
    const { data, error } = await supabase
      .from('assets')
      .update({ room_id: newRoomId || null })
      .eq('id', assetId)
      .select()

    if (error) throw error
    return data
  }

  const getUnassignedAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .is('room_id', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Erro ao buscar patrimônios sem sala:', err)
      return []
    }
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

  const searchAll = async query => {
    if (!query || query.trim().length < 2) return { rooms: [], assets: [] }
    const term = `%${query.trim()}%`

    try {
      const [roomsRes, assetsRes] = await Promise.all([
        supabase
          .from('rooms')
          .select('id, name, block, category')
          .or(`name.ilike.${term},block.ilike.${term},category.ilike.${term}`)
          .limit(5),
        supabase
          .from('assets')
          .select(
            'id, patrimony_number, category, brand, model, status, room_id, rooms(name, block)'
          )
          .or(
            `patrimony_number.ilike.${term},brand.ilike.${term},model.ilike.${term},category.ilike.${term},status.ilike.${term}`
          )
          .limit(6)
      ])

      return {
        rooms: roomsRes.data || [],
        assets: assetsRes.data || []
      }
    } catch (err) {
      console.error('Erro na busca global:', err)
      return { rooms: [], assets: [] }
    }
  }

  // Lembre-se de incluir searchAll no return do useValkyrie:
  // return { ..., searchAll }

  // Regras estritas: Apenas admin pode criar/deletar salas ou mudar categoria
  const canEditRooms = () => userRole.value === 'admin'

  return {
    userRole,
    getRooms,
    getAssetsByRoom,
    fetchAssets,
    moveAsset,
    getUnassignedAssets,
    addAsset,
    updateRoom,
    canEditRooms,
    createRoom,
    deleteRoom,
    updateAsset,
    deleteAsset,
    getAllAssets,
    searchAll
  }
}
