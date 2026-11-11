<template>
  <q-table
    flat
    :dark="$q.dark.isActive"
    :rows="assets"
    :columns="columns"
    row-key="id"
    class="vk-table"
    no-data-label="Nenhum equipamento cadastrado"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:body-cell-patrimony="props">
      <q-td :props="props">
        <span class="vk-font-mono vk-id">{{ props.row.patrimony_number }}</span>
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
        <q-chip
          v-if="props.row.rooms"
          dense
          icon="place"
          size="12px"
          class="vk-location-chip"
        >
          {{ props.row.rooms.name }} (Bloco {{ props.row.rooms.block }})
        </q-chip>
        <q-chip
          v-else
          dense
          icon="warning_amber"
          size="12px"
          class="vk-unassigned-chip"
        >
          Sem sala
        </q-chip>
      </q-td>
    </template>

    <template v-slot:body-cell-marca="props">
      <q-td :props="props">
        <div class="text-weight-medium">{{ props.row.brand }}</div>
        <div class="text-caption vk-text-dim">{{ props.row.model || '-' }}</div>
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

    <!-- Coluna de Status Interativa (Edição Rápida Direto na Tabela) -->
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-select
          :model-value="props.row.status || 'funcional'"
          :options="ASSET_STATUS"
          dense
          borderless
          options-dense
          emit-value
          map-options
          class="vk-status-select"
          @update:model-value="val => onStatusChange(props.row, val)"
        >
          <template v-slot:selected>
            <q-badge
              :color="assetStatusColor(props.row.status || 'funcional')"
              class="text-weight-bold text-uppercase q-px-xs q-py-xs cursor-pointer"
            >
              {{ props.row.status || 'funcional' }}
              <q-icon name="arrow_drop_down" size="14px" class="q-ml-xs" />
            </q-badge>
          </template>
        </q-select>
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props" class="text-right">
        <q-btn
          flat
          dense
          no-caps
          class="vk-action-btn q-mr-sm"
          label="Mover"
          @click="$emit('move', props.row)"
        />
        <q-btn
          flat
          dense
          no-caps
          class="vk-action-btn q-mr-sm"
          label="Editar"
          @click="$emit('edit', props.row)"
        />
        <q-btn
          flat
          dense
          round
          class="vk-delete-btn"
          icon="delete"
          size="sm"
          @click="$emit('delete', props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useValkyrie } from '/src/composables/useValkyrie'
import {
  assetCategoryIcon,
  ASSET_STATUS,
  assetStatusColor
} from '/src/utils/categoryStyles'

defineProps({
  assets: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['move', 'edit', 'delete', 'updated'])

const $q = useQuasar()
const { updateAsset } = useValkyrie()

const onStatusChange = async (asset, newStatus) => {
  const oldStatus = asset.status
  asset.status = newStatus // Atualização otimista na UI

  try {
    await updateAsset(asset.id, { status: newStatus })
    $q.notify({
      type: 'positive',
      message: `Status alterado para "${newStatus}".`,
      timeout: 1000
    })
    emit('updated')
  } catch (error) {
    asset.status = oldStatus // Reverte se der erro
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Falha ao atualizar status.'
    })
  }
}

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
    field: row => row.rooms?.name || 'Sem sala'
  },
  { name: 'marca', label: 'MARCA/MODELO', align: 'left', field: 'brand' },
  {
    name: 'observacoes',
    label: 'OBSERVAÇÕES',
    align: 'left',
    field: 'notes',
    format: val => val || '-'
  },
  {
    name: 'status',
    label: 'STATUS',
    align: 'center',
    field: row => row.status || 'funcional'
  },
  { name: 'actions', label: 'AÇÕES', align: 'right' }
]
</script>

<style scoped>
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

.vk-tag-info {
  color: var(--vk-cat-sala-de-aula);
}

.vk-tag-alt {
  color: var(--vk-cat-laboratorio);
}

.vk-action-btn {
  color: var(--vk-accent);
}

.vk-delete-btn {
  color: var(--vk-danger);
}

.vk-location-chip {
  background: var(--vk-accent-dim);
  color: var(--vk-accent);
}

.vk-unassigned-chip {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.vk-status-select {
  display: inline-block;
}
</style>
