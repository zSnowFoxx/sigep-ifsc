const periodoModel = require('../models/periodo.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getAll = asyncHandler(async (req, res) => {
  const periodos = await periodoModel.findAll();
  res.json({ success: true, data: periodos });
});

const getById = asyncHandler(async (req, res) => {
  const periodo = await periodoModel.findById(req.params.id);

  if (!periodo) {
    throw new ApiError(404, 'Período não encontrado');
  }

  res.json({ success: true, data: periodo });
});

const create = asyncHandler(async (req, res) => {
  const { ano, semestre, ativo } = req.body;

  const periodo = await periodoModel.create({ ano, semestre, ativo });
  res.status(201).json({ success: true, data: periodo });
});

const update = asyncHandler(async (req, res) => {
  const { ano, semestre, ativo } = req.body;

  const existing = await periodoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Período não encontrado');
  }

  const periodo = await periodoModel.update(req.params.id, { ano, semestre, ativo });
  res.json({ success: true, data: periodo });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await periodoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Período não encontrado');
  }

  try {
    await periodoModel.remove(req.params.id);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new ApiError(409, 'Não é possível excluir: período está em uso por turmas');
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
