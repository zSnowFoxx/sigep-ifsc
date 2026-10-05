const encaminhamentoModel = require('../models/encaminhamento.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isNullViolation } = require('../utils/dbErrors');

function pickFields(body) {
  return Object.fromEntries(encaminhamentoModel.FIELDS.map((field) => [field, body[field]]));
}

async function saveOrBadRequest(work) {
  try {
    return await work();
  } catch (error) {
    if (isNullViolation(error)) {
      throw new ApiError(400, 'O aluno não está matriculado em nenhuma turma; informe turmaId');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'alunoId, turmaId, conselhoId ou servidorResponsavelId inválido');
    }
    throw error;
  }
}

const getAll = asyncHandler(async (req, res) => {
  const encaminhamentos = await encaminhamentoModel.findAll();
  res.json({ success: true, data: encaminhamentos });
});

const getById = asyncHandler(async (req, res) => {
  const encaminhamento = await encaminhamentoModel.findById(req.params.id);

  if (!encaminhamento) {
    throw new ApiError(404, 'Encaminhamento não encontrado');
  }

  res.json({ success: true, data: encaminhamento });
});

const create = asyncHandler(async (req, res) => {
  const encaminhamento = await saveOrBadRequest(() => encaminhamentoModel.create(pickFields(req.body)));
  res.status(201).json({ success: true, data: encaminhamento });
});

const update = asyncHandler(async (req, res) => {
  const existing = await encaminhamentoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Encaminhamento não encontrado');
  }

  const encaminhamento = await saveOrBadRequest(() =>
    encaminhamentoModel.update(req.params.id, pickFields(req.body))
  );
  res.json({ success: true, data: encaminhamento });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await encaminhamentoModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Encaminhamento não encontrado');
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
