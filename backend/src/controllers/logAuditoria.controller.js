const logAuditoriaModel = require('../models/logAuditoria.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const FK_MESSAGE = 'usuarioId inválido';

const getAll = asyncHandler(async (req, res) => {
  const logs = await logAuditoriaModel.findAll();
  res.json({ success: true, data: logs });
});

const getById = asyncHandler(async (req, res) => {
  const log = await logAuditoriaModel.findById(req.params.id);

  if (!log) {
    throw new ApiError(404, 'Log de auditoria não encontrado');
  }

  res.json({ success: true, data: log });
});

const create = asyncHandler(async (req, res) => {
  const {
    usuarioId,
    acao,
    tabelaAfetada,
    registroId,
    dadosAnteriores,
    dadosNovos,
    dataHora,
    enderecoIp,
    userAgent
  } = req.body;

  try {
    const log = await logAuditoriaModel.create({
      usuarioId,
      acao,
      tabelaAfetada,
      registroId,
      dadosAnteriores,
      dadosNovos,
      dataHora,
      // Fall back to the request's own origin when the client does not send them.
      enderecoIp: enderecoIp ?? req.ip?.slice(0, 45),
      userAgent: userAgent ?? req.get('user-agent')?.slice(0, 500)
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const {
    usuarioId,
    acao,
    tabelaAfetada,
    registroId,
    dadosAnteriores,
    dadosNovos,
    dataHora,
    enderecoIp,
    userAgent
  } = req.body;

  const existing = await logAuditoriaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Log de auditoria não encontrado');
  }

  try {
    const log = await logAuditoriaModel.update(req.params.id, {
      usuarioId,
      acao,
      tabelaAfetada,
      registroId,
      dadosAnteriores,
      dadosNovos,
      dataHora,
      enderecoIp,
      userAgent
    });
    res.json({ success: true, data: log });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await logAuditoriaModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Log de auditoria não encontrado');
  }

  res.status(204).send();
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
