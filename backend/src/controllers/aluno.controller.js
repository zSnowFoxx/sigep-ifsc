const alunoModel = require('../models/aluno.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isRowReferenced, isForeignKeyViolation } = require('../utils/dbErrors');

// turmaIds com uma turma inexistente viola a chave estrangeira de matriculas.
async function saveOrInvalidTurma(work) {
  try {
    return await work();
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'turmaIds inválido: turma não encontrada');
    }
    throw error;
  }
}

const getAll = asyncHandler(async (req, res) => {
  const alunos = await alunoModel.findAll();
  res.json({ success: true, data: alunos });
});

const getById = asyncHandler(async (req, res) => {
  const aluno = await alunoModel.findById(req.params.id);

  if (!aluno) {
    throw new ApiError(404, 'Aluno não encontrado');
  }

  res.json({ success: true, data: aluno });
});

const create = asyncHandler(async (req, res) => {
  const { matricula, nome, email, status, turmaIds } = req.body;

  const existing = await alunoModel.findByMatricula(matricula);
  if (existing) {
    throw new ApiError(409, 'Já existe um aluno com essa matrícula');
  }

  const aluno = await saveOrInvalidTurma(() =>
    alunoModel.create({ matricula, nome, email, status, turmaIds })
  );
  res.status(201).json({ success: true, data: aluno });
});

const update = asyncHandler(async (req, res) => {
  const { matricula, nome, email, status, turmaIds } = req.body;

  const existing = await alunoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Aluno não encontrado');
  }

  if (matricula) {
    const matriculaInUse = await alunoModel.findByMatricula(matricula);
    if (matriculaInUse && String(matriculaInUse.id) !== req.params.id) {
      throw new ApiError(409, 'Já existe um aluno com essa matrícula');
    }
  }

  const aluno = await saveOrInvalidTurma(() =>
    alunoModel.update(req.params.id, { matricula, nome, email, status, turmaIds })
  );
  res.json({ success: true, data: aluno });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await alunoModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Aluno não encontrado');
  }

  try {
    await alunoModel.remove(req.params.id);
  } catch (error) {
    if (isRowReferenced(error)) {
      throw new ApiError(
        409,
        'Não é possível excluir: aluno possui registros docentes, deliberações, atendimentos ou encaminhamentos'
      );
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
