const express = require("express");
const router = express.Router();

// GET /api/sigaa/:email
router.get("/:email", (req, res) => {
  const { email } = req.params;

  if (!email.endsWith("@ifsc.edu.br")) {
    return res.status(400).json({ message: "E-mail inválido para busca no SIGAA." });
  }

  // Simulação de resposta com base no e-mail
  return res.json({
    name: "Servidor Exemplo IFSC",
    siape: "2048591",
    role: "Professor",
    course: "Análise e Desenvolvimento de Sistemas",
    disciplines: ["Programação Web", "Banco de Dados"]
  });
});

module.exports = router;