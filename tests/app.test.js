const request = require('supertest');

const app = require('../src/app');
const { addTodo, resetTodos } = require('../src/todos');

beforeEach(() => {
  resetTodos();
});

describe('API To-Do', () => {
  it('should return a healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('should return an empty list at startup', async () => {
    const response = await request(app).get('/todos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a todo with valid payload', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ title: 'Rédiger le rapport' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: 'Rédiger le rapport',
      completed: false,
    });
    expect(response.body).toHaveProperty('id');
  });

  it('should reject a todo without title', async () => {
    const response = await request(app).post('/todos').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('title');
  });

  it('should reject a blank title in the storage layer', () => {
    expect(() => addTodo('   ')).toThrow('Todo title is required');
  });

  it('should reject a todo with an empty title', async () => {
    const response = await request(app).post('/todos').send({ title: '   ' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle unexpected storage failures in the POST route', async () => {
    jest.resetModules();
    jest.doMock('../src/todos', () => ({
      addTodo: jest.fn(() => {
        throw new Error('Storage failed');
      }),
      deleteTodo: jest.fn(() => true),
      listTodos: jest.fn(() => []),
    }));

    const appWithFailure = require('../src/app');
    const response = await request(appWithFailure)
      .post('/todos')
      .send({ title: 'Tâche de secours' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Storage failed' });

    jest.dontMock('../src/todos');
    jest.resetModules();
  });

  it('should start the server when startServer is invoked', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const server = app.startServer(4012);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await request(server).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    logSpy.mockRestore();
  });

  it('should delete an existing todo', async () => {
    const creation = await request(app)
      .post('/todos')
      .send({ title: 'Préparer la review' });
    const response = await request(app).delete(`/todos/${creation.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Todo supprimé.' });

    const remaining = await request(app).get('/todos');
    expect(remaining.body).toEqual([]);
  });

  it('should return 404 when deleting an unknown todo', async () => {
    const response = await request(app).delete('/todos/unknown-id');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});
