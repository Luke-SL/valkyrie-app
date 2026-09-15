<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 400px; width: 100%; border-radius: 12px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Mover Patrimônio</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <p class="text-grey-8">
          Selecione a nova sala para o equipamento
          <b>{{ asset?.patrimony_number }}</b> ({{ asset?.category }}).
        </p>

        <q-form @submit.prevent="submitForm" class="q-mt-md">
          <q-select
            v-model="selectedRoom"
            :options="roomOptions"
            label="Sala de Destino"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'Selecione uma sala de destino']"
          />

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
            <q-btn
              label="Mover Equipamento"
              type="submit"
              color="primary"
              unelevated
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useValkyrie } from '/src/composables/useValkyrie'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
  asset: Object,
  allRooms: Array
})
const emit = defineEmits(['update:modelValue', 'moved'])

const $q = useQuasar()
const { updateAsset } = useValkyrie()

const selectedRoom = ref(null)
const loading = ref(false)

// Formata as salas para o dropdown (Ex: "A - A1 (Sala de Aula)")
const roomOptions = computed(() => {
  if (!props.allRooms) return []
  return props.allRooms
    .filter(r => r.id !== props.asset?.room_id) // Esconde a sala atual
    .map(r => ({
      label: `Bloco ${r.block} - ${r.name} (${r.category})`,
      value: r.id
    }))
})

watch(
  () => props.modelValue,
  newVal => {
    if (newVal) selectedRoom.value = null
  }
)

const submitForm = async () => {
  loading.value = true
  try {
    await updateAsset(props.asset.id, { room_id: selectedRoom.value })
    $q.notify({ type: 'positive', message: 'Patrimônio movido com sucesso!' })
    emit('moved')
    emit('update:modelValue', false)
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Erro ao mover o patrimônio.' })
  } finally {
    loading.value = false
  }
}
</script>
