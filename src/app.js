const express = require('express');
const { addTodo, deleteTodo, listTodos } = require('./todos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function startServer(port = PORT) {
  return app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/todos', (req, res) => {
  res.status(200).json(listTodos());
});

app.post('/todos', (req, res) => {
  const { title } = req.body || {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      error: 'Le champ title est requis et doit être une chaîne non vide.',
    });
  }

  try {
    const todo = addTodo(title);
    return res.status(201).json(todo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!deleteTodo(id)) {
    return res.status(404).json({ error: 'Todo introuvable.' });
  }

  return res.status(200).json({ message: 'Todo supprimé.' });
});

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
