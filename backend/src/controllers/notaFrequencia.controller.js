const notaFrequenciaModel = require('../models/notaFrequencia.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const FK_MESSAGE = 'matriculaId ou diarioId inválido';

const getAll = asyncHandler(async (req, res) => {
  const notas = await notaFrequenciaModel.findAll();
  res.json({ success: true, data: notas });
});

const getById = asyncHandler(async (req, res) => {
  const nota = await notaFrequenciaModel.findById(req.params.id);

  if (!nota) {
    throw new ApiError(404, 'Registro de nota/frequência não encontrado');
  }

  res.json({ success: true, data: nota });
});

const create = asyncHandler(async (req, res) => {
  const { matriculaId, diarioId, media, infrequencia } = req.body;

  try {
    const nota = await notaFrequenciaModel.create({ matriculaId, diarioId, media, infrequencia });
    res.status(201).json({ success: true, data: nota });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { matriculaId, diarioId, media, infrequencia } = req.body;

  const existing = await notaFrequenciaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Registro de nota/frequência não encontrado');
  }

  try {
    const nota = await notaFrequenciaModel.update(req.params.id, {
      matriculaId,
      diarioId,
      media,
      infrequencia
    });
    res.json({ success: true, data: nota });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await notaFrequenciaModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Registro de nota/frequência não encontrado');
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
