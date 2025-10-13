/* renderUI.js
   Funções para renderizar o board e elementos
*/

const renderUI = (function () {

 function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "dd-item";
  li.draggable = true;
  li.dataset.id = task.id;

  li.innerHTML = `
    <div class="title">
      <span class="task-title" contenteditable="true" data-field="title">${escapeHtml(task.title)}</span>
      <i class="material-icons drag-icon" title="Arrastar">drag_indicator</i>
    </div>
    <div class="text" contenteditable="true" data-field="description">${escapeHtml(task.description)}</div>
    <div class="card-actions">
      <button class="btn-edit" title="Editar (duplicar)"><i class="material-icons">edit</i></button>
      <button class="btn-link" title="Link"><i class="material-icons">insert_link</i></button>
      <button class="btn-attach" title="Anexo"><i class="material-icons">attach_file</i></button>
      <button class="btn-delete" title="Excluir"><i class="material-icons">delete</i></button>
    </div>
  `;

  // 👉 INSERÇÃO CORRETA FORA DO innerHTML
  if (task.responsavel || task.data) {
    const info = document.createElement("div");
    info.style.fontSize = "12px";
    info.style.color = "#607D8B";
    info.style.marginTop = "4px";
    info.innerHTML = `<strong>${task.responsavel || ''}</strong> - <em>${task.data || ''}</em>`;
    li.appendChild(info);
  }

  return li;
}


  function renderColumn(columnName, container) {
    // container: <ol class="kanban" data-column="...">
    // limpa cards (mantém título e botão)
    // vamos remover todos os .dd-item já existentes antes de colocar novos
    const existingCards = container.querySelectorAll(".dd-item");
    existingCards.forEach(n => n.remove());

    const tasks = dataStore.getByColumn(columnName);
    tasks.forEach(task => {
      const el = createTaskElement(task);
      container.insertBefore(el, container.querySelector(".actions"));
    });
  }

  function renderBoard() {
    const columns = document.querySelectorAll("ol.kanban");
    columns.forEach(col => {
      const columnName = col.dataset.column || col.className;
      renderColumn(columnName, col);
    });

    // atualiza progress bar (percentual simples: % de tasks em Done)
    updateProgressBar();
  }

  function updateProgressBar() {
    const all = dataStore.getAll().length;
    const done = dataStore.getByColumn("Done").length;
    const pct = all === 0 ? 0 : Math.round((done / all) * 100);
    const p1 = document.querySelector("#p1");
    if (p1 && p1.MaterialProgress) {
      p1.MaterialProgress.setProgress(pct);
    } else {
      // se MDL não disponível, criar fallback visual (não obrigatório)
      if (p1) p1.style.width = pct + "%";
    }
  }

  // utility
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  return {
    renderBoard,
    renderColumn,
    createTaskElement,
    updateProgressBar
  };
})();