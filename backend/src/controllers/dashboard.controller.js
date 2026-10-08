const dashboardModel = require('../models/dashboard.model');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardModel.getStats();
  res.json({ success: true, data: stats });
});

const getFilterOptions = asyncHandler(async (req, res) => {
  const options = await dashboardModel.getFilterOptions();
  res.json({ success: true, data: options });
});

// Filtros opcionais via query string: ?periodo=2026.1&curso=...&fase=2ª Fase&turma=...&disciplina=...
const RISK_FILTERS = ['periodo', 'curso', 'fase', 'turma', 'disciplina'];

const getRiskStudents = asyncHandler(async (req, res) => {
  const filters = Object.fromEntries(
    RISK_FILTERS.filter((key) => typeof req.query[key] === 'string' && req.query[key].trim()).map((key) => [
      key,
      req.query[key].trim()
    ])
  );
  const students = await dashboardModel.findRiskStudents(filters);
  res.json({ success: true, data: students });
});

module.exports = {
  getStats,
  getFilterOptions,
  getRiskStudents
};
