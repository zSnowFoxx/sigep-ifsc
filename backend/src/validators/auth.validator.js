const ApiError = require('../utils/ApiError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INSTITUTIONAL_DOMAIN = '@ifsc.edu.br';

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isIntegerList(value) {
  return Array.isArray(value) && value.every((id) => Number.isInteger(id));
}

function isInstitutionalEmail(email) {
  return (
    isNonEmptyString(email, 100) &&
    EMAIL_REGEX.test(email) &&
    email.trim().toLowerCase().endsWith(INSTITUTIONAL_DOMAIN)
  );
}

// Mesmas regras exibidas no formulário de cadastro.
function isStrongPassword(senha) {
  return typeof senha === 'string' && senha.length >= 8 && /\d/.test(senha) && /[@#$%^&*!?]/.test(senha);
}

function respond(errors, next) {
  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateOtpRequest(req, res, next) {
  const errors = [];

  if (!isInstitutionalEmail(req.body.email)) {
    errors.push(`email é obrigatório e deve ser do domínio ${INSTITUTIONAL_DOMAIN}`);
  }

  respond(errors, next);
}

function validateOtpVerify(req, res, next) {
  const { email, codigo } = req.body;
  const errors = [];

  if (!isNonEmptyString(email, 100) || !EMAIL_REGEX.test(email)) {
    errors.push('email é obrigatório e deve ser um e-mail válido');
  }
  if (typeof codigo !== 'string' || !/^\d{6}$/.test(codigo.trim())) {
    errors.push('codigo é obrigatório e deve conter 6 dígitos');
  }

  respond(errors, next);
}

function validateRegister(req, res, next) {
  const { siape, nome, email, senha, perfilId, funcaoIds, disciplinaIds, cursoIds } = req.body;
  const errors = [];

  if (!isNonEmptyString(siape, 7)) {
    errors.push('siape é obrigatório e deve ter no máximo 7 caracteres');
  }
  if (!isNonEmptyString(nome, 100)) {
    errors.push('nome é obrigatório e deve ter no máximo 100 caracteres');
  }
  if (!isInstitutionalEmail(email)) {
    errors.push(`email é obrigatório e deve ser do domínio ${INSTITUTIONAL_DOMAIN}`);
  }
  if (!isStrongPassword(senha)) {
    errors.push('senha deve ter ao menos 8 caracteres, 1 número e 1 caractere especial');
  }
  if (!Number.isInteger(perfilId)) {
    errors.push('perfilId é obrigatório e deve ser um número inteiro');
  }
  if (funcaoIds !== undefined && !isIntegerList(funcaoIds)) {
    errors.push('funcaoIds deve ser uma lista de números inteiros');
  }
  if (disciplinaIds !== undefined && !isIntegerList(disciplinaIds)) {
    errors.push('disciplinaIds deve ser uma lista de números inteiros');
  }
  if (cursoIds !== undefined && !isIntegerList(cursoIds)) {
    errors.push('cursoIds deve ser uma lista de números inteiros');
  }

  respond(errors, next);
}

function validateLogin(req, res, next) {
  const { email, senha } = req.body;
  const errors = [];

  if (!isNonEmptyString(email, 100)) {
    errors.push('email é obrigatório');
  }
  if (typeof senha !== 'string' || senha.length === 0) {
    errors.push('senha é obrigatória');
  }

  respond(errors, next);
}

function validateForgotPassword(req, res, next) {
  const errors = [];

  if (!isNonEmptyString(req.body.email, 100) || !EMAIL_REGEX.test(req.body.email)) {
    errors.push('email é obrigatório e deve ser um e-mail válido');
  }

  respond(errors, next);
}

function validateResetPassword(req, res, next) {
  const { email, codigo, novaSenha } = req.body;
  const errors = [];

  if (!isNonEmptyString(email, 100) || !EMAIL_REGEX.test(email)) {
    errors.push('email é obrigatório e deve ser um e-mail válido');
  }
  if (typeof codigo !== 'string' || !/^\d{6}$/.test(codigo.trim())) {
    errors.push('codigo é obrigatório e deve conter 6 dígitos');
  }
  if (!isStrongPassword(novaSenha)) {
    errors.push('novaSenha deve ter ao menos 8 caracteres, 1 número e 1 caractere especial');
  }

  respond(errors, next);
}

function validateChangePassword(req, res, next) {
  const { email, senhaAtual, novaSenha } = req.body;
  const errors = [];

  if (!isNonEmptyString(email, 100) || !EMAIL_REGEX.test(email)) {
    errors.push('email é obrigatório e deve ser um e-mail válido');
  }
  if (typeof senhaAtual !== 'string' || senhaAtual.length === 0) {
    errors.push('senhaAtual é obrigatória');
  }
  if (!isStrongPassword(novaSenha)) {
    errors.push('novaSenha deve ter ao menos 8 caracteres, 1 número e 1 caractere especial');
  }

  respond(errors, next);
}

module.exports = {
  validateOtpRequest,
  validateOtpVerify,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword
};
