<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <h4 class="text-weight-bold q-my-none">Gerenciamento de Salas</h4>
        <div class="text-caption text-grey-5 q-mt-xs"
          >Visão geral e distribuição dos blocos e setores.</div
        >
      </div>
      <q-btn
        v-if="userRole === 'admin'"
        color="primary"
        icon="add"
        label="Nova Sala"
        unelevated
        no-caps
        class="q-px-md"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Lista de Blocos agrupados -->
    <div v-for="b in blocks" :key="b.letter" class="q-mb-xl">
      <div class="text-h6 text-weight-bold q-mb-md">
        {{
          b.letter.toLowerCase().includes('corredor') || b.letter.length > 2
            ? b.letter
            : `Bloco ${b.letter}`
        }}
      </div>

      <div class="row q-col-gutter-md">
        <div
          v-for="room in b.rooms"
          :key="room.id"
          class="col-12 col-sm-6 col-md-4 col-lg-2"
        >
          <RoomCard :room="room" @click="goToRoom(room.id)" />
        </div>
      </div>
    </div>

    <!-- Modal de Criação de Sala -->
    <CreateRoomDialog v-model="showCreateDialog" @created="fetchRooms" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useValkyrie } from '/src/composables/useValkyrie'
import { useAuth } from '/src/composables/useAuth'

import RoomCard from '/src/components/rooms/RoomCard.vue'
import CreateRoomDialog from '/src/components/rooms/CreateRoomDialog.vue'

const router = useRouter()
const { getRooms } = useValkyrie()
const { userRole } = useAuth()

const roomsList = ref([])
const showCreateDialog = ref(false)

const fetchRooms = async () => {
  roomsList.value = await getRooms()
}

onMounted(async () => {
  await fetchRooms()
})

const goToRoom = id => {
  router.push(`/rooms/${id}`)
}

const blocks = computed(() => {
  const grouped = {}
  if (!roomsList.value || !Array.isArray(roomsList.value)) return []

  roomsList.value.forEach(room => {
    const key = room.block || 'Outros'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(room)
  })

  const naturalSort = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  })

  return Object.keys(grouped)
    .sort()
    .map(letter => ({
      letter,
      rooms: grouped[letter].sort((a, b) => naturalSort.compare(a.name, b.name))
    }))
})
</script>
