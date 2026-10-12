const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Atrás de um proxy (como o da Vercel), o IP real do cliente chega em X-Forwarded-For e
// req.ip só o enxerga com "trust proxy". Sem proxy, confiar nesse cabeçalho deixaria o
// próprio cliente forjar o IP gravado nos logs de auditoria. TRUST_PROXY = nº de proxies.
const trustedProxies = Number(process.env.TRUST_PROXY ?? (process.env.VERCEL ? 1 : 0));
if (trustedProxies > 0) {
  app.set('trust proxy', trustedProxies);
}

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
