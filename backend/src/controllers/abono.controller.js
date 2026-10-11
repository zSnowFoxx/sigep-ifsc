const abonoModel = require('../models/abono.model');
const conselhoModel = require('../models/conselho.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation } = require('../utils/dbErrors');

async function ensureConselhoExists(conselhoId) {
  if (!(await conselhoModel.findById(conselhoId))) {
    throw new ApiError(404, 'Conselho não encontrado');
  }
}

const getAll = asyncHandler(async (req, res) => {
  await ensureConselhoExists(req.params.conselhoId);

  const abonos = await abonoModel.findAllByConselho(req.params.conselhoId);
  res.json({ success: true, data: abonos });
});

const create = asyncHandler(async (req, res) => {
  const { conselhoId } = req.params;
  await ensureConselhoExists(conselhoId);

  const disponiveis = await abonoModel.horasDisponiveis(conselhoId, req.body.notaFrequenciaId);
  if (disponiveis === null) {
    throw new ApiError(400, 'A nota informada não é de um aluno das turmas deste conselho');
  }
  if (req.body.horas > disponiveis) {
    throw new ApiError(400, `Só há ${disponiveis}h de faltas não justificadas para abonar nesta disciplina`);
  }

  try {
    const abono = await abonoModel.create(conselhoId, req.body);
    res.status(201).json({ success: true, data: abono });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'usuarioId inválido');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await abonoModel.remove(req.params.conselhoId, req.params.id);

  if (!removed) {
    throw new ApiError(404, 'Abono não encontrado neste conselho');
  }

  res.status(204).send();
});

module.exports = {
  getAll,
  create,
  remove
};
