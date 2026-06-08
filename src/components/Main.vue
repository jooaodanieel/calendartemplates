<template>
  <main>
    <h2>{{ title }}</h2>
    <slot></slot>
  </main>
  <footer>
    <hr>
    <small>Calendar Templates - <a target="_blank" href="https://github.com/jooaodanieel/calendartemplates/tree/v1.0.1">v1.0.1</a></small>
  </footer>
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
