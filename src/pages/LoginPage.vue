<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2 flex flex-center">
    <q-card flat bordered class="login-card bg-white q-pa-lg">
      <!-- Cabeçalho com Imagem e Nome lado a lado -->
      <q-card-section class="q-pb-none text-center">
        <div
          class="row items-center justify-center text-primary text-weight-bold text-h5 q-mb-xs"
        >
          <q-img
            src="images/crow.png"
            style="width: 44px; height: 44px"
            fit="contain"
            class="q-mr-sm"
          />
          <span>VALKYRIE</span>
        </div>
        <div class="text-grey-7 text-caption"
          >Sistema de Controle de Patrimônio</div
        >
      </q-card-section>

      <!-- Formulário com espaçamento vertical estrito -->
      <q-card-section class="q-mt-md">
        <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
          <q-input
            v-model="email"
            label="E-mail"
            outlined
            type="email"
            :rules="[val => !!val || 'E-mail é obrigatório']"
          />

          <q-input
            v-model="password"
            label="Senha"
            outlined
            type="password"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '/src/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

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
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
</style>
