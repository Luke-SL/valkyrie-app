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
        <div class="text-h6 text-weight-bold">Editar Sala: {{ form.name }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-y-md q-mt-xs">
          <!-- Correção da Borda: Inputs diretos na linha com a classe 'col' -->
          <div class="row q-gutter-x-md">
            <q-input
              v-model="form.name"
              label="Nome da Sala"
              outlined
              class="col"
              :disable="userRole !== 'admin'"
            />
            <q-input
              v-model="form.block"
              label="Bloco"
              outlined
              class="col"
              :disable="userRole !== 'admin'"
            />
          </div>

          <!-- Bloqueado para Staff -->
          <q-select
            v-model="form.category"
            :options="roomCategories"
            label="Categoria da Sala"
            outlined
            :disable="userRole !== 'admin'"
            :hint="
              userRole !== 'admin'
                ? 'Apenas administradores podem alterar a categoria.'
                : ''
            "
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
import { useAuth } from '/src/composables/useAuth'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
  room: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'updated'])

const $q = useQuasar()
const { updateRoom } = useValkyrie()
const { userRole } = useAuth() // Pega a permissão real do usuário

const roomCategories = [
  'administração',
  'sala de aula',
  'laboratório',
  'auditório',
  'sala de estudos',
  'depósito'
]

const form = reactive({
  id: '',
  name: '',
  block: '',
  category: '',
  connections: [],
  notes: ''
})
const loading = ref(false)

// Preenche o formulário com os dados da sala ao abrir
watch(
  () => props.modelValue,
  newVal => {
    if (newVal && props.room) {
      form.id = props.room.id
      form.name = props.room.name
      form.block = props.room.block
      form.category = props.room.category
      form.connections = props.room.connections
        ? [...props.room.connections]
        : []
      form.notes = props.room.notes || ''
    }
  }
)

const submitForm = async () => {
  loading.value = true
  try {
    await updateRoom(form.id, {
      name: form.name,
      block: form.block,
      category: form.category,
      connections: form.connections,
      notes: form.notes
    })

    $q.notify({ type: 'positive', message: 'Sala atualizada com sucesso!' })
    emit('updated')
    emit('update:modelValue', false)
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Erro ao atualizar a sala.' })
  } finally {
    loading.value = false
  }
}
</script>
