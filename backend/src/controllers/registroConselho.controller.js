const registroConselhoModel = require('../models/registroConselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const FK_MESSAGE = 'conselhoId, alunoId ou usuarioId inválido';

function pickFields(body) {
  const {
    conselhoId,
    alunoId,
    usuarioId,
    observacao,
    riscoEvasao,
    informacoesAdicionais,
    retorno
  } = body;
  return { conselhoId, alunoId, usuarioId, observacao, riscoEvasao, informacoesAdicionais, retorno };
}

const getAll = asyncHandler(async (req, res) => {
  const registros = await registroConselhoModel.findAll();
  res.json({ success: true, data: registros });
});

const getById = asyncHandler(async (req, res) => {
  const registro = await registroConselhoModel.findById(req.params.id);

  if (!registro) {
    throw new ApiError(404, 'Registro de conselho não encontrado');
  }

  res.json({ success: true, data: registro });
});

const create = asyncHandler(async (req, res) => {
  try {
    const registro = await registroConselhoModel.create(pickFields(req.body));
    res.status(201).json({ success: true, data: registro });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const existing = await registroConselhoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Registro de conselho não encontrado');
  }

  try {
    const registro = await registroConselhoModel.update(req.params.id, pickFields(req.body));
    res.json({ success: true, data: registro });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await registroConselhoModel.remove(req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Registro de conselho não encontrado');
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
