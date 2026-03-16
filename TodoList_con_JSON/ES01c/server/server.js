const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

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

app.get('/api/todos', async (req, res) => {
    const data = await readData();
    res.json({ success: true, data: data.todos, count: data.todos.length });
});

app.get('/api/todos/:id', async (req, res) => {
    const data = await readData();
    const todo = data.todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ success: false, message: 'Task non trovata' });
    res.json({ success: true, data: todo });
});

app.post('/api/todos', async (req, res) => {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Il titolo è obbligatorio' });
    }
    const data = await readData();
    const newTodo = {
        id: data.nextId,
        title: title.trim(),
        description: (description || '').trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    data.todos.push(newTodo);
    data.nextId++;
    await writeData(data);
    res.status(201).json({ success: true, data: newTodo, message: 'Task creata con successo' });
});

app.put('/api/todos/:id', async (req, res) => {
    const data = await readData();
    const todo = data.todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ success: false, message: 'Task non trovata' });
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Il titolo è obbligatorio' });
    }
    todo.title = title.trim();
    todo.description = (description || '').trim();
    await writeData(data);
    res.json({ success: true, data: todo, message: 'Task aggiornata con successo' });
});

app.patch('/api/todos/:id/toggle', async (req, res) => {
    const data = await readData();
    const todo = data.todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ success: false, message: 'Task non trovata' });
    todo.completed = !todo.completed;
    await writeData(data);
    res.json({ success: true, data: todo, message: todo.completed ? 'Task completata' : 'Task riattivata' });
});

app.delete('/api/todos/:id', async (req, res) => {
    const data = await readData();
    const index = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Task non trovata' });
    data.todos.splice(index, 1);
    await writeData(data);
    res.json({ success: true, message: 'Task eliminata con successo' });
});

app.get('/api/stats', async (req, res) => {
    const data = await readData();
    const total = data.todos.length;
    const completed = data.todos.filter(t => t.completed).length;
    res.json({ success: true, data: { total, completed, active: total - completed } });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint non trovato' });
});

app.use((err, req, res, next) => {
    console.error('Errore:', err);
    res.status(500).json({ success: false, message: 'Errore interno del server' });
});

app.listen(PORT, () => {
    console.log(`Server Express in ascolto su http://localhost:${PORT}/`);
});
