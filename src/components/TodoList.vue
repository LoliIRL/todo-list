<template>
  <ul class="list">
    <TodoItem 
      v-for="task in tasks" 
      :key="task.id" 
      :task="task" 
      @toggle="$emit('toggle', task.id)"
      @edit="$emit('edit', task)"
      @delete="$emit('delete', task.id)"
    />
  </ul>
</template>

<script setup>
import TodoItem from './TodoItem.vue';
defineProps({ tasks: Array });
defineEmits(['toggle', 'edit', 'delete']);
</script>

<style scoped>
.list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
</style>