/* =====================================================
   To-Do List — лабораторная №4
   Автор: Киселев Максим, ФИТ-241
   Доступность: A1–A7
   ===================================================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'todo-list-tasks';
  const THEME_KEY = 'todo-list-theme';

  // ---------- DOM ----------
  const listActive = document.querySelector('.js-list-active');
  const listDone   = document.querySelector('.js-list-done');
  const emptyActive = document.querySelector('.js-empty-active');
  const emptyDone   = document.querySelector('.js-empty-done');
  const searchInput = document.querySelector('.js-search');

  const dialog = document.querySelector('.js-dialog');
  const form = document.querySelector('.js-form');
  const taskInput = document.querySelector('.js-task-input');
  const btnAdd = document.querySelector('.js-add-task');
  const btnCancel = document.querySelector('.js-cancel');
  const btnTheme = document.querySelector('.js-theme-toggle');

  // ---------- STATE ----------
  let tasks = loadTasks();
  let editingId = null;

  // ---------- STORAGE ----------
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Базовая валидация
      return parsed
        .filter(t => t && typeof t.id === 'number' && typeof t.title === 'string')
        .map(t => ({ id: t.id, title: t.title, done: !!t.done }));
    } catch (e) {
      console.warn('Повреждённое хранилище, стартуем с пустым списком');
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Не удалось сохранить задачи', e);
    }
  }

  function nextId() {
    if (!tasks.length) return 1;
    return Math.max(...tasks.map(t => t.id)) + 1;
  }

  // ---------- THEME ----------
  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    btnTheme.querySelector('span').textContent = theme === 'dark' ? '☀️' : '🌙';
    btnTheme.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }

  // ---------- RENDER ----------
  function render() {
    const query = (searchInput.value || '').trim().toLowerCase();

    const filtered = tasks.filter(t => t.title.toLowerCase().includes(query));
    const active = filtered.filter(t => !t.done);
    const done   = filtered.filter(t => t.done);

    listActive.innerHTML = '';
    listDone.innerHTML = '';

    active.forEach(t => listActive.appendChild(createTaskEl(t)));
    done.forEach(t => listDone.appendChild(createTaskEl(t)));

    emptyActive.hidden = active.length > 0;
    emptyDone.hidden = done.length > 0;
  }

  // ---------- CREATE TASK ELEMENT ----------
  function createTaskEl(task) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' task--done' : '');
    li.dataset.task = '';
    li.dataset.id = String(task.id);

    // id для aria-labelledby
    const checkboxId = `task-${task.id}-done`;
    const titleId = `task-${task.id}-title`;
    const deleteId = `task-${task.id}-delete`;
    const editId = `task-${task.id}-edit`;

    // Чекбокс
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task__checkbox js-toggle';
    checkbox.id = checkboxId;
    checkbox.checked = task.done;

    // Название — label для чекбокса (A3)
    const title = document.createElement('label');
    title.className = 'task__title';
    title.id = titleId;
    title.setAttribute('for', checkboxId);
    title.textContent = task.title;  // безопасно, без innerHTML

    // Кнопки
    const actions = document.createElement('div');
    actions.className = 'task__actions';

    const btnEdit = document.createElement('button');
    btnEdit.type = 'button';
    btnEdit.className = 'button button--icon js-edit';
    btnEdit.id = editId;
    btnEdit.setAttribute('aria-labelledby', `${editId} ${titleId}`);
    btnEdit.innerHTML = `<span class="visually-hidden">Редактировать задачу</span>
      <svg class="task__icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
      </svg>`;

    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.className = 'button button--icon button--danger js-delete';
    btnDelete.id = deleteId;
    btnDelete.setAttribute('aria-labelledby', `${deleteId} ${titleId}`);
    btnDelete.innerHTML = `<span class="visually-hidden">Удалить задачу</span>
      <svg class="task__icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
      </svg>`;

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(actions);

    // Обработчики
    checkbox.addEventListener('change', () => toggleTask(task.id));
    btnEdit.addEventListener('click', () => openEdit(task.id));
    btnDelete.addEventListener('click', () => deleteTask(task.id, li));

    return li;
  }

  // ---------- ACTIONS ----------
  function addTask(title) {
    const t = { id: nextId(), title: title.trim(), done: false };
    tasks.push(t);
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    saveTasks();
    render();
  }

  function openEdit(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    editingId = id;
    taskInput.value = t.title;
    document.getElementById('dialog-title').textContent = 'Редактировать задачу';
    dialog.showModal();
  }

  function deleteTask(id, liEl) {
    // A5: ищем следующую видимую задачу
    const allTasks = Array.from(document.querySelectorAll('[data-task]'));
    const index = allTasks.indexOf(liEl);
    const isVisible = el => el.getClientRects().length > 0;
    const next =
      allTasks.slice(index + 1).find(isVisible) ||
      allTasks.slice(0, index).reverse().find(isVisible);

    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();

    // A5: возврат фокуса
    if (next && document.body.contains(next)) {
      const focusable = next.querySelector('input[type="checkbox"], button');
      if (focusable) focusable.focus();
    } else {
      btnAdd.focus();
    }
  }

  // ---------- MODAL ----------
  function openAdd() {
    editingId = null;
    taskInput.value = '';
    document.getElementById('dialog-title').textContent = 'Новая задача';
    dialog.showModal();
  }

  btnAdd.addEventListener('click', openAdd);

  btnCancel.addEventListener('click', () => dialog.close());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) {
      taskInput.focus();
      return;
    }

    if (editingId === null) {
      addTask(title);
    } else {
      const t = tasks.find(x => x.id === editingId);
      if (t) {
        t.title = title;
        saveTasks();
        render();
      }
      editingId = null;
    }
    dialog.close();
  });

  // A4: фокус на кнопку, которая открыла диалог (dialog делает это сам,
  // но на всякий случай — на добавление)
  dialog.addEventListener('close', () => {
    // если редактировали через кнопку в задаче — вернуть фокус туда
    // это уже делает браузер автоматически через <dialog>
  });

  // ---------- SEARCH ----------
  searchInput.addEventListener('input', render);

  // ---------- THEME ----------
  btnTheme.addEventListener('click', toggleTheme);

  // ---------- INIT ----------
  applyTheme(getInitialTheme());
  render();

})();