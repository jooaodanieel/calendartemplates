<template>
  <div class="block-card">
    <span class="block-name">{{ block.name }}</span>
    <span class="block-duration">({{ block.durationInMinutes }} min)</span>
  </div>
</template>

<script setup>
defineProps({
  block: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.block-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 4px 0;
  width: 75%;
}
.block-duration {
  color: #888;
  font-size: 0.9em;
}
</style>