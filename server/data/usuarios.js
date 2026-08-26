module.exports = [
  {
    id: 1,
    email: "servidor@ifsc.edu.br",
    password: "$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy",
    nome: "Servidor Exemplo",
    siape: "1234567",
    perfil_id: 4,
    curso_id: null,
    disciplinas_ids: []
  },
  {
    id: 2,
    email: "professor@ifsc.edu.br",
    password: "$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy",
    nome: "Carlos Lima",
    siape: "7654321",
    perfil_id: 1,
    curso_id: null,
    disciplinas_ids: [1, 2]
  },
  {
    id: 3,
    email: "coordenador@ifsc.edu.br",
    password: "$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy",
    nome: "Maria Santos",
    siape: "9876543",
    perfil_id: 2,
    curso_id: 1,
    disciplinas_ids: []
  }
];