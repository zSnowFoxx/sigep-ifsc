const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const otpStore = require('../utils/otpStore');
const { isForeignKeyViolation } = require('../utils/dbErrors');

const SALT_ROUNDS = 10;

const normalizeEmail = (email) => email.trim().toLowerCase();

// Envia o código de confirmação do e-mail para o autocadastro.
const requestOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (await userModel.findByEmail(email)) {
    throw new ApiError(409, 'Este e-mail já está cadastrado no sistema');
  }

  otpStore.issue(email);
  res.json({ success: true, message: 'Código enviado com sucesso' });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!otpStore.verify(email, req.body.codigo.trim())) {
    throw new ApiError(400, 'Código inválido ou expirado');
  }

  res.json({ success: true, message: 'Código verificado' });
});

const register = asyncHandler(async (req, res) => {
  const { siape, nome, senha, perfilId, funcaoIds, disciplinaIds, cursoIds } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!otpStore.isVerified(email)) {
    throw new ApiError(403, 'Confirme o e-mail com o código enviado antes de concluir o cadastro');
  }

  if (await userModel.findBySiape(siape.trim())) {
    throw new ApiError(409, 'Já existe um usuário com esse SIAPE');
  }

  if (await userModel.findByEmail(email)) {
    throw new ApiError(409, 'Já existe um usuário com esse e-mail');
  }

  const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS);

  try {
    const user = await userModel.create({
      siape: siape.trim(),
      nome: nome.trim(),
      email,
      passwordHash,
      perfilId,
      funcaoIds,
      disciplinaIds,
      cursoIds
    });

    otpStore.consume(email);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'perfilId, funcaoIds ou disciplinaIds inválido');
    }
    throw error;
  }
});

const INVALID_CREDENTIALS = 'E-mail ou senha incorretos';

const login = asyncHandler(async (req, res) => {
  const user = await userModel.findByEmail(normalizeEmail(req.body.email));

  if (!user) {
    throw new ApiError(401, INVALID_CREDENTIALS);
  }

  if (!user.senha) {
    throw new ApiError(401, "Usuário sem senha cadastrada. Utilize 'Esqueci minha senha' para criar uma");
  }

  const isPasswordValid = await bcrypt.compare(req.body.senha, user.senha);
  if (!isPasswordValid) {
    throw new ApiError(401, INVALID_CREDENTIALS);
  }

  const profile = await userModel.findProfileBySiape(user.siape);
  res.json({ success: true, data: profile });
});

// Envia o código para redefinição de senha de um usuário já cadastrado.
const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!(await userModel.findByEmail(email))) {
    throw new ApiError(404, 'E-mail não encontrado no sistema');
  }

  otpStore.issue(email);
  res.json({ success: true, message: 'Código enviado com sucesso' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!otpStore.verify(email, req.body.codigo.trim())) {
    throw new ApiError(400, 'Código inválido ou expirado');
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  await userModel.updatePassword(user.id, await bcrypt.hash(req.body.novaSenha, SALT_ROUNDS));
  otpStore.consume(email);

  res.json({ success: true, message: 'Senha redefinida com sucesso' });
});

// Troca de senha pelo próprio usuário (tela de perfil): exige a senha atual.
const changePassword = asyncHandler(async (req, res) => {
  const user = await userModel.findByEmail(normalizeEmail(req.body.email));
  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  if (!user.senha) {
    throw new ApiError(400, "Usuário sem senha cadastrada. Utilize 'Esqueci minha senha' para criar uma");
  }

  if (!(await bcrypt.compare(req.body.senhaAtual, user.senha))) {
    throw new ApiError(400, 'A senha atual está incorreta');
  }

  await userModel.updatePassword(user.id, await bcrypt.hash(req.body.novaSenha, SALT_ROUNDS));
  res.json({ success: true, message: 'Senha alterada com sucesso' });
});

module.exports = {
  requestOtp,
  verifyOtp,
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword
};
