const { Router } = require('express');

const authenticate = require('../middlewares/authenticate');
const { authenticateWrites } = authenticate;

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

router.use('/auth', require('./auth.routes'));

// Listas lidas pelo formulário de autocadastro, antes do login.
router.use('/perfis', authenticateWrites, require('./perfil.routes'));
router.use('/funcoes', authenticateWrites, require('./funcao.routes'));
router.use('/cursos', authenticateWrites, require('./curso.routes'));
router.use('/disciplinas', authenticateWrites, require('./disciplina.routes'));

// Daqui em diante, todas as rotas exigem token.
router.use(authenticate);

router.use('/users', require('./user.routes'));
router.use('/periodos', require('./periodo.routes'));
router.use('/turmas', require('./turma.routes'));
router.use('/diarios', require('./diario.routes'));
router.use('/alunos', require('./aluno.routes'));
router.use('/matriculas', require('./matricula.routes'));
router.use('/notas-frequencias', require('./notaFrequencia.routes'));
router.use('/conselhos', require('./conselho.routes'));
router.use('/atendimentos', require('./atendimento.routes'));
router.use('/encaminhamentos', require('./encaminhamento.routes'));
router.use('/importacoes', require('./importacao.routes'));
router.use('/logs-auditoria', require('./logAuditoria.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;