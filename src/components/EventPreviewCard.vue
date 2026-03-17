<template>
  <div :class="['preview-card', { anchor: isAnchor }]">
    <span class="event-label">{{ event.label }}</span>
    <span class="event-time">{{ event.time }}</span>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  },
  isAnchor: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.preview-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
}
.anchor {
  margin: 12px 0;
}
.event-time {
  color: #888;
  font-size: 0.9em;
}
</style>