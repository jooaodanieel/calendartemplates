<template>
  <main>
    <h2>{{ title }}</h2>
    <slot></slot>
  </main>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
main {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
