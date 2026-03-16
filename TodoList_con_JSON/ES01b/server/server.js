const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

async function readData() {
    try {
        const raw = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        const initial = { todos: [], nextId: 1 };
        await writeData(initial);
        return initial;
    }
}

async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch { reject(new Error('JSON non valido')); }
        });
    });
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
    sendJSON(res, statusCode, { success: false, message });
}

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function handleGetTodos(req, res) {
    const data = await readData();
    sendJSON(res, 200, { success: true, data: data.todos, count: data.todos.length });
}

async function handleCreateTodo(req, res) {
    const body = await parseBody(req);
    if (!body.title || body.title.trim() === '') {
        return sendError(res, 400, 'Il titolo è obbligatorio');
    }
    const data = await readData();
    const newTodo = {
        id: data.nextId,
        title: body.title.trim(),
        description: (body.description || '').trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    data.todos.push(newTodo);
    data.nextId++;
    await writeData(data);
    sendJSON(res, 201, { success: true, data: newTodo, message: 'Task creata con successo' });
}

async function handleToggleTodo(req, res, id) {
    const data = await readData();
    const todo = data.todos.find(t => t.id === id);
    if (!todo) return sendError(res, 404, 'Task non trovata');
    todo.completed = !todo.completed;
    await writeData(data);
    sendJSON(res, 200, { success: true, data: todo, message: todo.completed ? 'Task completata' : 'Task riattivata' });
}

async function handleDeleteTodo(req, res, id) {
    const data = await readData();
    const index = data.todos.findIndex(t => t.id === id);
    if (index === -1) return sendError(res, 404, 'Task non trovata');
    data.todos.splice(index, 1);
    await writeData(data);
    sendJSON(res, 200, { success: true, message: 'Task eliminata con successo' });
}

async function handleGetStats(req, res) {
    const data = await readData();
    const total = data.todos.length;
    const completed = data.todos.filter(t => t.completed).length;
    sendJSON(res, 200, { success: true, data: { total, completed, active: total - completed } });
}

const server = http.createServer(async (req, res) => {
    setCORS(res);
    const method = req.method;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    console.log(`${method} ${pathname}`);

    if (method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    try {
        if (method === 'GET' && pathname === '/todos') {
            return await handleGetTodos(req, res);
        }
        if (method === 'POST' && pathname === '/todos') {
            return await handleCreateTodo(req, res);
        }
        const toggleMatch = pathname.match(/^\/todos\/(\d+)\/toggle$/);
        if (method === 'PATCH' && toggleMatch) {
            return await handleToggleTodo(req, res, parseInt(toggleMatch[1]));
        }
        const deleteMatch = pathname.match(/^\/todos\/(\d+)$/);
        if (method === 'DELETE' && deleteMatch) {
            return await handleDeleteTodo(req, res, parseInt(deleteMatch[1]));
        }
        if (method === 'GET' && pathname === '/stats') {
            return await handleGetStats(req, res);
        }
        sendError(res, 404, 'Endpoint non trovato');
    } catch (error) {
        console.error('Errore server:', error);
        sendError(res, 500, 'Errore interno del server');
    }
});

server.listen(PORT, () => {
    console.log(`Server HTTP in ascolto su http://localhost:${PORT}/`);
});
