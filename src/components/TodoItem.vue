<template>
  <li class="task" :class="{ done: task.done }">
    <input type="checkbox" :id="'task-' + task.id" :checked="task.done" @change="$emit('toggle')" class="checkbox">
    <label :for="'task-' + task.id" class="title">{{ task.title }}</label>
    
    <div class="actions">
      <button class="btn-icon" :id="'edit-' + task.id" :aria-labelledby="'edit-' + task.id + ' title-' + task.id" @click="$emit('edit')">
        <span class="sr-only">Редактировать задачу</span>
        ✏️
      </button>
      <button class="btn-icon danger" :id="'del-' + task.id" :aria-labelledby="'del-' + task.id + ' title-' + task.id" @click="$emit('delete')">
        <span class="sr-only">Удалить задачу</span>
        🗑️
      </button>
    </div>
  </li>
</template>

<script setup>
defineProps({ task: Object });
defineEmits(['toggle', 'edit', 'delete']);
</script>

<style scoped>
.task { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; }
.task.done .title { text-decoration: line-through; color: var(--muted); }
.checkbox { width: 1.2rem; height: 1.2rem; accent-color: var(--primary); cursor: pointer; }
.title { flex: 1; cursor: pointer; word-break: break-word; }
.actions { display: flex; gap: 0.5rem; }
.btn-icon { width: 2rem; height: 2rem; border-radius: 6px; display: flex; align-items: center; justify-content: center; background: var(--bg-alt); }
.btn-icon:hover { background: var(--border); }
.btn-icon.danger:hover { color: #ef4444; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
</style>