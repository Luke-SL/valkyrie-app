<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="vk-font-display text-h5 text-weight-medium vk-title"
          >Gerenciamento de Salas</div
        >
        <div class="text-caption vk-subtitle q-mt-xs">
          Visão geral e distribuição dos blocos e setores.
        </div>
      </div>
      <q-btn
        v-if="userRole === 'admin'"
        icon="add"
        label="Nova Sala"
        unelevated
        no-caps
        class="vk-btn-primary q-px-md"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Lista de Blocos agrupados -->
    <div v-for="b in blocks" :key="b.letter" class="q-mb-xl">
      <div class="row items-center q-mb-md vk-block-heading">
        <span
          class="vk-font-display text-subtitle1 text-weight-medium vk-title"
        >
          {{
            b.letter.toLowerCase().includes('corredor') || b.letter.length > 2
              ? b.letter
              : `Bloco ${b.letter}`
          }}
        </span>
        <span class="text-caption vk-subtitle q-ml-sm"
          >{{ b.rooms.length }} salas</span
        >
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

    <div v-if="!blocks.length" class="vk-empty-state text-center q-pa-xl">
      <q-icon name="place" size="32px" class="q-mb-sm" />
      <div class="text-body2">Nenhuma sala cadastrada ainda.</div>
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

<style scoped>
.vk-title {
  color: var(--vk-text);
}

.vk-subtitle {
  color: var(--vk-text-dim);
}

.vk-block-heading {
  border-bottom: 1px solid var(--vk-border);
  padding-bottom: 8px;
}

.vk-btn-primary {
  background: var(--vk-accent);
  color: var(--vk-accent-text);
  border-radius: var(--vk-radius-md);
}

.vk-empty-state {
  color: var(--vk-text-dim);
  border: 1px dashed var(--vk-border);
  border-radius: var(--vk-radius-lg);
}
</style>
