const { Router } = require('express');

const controller = require('../controllers/abono.controller');
const { validateCreate } = require('../validators/abono.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const abonoModel = require('../models/abono.model');
const auditar = require('../middlewares/auditar');

const router = Router({ mergeParams: true });

const audit = auditar('conselhos_abonos', (req) => abonoModel.findOne(req.params.conselhoId, req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.post('/', validateCreate, audit, controller.create);
router.delete('/:id', audit, controller.remove);

module.exports = router;
