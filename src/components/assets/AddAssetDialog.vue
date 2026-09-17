<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card
      class="vk-dialog"
      style="min-width: 400px; max-width: 600px; width: 100%"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="vk-font-display text-subtitle1 text-weight-medium vk-title">
          Adicionar Equipamento / Utensílio
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-y-md q-mt-xs">
          <!-- Seletor de Tipo de Identificação -->
          <div>
            <div class="text-caption vk-subtitle q-mb-sm"
              >Tipo de Identificação</div
            >
            <q-btn-toggle
              v-model="idType"
              spread
              no-caps
              unelevated
              toggle-color="primary"
              class="vk-toggle"
              :options="[
                { label: 'Patrimônio', value: 'patrimony' },
                { label: 'Nº Série', value: 'serial' },
                { label: 'Gerar Auto', value: 'auto' }
              ]"
            />
          </div>

          <!-- Campo: Patrimônio (10 dígitos) -->
          <q-input
            v-if="idType === 'patrimony'"
            v-model="form.patrimony_number"
            label="Nº do Patrimônio (10 dígitos)"
            outlined
            class="vk-field"
            mask="##########"
            unmasked-value
            :rules="[
              val => !!val || 'Obrigatório',
              val => val.length === 10 || 'Deve conter exatamente 10 números'
            ]"
          />

          <!-- Campo: Nº de Série -->
          <q-input
            v-if="idType === 'serial'"
            v-model="form.patrimony_number"
            label="Número de Série"
            outlined
            class="vk-field"
            :rules="[val => !!val || 'Obrigatório']"
          />

          <!-- Aviso de Identificador Automático -->
          <div
            v-if="idType === 'auto'"
            class="vk-auto-notice q-pa-md text-center"
          >
            <q-icon name="auto_awesome" size="18px" class="q-mr-sm" />
            Um código único (VALK-XXXXXX) será gerado automaticamente.
          </div>

          <!-- Categoria de Ativos com os novos utensílios -->
          <q-select
            v-model="form.category"
            :options="categories"
            label="Categoria"
            outlined
            class="vk-field"
            :rules="[val => !!val || 'Categoria é obrigatória']"
          />

          <div class="row q-gutter-x-md">
            <q-input
              v-model="form.brand"
              label="Marca"
              outlined
              placeholder="Ex: Intelbras, Epson, Genérico"
              class="col vk-field"
            />
            <q-input
              v-model="form.model"
              label="Modelo"
              outlined
              class="col vk-field"
            />
          </div>

          <!-- Campos dinâmicos dependentes da categoria -->
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
              label="Salvar Equipamento"
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
  roomId: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue', 'added'])

const $q = useQuasar()
const { addAsset } = useValkyrie()

const categories = [
  'access point',
  'armário',
  'cadeira',
  'câmera de segurança',
  'computador',
  'condicionador de ar',
  'criado mudo',
  'extintor de incêndio',
  'filtro de água',
  'impressora',
  'mesa',
  'monitor',
  'notebook',
  'projetor multimídia',
  'quadro branco',
  'quadro de vidro',
  'quadro interativo',
  'tela de projeção'
]
const osOptions = [
  'Windows 10',
  'Windows 11',
  'Ubuntu',
  'Debian',
  'macOS',
  'ChromeOS'
]
const connectionOptions = ['HDMI', 'VGA', 'Wireless']

const idType = ref('patrimony')

const getInitialState = () => ({
  patrimony_number: '',
  category: null,
  brand: 'Genérico',
  model: '',
  os_installed: [],
  supported_connections: [],
  notes: ''
})

const form = reactive(getInitialState())
const loading = ref(false)

watch(idType, () => (form.patrimony_number = ''))

watch(
  () => props.modelValue,
  newVal => {
    if (newVal) {
      idType.value = 'patrimony'
      Object.assign(form, getInitialState())
    }
  }
)

const submitForm = async () => {
  loading.value = true
  try {
    let finalIdentification = form.patrimony_number
    if (idType.value === 'auto') {
      finalIdentification =
        'VALK-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    const assetData = {
      room_id: props.roomId,
      patrimony_number: finalIdentification,
      category: form.category,
      brand: form.brand || 'Genérico',
      model: form.model || null,
      os_installed:
        form.category === 'computador' || form.category === 'notebook'
          ? [...form.os_installed]
          : [],
      supported_connections:
        form.category === 'projetor multimídia'
          ? [...form.supported_connections]
          : [],
      notes: form.notes || null
    }

    await addAsset(assetData)

    $q.notify({
      type: 'positive',
      message: 'Equipamento adicionado com sucesso!'
    })
    emit('added')
    emit('update:modelValue', false)
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar. Verifique se essa identificação já está em uso.'
    })
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

.vk-field :deep(.q-field__control) {
  border-radius: var(--vk-radius-md);
}

.vk-toggle :deep(.q-btn) {
  border: 1px solid var(--vk-border);
  color: var(--vk-text-dim);
}

.vk-toggle :deep(.q-btn.bg-primary) {
  background: var(--vk-accent) !important;
  color: var(--vk-accent-text) !important;
}

.vk-auto-notice {
  background: var(--vk-accent-dim);
  color: var(--vk-accent);
  border-radius: var(--vk-radius-md);
  font-weight: 500;
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
