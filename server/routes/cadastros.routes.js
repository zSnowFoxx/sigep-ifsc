const express = require("express");
const router = express.Router();

// Importação dos seus arquivos de dados (ajuste o caminho relativo caso estejam em outra pasta)
let db = {
  alunos: require("../data/alunos.js"),
  usuarios: require("../data/usuarios.js"),
  cursos: require("../data/cursos.js"),
  disciplinas: require("../data/disciplinas.js"),
  turmas: require("../data/turmas.js"),
  diarios: require("../data/diarios.js"),
};

// Gerador genérico de rotas CRUD para cada entidade
function createCrudRouter(entityKey) {
  const entityRouter = express.Router();

  // GET ALL
  entityRouter.get("/", (req, res) => {
    res.json(db[entityKey] || []);
  });

  // GET BY ID
  entityRouter.get("/:id", (req, res) => {
    const item = db[entityKey].find((i) => i.id == req.params.id);
    if (!item) return res.status(404).json({ message: "Registro não encontrado" });
    res.json(item);
  });

  // POST
  entityRouter.post("/", (req, res) => {
    const newItem = { id: Date.now(), ...req.body };
    db[entityKey].push(newItem);
    res.status(201).json(newItem);
  });

  // PUT
  entityRouter.put("/:id", (req, res) => {
    const index = db[entityKey].findIndex((i) => i.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Registro não encontrado" });

    db[entityKey][index] = { ...db[entityKey][index], ...req.body };
    res.json(db[entityKey][index]);
  });

  // DELETE
  entityRouter.delete("/:id", (req, res) => {
    const index = db[entityKey].findIndex((i) => i.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Registro não encontrado" });

    db[entityKey].splice(index, 1);
    res.status(204).send();
  });

  return entityRouter;
}

// Sub-rotas acopladas ao router principal de Cadastros
router.use("/alunos", createCrudRouter("alunos"));
router.use("/usuarios", createCrudRouter("usuarios"));
router.use("/cursos", createCrudRouter("cursos"));
router.use("/disciplinas", createCrudRouter("disciplinas"));
router.use("/turmas", createCrudRouter("turmas"));
router.use("/diarios", createCrudRouter("diarios"));

module.exports = router;