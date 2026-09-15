<template>
  <q-page class="q-pa-xl">
    <h4 class="text-weight-bold q-mt-none q-mb-xl">Visão Geral</h4>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard title="Total de Salas" :value="stats.totalRooms" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard title="Total de Patrimônios" :value="stats.totalAssets" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard title="Laboratórios" :value="stats.totalLabs" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard title="Salas Administrativas" :value="stats.totalAdmin" />
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
