/* dataStore.js
   Gerencia os dados do Kanban (localStorage)
*/

const dataStore = (function () {
  const STORAGE_KEY = "kanban_tasks_v1";

  // Estrutura de exemplo inicial (apenas se não existir nada no localStorage)
  const defaultTasks = [
    { id: genId(), column: "To-do", title: "Do the dishes", description: "Lavar a louça", created: Date.now() },
    { id: genId(), column: "To-do", title: "Login bug", description: "Corrigir erro no login", created: Date.now() },
    { id: genId(), column: "In Progress", title: "UX design", description: "Ajustes no layout", created: Date.now() },
    { id: genId(), column: "Done", title: "Deploy", description: "Colocar em produção", created: Date.now() }
  ];

  let tasks = [];

  function genId() {
    return 't_' + Math.random().toString(36).substr(2, 9);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaultTasks));
    } catch (e) {
      console.error("Erro ao carregar tasks:", e);
      tasks = JSON.parse(JSON.stringify(defaultTasks));
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Erro ao salvar tasks:", e);
    }
  }

  function getAll() {
    return tasks.slice();
  }

  function getByColumn(column) {
    return tasks.filter(t => t.column === column);
  }

  function addTask({ column = "To-do", title = "Nova tarefa", description = "" } = {}) {
    const newTask = { id: genId(), column, title, description, created: Date.now() };
    tasks.unshift(newTask);
    save();
    return newTask;
  }

  function updateTask(id, patch = {}) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = Object.assign({}, tasks[idx], patch);
    save();
    return tasks[idx];
  }

  function deleteTask(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    tasks.splice(idx, 1);
    save();
    return true;
  }

  function moveTask(id, toColumn, toIndex = 0) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    tasks[idx].column = toColumn;
    // optionally reorder: move to front by default
    const [task] = tasks.splice(idx, 1);
    tasks.splice(toIndex, 0, task);
    save();
    return true;
  }

  // Inicialização
  load();

  return {
    load,
    save,
    getAll,
    getByColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask
  };
})();