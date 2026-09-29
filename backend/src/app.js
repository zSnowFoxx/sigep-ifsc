const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express 5 leaves req.body undefined when no body is sent.
app.use((req, res, next) => {
  req.body ??= {};
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SIGEP Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health'
    }
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
