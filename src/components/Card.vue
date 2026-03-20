<template>
  <section>
    <slot></slot>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>