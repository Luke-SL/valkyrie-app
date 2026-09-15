<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-lg">
      <div>
        <h4 class="text-weight-bold q-my-none">Gerenciamento de Patrimônios</h4>
        <div class="text-caption text-grey-5 q-mt-xs"
          >Visão global de todos os equipamentos e utensílios cadastrados.</div
        >
      </div>
    </div>

    <q-table
      flat
      bordered
      :dark="$q.dark.isActive"
      :rows="assets"
      :columns="columns"
      row-key="id"
      class="border-radius-8"
      :pagination="{ rowsPerPage: 10 }"
      no-data-label="Nenhum patrimônio cadastrado"
    >
      <template v-slot:body-cell-location="props">
        <q-td :props="props">
          <div v-if="props.row.rooms" class="text-weight-medium text-primary">
            Bloco {{ props.row.rooms.block }} - Sala {{ props.row.rooms.name }}
          </div>
          <div v-else class="text-grey-5 italic">Sem sala vinculada</div>
        </q-td>
      </template>

      <template v-slot:body-cell-marca="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.brand }}</div>
          <div class="text-caption text-grey-5">{{
            props.row.model || '-'
          }}</div>
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
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useValkyrie } from '/src/composables/useValkyrie'

const $q = useQuasar()
const { getAllAssets } = useValkyrie()
const assets = ref([])

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

onMounted(async () => {
  assets.value = await getAllAssets()
})
</script>

<style scoped>
.border-radius-8 {
  border-radius: 8px;
}
</style>
