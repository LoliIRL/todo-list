<template>
  <header class="header">
    <div class="header-inner">
      <h1>📝 To-Do List (Vue)</h1>
      <div class="actions">
        <ThemeToggle @toggle="toggleTheme" :theme="theme" />
        <button class="btn-primary" @click="openModal()">➕ Добавить</button>
      </div>
    </div>
  </header>

  <main class="main">
    <SearchBar v-model="searchQuery" />

    <section class="section">
      <h2 class="section-title">Активные</h2>
      <TodoList :tasks="activeTasks" @toggle="toggleTask" @edit="openModal" @delete="deleteTask" />
      <p v-if="activeTasks.length === 0" class="empty">Активных задач нет</p>
    </section>

    <section class="section">
      <h2 class="section-title">Выполненные</h2>
      <TodoList :tasks="doneTasks" @toggle="toggleTask" @edit="openModal" @delete="deleteTask" />
      <p v-if="doneTasks.length === 0" class="empty">Выполненных задач нет</p>
    </section>
  </main>

  <AddTodoModal 
    :isOpen="isModalOpen" 
    :initialTitle="editingTask ? editingTask.title : ''"
    @close="closeModal" 
    @save="saveTask" 
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import SearchBar from './components/SearchBar.vue';
import TodoList from './components/TodoList.vue';
import AddTodoModal from './components/AddTodoModal.vue';
import ThemeToggle from './components/ThemeToggle.vue';

const STORAGE_KEY = 'vue-todo-tasks';
const THEME_KEY = 'vue-todo-theme';

const tasks = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const editingTask = ref(null);
const theme = ref(localStorage.getItem(THEME_KEY) || 'light');

// === Computed: фильтрация задач ===
const filteredTasks = computed(() => {
  return tasks.value.filter(t => t.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const activeTasks = computed(() => filteredTasks.value.filter(t => !t.done));
const doneTasks = computed(() => filteredTasks.value.filter(t => t.done));

// === Watch: сохранение в localStorage ===
watch(tasks, (newTasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
}, { deep: true });

// === Watch: смена темы ===
watch(theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}, { immediate: true });

// === Загрузка при старте ===
onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) tasks.value = JSON.parse(saved);
  } catch (e) {
    console.warn('Ошибка загрузки задач', e);
  }
});

// === Действия ===
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const openModal = (task = null) => {
  editingTask.value = task;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingTask.value = null;
};

const saveTask = (title) => {
  if (editingTask.value) {
    editingTask.value.title = title;
  } else {
    tasks.value.push({ id: Date.now(), title, done: false });
  }
  closeModal();
};

const toggleTask = (id) => {
  const task = tasks.value.find(t => t.id === id);
  if (task) task.done = !task.done;
};

const deleteTask = (id) => {
  tasks.value = tasks.value.filter(t => t.id !== id);
};
</script>

<style scoped>
.header { background: var(--panel); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; }
.header-inner { max-width: 800px; margin: 0 auto; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
h1 { font-size: 1.5rem; color: var(--primary); }
.actions { display: flex; gap: 0.5rem; align-items: center; }
.btn-primary { background: var(--primary); color: #fff; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500; }
.btn-primary:hover { filter: brightness(1.1); }
.main { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
.section-title { font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
.section-title::before { content: ''; display: block; width: 4px; height: 1.2rem; background: var(--primary); border-radius: 2px; }
.empty { color: var(--muted); font-style: italic; padding: 1rem 0; text-align: center; }
</style>