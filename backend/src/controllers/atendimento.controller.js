const atendimentoModel = require('../models/atendimento.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isRowReferenced } = require('../utils/dbErrors');

const FK_MESSAGE = 'usuarioId ou alunoId inválido';

function pickFields(body) {
  const {
    usuarioId,
    alunoId,
    dataAtendimento,
    motivoAtendimento,
    motivoContato,
    relatoAtendimento
  } = body;
  return { usuarioId, alunoId, dataAtendimento, motivoAtendimento, motivoContato, relatoAtendimento };
}

const getAll = asyncHandler(async (req, res) => {
  const atendimentos = await atendimentoModel.findAll();
  res.json({ success: true, data: atendimentos });
});

const getById = asyncHandler(async (req, res) => {
  const atendimento = await atendimentoModel.findById(req.params.id);

  if (!atendimento) {
    throw new ApiError(404, 'Atendimento não encontrado');
  }

  res.json({ success: true, data: atendimento });
});

const create = asyncHandler(async (req, res) => {
  try {
    const atendimento = await atendimentoModel.create(pickFields(req.body));
    res.status(201).json({ success: true, data: atendimento });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const existing = await atendimentoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Atendimento não encontrado');
  }

  try {
    const atendimento = await atendimentoModel.update(req.params.id, pickFields(req.body));
    res.json({ success: true, data: atendimento });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const existing = await atendimentoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Atendimento não encontrado');
  }

  try {
    await atendimentoModel.remove(req.params.id);
  } catch (error) {
    if (isRowReferenced(error)) {
      throw new ApiError(409, 'Não é possível excluir: atendimento possui encaminhamentos');
    }
    throw error;
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
