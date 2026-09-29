const perfilModel = require('../models/perfil.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getAll = asyncHandler(async (req, res) => {
  const perfis = await perfilModel.findAll();
  res.json({ success: true, data: perfis });
});

const getById = asyncHandler(async (req, res) => {
  const perfil = await perfilModel.findById(req.params.id);

  if (!perfil) {
    throw new ApiError(404, 'Perfil não encontrado');
  }

  res.json({ success: true, data: perfil });
});

const create = asyncHandler(async (req, res) => {
  const { nome } = req.body;

  const existing = await perfilModel.findByNome(nome);
  if (existing) {
    throw new ApiError(409, 'Já existe um perfil com esse nome');
  }

  try {
    const perfil = await perfilModel.create({ nome });
    res.status(201).json({ success: true, data: perfil });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ApiError(409, 'Já existe um perfil com esse nome');
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { nome } = req.body;

  const existing = await perfilModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Perfil não encontrado');
  }

  if (nome) {
    const nomeInUse = await perfilModel.findByNome(nome);
    if (nomeInUse && String(nomeInUse.id) !== req.params.id) {
      throw new ApiError(409, 'Já existe um perfil com esse nome');
    }
  }

  try {
    const perfil = await perfilModel.update(req.params.id, { nome });
    res.json({ success: true, data: perfil });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ApiError(409, 'Já existe um perfil com esse nome');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const existing = await perfilModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Perfil não encontrado');
  }

  try {
    await perfilModel.remove(req.params.id);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new ApiError(409, 'Não é possível excluir: perfil está em uso por usuários');
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
