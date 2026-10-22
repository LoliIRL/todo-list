<template>
  <dialog ref="dialogRef" class="modal" @close="$emit('close')">
    <form method="dialog" @submit.prevent="onSubmit" class="modal-content">
      <h2>{{ initialTitle ? 'Редактировать' : 'Новая задача' }}</h2>
      <label>
        <span class="label-text">Название задачи</span>
        <input type="text" v-model="title" required autofocus class="input">
      </label>
      <div class="modal-actions">
        <button type="button" @click="$emit('close')">Отмена</button>
        <button type="submit" class="btn-primary">Сохранить</button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({ isOpen: Boolean, initialTitle: String });
const emit = defineEmits(['close', 'save']);
const dialogRef = ref(null);
const title = ref('');

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    title.value = props.initialTitle || '';
    dialogRef.value.showModal();
    await nextTick();
    dialogRef.value.querySelector('input').focus();
  } else {
    dialogRef.value.close();
  }
});

const onSubmit = () => {
  if (title.value.trim()) emit('save', title.value.trim());
};
</script>

<style scoped>
.modal { border: none; border-radius: 12px; background: var(--panel); color: var(--text); padding: 0; max-width: 90vw; width: 400px; }
.modal::backdrop { background: rgba(0,0,0,0.6); }
.modal-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
h2 { font-size: 1.2rem; }
.label-text { display: block; font-size: 0.9rem; margin-bottom: 0.5rem; }
.input { width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
.btn-primary { background: var(--primary); color: #fff; padding: 0.5rem 1rem; border-radius: 6px; }
</style>