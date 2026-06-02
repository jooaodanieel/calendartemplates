<template>
  <ol>
    <li v-for="task in tasks">
      {{ task.label }}<br />{{ task.list.title }}
    </li>
  </ol>
</template>

<script setup>
const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
ol,li,span {
  border: none;
}
</style>