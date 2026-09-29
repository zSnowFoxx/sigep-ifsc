const historicoModel = require('../models/historicoEncaminhamento.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const FK_MESSAGE = 'encaminhamentoId ou usuarioId inválido';

const getAll = asyncHandler(async (req, res) => {
  const historicos = await historicoModel.findAll();
  res.json({ success: true, data: historicos });
});

const getById = asyncHandler(async (req, res) => {
  const historico = await historicoModel.findById(req.params.id);

  if (!historico) {
    throw new ApiError(404, 'Histórico de encaminhamento não encontrado');
  }

  res.json({ success: true, data: historico });
});

const create = asyncHandler(async (req, res) => {
  const { encaminhamentoId, usuarioId, dataRegistro, relato } = req.body;

  try {
    const historico = await historicoModel.create({ encaminhamentoId, usuarioId, dataRegistro, relato });
    res.status(201).json({ success: true, data: historico });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { encaminhamentoId, usuarioId, dataRegistro, relato } = req.body;

  const existing = await historicoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Histórico de encaminhamento não encontrado');
  }

  try {
    const historico = await historicoModel.update(req.params.id, {
      encaminhamentoId,
      usuarioId,
      dataRegistro,
      relato
    });
    res.json({ success: true, data: historico });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await historicoModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Histórico de encaminhamento não encontrado');
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
