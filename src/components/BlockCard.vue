<template>
  <Card class="reduced">
    <span class="block-name">{{ block.name }}</span>
    <span class="block-duration">({{ block.durationInMinutes }} min)</span>
  </Card>
</template>

<script setup>
import Card from './Card.vue';

defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.reduced {
  width: 75%;
}

.block-duration {
  color: #888;
  font-size: 0.9em;
}
</style>
