'use strict';

const express = require('express');

function createServer() {
  const app = express();

  app.use(express.json());

  const users = [];
  const expenses = [];
  let userIdCounter = 1;
  let expenseIdCounter = 1;

  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  app.get('/users', (req, res) => {
    res.json(users);
  });

  app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  });

  app.post('/users', (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Missing parameter' });
    }

    const user = { id: userIdCounter++, name };

    users.push(user);
    res.status(201).json(user);
  });

  app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Missing parameter' });
    }
    users[index] = { ...users[index], name };
    res.json(users[index]);
  });

  app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  });

  app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    users.splice(index, 1);
    res.status(204).send();
  });

  app.get('/expenses', (req, res) => {
    let results = [...expenses];
    const { userId, categories, from, to } = req.query;

    if (userId) {
      results = results.filter((e) => e.userId === parseInt(userId));
    }

    if (categories) {
      const categoryList = categories.split(',');

      results = results.filter((e) => categoryList.includes(e.category));
    }

    if (from) {
      results = results.filter((e) => new Date(e.spentAt) >= new Date(from));
    }

    if (to) {
      results = results.filter((e) => new Date(e.spentAt) <= new Date(to));
    }
    res.json(results);
  });

  app.get('/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const expense = expenses.find((e) => e.id === id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  });

  app.post('/expenses', (req, res) => {
    const { userId, spentAt, title, amount, category, note } = req.body;

    if (
      userId === undefined ||
      !spentAt ||
      !title ||
      amount === undefined ||
      !category
    ) {
      return res.status(400).json({ message: 'Missing parameter' });
    }

    const userExists = users.find((u) => u.id === userId);

    if (!userExists) {
      return res.status(400).json({ message: 'User not found' });
    }

    const expense = {
      id: expenseIdCounter++,
      userId,
      spentAt,
      title,
      amount,
      category,
      note: note || '',
    };

    expenses.push(expense);
    res.status(201).json(expense);
  });

  app.put('/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { userId, spentAt, title, amount, category, note } = req.body;

    if (
      userId === undefined ||
      !spentAt ||
      !title ||
      amount === undefined ||
      !category
    ) {
      return res.status(400).json({ message: 'Missing parameter' });
    }

    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const userExists = users.find((u) => u.id === userId);

    if (!userExists) {
      return res.status(400).json({ message: 'User not found' });
    }

    expenses[index] = {
      ...expenses[index],
      userId,
      spentAt,
      title,
      amount,
      category,
      note: note || '',
    };
    res.json(expenses[index]);
  });

  app.patch('/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (req.body.userId) {
      const userExists = users.find((u) => u.id === req.body.userId);

      if (!userExists) {
        return res.status(400).json({ message: 'User not found' });
      }
    }
    expenses[index] = { ...expenses[index], ...req.body };
    res.json(expenses[index]);
  });

  app.delete('/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    expenses.splice(index, 1);
    res.status(204).send();
  });

  return app;
}

module.exports = { createServer };
