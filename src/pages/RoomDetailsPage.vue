<template>
  <q-page class="q-pa-lg">
    <!-- Botão Voltar -->
    <q-btn
      flat
      no-caps
      icon="arrow_back"
      label="Voltar para as salas"
      class="q-mb-md vk-back-btn"
      @click="router.push('/rooms')"
    />

    <!-- Detalhes da Sala -->
    <div class="vk-room-header q-mb-lg q-pa-md">
      <div class="row items-center justify-between">
        <div>
          <div class="row items-center q-gutter-sm">
            <div class="vk-font-display text-h5 text-weight-medium vk-title">{{
              room.name
            }}</div>
            <div class="row items-center q-gutter-x-xs">
              <span
                class="vk-dot"
                :style="{ background: roomCategoryColor(room.category) }"
              />
              <span
                class="text-caption vk-subtitle"
                style="text-transform: capitalize"
              >
                {{ room.category }}
              </span>
            </div>
          </div>

          <div class="row q-gutter-sm q-mt-sm">
            <div class="vk-info-chip">Bloco {{ room.block }}</div>
            <div v-if="room.connections?.length" class="vk-info-chip">
              {{ room.connections.join(', ') }}
            </div>
          </div>
        </div>

        <!-- Ações do Card -->
        <div v-if="userRole === 'admin' || userRole === 'staff'">
          <q-btn
            flat
            round
            color="grey-6"
            icon="edit"
            @click="showEditDialog = true"
          />
          <q-btn
            v-if="userRole === 'admin'"
            flat
            round
            class="vk-danger-btn"
            icon="delete"
            @click="confirmDelete"
          />
        </div>
      </div>
    </div>

    <!-- Cabeçalho da Lista de Patrimônios -->
    <div class="row justify-between items-center q-mb-md">
      <div class="text-subtitle1 text-weight-medium row items-center vk-title">
        <q-icon name="inventory_2" size="20px" class="q-mr-sm vk-subtitle" />
        Patrimônios na Sala ({{ assets.length }})
      </div>
      <q-btn
        icon="add"
        label="Adicionar Equipamento"
        unelevated
        no-caps
        class="vk-btn-primary"
        @click="showAddDialog = true"
      />
    </div>

    <!-- Tabela de Patrimônios -->
    <AssetTable
      :assets="assets"
      @move="handleMove"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Modais -->
    <AddAssetDialog
      v-model="showAddDialog"
      :room-id="roomId"
      @added="fetchAssets"
    />

    <EditRoomDialog
      v-model="showEditDialog"
      :room="room"
      @updated="fetchRoomDetails"
    />

    <EditAssetDialog
      v-model="showEditAssetDialog"
      :asset="selectedAsset"
      @updated="fetchAssets"
    />

    <MoveAssetDialog
      v-model="showMoveAssetDialog"
      :asset="selectedAsset"
      :all-rooms="allRoomsList"
      @moved="fetchAssets"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useValkyrie } from '/src/composables/useValkyrie'
import { useAuth } from '/src/composables/useAuth'
import { roomCategoryColor } from '/src/utils/categoryStyles'

import AssetTable from '/src/components/assets/AssetTable.vue'
import AddAssetDialog from '/src/components/assets/AddAssetDialog.vue'
import EditRoomDialog from '/src/components/rooms/EditRoomDialog.vue'
import EditAssetDialog from '/src/components/assets/EditAssetDialog.vue'
import MoveAssetDialog from '/src/components/assets/MoveAssetDialog.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const { getRooms, getAssetsByRoom, deleteRoom, deleteAsset } = useValkyrie()
const { userRole } = useAuth()

const roomId = route.params.id
const room = ref({})
const assets = ref([])
const allRoomsList = ref([])

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showEditAssetDialog = ref(false)
const showMoveAssetDialog = ref(false)
const selectedAsset = ref(null)

const fetchRoomDetails = async () => {
  allRoomsList.value = await getRooms()
  const found = allRoomsList.value.find(r => r.id === roomId)
  if (found) room.value = found
  else router.push('/rooms')
}

const fetchAssets = async () => {
  assets.value = await getAssetsByRoom(roomId)
}

onMounted(async () => {
  await fetchRoomDetails()
  await fetchAssets()
})

const handleEdit = asset => {
  selectedAsset.value = asset
  showEditAssetDialog.value = true
}

const handleMove = asset => {
  selectedAsset.value = asset
  showMoveAssetDialog.value = true
}

const handleDelete = asset => {
  $q.dialog({
    title: 'Excluir Patrimônio',
    message: `Tem certeza que deseja apagar o patrimônio <b>${asset.patrimony_number}</b>?`,
    html: true,
    cancel: { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok: { label: 'Excluir', color: 'red-5', unelevated: true },
    persistent: true
  }).onOk(async () => {
    try {
      await deleteAsset(asset.id)
      $q.notify({ type: 'positive', message: 'Patrimônio excluído.' })
      await fetchAssets()
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'Erro ao excluir patrimônio.' })
    }
  })
}

const confirmDelete = () => {
  $q.dialog({
    title: 'Atenção: Excluir Sala',
    message: `Tem certeza que deseja excluir a sala <b>${room.value.name}</b>?<br><br><i>Os patrimônios vinculados a ela ficarão sem sala associada.</i>`,
    html: true,
    cancel: { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok: { label: 'Sim, Excluir', color: 'red-5', unelevated: true },
    persistent: true
  }).onOk(async () => {
    try {
      await deleteRoom(roomId)
      $q.notify({ type: 'positive', message: 'Sala excluída com sucesso.' })
      router.push('/rooms')
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'Erro ao excluir a sala.' })
    }
  })
}
</script>

<style scoped>
.vk-back-btn {
  color: var(--vk-text-dim);
}

.vk-title {
  color: var(--vk-text);
}

.vk-subtitle {
  color: var(--vk-text-dim);
}

.vk-room-header {
  background: var(--vk-surface);
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius-lg);
}

.vk-info-chip {
  background: var(--vk-bg);
  border: 1px solid var(--vk-border);
  color: var(--vk-text-dim);
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: var(--vk-radius-sm);
}

.vk-btn-primary {
  background: var(--vk-accent);
  color: var(--vk-accent-text);
  border-radius: var(--vk-radius-md);
}

.vk-danger-btn {
  color: var(--vk-danger);
}
</style>
