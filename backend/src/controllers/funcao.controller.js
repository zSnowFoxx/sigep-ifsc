const funcaoModel = require('../models/funcao.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getAll = asyncHandler(async (req, res) => {
  const funcoes = await funcaoModel.findAll();
  res.json({ success: true, data: funcoes });
});

const getById = asyncHandler(async (req, res) => {
  const funcao = await funcaoModel.findById(req.params.id);

  if (!funcao) {
    throw new ApiError(404, 'Função não encontrada');
  }

  res.json({ success: true, data: funcao });
});

const create = asyncHandler(async (req, res) => {
  const { nome } = req.body;

  const existing = await funcaoModel.findByNome(nome);
  if (existing) {
    throw new ApiError(409, 'Já existe uma função com esse nome');
  }

  try {
    const funcao = await funcaoModel.create({ nome });
    res.status(201).json({ success: true, data: funcao });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ApiError(409, 'Já existe uma função com esse nome');
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { nome } = req.body;

  const existing = await funcaoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Função não encontrada');
  }

  if (nome) {
    const nomeInUse = await funcaoModel.findByNome(nome);
    if (nomeInUse && String(nomeInUse.id) !== req.params.id) {
      throw new ApiError(409, 'Já existe uma função com esse nome');
    }
  }

  try {
    const funcao = await funcaoModel.update(req.params.id, { nome });
    res.json({ success: true, data: funcao });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ApiError(409, 'Já existe uma função com esse nome');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await funcaoModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Função não encontrada');
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
