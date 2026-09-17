<template>
  <q-layout view="lHh Lpr lFf" class="vk-login-bg flex flex-center">
    <q-card flat class="vk-login-card q-pa-lg relative-position">
      <!-- Alternador de Tema Dark/Light no topo do cartão -->
      <div class="absolute-top-right q-pa-sm">
        <q-btn
          flat
          round
          dense
          size="sm"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          class="vk-theme-toggle"
          @click="toggleDarkMode"
        >
          <q-tooltip>{{
            $q.dark.isActive ? 'Ativar modo claro' : 'Ativar modo escuro'
          }}</q-tooltip>
        </q-btn>
      </div>

      <!-- Cabeçalho com Logo e Nome -->
      <q-card-section class="q-pb-none text-center q-pt-md">
        <div class="row items-center justify-center q-mb-sm vk-brand-mark">
          <q-img
            src="images/crow.png"
            style="width: 40px; height: 40px"
            :style="
              $q.dark.isActive ? 'filter: invert(1) brightness(1.8);' : ''
            "
            fit="contain"
            class="q-mr-sm"
          />
          <span class="vk-font-display text-h5 text-weight-medium"
            >VALKYRIE</span
          >
        </div>
        <div class="text-caption vk-subtitle">
          Sistema de controle de patrimônio
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
            class="vk-field"
            :rules="[val => !!val || 'E-mail é obrigatório']"
          />

          <q-input
            v-model="password"
            label="Senha"
            outlined
            type="password"
            class="vk-field"
            :rules="[val => !!val || 'Senha é obrigatória']"
          />

          <div v-if="errorMessage" class="vk-error text-center text-caption">
            {{ errorMessage }}
          </div>

          <div>
            <q-btn
              label="Entrar no sistema"
              type="submit"
              class="full-width q-py-sm text-weight-medium vk-submit-btn"
              unelevated
              no-caps
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
.vk-login-bg {
  background: var(--vk-bg);
}

.vk-login-card {
  width: 90%;
  max-width: 400px;
  border-radius: var(--vk-radius-lg);
  border: 1px solid var(--vk-border);
  background: var(--vk-surface);
}

.vk-brand-mark {
  color: var(--vk-text);
}

.vk-subtitle {
  color: var(--vk-text-dim);
}

.vk-theme-toggle {
  color: var(--vk-text-dim);
}

.vk-error {
  color: var(--vk-danger);
  font-weight: 500;
}

.vk-submit-btn {
  background: var(--vk-accent);
  color: var(--vk-accent-text);
  border-radius: var(--vk-radius-md);
}

.vk-field :deep(.q-field__control) {
  border-radius: var(--vk-radius-md);
}
</style>
