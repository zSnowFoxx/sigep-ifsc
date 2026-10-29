const { Router } = require('express');

const controller = require('../controllers/user.controller');
const { validateCreate, validateUpdate } = require('../validators/user.validator');
const userModel = require('../models/user.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('usuarios', (req) => userModel.findBySiape(req.params.siape));

router.get('/', controller.getAll);
router.get('/:siape', controller.getById);
router.get('/:siape/profile', controller.getProfile);
router.post('/', validateCreate, audit, controller.create);
router.put('/:siape', validateUpdate, audit, controller.update);
router.delete('/:siape', audit, controller.remove);

module.exports = router;
