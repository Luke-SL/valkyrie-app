<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-xl">
      <h4 class="text-weight-bold q-my-none">Gerenciamento de Salas</h4>
      <!-- Adicionado o @click -->
      <q-btn
        v-if="userRole === 'admin'"
        color="primary"
        icon="add"
        label="Nova Sala"
        unelevated
        class="q-px-md"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- ... (o restante do código do v-for e RoomCard fica igual) ... -->

    <!-- Novo modal no final do template -->
    <CreateRoomDialog v-model="showCreateDialog" @created="fetchRooms" />

    <div v-for="block in blocks" :key="block.letter" class="q-mb-xl">
      <h6 class="text-weight-bold q-mt-none q-mb-md"
        >Bloco {{ block.letter }}</h6
      >
      <div class="row q-col-gutter-md">
        <div
          class="col-12 col-sm-6 col-md-3 col-lg-2"
          v-for="room in block.rooms"
          :key="room.id"
        >
          <RoomCard :room="room" @click="openRoom(room.id)" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useValkyrie } from '/src/composables/useValkyrie'
import { useAuth } from '/src/composables/useAuth' // <-- Importando o auth
import RoomCard from '/src/components/rooms/RoomCard.vue'
import CreateRoomDialog from '/src/components/rooms/CreateRoomDialog.vue'

const router = useRouter()
const { getRooms } = useValkyrie() // Removido canEditRooms
const { userRole } = useAuth() // Pegando a role real
const showCreateDialog = ref(false) // Variável para controlar o modal

const roomsList = ref([])

onMounted(async () => {
  await fetchRooms()
})

// Crie uma função para buscar e recarregar os dados
const fetchRooms = async () => {
  roomsList.value = await getRooms()
}

const blocks = computed(() => {
  const grouped = {}

  // Trava de segurança
  if (!roomsList.value || !Array.isArray(roomsList.value)) return []

  // Agrupa as salas por bloco
  roomsList.value.forEach(room => {
    if (!grouped[room.block]) grouped[room.block] = []
    grouped[room.block].push(room)
  })

  // Configura o ordenador natural (entende números dentro de strings)
  const naturalSort = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  })

  // Retorna os blocos ordenados e as salas dentro deles ordenadas naturalmente
  return Object.keys(grouped)
    .sort()
    .map(letter => ({
      letter,
      rooms: grouped[letter].sort((a, b) => naturalSort.compare(a.name, b.name))
    }))
})

const openRoom = id => router.push(`/rooms/${id}`)
</script>

<style scoped>
.room-card:hover {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
}
.border-radius-8 {
  border-radius: 8px;
}
</style>
