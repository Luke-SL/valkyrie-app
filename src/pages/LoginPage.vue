<template>
  <q-layout
    view="lHh Lpr lFf"
    :class="$q.dark.isActive ? 'bg-dark-page' : 'bg-grey-2'"
    class="flex flex-center"
  >
    <q-card
      flat
      bordered
      class="login-card q-pa-lg relative-position"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <!-- Alternador de Tema Dark/Light no topo do cartão -->
      <div class="absolute-top-right q-pa-sm">
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          :color="$q.dark.isActive ? 'grey-4' : 'grey-8'"
          @click="toggleDarkMode"
        >
          <q-tooltip>{{
            $q.dark.isActive ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'
          }}</q-tooltip>
        </q-btn>
      </div>

      <!-- Cabeçalho com Logo e Nome -->
      <q-card-section class="q-pb-none text-center q-pt-md">
        <div
          class="row items-center justify-center text-primary text-weight-bold text-h5 q-mb-xs"
        >
          <q-img
            src="images/crow.png"
            style="width: 44px; height: 44px"
            :style="
              $q.dark.isActive ? 'filter: invert(1) brightness(1.8);' : ''
            "
            fit="contain"
            class="q-mr-sm"
          />
          <span>VALKYRIE</span>
        </div>
        <div
          class="text-caption"
          :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'"
        >
          Sistema de Controle de Patrimônio
        </div>
      </q-card-section>

      <!-- Formulário de Login -->
      <q-card-section class="q-mt-md">
        <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
          <q-input
            v-model="email"
            label="E-mail"
            outlined
            type="email"
            :bg-color="$q.dark.isActive ? 'dark-page' : 'white'"
            :rules="[val => !!val || 'E-mail é obrigatório']"
          />

          <q-input
            v-model="password"
            label="Senha"
            outlined
            type="password"
            :bg-color="$q.dark.isActive ? 'dark-page' : 'white'"
            :rules="[val => !!val || 'Senha é obrigatória']"
          />

          <div
            v-if="errorMessage"
            class="text-negative text-center text-weight-medium text-caption"
          >
            {{ errorMessage }}
          </div>

          <div>
            <q-btn
              label="Entrar no Sistema"
              type="submit"
              color="primary"
              class="full-width q-py-sm text-weight-bold"
              unelevated
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from '/src/composables/useAuth'

const $q = useQuasar()
const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  $q.dark.set(true)
})

const toggleDarkMode = () => {
  $q.dark.toggle()
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = 'E-mail ou senha incorretos.'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
