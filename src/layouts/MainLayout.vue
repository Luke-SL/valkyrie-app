<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
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

        <!-- Busca Desktop -->
        <div class="gt-xs relative-position" style="min-width: 320px">
          <q-input
            dense
            outlined
            v-model="search"
            placeholder="Buscar salas, patrimônios..."
            class="q-ml-md"
            :loading="searching"
            :bg-color="$q.dark.isActive ? 'dark-page' : 'grey-2'"
            clearable
            @clear="clearSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- Dropdown Desktop -->
          <q-menu
            v-model="showResultsMenu"
            no-parent-event
            fit
            anchor="bottom left"
            self="top left"
            :offset="[16, 4]"
            class="search-results-menu"
          >
            <q-list dense separator class="q-py-xs">
              <!-- Seção de Salas -->
              <q-item-label
                header
                class="text-weight-bold text-caption text-primary"
                >SALAS</q-item-label
              >
              <q-item
                v-for="room in searchResults.rooms"
                :key="'room-' + room.id"
                clickable
                v-close-popup
                @click="goToRoom(room.id)"
              >
                <q-item-section avatar>
                  <q-icon name="place" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{
                    room.name
                  }}</q-item-label>
                  <q-item-label caption
                    >Bloco {{ room.block }} • {{ room.category }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <div
                v-if="!searchResults.rooms.length"
                class="text-caption text-grey-6 q-px-md q-py-xs italic"
              >
                Nenhuma sala encontrada
              </div>

              <q-separator class="q-my-xs" />

              <!-- Seção de Patrimônios -->
              <q-item-label
                header
                class="text-weight-bold text-caption text-primary"
                >PATRIMÔNIOS & UTENSÍLIOS</q-item-label
              >
              <q-item
                v-for="asset in searchResults.assets"
                :key="'asset-' + asset.id"
                clickable
                v-close-popup
                @click="goToAsset(asset)"
              >
                <q-item-section avatar>
                  <q-icon name="inventory_2" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    <span class="text-bold font-mono">{{
                      asset.patrimony_number
                    }}</span>
                    — {{ asset.category }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ asset.brand }}
                    {{ asset.model ? `(${asset.model})` : '' }}
                    <span v-if="asset.rooms">
                      • {{ asset.rooms.name }} (Bloco
                      {{ asset.rooms.block }})</span
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
              <div
                v-if="!searchResults.assets.length"
                class="text-caption text-grey-6 q-px-md q-py-xs italic"
              >
                Nenhum equipamento encontrado
              </div>
            </q-list>
          </q-menu>
        </div>

        <q-space class="gt-xs" />

        <!-- Botão Lupa Mobile -->
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

      <!-- Barra de Pesquisa Mobile com Resultados Integrados -->
      <q-slide-transition>
        <div
          v-if="showMobileSearch"
          class="q-px-md q-py-sm"
          :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-2'"
        >
          <q-input
            dense
            outlined
            autofocus
            v-model="search"
            placeholder="Buscar salas, patrimônios..."
            :loading="searching"
            :bg-color="$q.dark.isActive ? 'dark' : 'white'"
            clearable
            @clear="clearSearch"
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

          <!-- Resultados Mobile -->
          <div
            v-if="search.length >= 2"
            class="q-mt-sm bg-dark-page rounded-borders q-pa-xs"
          >
            <q-list dense separator>
              <q-item-label
                header
                class="text-weight-bold text-caption text-primary q-pa-xs"
                >SALAS</q-item-label
              >
              <q-item
                v-for="room in searchResults.rooms"
                :key="'m-room-' + room.id"
                clickable
                @click="goToRoom(room.id)"
              >
                <q-item-section avatar
                  ><q-icon name="place" color="primary"
                /></q-item-section>
                <q-item-section>
                  <q-item-label
                    >{{ room.name }} (Bloco {{ room.block }})</q-item-label
                  >
                  <q-item-label caption>{{ room.category }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item-label
                header
                class="text-weight-bold text-caption text-primary q-pa-xs q-mt-xs"
                >PATRIMÔNIOS</q-item-label
              >
              <q-item
                v-for="asset in searchResults.assets"
                :key="'m-asset-' + asset.id"
                clickable
                @click="goToAsset(asset)"
              >
                <q-item-section avatar
                  ><q-icon name="inventory_2" color="secondary"
                /></q-item-section>
                <q-item-section>
                  <q-item-label
                    >{{ asset.patrimony_number }} —
                    {{ asset.category }}</q-item-label
                  >
                  <q-item-label caption>{{ asset.brand }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-slide-transition>
    </q-header>

    <!-- Drawer Lateral -->
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

    <!-- Page Container -->
    <q-page-container
      :class="$q.dark.isActive ? 'bg-dark-page' : 'bg-grey-1'"
      @click="showMobileSearch = false"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from '/src/composables/useAuth'
import { useValkyrie } from '/src/composables/useValkyrie'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const { currentUser, userRole, logout, checkSession } = useAuth()
const { searchAll } = useValkyrie()

const search = ref('')
const searching = ref(false)
const showResultsMenu = ref(false)
const searchResults = ref({ rooms: [], assets: [] })
let debounceTimer = null

const leftDrawerOpen = ref(false)
const showMobileSearch = ref(false)

onMounted(async () => {
  $q.dark.set(true)
  const session = await checkSession()
  if (!session) {
    router.push('/login')
  }
})

watch(search, newVal => {
  clearTimeout(debounceTimer)
  if (!newVal || newVal.trim().length < 2) {
    showResultsMenu.value = false
    searchResults.value = { rooms: [], assets: [] }
    return
  }

  debounceTimer = setTimeout(async () => {
    searching.value = true
    try {
      searchResults.value = await searchAll(newVal)
      showResultsMenu.value = true
    } finally {
      searching.value = false
    }
  }, 300)
})

const clearSearch = () => {
  search.value = ''
  showResultsMenu.value = false
  searchResults.value = { rooms: [], assets: [] }
}

const goToRoom = roomId => {
  clearSearch()
  showMobileSearch.value = false
  router.push(`/rooms/${roomId}`)
}

const goToAsset = asset => {
  clearSearch()
  showMobileSearch.value = false
  if (asset.room_id) {
    router.push(`/rooms/${asset.room_id}`)
  } else {
    router.push('/assets')
  }
}

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
.search-results-menu {
  max-height: 400px;
  border-radius: 8px;
}
.font-mono {
  font-family: monospace;
}
</style>
