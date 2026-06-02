<template>
  <ol>
    <li v-for="block in blocks">
      {{ block.title }} {{ block.isBusy ? "(busy)" : "" }}<br />
      <span v-if="block.scheduling.type === 'fixed'">
        {{ block.scheduling.start }} - {{ block.scheduling.end }}
      </span>

      <span v-else-if="block.scheduling.type === 'dynamic'">
        (dyn: {{ block.scheduling.duration }} min)
      </span>

      <span v-else-if="block.scheduling.type === 'calculated'">
        {{ block.scheduling.duration }} min {{ block.scheduling.diffRef }} {{ block.scheduling.reference }}
      </span>
    </li>
  </ol>
</template>

<script setup>
const props = defineProps({
  blocks: {
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