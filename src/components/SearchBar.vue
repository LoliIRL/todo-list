<template>
  <div>
    <label for="search" class="sr-only">Поиск задач</label>
    <input 
      id="search" 
      type="search" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)" 
      placeholder="Найти задачу..." 
      class="search-input"
    >
  </div>
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>

<style scoped>
.search-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 8px; background: var(--panel); color: var(--text); font-size: 1rem; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
</style>