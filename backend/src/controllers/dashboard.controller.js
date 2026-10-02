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

const getRiskStudents = asyncHandler(async (req, res) => {
  const students = await dashboardModel.findRiskStudents();
  res.json({ success: true, data: students });
});

module.exports = {
  getStats,
  getFilterOptions,
  getRiskStudents
};
