const conselhoModel = require('../models/conselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const FK_MESSAGE = 'participanteIds contém usuário inexistente';

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
  const { nome, etapa, dataRealizacao, local, status, participanteIds } = req.body;

  try {
    const conselho = await conselhoModel.create({
      nome,
      etapa,
      dataRealizacao,
      local,
      status,
      participanteIds
    });
    res.status(201).json({ success: true, data: conselho });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { nome, etapa, dataRealizacao, local, status, participanteIds } = req.body;

  const existing = await conselhoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Conselho não encontrado');
  }

  try {
    const conselho = await conselhoModel.update(req.params.id, {
      nome,
      etapa,
      dataRealizacao,
      local,
      status,
      participanteIds
    });
    res.json({ success: true, data: conselho });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
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
