const express = require("express");
const cors = require("cors");

// Importação das coleções de dados relacionais
const usuariosDB = require("./data/usuarios");
const perfisDB = require("./data/perfis");
const alunosDB = require("./data/alunos");
const disciplinasDB = require("./data/disciplinas");
const periodosDB = require("./data/periodos");
const cursosDB = require("./data/cursos");
const turmasDB = require("./data/turmas");
const diariosDB = require("./data/diarios");
const matriculasDB = require("./data/matriculas");
const notasFrequenciasDB = require("./data/notas_frequencias");
const situacaoRiscoDB = require("./data/situacao_risco");

const app = express();
app.use(cors());
app.use(express.json());

const otpCodes = new Map();

// Helper para formatar o objeto de perfil retornado nas APIs
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
    disciplines: disciplinas
  };
};

// --- ENDPOINTS REST ---

// 1. Enviar OTP
app.post("/api/auth/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email || !email.toLowerCase().endsWith("@ifsc.edu.br")) {
    return res.status(400).json({ message: "O e-mail deve ser do domínio @ifsc.edu.br" });
  }

  const exists = usuariosDB.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ message: "Este e-mail já está cadastrado." });
  }

  otpCodes.set(email.toLowerCase(), "123456");
  return res.json({ message: "Código enviado com sucesso!" });
});

// 2. Validar OTP
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, code } = req.body;
  const savedCode = otpCodes.get(email?.toLowerCase());

  if (!savedCode || savedCode !== code.trim()) {
    return res.status(400).json({ message: "Código inválido ou expirado." });
  }

  return res.json({ message: "Código verificado!" });
});

// 3. Buscar Opções para Cadastro de Formulários
app.get("/api/options", (req, res) => {
  return res.json({
    disciplines: disciplinasDB.map((d) => d.nome),
    courses: cursosDB.map((c) => c.nome),
    roles: perfisDB.map((p) => p.nome)
  });
});

// 4. Integração SIGAA
app.get("/api/sigaa/:email", (req, res) => {
  const prefix = req.params.email.split("@")[0].toLowerCase();

  if (prefix.includes("coord")) {
    return res.json({
      name: "Marcos Pereira",
      siape: "3456789",
      role: "Coordenador de Curso",
      course: cursosDB[0].nome
    });
  }
  if (prefix.includes("prof") || prefix.includes("docente")) {
    return res.json({
      name: "Juliana Rocha",
      siape: "5678901",
      role: "Professor",
      disciplines: [disciplinasDB[2].nome, disciplinasDB[5].nome]
    });
  }
  return res.json({
    name: "Servidor Teste IFSC",
    siape: "1928374",
    role: "Servidor Geral"
  });
});

// 5. Cadastrar Usuário
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, siape, role, disciplines, course } = req.body;

  const perfil = perfisDB.find((p) => p.nome === role);
  const cursoObj = cursosDB.find((c) => c.nome === course);
  const discIds = disciplines
    ?.map((dName) => disciplinasDB.find((d) => d.nome === dName)?.id)
    .filter(Boolean);

  const newUser = {
    id: usuariosDB.length + 1,
    email: email.toLowerCase(),
    password,
    nome: name,
    siape,
    perfil_id: perfil ? perfil.id : 4,
    curso_id: cursoObj ? cursoObj.id : null,
    disciplinas_ids: discIds || []
  };

  usuariosDB.push(newUser);
  return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
});

// 6. Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = usuariosDB.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }

  return res.json({
    message: "Login realizado com sucesso!",
    user: formatUserProfile(user)
  });
});

// 7. Mapeamento da Relacional para Retorno da Dashboard de Alunos em Risco
app.get("/api/students/risk", (req, res) => {
  const response = alunosDB.map((aluno) => {
    const matricula = matriculasDB.find((m) => m.aluno_id === aluno.id);
    const turma = turmasDB.find((t) => t.id === matricula?.turma_id);
    const notaFreq = notasFrequenciasDB.find((nf) => nf.matricula_id === matricula?.id);
    const risco = situacaoRiscoDB.find((sr) => sr.aluno_id === aluno.id);

    return {
      matricula: aluno.matricula,
      nome: aluno.nome,
      turma: turma ? turma.nome : "Sem Turma",
      media: notaFreq ? notaFreq.media : 0,
      infrequencia: notaFreq ? notaFreq.infrequencia : 0,
      fatores: risco ? risco.fatores : [],
      risco: risco ? risco.risco : "medio"
    };
  });

  return res.json(response);
});

// 8. Alteração de Senha do Usuário
app.post("/api/profile/change-password", (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const user = usuariosDB.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  if (user.password !== currentPassword) {
    return res.status(400).json({ message: "Senha atual incorreta." });
  }

  user.password = newPassword;
  return res.json({ message: "Senha alterada com sucesso!" });
});

app.listen(3001, () => console.log("API REST relacional rodando em http://localhost:3001"));