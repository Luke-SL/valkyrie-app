<template>
  <div class="vk-stat">
    <div class="vk-stat__tick" :style="{ background: accent }" />
    <div class="vk-stat__body">
      <div class="text-caption vk-stat__label">{{ title }}</div>
      <div class="vk-font-display vk-stat__value">{{ value }}</div>
    </div>
    <q-icon v-if="icon" :name="icon" class="vk-stat__icon" size="22px" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String],
  icon: { type: String, default: '' },
  accent: { type: String, default: 'var(--vk-accent)' }
})
</script>

<style scoped>
.vk-stat {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 18px 18px 20px;
  background: var(--vk-surface);
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius-lg);
  overflow: hidden;
}

.vk-stat__tick {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}

.vk-stat__body {
  flex: 1;
  min-width: 0;
}

.vk-stat__label {
  color: var(--vk-text-dim);
  font-weight: 500;
}

.vk-stat__value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--vk-text);
  margin-top: 4px;
  line-height: 1;
}

.vk-stat__icon {
  color: var(--vk-text-dim);
  opacity: 0.5;
}
</style>
