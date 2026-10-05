const atendimentoModel = require('../models/atendimento.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isNullViolation } = require('../utils/dbErrors');

function pickFields(body) {
  return Object.fromEntries(atendimentoModel.FIELDS.map((field) => [field, body[field]]));
}

async function saveOrBadRequest(work) {
  try {
    return await work();
  } catch (error) {
    if (isNullViolation(error)) {
      throw new ApiError(400, 'O aluno não está matriculado em nenhuma turma; informe turmaId');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'alunoId, turmaId ou servidorId inválido');
    }
    throw error;
  }
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
  const atendimento = await saveOrBadRequest(() => atendimentoModel.create(pickFields(req.body)));
  res.status(201).json({ success: true, data: atendimento });
});

const update = asyncHandler(async (req, res) => {
  const existing = await atendimentoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Atendimento não encontrado');
  }

  const atendimento = await saveOrBadRequest(() => atendimentoModel.update(req.params.id, pickFields(req.body)));
  res.json({ success: true, data: atendimento });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await atendimentoModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Atendimento não encontrado');
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
