<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card
      style="
        min-width: 400px;
        max-width: 600px;
        width: 100%;
        border-radius: 12px;
      "
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold"
          >Adicionar Equipamento / Utensílio</div
        >
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-y-md q-mt-xs">
          <!-- Seletor de Tipo de Identificação -->
          <div>
            <div class="text-subtitle2 text-grey-8 q-mb-sm"
              >Tipo de Identificação</div
            >
            <q-btn-toggle
              v-model="idType"
              spread
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="grey-2"
              text-color="grey-8"
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
            :rules="[val => !!val || 'Obrigatório']"
          />

          <!-- Aviso de Identificador Automático -->
          <div
            v-if="idType === 'auto'"
            class="bg-blue-1 text-primary q-pa-md rounded-borders text-center text-weight-medium"
          >
            <q-icon name="auto_awesome" size="sm" class="q-mr-sm" />
            Um código único (VALK-XXXXXX) será gerado automaticamente.
          </div>

          <!-- Categoria de Ativos com os novos utensílios -->
          <q-select
            v-model="form.category"
            :options="categories"
            label="Categoria"
            outlined
            :rules="[val => !!val || 'Categoria é obrigatória']"
          />

          <div class="row q-gutter-x-md">
            <q-input
              v-model="form.brand"
              label="Marca"
              outlined
              placeholder="Ex: Intelbras, Epson, Genérico"
              class="col"
            />
            <q-input v-model="form.model" label="Modelo" outlined class="col" />
          </div>

          <!-- Campos dinâmicos dependentes da categoria -->
          <!-- Exibir campo de OS tanto para computador de mesa quanto para notebook -->
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
              label="Salvar Equipamento"
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
