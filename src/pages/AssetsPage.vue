<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-lg">
      <div>
        <div class="vk-font-display text-h5 text-weight-medium vk-title"
          >Gerenciamento de Patrimônios</div
        >
        <div class="text-caption vk-subtitle q-mt-xs">
          Visão global de todos os equipamentos e utensílios cadastrados.
        </div>
      </div>

      <q-btn
        label="Novo Patrimônio"
        icon="add"
        unelevated
        no-caps
        class="vk-btn-primary"
        @click="showAddDialog = true"
      />
    </div>

    <q-table
      flat
      :dark="$q.dark.isActive"
      :rows="assets"
      :columns="columns"
      row-key="id"
      class="vk-table"
      :pagination="{ rowsPerPage: 10 }"
      no-data-label="Nenhum patrimônio cadastrado"
    >
      <template v-slot:body-cell-patrimony="props">
        <q-td :props="props">
          <span class="vk-font-mono vk-id">{{
            props.row.patrimony_number
          }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-categoria="props">
        <q-td :props="props">
          <div class="row items-center no-wrap q-gutter-x-xs">
            <q-icon
              :name="assetCategoryIcon(props.row.category)"
              size="16px"
              class="vk-icon-dim"
            />
            <span style="text-transform: capitalize">{{
              props.row.category
            }}</span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-location="props">
        <q-td :props="props">
          <div v-if="props.row.rooms" class="text-weight-medium vk-location">
            Bloco {{ props.row.rooms.block }} · Sala {{ props.row.rooms.name }}
          </div>
          <div v-else class="text-caption vk-text-dim">Sem sala vinculada</div>
        </q-td>
      </template>

      <template v-slot:body-cell-marca="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.brand }}</div>
          <div class="text-caption vk-text-dim">{{
            props.row.model || '-'
          }}</div>
          <div
            v-if="
              props.row.category === 'computador' &&
              props.row.os_installed?.length
            "
            class="text-caption vk-tag-info"
          >
            OS: {{ props.row.os_installed.join(', ') }}
          </div>
          <div
            v-if="
              props.row.category === 'projetor multimídia' &&
              props.row.supported_connections?.length
            "
            class="text-caption vk-tag-alt"
          >
            Suporta: {{ props.row.supported_connections.join(', ') }}
          </div>
        </q-td>
      </template>
    </q-table>

    <AddAssetDialog
      v-model="showAddDialog"
      :all-rooms="rooms"
      @added="reloadAssets"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useValkyrie } from '/src/composables/useValkyrie'
import { assetCategoryIcon } from '/src/utils/categoryStyles'
import AddAssetDialog from '/src/components/assets/AddAssetDialog.vue'

const $q = useQuasar()
const { getAllAssets, getRooms } = useValkyrie()
const assets = ref([])
const rooms = ref([])
const showAddDialog = ref(false)

const columns = [
  {
    name: 'patrimony',
    label: 'IDENTIFICAÇÃO',
    align: 'left',
    field: 'patrimony_number'
  },
  {
    name: 'categoria',
    label: 'CATEGORIA',
    align: 'left',
    field: 'category'
  },
  {
    name: 'location',
    label: 'LOCALIZAÇÃO',
    align: 'left',
    field: row => row.rooms?.name
  },
  { name: 'marca', label: 'MARCA/MODELO', align: 'left', field: 'brand' },
  {
    name: 'observacoes',
    label: 'OBSERVAÇÕES',
    align: 'left',
    field: 'notes',
    format: val => val || '-'
  }
]

async function reloadAssets() {
  assets.value = await getAllAssets()
}

onMounted(async () => {
  await reloadAssets()
  rooms.value = await getRooms()
})
</script>

<style scoped>
.vk-title {
  color: var(--vk-text);
}

.vk-subtitle {
  color: var(--vk-text-dim);
}

.vk-table {
  background: var(--vk-surface);
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius-lg);
}

.vk-table :deep(thead th) {
  color: var(--vk-text-dim);
  font-size: 0.7rem;
  letter-spacing: 0.03em;
  border-bottom: 1px solid var(--vk-border);
}

.vk-table :deep(tbody td) {
  border-bottom: 1px solid var(--vk-border);
  color: var(--vk-text);
}

.vk-table :deep(tbody tr:hover td) {
  background: var(--vk-accent-dim);
}

.vk-id {
  font-weight: 600;
  color: var(--vk-text);
}

.vk-icon-dim {
  color: var(--vk-text-dim);
}

.vk-text-dim {
  color: var(--vk-text-dim);
}

.vk-location {
  color: var(--vk-accent);
}

.vk-tag-info {
  color: var(--vk-cat-sala-de-aula);
}

.vk-tag-alt {
  color: var(--vk-cat-laboratorio);
}
</style>
