const { Router } = require('express');

const controller = require('../controllers/retificacao.controller');
const { validateSave } = require('../validators/retificacao.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const retificacaoModel = require('../models/retificacao.model');
const auditar = require('../middlewares/auditar');

const router = Router({ mergeParams: true });

const audit = auditar('conselhos_retificacoes', (req) => retificacaoModel.findOne(req.params.conselhoId, req.params.notaId));

router.param('notaId', validateIdParam);

router.get('/', controller.getAll);
router.put('/:notaId', validateSave, audit, controller.save);
router.delete('/:notaId', audit, controller.remove);

module.exports = router;
