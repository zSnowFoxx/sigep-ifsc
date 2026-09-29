const cursoModel = require('../models/curso.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getAll = asyncHandler(async (req, res) => {
  const cursos = await cursoModel.findAll();
  res.json({ success: true, data: cursos });
});

const getById = asyncHandler(async (req, res) => {
  const curso = await cursoModel.findById(req.params.id);

  if (!curso) {
    throw new ApiError(404, 'Curso não encontrado');
  }

  res.json({ success: true, data: curso });
});

const create = asyncHandler(async (req, res) => {
  const { codigo, nome, tipo, grau, modalidade, ppc, fases, coordenadorId } = req.body;

  const existing = await cursoModel.findByCodigo(codigo);
  if (existing) {
    throw new ApiError(409, 'Já existe um curso com esse código');
  }

  try {
    const curso = await cursoModel.create({ codigo, nome, tipo, grau, modalidade, ppc, fases, coordenadorId });
    res.status(201).json({ success: true, data: curso });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      throw new ApiError(400, 'coordenadorId inválido: usuário não encontrado');
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { codigo, nome, tipo, grau, modalidade, ppc, fases, coordenadorId } = req.body;

  const existing = await cursoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Curso não encontrado');
  }

  if (codigo) {
    const codigoInUse = await cursoModel.findByCodigo(codigo);
    if (codigoInUse && String(codigoInUse.id) !== req.params.id) {
      throw new ApiError(409, 'Já existe um curso com esse código');
    }
  }

  try {
    const curso = await cursoModel.update(req.params.id, {
      codigo,
      nome,
      tipo,
      grau,
      modalidade,
      ppc,
      fases,
      coordenadorId
    });
    res.json({ success: true, data: curso });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      throw new ApiError(400, 'coordenadorId inválido: usuário não encontrado');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const existing = await cursoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Curso não encontrado');
  }

  try {
    await cursoModel.remove(req.params.id);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new ApiError(409, 'Não é possível excluir: curso está em uso por turmas ou disciplinas');
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
