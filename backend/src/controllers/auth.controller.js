const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');
const funcaoModel = require('../models/funcao.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const otpStore = require('../utils/otpStore');
const { isForeignKeyViolation } = require('../utils/dbErrors');
const { signToken } = require('../utils/jwt');
const { registrarLog, podeConsultarAuditoria } = require('../utils/auditoria');

const SALT_ROUNDS = 10;

const normalizeEmail = (email) => email.trim().toLowerCase();

// O frontend mostra a tela de logs só para quem o backend deixa consultar.
const comPermissoes = (profile) => ({ ...profile, acessoAuditoria: podeConsultarAuditoria(profile.perfil.nome) });

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

// Funções informadas por nome no autocadastro: reaproveita as existentes e cria as novas.
async function resolveFuncaoIds(nomes = []) {
  const ids = [];
  for (const nome of nomes.map((n) => n.trim())) {
    let funcao = await funcaoModel.findByNome(nome);
    if (!funcao) {
      try {
        funcao = await funcaoModel.create({ nome });
      } catch (error) {
        // Criada em paralelo por outra requisição.
        if (error.code !== 'ER_DUP_ENTRY') throw error;
        funcao = await funcaoModel.findByNome(nome);
      }
    }
    ids.push(funcao.id);
  }
  return ids;
}

const register = asyncHandler(async (req, res) => {
  const { siape, nome, senha, perfilId, disciplinaIds, cursoIds } = req.body;
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
  const funcaoIds = [...new Set([...(req.body.funcaoIds ?? []), ...(await resolveFuncaoIds(req.body.funcoes))])];

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
    await registrarLog(req, { acao: 'INSERT', tabela: 'usuarios', registroId: user.id, novos: user, usuarioId: user.id });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(400, 'perfilId, funcaoIds ou disciplinaIds inválido');
    }
    throw error;
  }
});

const INVALID_CREDENTIALS = 'E-mail ou senha incorretos';

// Tentativas recusadas também vão para o log, com o e-mail informado (nunca a senha).
async function registrarLoginRecusado(req, email, user, motivo) {
  await registrarLog(req, {
    acao: 'LOGIN_FALHA',
    tabela: 'usuarios',
    registroId: user?.id,
    novos: { email, motivo },
    usuarioId: user?.id ?? null
  });
}

const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await userModel.findByEmail(email);

  if (!user) {
    await registrarLoginRecusado(req, email, null, 'E-mail não cadastrado');
    throw new ApiError(401, INVALID_CREDENTIALS);
  }

  if (!user.senha) {
    await registrarLoginRecusado(req, email, user, 'Usuário sem senha cadastrada');
    throw new ApiError(401, "Usuário sem senha cadastrada. Utilize 'Esqueci minha senha' para criar uma");
  }

  const isPasswordValid = await bcrypt.compare(req.body.senha, user.senha);
  if (!isPasswordValid) {
    await registrarLoginRecusado(req, email, user, 'Senha incorreta');
    throw new ApiError(401, INVALID_CREDENTIALS);
  }

  const profile = await userModel.findProfileBySiape(user.siape);
  await registrarLog(req, { acao: 'LOGIN', tabela: 'usuarios', registroId: user.id, usuarioId: user.id });
  res.json({ success: true, data: { token: signToken(user), user: comPermissoes(profile) } });
});

// O token não é revogado (JWT sem estado): a saída só fica registrada no log.
const logout = asyncHandler(async (req, res) => {
  await registrarLog(req, { acao: 'LOGOUT', tabela: 'usuarios', registroId: req.user.id });
  res.status(204).send();
});

// Perfil do usuário dono do token (restaura a sessão no frontend).
const me = asyncHandler(async (req, res) => {
  const profile = await userModel.findProfileBySiape(req.user.siape);
  if (!profile) {
    throw new ApiError(401, 'Usuário da sessão não encontrado');
  }

  res.json({ success: true, data: comPermissoes(profile) });
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
  await registrarLog(req, { acao: 'REDEFINIR_SENHA', tabela: 'usuarios', registroId: user.id, usuarioId: user.id });

  res.json({ success: true, message: 'Senha redefinida com sucesso' });
});

// Troca de senha pelo próprio usuário autenticado (tela de perfil): exige a senha atual.
const changePassword = asyncHandler(async (req, res) => {
  const user = await userModel.findWithPasswordById(req.user.id);
  if (!user) {
    throw new ApiError(401, 'Usuário da sessão não encontrado');
  }

  if (!user.senha) {
    throw new ApiError(400, "Usuário sem senha cadastrada. Utilize 'Esqueci minha senha' para criar uma");
  }

  if (!(await bcrypt.compare(req.body.senhaAtual, user.senha))) {
    throw new ApiError(400, 'A senha atual está incorreta');
  }

  await userModel.updatePassword(user.id, await bcrypt.hash(req.body.novaSenha, SALT_ROUNDS));
  await registrarLog(req, { acao: 'ALTERAR_SENHA', tabela: 'usuarios', registroId: user.id });
  res.json({ success: true, message: 'Senha alterada com sucesso' });
});

module.exports = {
  requestOtp,
  verifyOtp,
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  changePassword
};
