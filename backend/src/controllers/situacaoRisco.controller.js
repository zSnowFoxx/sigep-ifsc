const situacaoRiscoModel = require('../models/situacaoRisco.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const getAll = asyncHandler(async (req, res) => {
  const situacoes = await situacaoRiscoModel.findAll();
  res.json({ success: true, data: situacoes });
});

const getById = asyncHandler(async (req, res) => {
  const situacao = await situacaoRiscoModel.findById(req.params.id);

  if (!situacao) {
    throw new ApiError(404, 'Situação de risco não encontrada');
  }

  res.json({ success: true, data: situacao });
});

const create = asyncHandler(async (req, res) => {
  const { alunoId, risco, fatores } = req.body;

  try {
    const situacao = await situacaoRiscoModel.create({ alunoId, risco, fatores });
    res.status(201).json({ success: true, data: situacao });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'alunoId inválido: aluno não encontrado');
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { alunoId, risco, fatores } = req.body;

  const existing = await situacaoRiscoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Situação de risco não encontrada');
  }

  try {
    const situacao = await situacaoRiscoModel.update(req.params.id, { alunoId, risco, fatores });
    res.json({ success: true, data: situacao });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'alunoId inválido: aluno não encontrado');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await situacaoRiscoModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Situação de risco não encontrada');
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
