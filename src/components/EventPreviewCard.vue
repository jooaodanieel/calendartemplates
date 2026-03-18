<template>
  <div :class="['preview-card', { anchor: isAnchor }]">
    <span class="event-label">{{ event.label }}</span>

    <div class="info-wrapper">
      <div class="event-info">{{ event.day }}</div>
      <div v-if="!isSameDay" class="event-info">{{ event.endDay }}</div>
    </div>
    
    <div class="info-wrapper">
      <div class="event-info">{{ event.time }}</div>
      <div class="event-info">{{ event.endTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  isAnchor: {
    type: Boolean,
    default: false
  }
})

const isSameDay = computed(() => props.event.day === props.event.endDay)
</script>

<style scoped>
.preview-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
}

.anchor {
  margin: 12px 0;
  border: 3px solid #ccc;
  font-weight: 700;
  width: calc(100% - 3px);
}

.event-info {
  color: #888;
  font-size: 0.7em;
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>