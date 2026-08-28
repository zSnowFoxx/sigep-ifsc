import type { UserSession } from "../types/auth";
import { API_URL } from "../data/apiData";
import type { RegisterUserData, SystemOptions, Role } from "../types/auth";
import { ROLE_TO_PERFIL_ID } from "../utils/authUtils";
import { DEFAULT_ROLES, DEFAULT_FUNCOES } from "../data/authData";

async function http<T>(path: string, config?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...config?.headers },
    ...config,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro na requisição ${path}: ${response.statusText}`);
  }

  if (response.status === 204) return {} as T;
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

// Busca os perfis/cargos do servidor (/perfis)
export async function fetchPerfis(): Promise<Array<{ id: number; nome: string }>> {
  return http<Array<{ id: number; nome: string }>>("/perfis").catch(() => []);
}

// Busca a lista de funções cadastradas (/funcoes)
export async function fetchFuncoesList(): Promise<Array<{ id: number; nome: string }>> {
  return http<Array<{ id: number; nome: string }>>("/funcoes").catch(() => []);
}

// 1. Busca opções do formulário (disciplinas, cursos, funcoes)
export async function fetchSystemOptions(): Promise<SystemOptions> {
  const [perfis, cursos, disciplinas, funcoes] = await Promise.all([
    fetchPerfis(),
    http<any[]>("/cursos").catch(() => []),
    http<any[]>("/disciplinas").catch(() => []),
    fetchFuncoesList(),
  ]);

  const roles = perfis.length > 0 ? perfis.map((p) => p.nome as Role) : DEFAULT_ROLES;
  const funcoesList = funcoes.length > 0 ? funcoes : DEFAULT_FUNCOES.map((nome, index) => ({ id: index + 1, nome }));

  return {
    roles,
    courses: cursos.map((c) => ({ id: c.id, nome: c.nome })),
    disciplines: disciplinas.map((d) => ({ id: d.id, nome: d.nome, sigla: d.sigla })),
    funcoes: funcoesList.map((f) => ({ id: f.id, nome: f.nome })),
  };
}

// 2. Consulta a integração SIGAA
export async function fetchSigaaData(email: string): Promise<Partial<RegisterUserData>> {
  return http<Partial<RegisterUserData>>(`/api/sigaa/${encodeURIComponent(email)}`).catch(() => {
    return {
      name: "Servidor IFSC",
      siape: "1234567",
      role: "Professor",
      disciplines: [],
    };
  });
}

// 3. Envia código OTP
export async function sendOtp(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao enviar código OTP.");
  return data;
}

// 4. Valida código OTP
export async function verifyOtp(email: string, code: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao verificar código OTP.");
  return data;
}

// 5. Cadastro de novo usuário
export async function registerUser(data: RegisterUserData): Promise<any> {
  if (!data.role) throw new Error("Selecione um cargo/perfil válido.");

  // 1. Busca dados do sistema para cruzamento de IDs
  const [rawCursos, rawDisciplinas, rawFuncoes, rawDiarios] = await Promise.all([
    http<any[]>("/cursos").catch(() => []),
    http<any[]>("/disciplinas").catch(() => []),
    http<any[]>("/funcoes").catch(() => []),
    http<any[]>("/diarios").catch(() => []),
  ]);

  const cursosMap = new Map(rawCursos.map((c) => [c.nome.toLowerCase().trim(), c.id]));
  const disciplinasMap = new Map(rawDisciplinas.map((d) => [d.nome.toLowerCase().trim(), d.id]));
  const funcoesMap = new Map(rawFuncoes.map((f) => [f.nome.toLowerCase().trim(), f.id]));

  // 2. Resolve Curso Coordenado (caso seja Coordenador)
  let curso_id: number | null = null;
  if (data.role === "Coordenador de Curso" && data.course) {
    const cleanCourse = data.course.toLowerCase().trim();
    curso_id = cursosMap.get(cleanCourse) || null;
  }

  // 3. Resolve Disciplinas Lecionadas (caso Professor ou Coordenador com aulas)
  const disciplinas_ids: number[] = [];
  if ((data.role === "Professor" || data.role === "Coordenador de Curso") && data.disciplines) {
    for (const dName of data.disciplines) {
      const cleanDisc = dName.toLowerCase().trim();
      const discId = disciplinasMap.get(cleanDisc);
      if (discId) disciplinas_ids.push(discId);
    }
  }

  // 4. Resolve e cria dinamicamente novas Funções (Equipe Pedagógica / Servidor Geral)
  const funcoes_ids: number[] = [];
  if ((data.role === "Equipe Pedagógica/NAE" || data.role === "Servidor Geral") && data.funcoes) {
    for (const fName of data.funcoes) {
      const cleanFuncao = fName.trim();
      if (!cleanFuncao) continue;

      const idExistente = funcoesMap.get(cleanFuncao.toLowerCase());
      if (idExistente) {
        funcoes_ids.push(idExistente);
      } else {
        // Cria nova função no banco e obtém seu id
        const novaFuncao = await http<any>("/funcoes", {
          method: "POST",
          body: JSON.stringify({ nome: cleanFuncao }),
        });
        if (novaFuncao?.id) {
          funcoes_ids.push(novaFuncao.id);
          funcoesMap.set(cleanFuncao.toLowerCase(), novaFuncao.id);
        }
      }
    }
  }

  // 5. Monta o Usuário final para a tabela usuarios
  const usuarioPayload = {
    nome: data.name,
    email: data.email,
    password: data.password,
    siape: data.siape,
    perfil_id: ROLE_TO_PERFIL_ID[data.role],
    curso_id,
    disciplinas_ids,
    funcoes_ids,
  };

  const novoUsuario = await http<any>("/usuarios", {
    method: "POST",
    body: JSON.stringify(usuarioPayload),
  });

  // 6. Aloca o novo Professor nos Diários correspondentes às Disciplinas selecionadas
  if (novoUsuario?.id && disciplinas_ids.length > 0 && rawDiarios.length > 0) {
    const targetDiarios = rawDiarios.filter((diario) =>
      disciplinas_ids.includes(diario.disciplina_id || diario.disciplinaId)
    );

    await Promise.all(
      targetDiarios.map((diario) =>
        http(`/diarios/${diario.id}`, {
          method: "PUT",
          body: JSON.stringify({
            ...diario,
            professor_id: novoUsuario.id,
            professor_usuario_id: novoUsuario.id,
          }),
        }).catch((err) => console.error(`Erro ao vincular diário ${diario.id}:`, err))
      )
    );
  }

  return novoUsuario;
}

// 6. Autenticação (Login)
export async function loginUser(email: string, password: string): Promise<{ message: string; user: UserSession }> {
  if (!email || !password) throw new Error("E-mail e senha são obrigatórios.");

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Credenciais inválidas.");
  return data;
}

// 7. Busca dados do usuário logado na sessão
export async function fetchCurrentUser(email: string): Promise<UserSession> {
  const response = await fetch(`${API_URL}/auth/me?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao buscar dados do usuário.");
  return data;
}

// 8. Solicitação de Recuperação de Senha (Esqueci a senha)
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao solicitar recuperação.");
  return data;
}

// 9. Redefinição de Senha com Token/OTP (Sem login)
export async function resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao redefinir a senha.");
  return data;
}

// 10. Alteração de Senha (Com usuário autenticado no sistema)
export async function changePassword(email: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao alterar a senha.");
  return data;
}