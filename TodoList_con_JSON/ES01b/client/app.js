const API_BASE = 'http://localhost:3000';

let todos = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', init);

async function init() {
    setupEventListeners();
    await loadTodos();
    await loadStats();
}

async function loadTodos() {
    try {
        const res = await fetch(`${API_BASE}/todos`);
        const result = await res.json();
        if (result.success) {
            todos = result.data;
            setConnectionStatus(true);
            renderTodos();
        }
    } catch {
        setConnectionStatus(false);
    }
}

async function addTodo(title, description) {
    try {
        const res = await fetch(`${API_BASE}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        const result = await res.json();
        if (!result.success) { alert(result.message); return false; }
        await loadTodos();
        await loadStats();
        return true;
    } catch {
        setConnectionStatus(false);
        return false;
    }
}

async function toggleTodo(id) {
    try {
        await fetch(`${API_BASE}/todos/${id}/toggle`, { method: 'PATCH' });
        await loadTodos();
        await loadStats();
    } catch { setConnectionStatus(false); }
}

async function deleteTodo(id) {
    if (!confirm('Sei sicuro di voler eliminare questa task?')) return;
    try {
        await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
        await loadTodos();
        await loadStats();
    } catch { setConnectionStatus(false); }
}

async function loadStats() {
    try {
        const res = await fetch(`${API_BASE}/stats`);
        const result = await res.json();
        if (result.success) {
            const s = result.data;
            document.getElementById('stats').textContent = `Totale: ${s.total} | Completate: ${s.completed} | Attive: ${s.active}`;
        }
    } catch {}
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    const filtered = getFilteredTodos();
    if (filtered.length === 0) {
        todoList.innerHTML = '<p class="empty-message">Nessuna task da visualizzare</p>';
        updateCounter();
        return;
    }
    filtered.forEach(todo => todoList.appendChild(createTodoElement(todo)));
    updateCounter();
}

function createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    div.dataset.id = todo.id;
    div.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <div class="todo-content">
            <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
            ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
            <small class="todo-date">${formatDate(todo.createdAt)}</small>
        </div>
        <div class="todo-actions">
            <button class="btn-delete">Elimina</button>
        </div>
    `;
    div.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
    div.querySelector('.btn-delete').addEventListener('click', () => deleteTodo(todo.id));
    return div;
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'active': return todos.filter(t => !t.completed);
        case 'completed': return todos.filter(t => t.completed);
        default: return todos;
    }
}

function updateCounter() {
    const active = todos.filter(t => !t.completed).length;
    document.getElementById('activeCount').textContent = `${active} task ${active === 1 ? 'attiva' : 'attive'}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('it-IT')}, ${date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
}

function setConnectionStatus(connected) {
    document.getElementById('statusDot').className = `status-dot ${connected ? 'connected' : ''}`;
    document.getElementById('statusText').textContent = connected ? 'Server connesso' : 'Server disconnesso';
}

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', handleAddTodo);
    document.getElementById('todoTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });
    document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', handleFilterChange));
}

async function handleAddTodo() {
    const titleInput = document.getElementById('todoTitle');
    const descInput = document.getElementById('todoDescription');
    const title = titleInput.value.trim();
    if (!title) { alert('Il titolo è obbligatorio!'); return; }
    if (await addTodo(title, descInput.value.trim())) {
        titleInput.value = '';
        descInput.value = '';
        titleInput.focus();
    }
}

function handleFilterChange(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderTodos();
}
