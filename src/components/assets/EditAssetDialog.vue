<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card
      class="vk-dialog"
      style="min-width: 400px; max-width: 500px; width: 100%"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="vk-font-display text-subtitle1 text-weight-medium vk-title">
          Editar Equipamento
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="text-caption vk-subtitle q-mb-md">
          Identificação:
          <span class="vk-font-mono vk-id">{{ form.patrimony_number }}</span>
          &nbsp;·&nbsp; Categoria:
          <span style="text-transform: capitalize">{{ form.category }}</span>
        </div>

        <q-form @submit.prevent="submitForm" class="q-gutter-y-md">
          <div class="row q-gutter-x-md">
            <q-input
              v-model="form.brand"
              label="Marca"
              outlined
              class="col vk-field"
            />
            <q-input
              v-model="form.model"
              label="Modelo"
              outlined
              class="col vk-field"
            />
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
            class="vk-field"
          />

          <q-select
            v-if="form.category === 'projetor multimídia'"
            v-model="form.supported_connections"
            :options="connectionOptions"
            label="Conexões Suportadas"
            multiple
            outlined
            use-chips
            class="vk-field"
          />

          <q-input
            v-model="form.notes"
            label="Observações"
            outlined
            type="textarea"
            rows="3"
            class="vk-field"
          />

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn
              label="Cancelar"
              flat
              no-caps
              class="vk-btn-ghost"
              v-close-popup
            />
            <q-btn
              label="Salvar Alterações"
              type="submit"
              unelevated
              no-caps
              class="vk-btn-primary"
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

<style scoped>
.vk-dialog {
  background: var(--vk-surface-raised);
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius-lg);
}

.vk-title {
  color: var(--vk-text);
}

.vk-subtitle {
  color: var(--vk-text-dim);
}

.vk-id {
  color: var(--vk-text);
  font-weight: 600;
}

.vk-field :deep(.q-field__control) {
  border-radius: var(--vk-radius-md);
}

.vk-btn-primary {
  background: var(--vk-accent);
  color: var(--vk-accent-text);
  border-radius: var(--vk-radius-md);
}

.vk-btn-ghost {
  color: var(--vk-text-dim);
}
</style>
