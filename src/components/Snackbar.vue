<template>
  <Transition name="snackbar">
    <div v-if="visible" class="snackbar">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let timeout = null

function show(text, duration = 3000) {
  if (timeout) clearTimeout(timeout)
  message.value = text
  visible.value = true
  timeout = setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9em;
  white-space: nowrap;
  z-index: 1000;
}
.snackbar-enter-active,
.snackbar-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>