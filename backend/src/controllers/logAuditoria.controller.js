const logAuditoriaModel = require('../models/logAuditoria.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');
const { origemDaRequisicao, semDadosSigilosos } = require('../utils/auditoria');

// Filtros e paginação validados em validateQuery (req.filtros).
const getAll = asyncHandler(async (req, res) => {
  const logs = await logAuditoriaModel.findAll(req.filtros);
  res.json({ success: true, data: logs });
});

const getOpcoes = asyncHandler(async (req, res) => {
  const opcoes = await logAuditoriaModel.findOpcoes();
  res.json({ success: true, data: opcoes });
});

const getById = asyncHandler(async (req, res) => {
  const log = await logAuditoriaModel.findById(req.params.id);

  if (!log) {
    throw new ApiError(404, 'Log de auditoria não encontrado');
  }

  res.json({ success: true, data: log });
});

const create = asyncHandler(async (req, res) => {
  const { acao, tabelaAfetada, registroId, dadosAnteriores, dadosNovos } = req.body;

  try {
    const log = await logAuditoriaModel.create({
      acao,
      tabelaAfetada,
      registroId,
      dadosAnteriores: semDadosSigilosos(dadosAnteriores),
      dadosNovos: semDadosSigilosos(dadosNovos),
      // Origem e momento do registro: sempre o usuário autenticado, a própria requisição e a
      // hora do servidor, nunca o corpo.
      usuarioId: req.user.id,
      ...origemDaRequisicao(req)
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(401, 'Usuário da sessão não encontrado');
    }
    throw error;
  }
});

module.exports = {
  getAll,
  getOpcoes,
  getById,
  create
};
