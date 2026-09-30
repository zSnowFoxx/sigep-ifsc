const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isForeignKeyViolation, isRowReferenced } = require('../utils/dbErrors');

const SALT_ROUNDS = 10;
const FK_MESSAGE = 'perfilId ou funcaoIds inválido';

const getAll = asyncHandler(async (req, res) => {
  const users = await userModel.findAll();
  res.json({ success: true, data: users });
});

const getById = asyncHandler(async (req, res) => {
  const user = await userModel.findBySiape(req.params.siape);

  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  res.json({ success: true, data: user });
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userModel.findProfileBySiape(req.params.siape);

  if (!profile) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  res.json({ success: true, data: profile });
});

const create = asyncHandler(async (req, res) => {
  const { siape, nome, email, senha, perfilId, funcaoIds } = req.body;

  const existing = await userModel.findBySiape(siape);
  if (existing) {
    throw new ApiError(409, 'Já existe um usuário com esse SIAPE');
  }

  const emailInUse = await userModel.findByEmail(email);
  if (emailInUse) {
    throw new ApiError(409, 'Já existe um usuário com esse e-mail');
  }

  const passwordHash = senha ? await bcrypt.hash(senha, SALT_ROUNDS) : undefined;

  try {
    const user = await userModel.create({
      siape,
      nome,
      email,
      passwordHash,
      perfilId,
      funcaoIds
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const update = asyncHandler(async (req, res) => {
  const { nome, email, senha, perfilId, funcaoIds } = req.body;

  const existing = await userModel.findBySiape(req.params.siape);
  if (!existing) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  if (email) {
    const emailInUse = await userModel.findByEmail(email);
    if (emailInUse && emailInUse.siape !== req.params.siape) {
      throw new ApiError(409, 'Já existe um usuário com esse e-mail');
    }
  }

  const passwordHash = senha ? await bcrypt.hash(senha, SALT_ROUNDS) : undefined;

  try {
    const user = await userModel.update(req.params.siape, {
      nome,
      email,
      passwordHash,
      perfilId,
      funcaoIds
    });
    res.json({ success: true, data: user });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, FK_MESSAGE);
    }
    throw error;
  }
});

const remove = asyncHandler(async (req, res) => {
  const existing = await userModel.findBySiape(req.params.siape);
  if (!existing) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  try {
    await userModel.remove(req.params.siape);
  } catch (error) {
    if (isRowReferenced(error)) {
      throw new ApiError(
        409,
        'Não é possível excluir: usuário possui diários, registros de conselho, atendimentos ou encaminhamentos'
      );
    }
    throw error;
  }

  res.status(204).send();
});

module.exports = {
  getAll,
  getById,
  getProfile,
  create,
  update,
  remove
};
