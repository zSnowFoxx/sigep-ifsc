const encaminhamentoModel = require('../models/encaminhamento.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const FK_MESSAGE = 'conselhoId, atendimentoId, alunoId ou usuarioResponsavelId inválido';

function pickFields(body) {
  const {
    conselhoId,
    atendimentoId,
    alunoId,
    categoria,
    observacoes,
    descricaoAcao,
    usuarioResponsavelId,
    status
  } = body;
  return {
    conselhoId,
    atendimentoId,
    alunoId,
    categoria,
    observacoes,
    descricaoAcao,
    usuarioResponsavelId,
    status
  };
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
  try {
    const encaminhamento = await encaminhamentoModel.create(pickFields(req.body));
    res.status(201).json({ success: true, data: encaminhamento });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const existing = await encaminhamentoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Encaminhamento não encontrado');
  }

  try {
    const encaminhamento = await encaminhamentoModel.update(req.params.id, pickFields(req.body));
    res.json({ success: true, data: encaminhamento });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
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
