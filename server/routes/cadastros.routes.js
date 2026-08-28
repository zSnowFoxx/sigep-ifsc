const express = require("express");
const router = express.Router();

let db = {
  alunos: require("../data/alunos.js"),
  usuarios: require("../data/usuarios.js"),
  funcoes: require("../data/funcoes.js"),
  perfis: require("../data/perfis.js"),
  cursos: require("../data/cursos.js"),
  disciplinas: require("../data/disciplinas.js"),
  turmas: require("../data/turmas.js"),
  diarios: require("../data/diarios.js"),
};

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

  // POST (Adicionar)
  entityRouter.post("/", (req, res) => {
    const newItem = { id: Date.now(), ...req.body };
    db[entityKey].push(newItem);

    console.log(`[${entityKey.toUpperCase()}] Adicionado com sucesso! ID: ${newItem.id}`);

    res.status(201).json(newItem);
  });

  // PUT (Editar / Atualizar)
  entityRouter.put("/:id", (req, res) => {
    const index = db[entityKey].findIndex((i) => i.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Registro não encontrado" });

    db[entityKey][index] = { ...db[entityKey][index], ...req.body };

    console.log(`[${entityKey.toUpperCase()}] Atualizado com sucesso! ID: ${req.params.id}`);

    res.json(db[entityKey][index]);
  });

  // DELETE (Excluir)
  entityRouter.delete("/:id", (req, res) => {
    const index = db[entityKey].findIndex((i) => i.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Registro não encontrado" });

    db[entityKey].splice(index, 1);

    console.log(`[${entityKey.toUpperCase()}] Excluído com sucesso! ID: ${req.params.id}`);

    res.status(204).send();
  });

  return entityRouter;
}

// Sub-rotas acopladas ao router principal de Cadastros
router.use("/alunos", createCrudRouter("alunos"));
router.use("/usuarios", createCrudRouter("usuarios"));
router.use("/funcoes", createCrudRouter("funcoes"));
router.use("/perfis", createCrudRouter("perfis"));
router.use("/cursos", createCrudRouter("cursos"));
router.use("/disciplinas", createCrudRouter("disciplinas"));
router.use("/turmas", createCrudRouter("turmas"));
router.use("/diarios", createCrudRouter("diarios"));

module.exports = router;