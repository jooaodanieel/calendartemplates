<template>
  <div class="group">
    <div
      :class="[
        'option',
        { selected: selectedColor && color.name === selectedColor.name },
      ]"
      v-for="color of colors"
      :key="color.hex"
      @click="select(color)"
    >
      <div class="view" :style="{ backgroundColor: color.hex }"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  colors: {
    type: Array,
    required: true,
  },
  modelValue: Object,
});

const selectedColor = ref(null);

const emit = defineEmits(['update:modelValue']);

function select(color) {
  selectedColor.value = color;
  emit('update:modelValue', color);
}

onMounted(() => select(props.colors[0]));
</script>

<style scoped>
.selected {
  border: 2px solid white;
  border-style: inset;
}

.group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;

  width: 100%;
}

.option {
  width: 30px;
  height: 30px;
  font-size: 0.75em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 25%;
  margin: 0.5em;
}

.view {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
