const pautaModel = require('../models/pauta.model');
const conselhoModel = require('../models/conselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isDuplicateEntry } = require('../utils/dbErrors');

async function ensureConselhoExists(conselhoId) {
  const conselho = await conselhoModel.findById(conselhoId);
  if (!conselho) {
    throw new ApiError(404, 'Conselho não encontrado');
  }
}

const getAll = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const pautas = await pautaModel.findAllByConselho(req.params.conselhoId);
  res.json({ success: true, data: pautas });
});

const getById = asyncHandler(async (req, res) => {
  const pauta = await pautaModel.findOne(req.params.conselhoId, req.params.turmaId);

  if (!pauta) {
    throw new ApiError(404, 'Pauta não encontrada');
  }

  res.json({ success: true, data: pauta });
});

const create = asyncHandler(async (req, res) => {
  const { turmaId, sinteseTurma, demandasTurma, observacoesTurma } = req.body;

  await ensureConselhoExists(req.params.conselhoId);

  try {
    const pauta = await pautaModel.create(req.params.conselhoId, {
      turmaId,
      sinteseTurma,
      demandasTurma,
      observacoesTurma
    });
    res.status(201).json({ success: true, data: pauta });
  } catch (error) {
    if (isDuplicateEntry(error)) {
      throw new ApiError(409, 'Já existe uma pauta para essa turma neste conselho');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'turmaId inválido: turma não encontrada');
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { sinteseTurma, demandasTurma, observacoesTurma } = req.body;

  const existing = await pautaModel.findOne(req.params.conselhoId, req.params.turmaId);
  if (!existing) {
    throw new ApiError(404, 'Pauta não encontrada');
  }

  const pauta = await pautaModel.update(req.params.conselhoId, req.params.turmaId, {
    sinteseTurma,
    demandasTurma,
    observacoesTurma
  });
  res.json({ success: true, data: pauta });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await pautaModel.remove(req.params.conselhoId, req.params.turmaId);

  if (!removed) {
    throw new ApiError(404, 'Pauta não encontrada');
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
