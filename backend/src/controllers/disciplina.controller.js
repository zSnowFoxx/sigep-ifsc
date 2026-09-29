const disciplinaModel = require('../models/disciplina.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getAll = asyncHandler(async (req, res) => {
  const disciplinas = await disciplinaModel.findAll();
  res.json({ success: true, data: disciplinas });
});

const getById = asyncHandler(async (req, res) => {
  const disciplina = await disciplinaModel.findById(req.params.id);

  if (!disciplina) {
    throw new ApiError(404, 'Disciplina não encontrada');
  }

  res.json({ success: true, data: disciplina });
});

const create = asyncHandler(async (req, res) => {
  const { sigla, codigo, nome, cargaHoraria, faseOferta, cursoId, usuarioIds } = req.body;

  const existing = await disciplinaModel.findByCodigo(codigo);
  if (existing) {
    throw new ApiError(409, 'Já existe uma disciplina com esse código');
  }

  try {
    const disciplina = await disciplinaModel.create({
      sigla,
      codigo,
      nome,
      cargaHoraria,
      faseOferta,
      cursoId,
      usuarioIds
    });
    res.status(201).json({ success: true, data: disciplina });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      throw new ApiError(400, 'cursoId inválido ou usuarioIds contém usuário inexistente');
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { sigla, codigo, nome, cargaHoraria, faseOferta, cursoId, usuarioIds } = req.body;

  const existing = await disciplinaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Disciplina não encontrada');
  }

  if (codigo) {
    const codigoInUse = await disciplinaModel.findByCodigo(codigo);
    if (codigoInUse && String(codigoInUse.id) !== req.params.id) {
      throw new ApiError(409, 'Já existe uma disciplina com esse código');
    }
  }

  try {
    const disciplina = await disciplinaModel.update(req.params.id, {
      sigla,
      codigo,
      nome,
      cargaHoraria,
      faseOferta,
      cursoId,
      usuarioIds
    });
    res.json({ success: true, data: disciplina });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      throw new ApiError(400, 'cursoId inválido ou usuarioIds contém usuário inexistente');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const existing = await disciplinaModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Disciplina não encontrada');
  }

  try {
    await disciplinaModel.remove(req.params.id);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new ApiError(409, 'Não é possível excluir: disciplina está em uso por diários');
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
