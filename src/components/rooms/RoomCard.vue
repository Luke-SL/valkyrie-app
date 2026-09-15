<template>
  <q-card
    class="cursor-pointer room-card border-radius-8 full-height column"
    flat
    bordered
  >
    <q-card-section class="col column justify-between">
      <!-- Parte superior: Nome e Categoria -->
      <div>
        <div class="row justify-between items-start no-wrap">
          <!-- Título com limite de 5 caracteres + Tooltip -->
          <div
            class="col text-h6 text-weight-bold q-pr-sm"
            style="line-height: 1.2"
          >
            {{
              room.name.length > 5
                ? room.name.substring(0, 5) + '...'
                : room.name
            }}

            <!-- Mostra o nome completo flutuando quando passar o mouse -->
            <q-tooltip v-if="room.name.length > 5" class="bg-grey-9 text-body2">
              {{ room.name }}
            </q-tooltip>
          </div>

          <div class="col-auto">
            <q-badge
              color="grey-2"
              text-color="grey-8"
              class="text-weight-bold q-pa-xs rounded-borders"
            >
              {{ room.category?.toUpperCase() }}
            </q-badge>
          </div>
        </div>
      </div>

      <!-- Parte inferior: Conexões -->
      <div style="min-height: 24px" class="q-mt-md">
        <div
          v-if="room.connections?.length > 0"
          class="text-caption text-grey-6 row items-center"
        >
          <q-icon name="monitor" class="q-mr-xs" />
          {{ room.connections.join(', ') }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  room: { type: Object, required: true }
})
</script>

<style scoped>
.room-card:hover {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
}
.border-radius-8 {
  border-radius: 8px;
}
</style>
