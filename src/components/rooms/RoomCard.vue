<template>
  <div class="vk-room-card cursor-pointer full-height column">
    <div class="vk-room-card__top row justify-between items-start no-wrap">
      <div class="vk-font-mono vk-room-card__code">
        {{ room.name.length > 5 ? room.name.substring(0, 5) + '…' : room.name }}
        <q-tooltip v-if="room.name.length > 5" class="vk-tooltip">
          {{ room.name }}
        </q-tooltip>
      </div>
    </div>

    <div class="row items-center q-gutter-x-xs q-mt-sm">
      <span
        class="vk-dot"
        :style="{ background: roomCategoryColor(room.category) }"
      />
      <span class="text-caption vk-room-card__category">{{
        room.category
      }}</span>
    </div>

    <q-space />

    <div class="q-mt-md" style="min-height: 20px">
      <div
        v-if="room.connections?.length > 0"
        class="text-caption vk-room-card__connections row items-center no-wrap"
      >
        <q-icon name="cable" size="14px" class="q-mr-xs" />
        {{ room.connections.join(', ') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { roomCategoryColor } from '/src/utils/categoryStyles'

defineProps({
  room: { type: Object, required: true }
})
</script>

<style scoped>
.vk-room-card {
  background: var(--vk-surface);
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius-md);
  padding: 14px 16px;
  transition: border-color 0.15s ease;
}

.vk-room-card:hover {
  border-color: var(--vk-accent);
}

.vk-room-card__code {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vk-text);
  line-height: 1.2;
}

.vk-room-card__category {
  color: var(--vk-text-dim);
  text-transform: capitalize;
}

.vk-room-card__connections {
  color: var(--vk-text-dim);
}

:deep(.vk-tooltip) {
  background: var(--vk-surface-raised);
  color: var(--vk-text);
  border: 1px solid var(--vk-border);
  font-size: 0.75rem;
}
</style>
