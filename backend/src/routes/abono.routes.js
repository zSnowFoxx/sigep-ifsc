const { Router } = require('express');

const controller = require('../controllers/abono.controller');
const { validateCreate } = require('../validators/abono.validator');
const validateIdParam = require('../middlewares/validateIdParam');

const router = Router({ mergeParams: true });

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.post('/', validateCreate, controller.create);
router.delete('/:id', controller.remove);

module.exports = router;
