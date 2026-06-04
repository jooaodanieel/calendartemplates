<template>
  <div class="wrapper">
    <div class="field">
      <label>Event Title</label>
      <input v-model="title" placeholder="es. Corso palestra" />
    </div>

    <div class="field">
      <label>Mark as <strong>busy</strong></label>
      <input type="checkbox" v-model="isBusy" />
    </div>

    <div class="field radios">
      <label>Type of Scheduling</label>
      <div class="radiogroup">
        <label>
          <input type="radio" v-model="schedulingType" value="fixed">
          fixed
        </label>

        <label>
          <input type="radio" v-model="schedulingType" value="calculated">
          calculated
        </label>

        <label>
          <input type="radio" v-model="schedulingType" value="dynamic">
          dynamic
        </label>
      </div>
    </div>

    <div v-if="isFixed">
      <div class="field">
        <label>Start</label>
        <input v-model="inputStart" type="time" />
      </div>

      <div class="field">
        <label>End</label>
        <input v-model="inputEnd" type="time" />
      </div>
    </div>

    <div v-else-if="isCalculated">
      <div class="field">
        <label>Reference</label>
        <select v-model="reference" class="field">
          <option
            class="field"
            v-for="reference in references"
            :value="reference"
          >
            {{ reference }}
          </option>
        </select>
      </div>

      <label>
        <input type="radio" v-model="diffRef" value="before">
        before
      </label>

      <label>
        <input type="radio" v-model="diffRef" value="after">
        after
      </label>

      <div class="field">
        <label>Duration</label>
        <input type="number" v-model="duration" />
      </div>
    </div>

    <div v-else-if="isDynamic">
      <div class="field">
        <label>Duration</label>
        <input type="number" v-model="duration" />
      </div>
    </div>

    <input type="button" value="done" @click="notify">
  </div>
</template>

<script setup>
import { computed, ref, toRaw } from 'vue';
import { calTimeFromHtmlInput } from '../utils/datetime';

const title = ref('')
const isBusy = ref(false)
const schedulingType = ref("fixed")

const inputStart = ref("")
const inputEnd = ref("")
const reference = ref("")
const diffRef = ref("before")
const duration = ref(0)

const props = defineProps({
  references: {
    type: Array,
    default: []
  }
})

const isFixed = computed(() => schedulingType.value === "fixed")
const isCalculated = computed(() => schedulingType.value === "calculated")
const isDynamic = computed(() => schedulingType.value === "dynamic")

const calStart = computed(() => calTimeFromHtmlInput(inputStart.value))
const calEnd = computed(() => calTimeFromHtmlInput(inputEnd.value))

const scheduling = computed(() => {
  if (isFixed.value) {
    return {
      type: schedulingType.value,
      start: toRaw(calStart.value.time),
      end: toRaw(calEnd.value.time)
    }
  }

  if (isCalculated.value)
    return {
      type: schedulingType.value,
      reference: reference.value,
      diffRef: diffRef.value,
      duration: duration.value
    }

  if (isDynamic)
    return {
      type: schedulingType.value,
      duration: duration.value
    }
})

const block = computed(() => {
  return {
    title: title.value,
    isBusy: isBusy.value,
    scheduling: scheduling.value
  }
})

function notify() {
  emit('blockCreated', block.value)
  title.value = ''
  isBusy.value = false
  schedulingType.value = "fixed"
  inputStart.value = ''
  inputEnd.value = ''
  reference.value = ''
  diffRef.value = 'before'
  duration.value = 0
}

const emit = defineEmits(['blockCreated'])
</script>

<style scoped>
.wrapper {
  border-radius: 5px;
  border: 1px solid whitesmoke;
  padding: 10px 0px;
  border-left: none;
  border-right: none;
}

.fields {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.field {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 8px;
}

.field input,
.field select,
.field option {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.small > label {
  padding: 0px;
}

.small > input {
  max-width: 3em;
}

.field.radios {
  display: flex;
  flex-direction: column;
}

.field.radios > .radiogroup {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>