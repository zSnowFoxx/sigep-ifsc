const { Router } = require('express');

const controller = require('../controllers/dashboard.controller');

const router = Router();

router.get('/stats', controller.getStats);
router.get('/filter-options', controller.getFilterOptions);
router.get('/risk-students', controller.getRiskStudents);

module.exports = router;
