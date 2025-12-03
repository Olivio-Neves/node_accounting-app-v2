'use strict';

const express = require('express');
const { resetDatabase } = require('./data/database');

function createServer() {
  resetDatabase();

  const app = express();

  app.use(express.json());

  const usersRoutes = require('./users/usersRoutes');
  const expensesRoutes = require('./expenses/expensesRoutes');

  app.use('/users', usersRoutes);
  app.use('/expenses', expensesRoutes);

  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  return app;
}

module.exports = { createServer };
