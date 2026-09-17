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
          Cadastrar Nova Sala
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-y-md q-mt-xs">
          <div class="row q-gutter-x-md">
            <q-input
              v-model="form.name"
              label="Nome da Sala (Ex: A1, Corredor 1)"
              outlined
              class="col vk-field"
              :rules="[val => !!val || 'Obrigatório']"
            />
            <q-input
              v-model="form.block"
              label="Bloco (Ex: A, Corredor Central)"
              outlined
              class="col vk-field"
              :rules="[val => !!val || 'Obrigatório']"
            />
          </div>

          <q-select
            v-model="form.category"
            :options="roomCategories"
            label="Categoria da Sala"
            outlined
            class="vk-field"
            :rules="[val => !!val || 'Obrigatório']"
          />

          <q-select
            v-model="form.connections"
            :options="['HDMI', 'VGA', 'Wireless']"
            label="Comunicação da Sala"
            multiple
            use-chips
            outlined
            class="vk-field"
          />

          <q-input
            v-model="form.notes"
            label="Observações sobre a sala"
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
              label="Criar Sala"
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

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'created'])

const $q = useQuasar()
const { createRoom } = useValkyrie()

const roomCategories = [
  'administração',
  'sala de aula',
  'laboratório',
  'auditório',
  'sala de estudos',
  'depósito',
  'corredor'
]

const getInitialState = () => ({
  name: '',
  block: '',
  category: null,
  connections: [],
  notes: ''
})
const form = reactive(getInitialState())
const loading = ref(false)

watch(
  () => props.modelValue,
  newVal => {
    if (newVal) Object.assign(form, getInitialState())
  }
)

const submitForm = async () => {
  loading.value = true
  try {
    await createRoom({
      name: form.name.trim(),
      block: form.block.trim(),
      category: form.category,
      connections: form.connections,
      notes: form.notes
    })

    $q.notify({ type: 'positive', message: 'Sala criada com sucesso!' })
    emit('created')
    emit('update:modelValue', false)
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Erro ao criar a sala.' })
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
