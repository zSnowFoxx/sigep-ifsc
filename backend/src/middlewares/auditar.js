const { registrarLog } = require('../utils/auditoria');

const ACOES = { POST: 'INSERT', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' };

const isSucesso = (status) => status >= 200 && status < 300;

// Registra no log de auditoria as escritas bem-sucedidas da rota em `tabela`.
// buscarAnterior(req) devolve o registro antes da alteração (em PUT e DELETE); o novo estado
// vem do `data` da resposta. Um PUT sem registro anterior (ex.: retificação) conta como INSERT.
//
// O log é gravado antes de a resposta sair: na Vercel a função é congelada logo após o envio,
// e um log gravado depois dele poderia se perder.
function auditar(tabela, buscarAnterior) {
  return async (req, res, next) => {
    let acao = ACOES[req.method];
    if (!acao) {
      return next();
    }

    let anteriores = null;
    if (buscarAnterior && acao !== 'INSERT') {
      try {
        anteriores = (await buscarAnterior(req)) ?? null;
      } catch (error) {
        return next(error);
      }
      if (!anteriores && acao === 'UPDATE') {
        acao = 'INSERT';
      }
    }

    const { json, send } = res;
    let corpo;

    res.json = function (body) {
      corpo = body;
      return json.call(this, body);
    };

    // res.json serializa o corpo e chama res.send, que também cobre o 204 sem corpo.
    res.send = function (body) {
      res.send = send;
      if (!isSucesso(res.statusCode)) {
        return send.call(this, body);
      }

      const dados = corpo?.data ?? null;
      registrarLog(req, {
        acao,
        tabela,
        registroId: dados?.id ?? anteriores?.id ?? (Object.values(req.params).join('/') || null),
        anteriores,
        novos: acao === 'DELETE' ? null : dados
      }).finally(() => send.call(this, body));
      return this;
    };

    next();
  };
}

module.exports = auditar;
