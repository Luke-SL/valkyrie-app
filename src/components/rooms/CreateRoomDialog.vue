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
        <div class="text-h6 text-weight-bold">Cadastrar Nova Sala</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- Trocamos para q-gutter-y-md para espaçamento vertical uniforme -->
        <q-form @submit.prevent="submitForm" class="q-gutter-y-md q-mt-xs">
          <!-- Correção da Borda: Usando q-gutter-x-md com a classe col -->
          <div class="row q-gutter-x-md">
            <q-input
              v-model="form.name"
              label="Nome da Sala (Ex: A1)"
              outlined
              class="col"
              :rules="[val => !!val || 'Obrigatório']"
            />
            <q-input
              v-model="form.block"
              label="Bloco (Ex: A)"
              outlined
              class="col"
              :rules="[val => !!val || 'Obrigatório']"
            />
          </div>

          <q-select
            v-model="form.category"
            :options="roomCategories"
            label="Categoria da Sala"
            outlined
            :rules="[val => !!val || 'Obrigatório']"
          />

          <q-select
            v-model="form.connections"
            :options="['HDMI', 'VGA', 'Wireless']"
            label="Comunicação da Sala"
            multiple
            use-chips
            outlined
          />

          <q-input
            v-model="form.notes"
            label="Observações sobre a sala"
            outlined
            type="textarea"
            rows="3"
          />

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
            <q-btn
              label="Criar Sala"
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
  'depósito'
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
      name: form.name,
      block: form.block.toUpperCase(), // Padroniza o bloco
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
