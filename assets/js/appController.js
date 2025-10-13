/* appController.js
   Integra dataStore e renderUI, adiciona eventos (drag & drop, add, edit, delete)
*/

(function () {

  // colunas padrão (iniciais)
  const COLUMNS = ["To-do", "In Progress", "Done", "Gone"];

  function init() {
    ensureColumnsExist();
    bindUI();
    renderUI.renderBoard();
  }

  function ensureColumnsExist() {
    const board = document.getElementById("board");
    COLUMNS.forEach(colName => {
      let col = board.querySelector(`ol.kanban[data-column="${colName}"]`);
      if (!col) {
        col = document.createElement("ol");
        col.className = "kanban";
        col.dataset.column = colName;
        col.innerHTML = `<h2><i class="material-icons">${colIcon(colName)}</i> ${colName}</h2>
                         <div class="actions"><button class="addbutt"><i class="material-icons">control_point</i> Add new</button></div>`;
        board.appendChild(col);
      }
    });
  }

  function colIcon(name) {
    switch (name) {
      case "To-do": return "report_problem";
      case "In Progress": return "build";
      case "Done": return "check_circle";
      case "Gone": return "delete";
      default: return "folder";
    }
  }

  function bindUI() {
    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);
    document.addEventListener("focusout", handleFocusOut);

    // botão "Add new task"
    document.querySelectorAll("button.addbutt").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const col = e.target.closest("ol.kanban");
        const columnName = col ? col.dataset.column : "To-do";
        const newTask = dataStore.addTask({ column: columnName, title: "Nova tarefa", description: "" });
        renderUI.renderBoard();
        setTimeout(() => {
          const el = document.querySelector(`.dd-item[data-id="${newTask.id}"] .task-title`);
          if (el) { el.focus(); selectAllText(el); }
        }, 50);
      });
    });

    // botão "Adicione colunas"
    const addColumnBtn = document.getElementById("addColumnBtn");
    if (addColumnBtn) {
      addColumnBtn.addEventListener("click", () => {
        const name = prompt("Digite o nome da nova coluna:");
        if (!name) return;

        const board = document.getElementById("board");
        const exists = board.querySelector(`ol.kanban[data-column="${name}"]`);
        if (exists) {
          alert("Já existe uma coluna com esse nome!");
          return;
        }

        // cria a nova coluna
        const col = document.createElement("ol");
        col.className = "kanban";
        col.dataset.column = name;
        col.innerHTML = `
          <h2><i class="material-icons">folder</i> ${name}</h2>
          <div class="actions">
            <button class="addbutt"><i class="material-icons">control_point</i> Add new</button>
          </div>
        `;
        board.appendChild(col);

        // evento para o botão "Add new" dentro da nova coluna
        col.querySelector(".addbutt").addEventListener("click", () => {
          const columnName = col.dataset.column;
          const newTask = dataStore.addTask({ column: columnName, title: "Nova tarefa", description: "" });
          renderUI.renderBoard();
          setTimeout(() => {
            const el = document.querySelector(`.dd-item[data-id="${newTask.id}"] .task-title`);
            if (el) { el.focus(); selectAllText(el); }
          }, 50);
        });
      });
    }
    
    // BOTÃO RESPONSÁVEL CORRIGIDO (MOVIDO PARA FORA DO addColumnBtn)
    const responsavelBtn = document.getElementById("responsavelBtn");
    if (responsavelBtn) {
      responsavelBtn.addEventListener("click", () => {
        const nome = prompt("Digite o nome do responsável (Ex: Thiago Malta):");
        const data = prompt("Digite a data (Ex: 25/12/2025):");

        if (!nome || !data) return;

        // Aplica em TODAS as tasks (como estava no seu código original)
        const all = dataStore.getAll().map(task => {
          return {
            ...task,
            responsavel: nome,
            data: data
          };
        });

        // Salva as alterações no localStorage
        localStorage.setItem("kanban_tasks_v1", JSON.stringify(all));
        
        renderUI.renderBoard();
        alert(`Responsável e data atribuídos: ${nome} - ${data}`);
      });
    }

    // botão "Clear All"
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Remover todas as tasks e restaurar valores padrão?")) {
          localStorage.removeItem("kanban_tasks_v1");
          location.reload();
        }
      });
    }

    // toggle view (kanban/list)
    const viewListBtn = document.getElementById("viewListBtn");
    const viewKanbanBtn = document.getElementById("viewKanbanBtn");
    viewListBtn && viewListBtn.addEventListener("click", () => {
      document.body.classList.add("list-view");
    });
    viewKanbanBtn && viewKanbanBtn.addEventListener("click", () => {
      document.body.classList.remove("list-view");
    });

    // eventos de drag & drop
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("dragend", onDragEnd);
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);

    // ações nos botões dos cards (excluir, duplicar)
    document.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const li = e.target.closest(".dd-item");
      if (!li) return;

      if (btn.classList.contains("btn-delete")) {
        const id = li.dataset.id;
        if (confirm("Excluir tarefa?")) {
          dataStore.deleteTask(id);
          renderUI.renderBoard();
        }
      } else if (btn.classList.contains("btn-edit")) {
        const id = li.dataset.id;
        const all = dataStore.getAll();
        const t = all.find(x => x.id === id);
        if (t) {
          const copy = dataStore.addTask({
            column: t.column,
            title: t.title + " (cópia)",
            description: t.description
          });
          renderUI.renderBoard();
        }
      }
    });

    // salva edição de campos (title/description)
    document.addEventListener("focusout", (e) => {
      const field = e.target;
      if (!field || !field.closest) return;
      const li = field.closest(".dd-item");
      if (!li) return;
      const id = li.dataset.id;
      const f = field.dataset.field;
      if (f) {
        const patch = {};
        patch[f] = field.innerText.trim();
        dataStore.updateTask(id, patch);
        renderUI.updateProgressBar();
      }
    });
  }

  // helper: selecionar texto
  function selectAllText(el) {
    if (document.createRange && window.getSelection) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  // DRAG & DROP
  let dragEl = null;

  function onDragStart(e) {
    const li = e.target.closest(".dd-item");
    if (!li) return;
    dragEl = li;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', li.dataset.id);
  }

  function onDragEnd() {
    if (dragEl) dragEl.classList.remove("dragging");
    dragEl = null;
    document.querySelectorAll(".kanban .placeholder").forEach(p => p.remove());
  }

  function onDragOver(e) {
    e.preventDefault();
    const col = e.target.closest("ol.kanban");
    if (!col) return;
    const afterElement = getDragAfterElement(col, e.clientY);
    let placeholder = col.querySelector(".placeholder");
    if (!placeholder) {
      placeholder = document.createElement("div");
      placeholder.className = "placeholder";
      col.appendChild(placeholder);
    }
    if (afterElement == null) {
      col.appendChild(placeholder);
    } else {
      col.insertBefore(placeholder, afterElement);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    const col = e.target.closest("ol.kanban");
    if (!col) return;
    const id = e.dataTransfer.getData('text/plain') || (dragEl && dragEl.dataset.id);
    if (!id) return;
    const columnName = col.dataset.column || "To-do";
    const placeholder = col.querySelector(".placeholder");
    let toIndex = 0;
    if (placeholder) {
      const items = Array.from(col.querySelectorAll(".dd-item"));
      toIndex = items.indexOf(placeholder.previousElementSibling) + 1;
      placeholder.remove();
    }
    dataStore.moveTask(id, columnName, toIndex);
    renderUI.renderBoard();
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.dd-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // handlers básicos
  function handleInput() {}
  function handleClick() {}
  function handleFocusOut() {}

  // inicia o app
  document.addEventListener("DOMContentLoaded", init);
})();