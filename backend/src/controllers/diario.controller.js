const diarioModel = require('../models/diario.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const FK_MESSAGE = 'disciplinaId, turmaId ou professorId inválido';

const getAll = asyncHandler(async (req, res) => {
  const diarios = await diarioModel.findAll();
  res.json({ success: true, data: diarios });
});

const getById = asyncHandler(async (req, res) => {
  const diario = await diarioModel.findById(req.params.id);

  if (!diario) {
    throw new ApiError(404, 'Diário não encontrado');
  }

  res.json({ success: true, data: diario });
});

const create = asyncHandler(async (req, res) => {
  const { codigo, disciplinaId, turmaId, professorId, cargaHoraria, aulasPrevistas } = req.body;

  const existing = await diarioModel.findByCodigo(codigo);
  if (existing) {
    throw new ApiError(409, 'Já existe um diário com esse código');
  }

  try {
    const diario = await diarioModel.create({
      codigo,
      disciplinaId,
      turmaId,
      professorId,
      cargaHoraria,
      aulasPrevistas
    });
    res.status(201).json({ success: true, data: diario });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { codigo, disciplinaId, turmaId, professorId, cargaHoraria, aulasPrevistas } = req.body;

  const existing = await diarioModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Diário não encontrado');
  }

  if (codigo) {
    const codigoInUse = await diarioModel.findByCodigo(codigo);
    if (codigoInUse && String(codigoInUse.id) !== req.params.id) {
      throw new ApiError(409, 'Já existe um diário com esse código');
    }
  }

  try {
    const diario = await diarioModel.update(req.params.id, {
      codigo,
      disciplinaId,
      turmaId,
      professorId,
      cargaHoraria,
      aulasPrevistas
    });
    res.json({ success: true, data: diario });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await diarioModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Diário não encontrado');
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
