const acompanhamentoModel = require('../models/acompanhamento.model');
const encaminhamentoModel = require('../models/encaminhamento.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

function pickFields(body) {
  return Object.fromEntries(acompanhamentoModel.FIELDS.map((field) => [field, body[field]]));
}

async function ensureEncaminhamentoExists(encaminhamentoId) {
  if (!(await encaminhamentoModel.findById(encaminhamentoId))) {
    throw new ApiError(404, 'Encaminhamento não encontrado');
  }
}

async function saveOrBadRequest(work) {
  try {
    return await work();
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'autorId inválido: usuário não encontrado');
    }
    throw error;
  }
}

const getAllFromAllEncaminhamentos = asyncHandler(async (req, res) => {
  const acompanhamentos = await acompanhamentoModel.findAll();
  res.json({ success: true, data: acompanhamentos });
});

const getAll = asyncHandler(async (req, res) => {
  await ensureEncaminhamentoExists(req.params.encaminhamentoId);

  const acompanhamentos = await acompanhamentoModel.findAllByEncaminhamento(req.params.encaminhamentoId);
  res.json({ success: true, data: acompanhamentos });
});

const getById = asyncHandler(async (req, res) => {
  const acompanhamento = await acompanhamentoModel.findOne(req.params.encaminhamentoId, req.params.id);

  if (!acompanhamento) {
    throw new ApiError(404, 'Acompanhamento não encontrado');
  }

  res.json({ success: true, data: acompanhamento });
});

const create = asyncHandler(async (req, res) => {
  await ensureEncaminhamentoExists(req.params.encaminhamentoId);

  const acompanhamento = await saveOrBadRequest(() =>
    acompanhamentoModel.create(req.params.encaminhamentoId, pickFields(req.body))
  );
  res.status(201).json({ success: true, data: acompanhamento });
});

const update = asyncHandler(async (req, res) => {
  const existing = await acompanhamentoModel.findOne(req.params.encaminhamentoId, req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Acompanhamento não encontrado');
  }

  const acompanhamento = await saveOrBadRequest(() =>
    acompanhamentoModel.update(req.params.encaminhamentoId, req.params.id, pickFields(req.body))
  );
  res.json({ success: true, data: acompanhamento });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await acompanhamentoModel.remove(req.params.encaminhamentoId, req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Acompanhamento não encontrado');
  }

  res.status(204).send();
});

module.exports = {
  getAllFromAllEncaminhamentos,
  getAll,
  getById,
  create,
  update,
  remove
};
