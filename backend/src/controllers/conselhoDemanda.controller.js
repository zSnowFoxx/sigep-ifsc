const demandaModel = require('../models/conselhoDemanda.model');
const conselhoModel = require('../models/conselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isDuplicateEntry } = require('../utils/dbErrors');

async function ensureConselhoExists(conselhoId) {
  if (!(await conselhoModel.findById(conselhoId))) {
    throw new ApiError(404, 'Conselho não encontrado');
  }
}

async function saveOrBadRequest(work) {
  try {
    return await work();
  } catch (error) {
    if (isDuplicateEntry(error)) {
      throw new ApiError(409, 'Já existem demandas para essa turma neste conselho');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'turmaId não faz parte do conselho ou alunoRepresentanteId inválido');
    }
    throw error;
  }
}

const getAll = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const demandas = await demandaModel.findAllByConselho(req.params.conselhoId);
  res.json({ success: true, data: demandas });
});

const getById = asyncHandler(async (req, res) => {
  const demanda = await demandaModel.findOne(req.params.conselhoId, req.params.turmaId);

  if (!demanda) {
    throw new ApiError(404, 'Demandas da turma não encontradas');
  }

  res.json({ success: true, data: demanda });
});

const create = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const demanda = await saveOrBadRequest(() => demandaModel.create(req.params.conselhoId, req.body));
  res.status(201).json({ success: true, data: demanda });
});

const update = asyncHandler(async (req, res) => {
  const existing = await demandaModel.findOne(req.params.conselhoId, req.params.turmaId);
  if (!existing) {
    throw new ApiError(404, 'Demandas da turma não encontradas');
  }

  const demanda = await saveOrBadRequest(() =>
    demandaModel.update(req.params.conselhoId, req.params.turmaId, req.body)
  );
  res.json({ success: true, data: demanda });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await demandaModel.remove(req.params.conselhoId, req.params.turmaId);

  if (!removed) {
    throw new ApiError(404, 'Demandas da turma não encontradas');
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
