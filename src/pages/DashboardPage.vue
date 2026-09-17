<template>
  <q-page class="q-pa-xl">
    <div class="q-mb-xl">
      <div class="vk-font-display text-h5 text-weight-medium vk-title"
        >Visão Geral</div
      >
      <div class="text-caption vk-subtitle q-mt-xs">
        Panorama do patrimônio sob a guarda do sistema.
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Total de Salas"
          :value="stats.totalRooms"
          icon="place"
          accent="var(--vk-accent)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Total de Patrimônios"
          :value="stats.totalAssets"
          icon="inventory_2"
          accent="var(--vk-cat-sala-de-aula)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Laboratórios"
          :value="stats.totalLabs"
          icon="science"
          accent="var(--vk-cat-laboratorio)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Salas Administrativas"
          :value="stats.totalAdmin"
          icon="domain"
          accent="var(--vk-cat-administracao)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useValkyrie } from '/src/composables/useValkyrie'
import { supabase } from '/src/boot/supabase'
import StatCard from '/src/components/dashboard/StatCard.vue'

const { getRooms } = useValkyrie()

const stats = reactive({
  totalRooms: 0,
  totalAssets: 0,
  totalLabs: 0,
  totalAdmin: 0
})

onMounted(async () => {
  try {
    const rooms = await getRooms()
    stats.totalRooms = rooms.length
    stats.totalLabs = rooms.filter(r => r.category === 'laboratório').length
    stats.totalAdmin = rooms.filter(r => r.category === 'administração').length

    const { count, error } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true })
    if (!error) {
      stats.totalAssets = count || 0
    }
  } catch (err) {
    console.error('Erro ao carregar estatísticas do dashboard:', err)
  }
})
</script>

<style scoped>
.vk-title {
  color: var(--vk-text);
}

.vk-subtitle {
  color: var(--vk-text-dim);
}
</style>
