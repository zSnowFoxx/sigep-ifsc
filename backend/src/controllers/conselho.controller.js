const conselhoModel = require('../models/conselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

function pickFields(body) {
  const { nome, tipo, status, conselhoOrigemId, dataRealizacao, turmaIds, servidores } = body;
  return { nome, tipo, status, conselhoOrigemId, dataRealizacao, turmaIds, servidores };
}

async function saveOrBadRequest(work) {
  try {
    return await work();
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'turmaIds, servidores ou conselhoOrigemId contém registro inexistente');
    }
    throw error;
  }
}

const getAll = asyncHandler(async (req, res) => {
  const conselhos = await conselhoModel.findAll();
  res.json({ success: true, data: conselhos });
});

const getById = asyncHandler(async (req, res) => {
  const conselho = await conselhoModel.findById(req.params.id);

  if (!conselho) {
    throw new ApiError(404, 'Conselho não encontrado');
  }

  res.json({ success: true, data: conselho });
});

const create = asyncHandler(async (req, res) => {
  const conselho = await saveOrBadRequest(() => conselhoModel.create(pickFields(req.body)));
  res.status(201).json({ success: true, data: conselho });
});

const update = asyncHandler(async (req, res) => {
  const existing = await conselhoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Conselho não encontrado');
  }

  if (req.body.conselhoOrigemId === existing.id) {
    throw new ApiError(400, 'Um conselho não pode ser a própria origem');
  }

  const conselho = await saveOrBadRequest(() => conselhoModel.update(req.params.id, pickFields(req.body)));
  res.json({ success: true, data: conselho });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await conselhoModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Conselho não encontrado');
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
