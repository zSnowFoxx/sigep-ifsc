const { Router } = require('express');

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/perfis', require('./perfil.routes'));
router.use('/funcoes', require('./funcao.routes'));
router.use('/cursos', require('./curso.routes'));
router.use('/periodos', require('./periodo.routes'));
router.use('/turmas', require('./turma.routes'));
router.use('/disciplinas', require('./disciplina.routes'));
router.use('/diarios', require('./diario.routes'));
router.use('/alunos', require('./aluno.routes'));
router.use('/matriculas', require('./matricula.routes'));
router.use('/notas-frequencias', require('./notaFrequencia.routes'));
router.use('/conselhos', require('./conselho.routes'));
router.use('/atendimentos', require('./atendimento.routes'));
router.use('/encaminhamentos', require('./encaminhamento.routes'));
router.use('/logs-auditoria', require('./logAuditoria.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;