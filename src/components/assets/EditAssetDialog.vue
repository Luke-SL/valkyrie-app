<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card
      style="
        min-width: 400px;
        max-width: 500px;
        width: 100%;
        border-radius: 12px;
      "
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Editar Equipamento</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="text-caption text-grey-6 q-mb-md">
          Identificação: <strong>{{ form.patrimony_number }}</strong> |
          Categoria: <strong>{{ form.category?.toUpperCase() }}</strong>
        </div>

        <q-form @submit.prevent="submitForm" class="q-gutter-y-md">
          <!-- Linha corrigida: q-gutter-x-md direto nos q-inputs com classe col -->
          <div class="row q-gutter-x-md">
            <q-input v-model="form.brand" label="Marca" outlined class="col" />
            <q-input v-model="form.model" label="Modelo" outlined class="col" />
          </div>

          <!-- Campos dinâmicos conforme a categoria -->
          <q-select
            v-if="
              form.category === 'computador' || form.category === 'notebook'
            "
            v-model="form.os_installed"
            :options="osOptions"
            label="Sistema(s) Operacional(is)"
            multiple
            outlined
            use-chips
          />

          <q-select
            v-if="form.category === 'projetor multimídia'"
            v-model="form.supported_connections"
            :options="connectionOptions"
            label="Conexões Suportadas"
            multiple
            outlined
            use-chips
          />

          <q-input
            v-model="form.notes"
            label="Observações"
            outlined
            type="textarea"
            rows="3"
          />

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
            <q-btn
              label="Salvar Alterações"
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
import { reactive, watch, ref } from 'vue'
import { useValkyrie } from '/src/composables/useValkyrie'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
  asset: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'updated'])

const $q = useQuasar()
const { updateAsset } = useValkyrie()

const osOptions = [
  'Windows 10',
  'Windows 11',
  'Ubuntu',
  'Debian',
  'macOS',
  'ChromeOS'
]
const connectionOptions = ['HDMI', 'VGA', 'Wireless']

const form = reactive({
  id: '',
  patrimony_number: '',
  category: '',
  brand: '',
  model: '',
  os_installed: [],
  supported_connections: [],
  notes: ''
})

const loading = ref(false)

watch(
  () => props.modelValue,
  newVal => {
    if (newVal && props.asset) {
      form.id = props.asset.id
      form.patrimony_number = props.asset.patrimony_number
      form.category = props.asset.category
      form.brand = props.asset.brand || ''
      form.model = props.asset.model || ''
      form.os_installed = props.asset.os_installed
        ? [...props.asset.os_installed]
        : []
      form.supported_connections = props.asset.supported_connections
        ? [...props.asset.supported_connections]
        : []
      form.notes = props.asset.notes || ''
    }
  }
)

const submitForm = async () => {
  loading.value = true
  try {
    await updateAsset(form.id, {
      brand: form.brand.trim() || 'Genérico',
      model: form.model ? form.model.trim() : null,
      os_installed:
        form.category === 'computador' || form.category === 'notebook'
          ? form.os_installed
          : [],
      supported_connections:
        form.category === 'projetor multimídia'
          ? form.supported_connections
          : [],
      notes: form.notes ? form.notes.trim() : null
    })

    $q.notify({
      type: 'positive',
      message: 'Equipamento atualizado com sucesso!'
    })
    emit('updated')
    emit('update:modelValue', false)
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Erro ao atualizar equipamento.' })
  } finally {
    loading.value = false
  }
}
</script>
