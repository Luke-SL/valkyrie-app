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
        <q-form @submit.prevent="submitForm" class="q-gutter-md q-mt-xs">
          <!-- O número de identificação e categoria não devem ser alterados na edição -->
          <div class="text-subtitle2 text-grey-7 q-mb-md">
            Identificação: {{ asset?.patrimony_number }} | Categoria:
            {{ asset?.category?.toUpperCase() }}
          </div>

          <div class="row q-col-gutter-md">
            <!-- Correção da Borda -->
            <div class="row q-gutter-x-md">
              <q-input
                v-model="form.brand"
                label="Marca"
                outlined
                class="col"
              />
              <q-input
                v-model="form.model"
                label="Modelo"
                outlined
                class="col"
              />
            </div>
          </div>

          <q-select
            v-if="asset?.category === 'computador'"
            v-model="form.os_installed"
            :options="osOptions"
            label="Sistema(s) Operacional(is)"
            multiple
            outlined
            use-chips
          />

          <q-select
            v-if="asset?.category === 'projetor multimídia'"
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

const props = defineProps({ modelValue: Boolean, asset: Object })
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
  brand: '',
  model: '',
  os_installed: [],
  supported_connections: [],
  notes: ''
})
const loading = ref(false)

// Preenche o formulário com os dados do equipamento ao abrir o modal
watch(
  () => props.modelValue,
  newVal => {
    if (newVal && props.asset) {
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
    await updateAsset(props.asset.id, {
      brand: form.brand,
      model: form.model,
      os_installed: form.os_installed,
      supported_connections: form.supported_connections,
      notes: form.notes
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
