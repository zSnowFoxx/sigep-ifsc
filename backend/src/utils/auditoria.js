const logAuditoriaModel = require('../models/logAuditoria.model');
const { isForeignKeyViolation } = require('./dbErrors');

// Perfis (por nome) que podem consultar os logs. AUDITORIA_PERFIS substitui a lista padrão,
// com os nomes separados por vírgula.
const PERFIS_AUDITORIA = (process.env.AUDITORIA_PERFIS ?? 'Coordenador de Curso,Equipe Pedagógica/NAE')
  .split(',')
  .map((nome) => nome.trim())
  .filter(Boolean);

function podeConsultarAuditoria(perfilNome) {
  return PERFIS_AUDITORIA.includes(perfilNome);
}

// Nunca vão para o log, em qualquer nível do objeto.
const CAMPOS_SIGILOSOS = new Set(['senha', 'novaSenha', 'senhaAtual', 'passwordHash', 'codigo', 'token']);

function semDadosSigilosos(valor) {
  if (Array.isArray(valor)) {
    return valor.map(semDadosSigilosos);
  }
  if (valor && typeof valor === 'object' && !(valor instanceof Date)) {
    return Object.fromEntries(
      Object.entries(valor)
        .filter(([campo]) => !CAMPOS_SIGILOSOS.has(campo))
        .map(([campo, conteudo]) => [campo, semDadosSigilosos(conteudo)])
    );
  }
  return valor;
}

// Origem do registro: sempre a própria requisição, nunca o corpo.
function origemDaRequisicao(req) {
  return {
    enderecoIp: req.ip?.slice(0, 45),
    userAgent: req.get('user-agent')?.slice(0, 500)
  };
}

// Grava um log da requisição. A operação auditada já foi concluída, então uma falha aqui
// só é reportada no console, sem derrubar a resposta.
async function registrarLog(req, { acao, tabela, registroId, anteriores, novos, usuarioId = req.user?.id }) {
  const log = {
    usuarioId,
    acao,
    tabelaAfetada: tabela,
    registroId,
    dadosAnteriores: semDadosSigilosos(anteriores),
    dadosNovos: semDadosSigilosos(novos),
    ...origemDaRequisicao(req)
  };

  try {
    try {
      await logAuditoriaModel.create(log);
    } catch (error) {
      // O autor não existe mais (ex.: excluiu a própria conta): grava o log sem ele.
      if (!isForeignKeyViolation(error) || log.usuarioId == null) throw error;
      await logAuditoriaModel.create({ ...log, usuarioId: null });
    }
  } catch (error) {
    console.error('Falha ao gravar log de auditoria:', error);
  }
}

module.exports = {
  podeConsultarAuditoria,
  semDadosSigilosos,
  origemDaRequisicao,
  registrarLog
};
