const userModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { podeConsultarAuditoria } = require('../utils/auditoria');

// Só os perfis de AUDITORIA_PERFIS consultam os logs (ver utils/auditoria.js).
async function exigirAcessoAuditoria(req, res, next) {
  try {
    if (!podeConsultarAuditoria(await userModel.findPerfilNomeById(req.user.id))) {
      return next(new ApiError(403, 'Seu perfil não tem acesso aos logs de auditoria'));
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = exigirAcessoAuditoria;
