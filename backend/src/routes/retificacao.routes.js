const { Router } = require('express');

const controller = require('../controllers/retificacao.controller');
const { validateSave } = require('../validators/retificacao.validator');
const validateIdParam = require('../middlewares/validateIdParam');

const router = Router({ mergeParams: true });

router.param('notaId', validateIdParam);

router.get('/', controller.getAll);
router.put('/:notaId', validateSave, controller.save);
router.delete('/:notaId', controller.remove);

module.exports = router;
