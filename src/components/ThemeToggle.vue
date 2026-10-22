<template>
  <button class="theme-btn" @click="$emit('toggle')" :aria-label="theme === 'dark' ? 'Включить светлую' : 'Включить тёмную'">
    {{ theme === 'dark' ? '☀️' : '🌙' }}
  </button>
</template>

<script setup>
defineProps(['theme']);
defineEmits(['toggle']);
</script>

<style scoped>
.theme-btn { width: 2.5rem; height: 2.5rem; border-radius: 8px; background: var(--bg-alt); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
</style>