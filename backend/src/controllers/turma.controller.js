const turmaModel = require('../models/turma.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getAll = asyncHandler(async (req, res) => {
  const turmas = await turmaModel.findAll();
  res.json({ success: true, data: turmas });
});

const getById = asyncHandler(async (req, res) => {
  const turma = await turmaModel.findById(req.params.id);

  if (!turma) {
    throw new ApiError(404, 'Turma não encontrada');
  }

  res.json({ success: true, data: turma });
});

const create = asyncHandler(async (req, res) => {
  const { nome, cursoId, periodoId, alunosQtd } = req.body;

  try {
    const turma = await turmaModel.create({ nome, cursoId, periodoId, alunosQtd });
    res.status(201).json({ success: true, data: turma });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      throw new ApiError(400, 'cursoId ou periodoId inválido');
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { nome, cursoId, periodoId, alunosQtd } = req.body;

  const existing = await turmaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Turma não encontrada');
  }

  try {
    const turma = await turmaModel.update(req.params.id, { nome, cursoId, periodoId, alunosQtd });
    res.json({ success: true, data: turma });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      throw new ApiError(400, 'cursoId ou periodoId inválido');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const existing = await turmaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Turma não encontrada');
  }

  try {
    await turmaModel.remove(req.params.id);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new ApiError(409, 'Não é possível excluir: turma possui matrículas, diários ou pautas de conselho');
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
