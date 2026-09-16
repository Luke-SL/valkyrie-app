<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header Principal -->
    <q-header
      :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-grey-9'"
      class="q-py-xs"
      bordered
    >
      <q-toolbar>
        <!-- Botão Hambúrguer Mobile -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="lt-md q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <div
          class="row items-center cursor-pointer text-primary text-weight-bold text-h6"
          @click="router.push('/')"
        >
          <q-img
            src="images/crow.png"
            style="width: 38px; height: 38px"
            :style="
              $q.dark.isActive ? 'filter: invert(1) brightness(1.8);' : ''
            "
            fit="contain"
            class="q-mr-sm"
          />
          <span>Valkyrie</span>
        </div>

        <q-space />

        <!-- Barra de Busca Desktop (Oculta no mobile) -->
        <q-input
          dense
          outlined
          v-model="search"
          placeholder="Buscar salas, patrimônios..."
          class="q-ml-md gt-xs"
          style="min-width: 280px"
          :bg-color="$q.dark.isActive ? 'dark-page' : 'grey-2'"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-space class="gt-xs" />

        <!-- Ícone de Lupa para Mobile (Abre a barra retrátil) -->
        <q-btn
          flat
          round
          dense
          icon="search"
          class="lt-sm q-mr-xs"
          @click="showMobileSearch = true"
        />

        <!-- Alternador Dark/Light Mode -->
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
        />
      </q-toolbar>

      <!-- Barra de Pesquisa Retrátil para Mobile -->
      <q-slide-transition>
        <div
          v-if="showMobileSearch"
          v-touch-swipe.up="() => (showMobileSearch = false)"
          class="q-px-md q-py-sm"
          :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-2'"
        >
          <q-input
            ref="mobileInputRef"
            dense
            outlined
            autofocus
            v-model="search"
            placeholder="Buscar salas, patrimônios..."
            :bg-color="$q.dark.isActive ? 'dark' : 'white'"
            @keyup.enter="showMobileSearch = false"
            @keyup.esc="showMobileSearch = false"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-btn
                flat
                round
                dense
                icon="close"
                size="sm"
                @click="showMobileSearch = false"
              />
            </template>
          </q-input>
        </div>
      </q-slide-transition>
    </q-header>

    <!-- Menu Lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <q-list class="q-mt-md">
        <q-item
          clickable
          v-ripple
          exact
          to="/"
          class="rounded-borders q-mx-sm q-mb-xs"
          :active-class="
            $q.dark.isActive
              ? 'bg-grey-9 text-primary text-weight-medium'
              : 'bg-blue-1 text-primary text-weight-medium'
          "
        >
          <q-item-section avatar><q-icon name="grid_view" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/rooms"
          :active="route.path.startsWith('/rooms')"
          class="rounded-borders q-mx-sm q-mb-xs"
          :active-class="
            $q.dark.isActive
              ? 'bg-grey-9 text-primary text-weight-medium'
              : 'bg-blue-1 text-primary text-weight-medium'
          "
        >
          <q-item-section avatar><q-icon name="place" /></q-item-section>
          <q-item-section>Salas & Locais</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          exact
          to="/assets"
          class="rounded-borders q-mx-sm q-mb-xs"
          :active-class="
            $q.dark.isActive
              ? 'bg-grey-9 text-primary text-weight-medium'
              : 'bg-blue-1 text-primary text-weight-medium'
          "
        >
          <q-item-section avatar><q-icon name="inventory_2" /></q-item-section>
          <q-item-section>Patrimônios</q-item-section>
        </q-item>
      </q-list>

      <div class="absolute-bottom q-pa-md border-top column q-gutter-y-sm">
        <q-item class="q-pa-none">
          <q-item-section avatar>
            <q-avatar
              :color="$q.dark.isActive ? 'grey-8' : 'blue-2'"
              text-color="primary"
              class="text-weight-bold"
            >
              {{ currentUser?.email?.charAt(0).toUpperCase() || 'U' }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label
              class="text-weight-bold ellipsis"
              style="max-width: 140px"
            >
              {{ currentUser?.email }}
            </q-item-label>
            <q-item-label
              caption
              class="text-uppercase text-primary text-weight-bold"
            >
              {{ userRole }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-btn
          flat
          no-caps
          align="left"
          class="full-width text-red-5 q-px-sm"
          icon="logout"
          label="Sair do Sistema"
          @click="handleLogout"
        />
      </div>
    </q-drawer>

    <!-- Container Principal (Clica aqui para fechar a busca mobile se estiver aberta) -->
    <q-page-container
      :class="$q.dark.isActive ? 'bg-dark-page' : 'bg-grey-1'"
      @click="showMobileSearch = false"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from '/src/composables/useAuth'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const search = ref('')
const leftDrawerOpen = ref(false)
const showMobileSearch = ref(false)
const mobileInputRef = ref(null)

const { currentUser, userRole, logout, checkSession } = useAuth()

onMounted(async () => {
  $q.dark.set(true)
  const session = await checkSession()
  if (!session) {
    router.push('/login')
  }
})

const toggleDarkMode = () => {
  $q.dark.toggle()
}

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.border-top {
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}
</style>
