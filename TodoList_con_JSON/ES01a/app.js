const STORAGE_KEY = 'todoListData';

let todosData = { todos: [], nextId: 1 };
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTodos();
    setupEventListeners();
    renderTodos();
}

function loadTodos() {
    try {
        const jsonString = localStorage.getItem(STORAGE_KEY);
        if (jsonString) {
            todosData = JSON.parse(jsonString);
        }
    } catch (error) {
        console.error('Errore caricamento:', error);
        todosData = { todos: [], nextId: 1 };
    }
}

function saveTodos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todosData));
    } catch (error) {
        console.error('Errore salvataggio:', error);
    }
}

function addTodo(title, description = '') {
    if (!title || title.trim() === '') {
        alert('Il titolo è obbligatorio!');
        return false;
    }
    const newTodo = {
        id: todosData.nextId,
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    todosData.todos.push(newTodo);
    todosData.nextId++;
    saveTodos();
    renderTodos();
    return true;
}

function deleteTodo(id) {
    if (!confirm('Sei sicuro di voler eliminare questa task?')) return;
    todosData.todos = todosData.todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todosData.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    const filteredTodos = getFilteredTodos();
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<p class="empty-message">Nessuna task da visualizzare</p>';
        updateCounter();
        return;
    }
    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
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
        case 'active': return todosData.todos.filter(t => !t.completed);
        case 'completed': return todosData.todos.filter(t => t.completed);
        default: return todosData.todos;
    }
}

function updateCounter() {
    const activeCount = todosData.todos.filter(t => !t.completed).length;
    document.getElementById('activeCount').textContent = `${activeCount} task ${activeCount === 1 ? 'attiva' : 'attive'}`;
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

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', handleAddTodo);
    document.getElementById('todoTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

function handleAddTodo() {
    const titleInput = document.getElementById('todoTitle');
    const descInput = document.getElementById('todoDescription');
    if (addTodo(titleInput.value, descInput.value)) {
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
