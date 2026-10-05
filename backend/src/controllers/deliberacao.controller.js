const deliberacaoModel = require('../models/deliberacao.model');
const conselhoModel = require('../models/conselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isDuplicateEntry, isNullViolation } = require('../utils/dbErrors');

function pickFields(body) {
  return Object.fromEntries(deliberacaoModel.FIELDS.map((field) => [field, body[field]]));
}

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
      throw new ApiError(409, 'Já existe uma deliberação para esse aluno neste conselho');
    }
    if (isNullViolation(error)) {
      throw new ApiError(400, 'O aluno não está matriculado em nenhuma turma; informe turmaId');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'alunoId ou turmaId inválido');
    }
    throw error;
  }
}

const getAll = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const deliberacoes = await deliberacaoModel.findAllByConselho(req.params.conselhoId);
  res.json({ success: true, data: deliberacoes });
});

const getById = asyncHandler(async (req, res) => {
  const deliberacao = await deliberacaoModel.findOne(req.params.conselhoId, req.params.id);

  if (!deliberacao) {
    throw new ApiError(404, 'Deliberação não encontrada');
  }

  res.json({ success: true, data: deliberacao });
});

const create = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const deliberacao = await saveOrBadRequest(() =>
    deliberacaoModel.create(req.params.conselhoId, pickFields(req.body))
  );
  res.status(201).json({ success: true, data: deliberacao });
});

const update = asyncHandler(async (req, res) => {
  const existing = await deliberacaoModel.findOne(req.params.conselhoId, req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Deliberação não encontrada');
  }

  const deliberacao = await saveOrBadRequest(() =>
    deliberacaoModel.update(req.params.conselhoId, req.params.id, pickFields(req.body))
  );
  res.json({ success: true, data: deliberacao });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await deliberacaoModel.remove(req.params.conselhoId, req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Deliberação não encontrada');
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
