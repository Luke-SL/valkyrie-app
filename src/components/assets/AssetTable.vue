<template>
  <q-table
    flat
    bordered
    :dark="$q.dark.isActive"
    :rows="assets"
    :columns="columns"
    row-key="id"
    class="border-radius-8"
    no-data-label="Nenhum equipamento cadastrado nesta sala"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:body-cell-marca="props">
      <q-td :props="props">
        <div class="text-weight-medium">{{ props.row.brand }}</div>
        <div class="text-caption text-grey-5">{{ props.row.model || '-' }}</div>
        <div
          v-if="
            props.row.category === 'computador' &&
            props.row.os_installed?.length
          "
          class="text-caption text-blue-4"
        >
          OS: {{ props.row.os_installed.join(', ') }}
        </div>
        <div
          v-if="
            props.row.category === 'projetor multimídia' &&
            props.row.supported_connections?.length
          "
          class="text-caption text-purple-4"
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
          color="primary"
          label="Mover"
          class="q-mr-sm"
          @click="$emit('move', props.row)"
        />
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          label="Editar"
          class="q-mr-sm"
          @click="$emit('edit', props.row)"
        />
        <q-btn
          flat
          dense
          round
          color="red-5"
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
    field: 'patrimony_number',
    style: 'font-family: monospace; font-weight: bold'
  },
  {
    name: 'categoria',
    label: 'CATEGORIA',
    align: 'left',
    field: 'category',
    format: val => (val ? val.charAt(0).toUpperCase() + val.slice(1) : '')
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
.border-radius-8 {
  border-radius: 8px;
}
</style>
