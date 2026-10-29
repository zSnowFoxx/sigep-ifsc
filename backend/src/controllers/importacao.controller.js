const importacaoModel = require('../models/importacao.model');
const asyncHandler = require('../utils/asyncHandler');
const { registrarLog } = require('../utils/auditoria');

// O corpo vai para o model como chegou: nenhum formato é assumido aqui.
// O log guarda quem importou e o tipo da planilha (registro_id), não o conteúdo.
function importar(funcao, modelo, descricao) {
  return asyncHandler(async (req, res) => {
    await funcao(req.body);
    await registrarLog(req, { acao: 'IMPORTAR', tabela: 'importacoes', registroId: modelo });
    res.json({ success: true, message: `Planilha de ${descricao} recebida` });
  });
}

module.exports = {
  notas: importar(importacaoModel.importarNotas, 'notas', 'notas parciais'),
  nae: importar(importacaoModel.importarNae, 'nae', 'atendimentos (NAE)'),
  frequencia: importar(importacaoModel.importarFrequencia, 'frequencia', 'frequência'),
  turmas: importar(importacaoModel.importarTurmas, 'turmas', 'turmas e matrículas')
};
