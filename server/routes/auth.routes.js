const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Importação do bcrypt

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

// POST /api/auth/send-otp
router.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email || !email.toLowerCase().endsWith("@ifsc.edu.br")) {
    return res.status(400).json({ message: "O e-mail deve ser do domínio @ifsc.edu.br" });
  }
  otpCodes.set(email.toLowerCase(), "123456");
  return res.json({ message: "Código enviado com sucesso!" });
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
  const { email, code } = req.body;
  const savedCode = otpCodes.get(email?.toLowerCase());
  if (!savedCode || savedCode !== code.trim()) {
    return res.status(400).json({ message: "Código inválido ou expirado." });
  }
  return res.json({ message: "Código verificado!" });
});

// POST /api/auth/login (Comparação por Hash)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = usuariosDB.find((u) => u.email.toLowerCase() === email?.toLowerCase());
  
  if (!user) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }

  // Compara a senha informada com o hash salvo
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }

  return res.json({ message: "Login realizado com sucesso!", user: formatUserProfile(user) });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  const { email } = req.query;
  const user = usuariosDB.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  return res.json(formatUserProfile(user));
});

// POST /api/auth/forgot-password
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  const cleanEmail = email?.toLowerCase();

  const user = usuariosDB.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ message: "E-mail não encontrado no sistema." });
  }

  otpCodes.set(cleanEmail, "123456");
  return res.json({ message: "Instruções enviadas com sucesso!" });
});

// POST /api/auth/reset-password (Gera Hash da nova senha)
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  const cleanEmail = email?.toLowerCase();

  const savedCode = otpCodes.get(cleanEmail);
  if (!savedCode || savedCode !== code.trim()) {
    return res.status(400).json({ message: "Código inválido ou expirado." });
  }

  const userIndex = usuariosDB.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  // Gera o hash antes de salvar
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  usuariosDB[userIndex].password = hashedPassword;
  otpCodes.delete(cleanEmail);

  return res.json({ message: "Senha redefinida com sucesso!" });
});

// POST /api/profile/change-password
router.post("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const userIndex = usuariosDB.findIndex((u) => u.email.toLowerCase() === email?.toLowerCase());
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  const user = usuariosDB[userIndex];

  // 1. Compara a senha atual enviada com o hash salvo no banco
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "A senha atual está incorreta." });
  }

  // 2. Gera o hash da nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 3. Atualiza no array em memória
  usuariosDB[userIndex].password = hashedPassword;

  return res.json({ message: "Senha alterada com sucesso!" });
});

// POST /api/auth/register (Gera Hash no cadastro)
router.post("/register", async (req, res) => {
  const { email, password, name, siape, role, disciplines, course } = req.body;

  if (!email || !password || !name || !siape || !role) {
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
  }

  const emailExists = usuariosDB.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ message: "Este e-mail já está cadastrado no sistema." });
  }

  const siapeExists = usuariosDB.some((u) => u.siape === siape);
  if (siapeExists) {
    return res.status(400).json({ message: "Este SIAPE já está cadastrado no sistema." });
  }

  const perfilEncontrado = perfisDB.find((p) => p.nome.toLowerCase() === role.toLowerCase());
  const perfil_id = perfilEncontrado ? perfilEncontrado.id : 4;

  const cursoEncontrado = course
    ? cursosDB.find((c) => c.nome.toLowerCase() === course.toLowerCase())
    : null;
  const curso_id = cursoEncontrado ? cursoEncontrado.id : null;

  const disciplinas_ids = Array.isArray(disciplines)
    ? disciplines
        .map((dNome) => disciplinasDB.find((d) => d.nome.toLowerCase() === dNome.toLowerCase())?.id)
        .filter(Boolean)
    : [];

  // Gera o hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  const novoUsuario = {
    id: usuariosDB.length > 0 ? Math.max(...usuariosDB.map((u) => u.id)) + 1 : 1,
    email: email.toLowerCase(),
    password: hashedPassword,
    nome: name,
    siape: siape,
    perfil_id,
    curso_id,
    disciplinas_ids,
  };

  usuariosDB.push(novoUsuario);

  return res.status(201).json({
    message: "Usuário cadastrado com sucesso!",
    user: formatUserProfile(novoUsuario),
  });
});

module.exports = router;