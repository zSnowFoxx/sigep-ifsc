const express = require("express");
const router = express.Router();

const usuariosDB = require("../data/usuarios");
const perfisDB = require("../data/perfis");
const cursosDB = require("../data/cursos");
const disciplinasDB = require("../data/disciplinas");

const otpCodes = new Map();

const formatUserProfile = (user) => {
  const perfil = perfisDB.find((p) => p.id === user.perfil_id);
  const curso = cursosDB.find((c) => c.id === user.curso_id);
  const disciplinas = user.disciplinas_ids
    ?.map((id) => disciplinasDB.find((d) => d.id === id)?.nome)
    .filter(Boolean);

  return {
    email: user.email,
    name: user.nome,
    siape: user.siape,
    role: perfil ? perfil.nome : "",
    course: curso ? curso.nome : undefined,
    disciplines: disciplinas,
  };
};

router.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email || !email.toLowerCase().endsWith("@ifsc.edu.br")) {
    return res.status(400).json({ message: "O e-mail deve ser do domínio @ifsc.edu.br" });
  }
  otpCodes.set(email.toLowerCase(), "123456");
  return res.json({ message: "Código enviado com sucesso!" });
});

router.post("/verify-otp", (req, res) => {
  const { email, code } = req.body;
  const savedCode = otpCodes.get(email?.toLowerCase());
  if (!savedCode || savedCode !== code.trim()) {
    return res.status(400).json({ message: "Código inválido ou expirado." });
  }
  return res.json({ message: "Código verificado!" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = usuariosDB.find((u) => u.email.toLowerCase() === email?.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }
  return res.json({ message: "Login realizado com sucesso!", user: formatUserProfile(user) });
});

router.get("/me", (req, res) => {
  const { email } = req.query;
  const user = usuariosDB.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  return res.json(formatUserProfile(user));
});

module.exports = router;