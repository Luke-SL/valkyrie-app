<template>
  <q-page class="q-pa-lg">
    <!-- Botão Voltar -->
    <q-btn
      flat
      no-caps
      icon="arrow_back"
      label="Voltar para as salas"
      class="q-mb-md"
      @click="router.push('/rooms')"
    />

    <!-- Detalhes da Sala -->
    <q-card flat bordered class="q-mb-lg border-radius-8 q-pa-sm">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="row items-center q-gutter-sm">
            <div class="text-h4 text-weight-bold">{{ room.name }}</div>
            <q-badge
              :color="$q.dark.isActive ? 'grey-8' : 'grey-3'"
              :text-color="$q.dark.isActive ? 'grey-2' : 'grey-9'"
              class="text-weight-bold q-pa-xs"
            >
              {{ room.category?.toUpperCase() }}
            </q-badge>
          </div>

          <div class="row q-gutter-sm q-mt-sm">
            <q-badge
              :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
              :text-color="$q.dark.isActive ? 'grey-3' : 'grey-8'"
              class="q-pa-xs"
            >
              Bloco: {{ room.block }}
            </q-badge>
            <q-badge
              v-if="room.connections?.length"
              :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
              :text-color="$q.dark.isActive ? 'grey-3' : 'grey-8'"
              class="q-pa-xs"
            >
              Comunicação: {{ room.connections.join(', ') }}
            </q-badge>
          </div>
        </div>

        <!-- Ações do Card -->
        <div v-if="userRole === 'admin' || userRole === 'staff'">
          <q-btn
            flat
            round
            color="grey-5"
            icon="edit"
            @click="showEditDialog = true"
          />
          <q-btn
            v-if="userRole === 'admin'"
            flat
            round
            color="red-5"
            icon="delete"
            @click="confirmDelete"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Cabeçalho da Lista de Patrimônios -->
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6 text-weight-bold row items-center">
        <q-icon name="inventory_2" class="q-mr-sm" />
        Patrimônios na Sala ({{ assets.length }})
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Adicionar Equipamento"
        unelevated
        no-caps
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
.border-radius-8 {
  border-radius: 8px;
}
</style>
