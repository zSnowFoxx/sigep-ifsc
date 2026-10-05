const notaFrequenciaModel = require('../models/notaFrequencia.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isDuplicateEntry } = require('../utils/dbErrors');

function pickFields(body) {
  return Object.fromEntries(notaFrequenciaModel.FIELDS.map((field) => [field, body[field]]));
}

async function saveOrBadRequest(work) {
  try {
    return await work();
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'matriculaId ou diarioId inválido');
    }
    if (isDuplicateEntry(error)) {
      throw new ApiError(409, 'Já existe nota/frequência para essa matrícula neste diário');
    }
    throw error;
  }
}

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
  const nota = await saveOrBadRequest(() => notaFrequenciaModel.create(pickFields(req.body)));
  res.status(201).json({ success: true, data: nota });
});

const update = asyncHandler(async (req, res) => {
  const existing = await notaFrequenciaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Registro de nota/frequência não encontrado');
  }

  const nota = await saveOrBadRequest(() => notaFrequenciaModel.update(req.params.id, pickFields(req.body)));
  res.json({ success: true, data: nota });
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
