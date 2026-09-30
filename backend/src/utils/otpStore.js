const crypto = require('crypto');

const OTP_TTL_MS = 10 * 60 * 1000;
// Após validar o código, o usuário tem esse prazo para concluir as demais etapas do cadastro.
const VERIFIED_TTL_MS = 30 * 60 * 1000;

// Códigos ficam em memória: reiniciar o servidor invalida os códigos pendentes.
const codes = new Map();

function getValidEntry(email) {
  const entry = codes.get(email);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    codes.delete(email);
    return null;
  }

  return entry;
}

function issue(email) {
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  codes.set(email, { code, expiresAt: Date.now() + OTP_TTL_MS, verified: false });

  // Ainda não há serviço de e-mail: o código é exibido no console do servidor.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[OTP] Código para ${email}: ${code}`);
  }

  return code;
}

function verify(email, code) {
  const entry = getValidEntry(email);
  if (!entry || entry.code !== code) {
    return false;
  }

  if (!entry.verified) {
    entry.verified = true;
    entry.expiresAt = Date.now() + VERIFIED_TTL_MS;
  }
  return true;
}

function isVerified(email) {
  return Boolean(getValidEntry(email)?.verified);
}

function consume(email) {
  codes.delete(email);
}

module.exports = {
  issue,
  verify,
  isVerified,
  consume
};
