const retificacaoModel = require('../models/retificacao.model');
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

  const retificacoes = await retificacaoModel.findAllByConselho(req.params.conselhoId);
  res.json({ success: true, data: retificacoes });
});

// PUT /conselhos/:conselhoId/retificacoes/:notaId cria ou substitui a média retificada da nota.
const save = asyncHandler(async (req, res) => {
  const { conselhoId, notaId } = req.params;
  await ensureConselhoExists(conselhoId);

  if (!(await retificacaoModel.notaDoConselho(conselhoId, notaId))) {
    throw new ApiError(400, 'A nota informada não é de um aluno das turmas deste conselho');
  }

  try {
    const retificacao = await retificacaoModel.salvar(conselhoId, notaId, req.body);
    res.json({ success: true, data: retificacao });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'usuarioId inválido');
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const removed = await retificacaoModel.remove(req.params.conselhoId, req.params.notaId);

  if (!removed) {
    throw new ApiError(404, 'Retificação não encontrada neste conselho');
  }

  res.status(204).send();
});

module.exports = {
  getAll,
  save,
  remove
};
