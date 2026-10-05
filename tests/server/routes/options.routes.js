const express = require("express");
const router = express.Router();

const perfisDB = require("../data/perfis");
const cursosDB = require("../data/cursos");
const periodosDB = require("../data/periodos");

// GET /api/options
router.get("/", (req, res) => {
  return res.json({
    roles: perfisDB.map((p) => p.nome),
    courses: cursosDB.map((c) => c.nome)
  });
});

// GET /api/options
router.get("/periodos/", (req, res) => {
  return res.json(periodosDB)
});

module.exports = router;