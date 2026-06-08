<template>
  <div class="field">
    <label>{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.field {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 8px;
}

.field input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>