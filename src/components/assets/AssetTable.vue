<template>
  <q-table
    flat
    :dark="$q.dark.isActive"
    :rows="assets"
    :columns="columns"
    row-key="id"
    class="vk-table"
    no-data-label="Nenhum equipamento cadastrado nesta sala"
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
import { assetCategoryIcon } from '/src/utils/categoryStyles'

defineProps({
  assets: {
    type: Array,
    default: () => []
  }
})

defineEmits(['move', 'edit', 'delete'])

const $q = useQuasar()

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
  { name: 'marca', label: 'MARCA/MODELO', align: 'left', field: 'brand' },
  {
    name: 'observacoes',
    label: 'OBSERVAÇÕES',
    align: 'left',
    field: 'notes',
    format: val => val || '-'
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
</style>
