<template>
  <q-card flat bordered class="q-pa-md border-radius-8">
    <div class="text-caption text-weight-medium text-grey-5">{{ title }}</div>
    <div class="text-h3 text-weight-bolder q-mt-sm">{{ value }}</div>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String]
})
</script>

<style scoped>
.border-radius-8 {
  border-radius: 8px;
}
</style>
