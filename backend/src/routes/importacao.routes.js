const { Router } = require('express');

const controller = require('../controllers/importacao.controller');

const router = Router();

router.post('/notas', controller.notas);
router.post('/nae', controller.nae);
router.post('/frequencia', controller.frequencia);
router.post('/turmas', controller.turmas);

module.exports = router;
