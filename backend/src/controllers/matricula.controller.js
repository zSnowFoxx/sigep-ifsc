const matriculaModel = require('../models/matricula.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isDuplicateEntry } = require('../utils/dbErrors');

const FK_MESSAGE = 'alunoId ou turmaId inválido';

const getAll = asyncHandler(async (req, res) => {
  const matriculas = await matriculaModel.findAll();
  res.json({ success: true, data: matriculas });
});

const getById = asyncHandler(async (req, res) => {
  const matricula = await matriculaModel.findById(req.params.id);

  if (!matricula) {
    throw new ApiError(404, 'Matrícula não encontrada');
  }

  res.json({ success: true, data: matricula });
});

const create = asyncHandler(async (req, res) => {
  const { alunoId, turmaId } = req.body;

  try {
    const matricula = await matriculaModel.create({ alunoId, turmaId });
    res.status(201).json({ success: true, data: matricula });
  } catch (error) {
    if (isDuplicateEntry(error)) {
      throw new ApiError(409, 'O aluno já está matriculado nessa turma');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { alunoId, turmaId } = req.body;

  const existing = await matriculaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Matrícula não encontrada');
  }

  try {
    const matricula = await matriculaModel.update(req.params.id, { alunoId, turmaId });
    res.json({ success: true, data: matricula });
  } catch (error) {
    if (isDuplicateEntry(error)) {
      throw new ApiError(409, 'O aluno já está matriculado nessa turma');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await matriculaModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Matrícula não encontrada');
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
