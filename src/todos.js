const todos = [];

function resetTodos() {
  todos.length = 0;
}

function listTodos() {
  return todos.map((todo) => ({ ...todo }));
}

function addTodo(title, completed = false) {
  const normalizedTitle = typeof title === 'string' ? title.trim() : '';

  if (!normalizedTitle) {
    throw new Error('Todo title is required');
  }

  const todo = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: normalizedTitle,
    completed: Boolean(completed),
  };

  todos.push(todo);
  return { ...todo };
}

function deleteTodo(id) {
  const targetId = String(id);
  const index = todos.findIndex((todo) => String(todo.id) === targetId);

  if (index === -1) {
    return false;
  }

  todos.splice(index, 1);
  return true;
}

module.exports = {
  addTodo,
  deleteTodo,
  listTodos,
  resetTodos,
};
