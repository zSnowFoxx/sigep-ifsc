import type { CategoryKey, ModalMode } from "../types/cadastros";
import {
  servidoresService,
  cursosService,
  disciplinasService,
  turmasService,
  funcoesService,
  entityServices,
} from "../services/cadastrosService";

const PALETTE = [
  "#15622f", "#1d6b9a", "#7c3aed", "#b45309",
  "#0f766e", "#be185d", "#1e40af", "#92400e", "#4c1d95"
];

const PERFIS_MAP: Record<string, number> = {
  "Professor": 1,
  "Coordenador de Curso": 2,
  "Equipe Pedagógica/NAE": 3,
  "Servidor Geral": 4,
};

export function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).map((n) => n[0].toUpperCase()).slice(0, 2).join("");
}

export function avatarColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function stripPrefix(nome: string): string {
  return nome
    .replace(/^Técnico em\s+/i, "")
    .replace(/^Técnico\s+/i, "")
    .replace(/^Superior em\s+/i, "")
    .replace(/^Bacharelado em\s+/i, "")
    .trim();
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export async function processAndSaveEntity(
  category: CategoryKey,
  formData: Record<string, any>,
  modalMode: ModalMode,
  editingId?: number | string
) {
  // 1. Busca tabelas auxiliares em paralelo para obter os IDs correspondentes aos nomes informados na UI
  const [rawCursos, rawTurmas, rawUsuarios, rawDisciplinas, rawFuncoes] = await Promise.all([
    cursosService.getAll().catch(() => []),
    turmasService.getAll().catch(() => []),
    servidoresService.getAll().catch(() => []),
    disciplinasService.getAll().catch(() => []),
    funcoesService.getAll().catch(() => []),
  ]);

  const cursosMap = new Map<string, number | string>(
    (rawCursos || []).map((c: any) => [c.nome?.toLowerCase().trim(), c.id])
  );
  const turmasMap = new Map<string, number | string>(
    (rawTurmas || []).map((t: any) => [t.nome?.toLowerCase().trim(), t.id])
  );
  const usuariosMap = new Map<string, number | string>(
    (rawUsuarios || []).map((u: any) => [u.nome?.toLowerCase().trim(), u.id])
  );
  const disciplinasMap = new Map<string, number | string>(
    (rawDisciplinas || []).map((d: any) => [d.nome?.toLowerCase().trim(), d.id])
  );
  const funcoesMap = new Map<string, number | string>(
    (rawFuncoes || []).map((f: any) => [f.nome?.toLowerCase().trim(), f.id])
  );

  const payload = { ...formData };

  switch (category) {
    case "alunos": {
      // Converte a lista de nomes/opções de turmas selecionadas para turmas_ids
      const turmasInput = Array.isArray(payload.turmas) ? payload.turmas : [];
      const turmas_ids = turmasInput
        .map((item: string | number) => {
          if (typeof item === "number") return item;
          const clean = String(item).toLowerCase().trim();
          return turmasMap.get(clean) ?? (Number(item) || null);
        })
        .filter((id: unknown): id is number | string => id !== null && id !== undefined && !Number.isNaN(id));

      payload.turmas_id = turmas_ids;
      delete payload.turmas;
      break;
    }

    case "servidores": {
      // 1. Mapeia o cargo/perfil para perfil_id
      if (payload.cargo) {
        payload.perfil_id = PERFIS_MAP[payload.cargo] || payload.perfil_id || 4;
      }

      // 2. Trata funções (Equipe Pedagógica / Servidor Geral): busca ID ou cria dinamicamente se for nova
      if (Array.isArray(payload.funcoes) && payload.funcoes.length > 0) {
        const funcoes_ids: (number | string)[] = [];
        for (const fItem of payload.funcoes) {
          const nomeLimpo = String(fItem).trim();
          if (!nomeLimpo) continue;

          const idExistente = funcoesMap.get(nomeLimpo.toLowerCase());
          if (idExistente !== undefined) {
            funcoes_ids.push(idExistente);
          } else {
            // Cria nova função no backend e recupera o ID gerado
            const novaFuncao = await funcoesService.create({ nome: nomeLimpo });
            if (novaFuncao?.id !== undefined) {
              funcoes_ids.push(novaFuncao.id);
              funcoesMap.set(nomeLimpo.toLowerCase(), novaFuncao.id);
            }
          }
        }
        payload.funcoes_ids = funcoes_ids;
      }

      // 3. Trata curso coordenado caso seja Coordenador de Curso
      if (payload.cursoCoord) {
        const cClean = String(payload.cursoCoord).toLowerCase().trim();
        payload.curso_id = cursosMap.get(cClean) ?? payload.curso_id ?? null;
      }

      // Remove propriedades temporárias da interface
      delete payload.cargo;
      delete payload.funcoes;
      delete payload.cursoCoord;
      delete payload.turmasLecionadas;
      break;
    }

    case "cursos": {
      // Busca o ID do usuário selecionado como coordenador
      if (payload.coordenador) {
        const nameClean = String(payload.coordenador).toLowerCase().trim();
        payload.coordenador_id = usuariosMap.get(nameClean) ?? payload.coordenador_id ?? null;
      }
      delete payload.coordenador;
      break;
    }

    case "disciplinas": {
      // Vincula a disciplina ao curso_id
      if (payload.curso) {
        const nameClean = String(payload.curso).toLowerCase().trim();
        payload.curso_id = cursosMap.get(nameClean) ?? payload.curso_id ?? null;
      }
      delete payload.curso;
      break;
    }

    case "turmas": {
      // Vincula a turma ao curso_id
      if (payload.curso) {
        const nameClean = String(payload.curso).toLowerCase().trim();
        payload.curso_id = cursosMap.get(nameClean) ?? payload.curso_id ?? null;
      }

      // Remove o campo de contagem de alunos para não sobrescrever o cálculo automático do banco
      delete payload.alunos;
      delete payload.alunos_qtd;
      delete payload.curso;
      break;
    }

    case "diarios": {
      // Vincula o diário a disciplina_id, turma_id e professor_id
      if (payload.disciplina) {
        const dClean = String(payload.disciplina).toLowerCase().trim();
        payload.disciplina_id = disciplinasMap.get(dClean) ?? payload.disciplina_id ?? null;
      }
      if (payload.turma) {
        const tClean = String(payload.turma).toLowerCase().trim();
        payload.turma_id = turmasMap.get(tClean) ?? payload.turma_id ?? null;
      }
      if (payload.professor) {
        const pClean = String(payload.professor).toLowerCase().trim();
        const profId = usuariosMap.get(pClean) ?? null;
        payload.professor_id = profId;
        payload.professor_usuario_id = profId;
      }

      delete payload.disciplina;
      delete payload.turma;
      delete payload.professor;
      break;
    }
  }

  // Envia o payload devidamente formatado para a API
  const service = entityServices[category];
  if (modalMode === "create") {
    return await service.create(payload);
  } else if (modalMode === "edit" && editingId !== undefined && editingId !== null) {
    return await service.update(editingId, payload);
  }
}