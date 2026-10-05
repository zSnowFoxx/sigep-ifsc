const registroModel = require('../models/registroDocente.model');
const conselhoModel = require('../models/conselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isNullViolation } = require('../utils/dbErrors');

function pickFields(body) {
  return Object.fromEntries(registroModel.FIELDS.map((field) => [field, body[field]]));
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
    if (isNullViolation(error)) {
      throw new ApiError(400, 'O aluno não está matriculado em nenhuma turma; informe turmaId');
    }
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'alunoId, docenteId, turmaId ou encaminhamentoId inválido');
    }
    throw error;
  }
}

const getAll = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const registros = await registroModel.findAllByConselho(req.params.conselhoId);
  res.json({ success: true, data: registros });
});

const getById = asyncHandler(async (req, res) => {
  const registro = await registroModel.findOne(req.params.conselhoId, req.params.id);

  if (!registro) {
    throw new ApiError(404, 'Registro docente não encontrado');
  }

  res.json({ success: true, data: registro });
});

const create = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const registro = await saveOrBadRequest(() => registroModel.create(req.params.conselhoId, pickFields(req.body)));
  res.status(201).json({ success: true, data: registro });
});

const update = asyncHandler(async (req, res) => {
  const existing = await registroModel.findOne(req.params.conselhoId, req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Registro docente não encontrado');
  }

  const registro = await saveOrBadRequest(() =>
    registroModel.update(req.params.conselhoId, req.params.id, pickFields(req.body))
  );
  res.json({ success: true, data: registro });
});

const remove = asyncHandler(async (req, res) => {
  const removed = await registroModel.remove(req.params.conselhoId, req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Registro docente não encontrado');
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
