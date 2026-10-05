-- =====================================================================
-- SIGEP — Sistema de Gestão e Estratégia Pedagógica
-- Script de criação do banco de dados (MySQL 8.0.16+)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS sigep
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE sigep;

-- =====================================================================
-- 1. TABELAS DE APOIO
-- =====================================================================

CREATE TABLE perfis (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_perfis_nome (nome)
);

CREATE TABLE funcoes (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_funcoes_nome (nome)
);

CREATE TABLE periodos (
  id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ano      CHAR(4)      NOT NULL,
  semestre CHAR(1)      NOT NULL,
  ativo    BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE KEY uq_periodos_ano_semestre (ano, semestre),
  CONSTRAINT ck_periodos_semestre CHECK (semestre IN ('1', '2'))
);

-- =====================================================================
-- 2. CADASTROS INSTITUCIONAIS
-- =====================================================================

-- Usuários / Servidores (docentes, coordenadores, equipe pedagógica/NAE...)
CREATE TABLE usuarios (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  siape     VARCHAR(20)  NOT NULL,
  nome      VARCHAR(150) NOT NULL,
  email     VARCHAR(150) NOT NULL,
  -- Hash bcrypt. NULL = conta criada sem senha (definida via "Esqueci minha senha").
  senha     VARCHAR(255) NULL,
  perfil_id INT UNSIGNED NOT NULL,
  curso_id  INT UNSIGNED NULL,
  criado_em TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_siape (siape),
  UNIQUE KEY uq_usuarios_email (email),
  CONSTRAINT fk_usuarios_perfil FOREIGN KEY (perfil_id) REFERENCES perfis (id)
);

CREATE TABLE cursos (
  id             INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(20)      NOT NULL,
  nome           VARCHAR(150)     NOT NULL,
  tipo           VARCHAR(50)      NULL,
  grau           VARCHAR(50)      NULL,
  modalidade     VARCHAR(50)      NULL,
  ppc            VARCHAR(40)      NULL,
  fases          TINYINT UNSIGNED NULL,
  coordenador_id INT UNSIGNED     NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cursos_codigo (codigo),
  UNIQUE KEY uq_cursos_nome (nome),
  CONSTRAINT fk_cursos_coordenador FOREIGN KEY (coordenador_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- usuarios e cursos se referenciam mutuamente, por isso esta FK vem depois
ALTER TABLE usuarios
  ADD CONSTRAINT fk_usuarios_curso FOREIGN KEY (curso_id) REFERENCES cursos (id) ON DELETE SET NULL;

CREATE TABLE disciplinas (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo        VARCHAR(20)  NOT NULL,
  sigla         VARCHAR(20)  NULL,
  nome          VARCHAR(150) NOT NULL,
  carga_horaria VARCHAR(10)  NULL,
  fase_oferta   VARCHAR(20)  NULL,
  curso_id      INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_disciplinas_codigo (codigo),
  UNIQUE KEY uq_disciplinas_curso_nome (curso_id, nome),
  CONSTRAINT fk_disciplinas_curso FOREIGN KEY (curso_id) REFERENCES cursos (id)
);

CREATE TABLE turmas (
  id         INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  nome       VARCHAR(100)      NOT NULL,
  curso_id   INT UNSIGNED      NOT NULL,
  periodo_id INT UNSIGNED      NOT NULL,
  alunos_qtd SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_turmas_nome_periodo (nome, periodo_id),
  CONSTRAINT fk_turmas_curso   FOREIGN KEY (curso_id)   REFERENCES cursos (id),
  CONSTRAINT fk_turmas_periodo FOREIGN KEY (periodo_id) REFERENCES periodos (id)
);

CREATE TABLE alunos (
  id        INT UNSIGNED             NOT NULL AUTO_INCREMENT,
  matricula VARCHAR(20)              NOT NULL,
  nome      VARCHAR(150)             NOT NULL,
  email     VARCHAR(150)             NULL,
  status    ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
  PRIMARY KEY (id),
  UNIQUE KEY uq_alunos_matricula (matricula)
);

-- Vínculo aluno x turma (as "turmas" de cada aluno no frontend)
CREATE TABLE matriculas (
  id       INT UNSIGNED             NOT NULL AUTO_INCREMENT,
  aluno_id INT UNSIGNED             NOT NULL,
  turma_id INT UNSIGNED             NOT NULL,
  status   ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
  PRIMARY KEY (id),
  UNIQUE KEY uq_matriculas_aluno_turma (aluno_id, turma_id),
  CONSTRAINT fk_matriculas_aluno FOREIGN KEY (aluno_id) REFERENCES alunos (id) ON DELETE CASCADE,
  CONSTRAINT fk_matriculas_turma FOREIGN KEY (turma_id) REFERENCES turmas (id) ON DELETE CASCADE
);

-- Diários de classe (disciplina x turma x professor)
CREATE TABLE diarios (
  id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  codigo          VARCHAR(30)       NOT NULL,
  disciplina_id   INT UNSIGNED      NOT NULL,
  turma_id        INT UNSIGNED      NOT NULL,
  professor_id    INT UNSIGNED      NULL,
  carga_horaria   VARCHAR(10)       NULL,
  aulas_previstas SMALLINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_diarios_codigo (codigo),
  CONSTRAINT fk_diarios_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas (id),
  CONSTRAINT fk_diarios_turma      FOREIGN KEY (turma_id)      REFERENCES turmas (id),
  CONSTRAINT fk_diarios_professor  FOREIGN KEY (professor_id)  REFERENCES usuarios (id) ON DELETE SET NULL
);

-- Notas e frequência do aluno em cada diário (Dashboard e Avaliação Discente do conselho)
CREATE TABLE notas_frequencias (
  id                      INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  matricula_id            INT UNSIGNED      NOT NULL,
  diario_id               INT UNSIGNED      NOT NULL,
  media                   DECIMAL(4, 2)     NULL,
  infrequencia            DECIMAL(5, 2)     NULL,
  presencas               SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  faltas_justificadas     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  faltas_nao_justificadas SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_notas_matricula_diario (matricula_id, diario_id),
  CONSTRAINT fk_notas_matricula FOREIGN KEY (matricula_id) REFERENCES matriculas (id) ON DELETE CASCADE,
  CONSTRAINT fk_notas_diario    FOREIGN KEY (diario_id)    REFERENCES diarios (id)    ON DELETE CASCADE,
  CONSTRAINT ck_notas_media        CHECK (media BETWEEN 0 AND 10),
  CONSTRAINT ck_notas_infrequencia CHECK (infrequencia BETWEEN 0 AND 100)
);

CREATE TABLE usuarios_funcoes (
  usuario_id INT UNSIGNED NOT NULL,
  funcao_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (usuario_id, funcao_id),
  CONSTRAINT fk_usuarios_funcoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_usuarios_funcoes_funcao  FOREIGN KEY (funcao_id)  REFERENCES funcoes (id)  ON DELETE CASCADE
);

CREATE TABLE usuarios_disciplinas (
  usuario_id    INT UNSIGNED NOT NULL,
  disciplina_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (usuario_id, disciplina_id),
  CONSTRAINT fk_usuarios_disciplinas_usuario    FOREIGN KEY (usuario_id)    REFERENCES usuarios (id)    ON DELETE CASCADE,
  CONSTRAINT fk_usuarios_disciplinas_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas (id) ON DELETE CASCADE
);

-- =====================================================================
-- 3. CONSELHOS DE CLASSE
-- =====================================================================

CREATE TABLE conselhos_lista (
  id                 INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nome               VARCHAR(255)     NOT NULL,
  -- 1 = Intermediário, 2 = Final
  tipo               TINYINT UNSIGNED NOT NULL,
  status             ENUM('agendado', 'em_andamento', 'encerrado') NOT NULL DEFAULT 'agendado',
  -- Conselho intermediário a partir do qual este conselho final foi agendado
  conselho_origem_id INT UNSIGNED     NULL,
  data_criacao       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_realizacao    DATETIME         NULL,
  PRIMARY KEY (id),
  KEY idx_conselhos_tipo_status (tipo, status),
  CONSTRAINT ck_conselhos_tipo CHECK (tipo IN (1, 2)),
  CONSTRAINT fk_conselhos_origem FOREIGN KEY (conselho_origem_id) REFERENCES conselhos_lista (id) ON DELETE SET NULL
);

-- Turmas relacionadas ao conselho
CREATE TABLE conselhos_turmas (
  conselho_id INT UNSIGNED NOT NULL,
  turma_id    INT UNSIGNED NOT NULL,
  PRIMARY KEY (conselho_id, turma_id),
  CONSTRAINT fk_conselhos_turmas_conselho FOREIGN KEY (conselho_id) REFERENCES conselhos_lista (id) ON DELETE CASCADE,
  CONSTRAINT fk_conselhos_turmas_turma    FOREIGN KEY (turma_id)    REFERENCES turmas (id)
);

-- Servidores relacionados ao conselho (participantes)
CREATE TABLE conselhos_servidores (
  conselho_id INT UNSIGNED NOT NULL,
  usuario_id  INT UNSIGNED NOT NULL,
  -- Lista de presença do conselho final. NULL = ainda não registrada.
  presente    BOOLEAN      NULL,
  PRIMARY KEY (conselho_id, usuario_id),
  CONSTRAINT fk_conselhos_servidores_conselho FOREIGN KEY (conselho_id) REFERENCES conselhos_lista (id) ON DELETE CASCADE,
  CONSTRAINT fk_conselhos_servidores_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios (id)
);

-- Demandas gerais: um formulário por turma do conselho
CREATE TABLE conselhos_demandas (
  id                     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conselho_id            INT UNSIGNED NOT NULL,
  turma_id               INT UNSIGNED NOT NULL,
  aluno_representante_id INT UNSIGNED NULL,
  sintese_diagnostico    TEXT         NULL,
  pontos_positivos       JSON         NOT NULL DEFAULT (JSON_ARRAY()),
  dificuldades_apontadas JSON         NOT NULL DEFAULT (JSON_ARRAY()),
  registros_observacoes  TEXT         NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_conselhos_demandas_conselho_turma (conselho_id, turma_id),
  -- Garante que a turma faz parte do conselho
  CONSTRAINT fk_conselhos_demandas_conselho_turma FOREIGN KEY (conselho_id, turma_id)
    REFERENCES conselhos_turmas (conselho_id, turma_id) ON DELETE CASCADE,
  CONSTRAINT fk_conselhos_demandas_representante FOREIGN KEY (aluno_representante_id)
    REFERENCES alunos (id) ON DELETE SET NULL,
  CONSTRAINT ck_conselhos_demandas_pontos       CHECK (JSON_TYPE(pontos_positivos) = 'ARRAY'),
  CONSTRAINT ck_conselhos_demandas_dificuldades CHECK (JSON_TYPE(dificuldades_apontadas) = 'ARRAY')
);

CREATE TABLE conselhos_demandas_gerais (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conselho_demanda_id INT UNSIGNED NOT NULL,
  situacao            TEXT         NOT NULL,
  gravidade           ENUM('nao-urgente', 'urgente', 'critica') NOT NULL DEFAULT 'nao-urgente',
  PRIMARY KEY (id),
  CONSTRAINT fk_conselhos_demandas_gerais_demanda FOREIGN KEY (conselho_demanda_id)
    REFERENCES conselhos_demandas (id) ON DELETE CASCADE
);

-- =====================================================================
-- 4. ENCAMINHAMENTOS
-- =====================================================================

CREATE TABLE encaminhamentos (
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  aluno_id                INT UNSIGNED NOT NULL,
  -- Preenchido automaticamente a partir do aluno (trigger)
  turma_id                INT UNSIGNED NOT NULL,
  -- Conselho em que o encaminhamento foi criado, se houver
  conselho_id             INT UNSIGNED NULL,
  titulo                  VARCHAR(255) NOT NULL,
  -- Lista pré-definida no frontend
  categoria               VARCHAR(80)  NOT NULL,
  -- Ex.: Conselho Intermediário, Painel de Risco, Atendimento NAE
  origem                  VARCHAR(80)  NULL,
  servidor_responsavel_id INT UNSIGNED NULL,
  descricao_inicial       TEXT         NULL,
  status                  ENUM('pendente', 'em-andamento', 'finalizado') NOT NULL DEFAULT 'pendente',
  urgente                 BOOLEAN      NOT NULL DEFAULT FALSE,
  prazo                   DATE         NULL,
  data_criacao            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_encaminhamentos_status (status),
  CONSTRAINT fk_encaminhamentos_aluno       FOREIGN KEY (aluno_id)                REFERENCES alunos (id),
  CONSTRAINT fk_encaminhamentos_turma       FOREIGN KEY (turma_id)                REFERENCES turmas (id),
  CONSTRAINT fk_encaminhamentos_conselho    FOREIGN KEY (conselho_id)             REFERENCES conselhos_lista (id) ON DELETE SET NULL,
  CONSTRAINT fk_encaminhamentos_responsavel FOREIGN KEY (servidor_responsavel_id) REFERENCES usuarios (id)        ON DELETE SET NULL
);

-- Linha do tempo do encaminhamento (criação, triagem, relatos e parecer de conclusão)
CREATE TABLE encaminhamentos_acompanhamento (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  encaminhamento_id INT UNSIGNED NOT NULL,
  -- NULL = registro gerado pelo sistema
  autor_id          INT UNSIGNED NULL,
  tipo              ENUM('criacao', 'triagem', 'relato', 'conclusao') NOT NULL DEFAULT 'relato',
  relato            TEXT         NOT NULL,
  data_registro     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_acompanhamento_encaminhamento_data (encaminhamento_id, data_registro),
  CONSTRAINT fk_acompanhamento_encaminhamento FOREIGN KEY (encaminhamento_id) REFERENCES encaminhamentos (id) ON DELETE CASCADE,
  CONSTRAINT fk_acompanhamento_autor          FOREIGN KEY (autor_id)          REFERENCES usuarios (id)        ON DELETE SET NULL
);

-- =====================================================================
-- 5. REGISTROS DOCENTES E DELIBERAÇÕES DO CONSELHO
-- =====================================================================

CREATE TABLE registros_docentes (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conselho_id       INT UNSIGNED NOT NULL,
  aluno_id          INT UNSIGNED NOT NULL,
  docente_id        INT UNSIGNED NOT NULL,
  data_registro     DATE         NOT NULL DEFAULT (CURRENT_DATE),
  -- Preenchido automaticamente a partir do aluno (trigger)
  turma_id          INT UNSIGNED NOT NULL,
  titulo            VARCHAR(255) NOT NULL,
  -- Lista pré-definida no frontend
  categoria         VARCHAR(80)  NOT NULL,
  registro          TEXT         NOT NULL,
  -- Encaminhamento novo ou existente vinculado ao registro
  encaminhamento_id INT UNSIGNED NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_registros_docentes_conselho       FOREIGN KEY (conselho_id)       REFERENCES conselhos_lista (id) ON DELETE CASCADE,
  CONSTRAINT fk_registros_docentes_aluno          FOREIGN KEY (aluno_id)          REFERENCES alunos (id),
  CONSTRAINT fk_registros_docentes_docente        FOREIGN KEY (docente_id)        REFERENCES usuarios (id),
  CONSTRAINT fk_registros_docentes_turma          FOREIGN KEY (turma_id)          REFERENCES turmas (id),
  CONSTRAINT fk_registros_docentes_encaminhamento FOREIGN KEY (encaminhamento_id) REFERENCES encaminhamentos (id) ON DELETE SET NULL
);

CREATE TABLE conselhos_deliberacoes (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conselho_id           INT UNSIGNED NOT NULL,
  aluno_id              INT UNSIGNED NOT NULL,
  -- Preenchido automaticamente a partir do aluno (trigger)
  turma_id              INT UNSIGNED NOT NULL,
  alteracoes_realizadas TEXT         NOT NULL,
  data_registro         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_conselhos_deliberacoes_conselho_aluno (conselho_id, aluno_id),
  CONSTRAINT fk_conselhos_deliberacoes_conselho FOREIGN KEY (conselho_id) REFERENCES conselhos_lista (id) ON DELETE CASCADE,
  CONSTRAINT fk_conselhos_deliberacoes_aluno    FOREIGN KEY (aluno_id)    REFERENCES alunos (id),
  CONSTRAINT fk_conselhos_deliberacoes_turma    FOREIGN KEY (turma_id)    REFERENCES turmas (id)
);

-- =====================================================================
-- 6. ATENDIMENTOS (NAE)
-- =====================================================================

CREATE TABLE atendimentos (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  aluno_id         INT UNSIGNED NOT NULL,
  -- Preenchido automaticamente a partir do aluno (trigger)
  turma_id         INT UNSIGNED NOT NULL,
  servidor_id      INT UNSIGNED NULL,
  data_atendimento DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Listas pré-definidas no frontend
  motivo           VARCHAR(80)  NOT NULL,
  forma_contato    VARCHAR(80)  NULL,
  relato           TEXT         NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_atendimentos_aluno    FOREIGN KEY (aluno_id)    REFERENCES alunos (id),
  CONSTRAINT fk_atendimentos_turma    FOREIGN KEY (turma_id)    REFERENCES turmas (id),
  CONSTRAINT fk_atendimentos_servidor FOREIGN KEY (servidor_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- =====================================================================
-- 7. AUDITORIA
-- =====================================================================

CREATE TABLE logs_auditoria (
  id_log           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id       INT UNSIGNED    NULL,
  acao             VARCHAR(20)     NOT NULL,
  tabela_afetada   VARCHAR(100)    NOT NULL,
  registro_id      VARCHAR(255)    NULL,
  dados_anteriores JSON            NULL,
  dados_novos      JSON            NULL,
  data_hora        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  endereco_ip      VARCHAR(45)     NULL,
  user_agent       VARCHAR(500)    NULL,
  PRIMARY KEY (id_log),
  CONSTRAINT fk_logs_auditoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- =====================================================================
-- 8. TURMA AUTOMÁTICA A PARTIR DO ALUNO
-- Quando turma_id não é informado, usa a turma do aluno, priorizando:
-- turma que faz parte do conselho > matrícula ativa > período mais recente.
-- Se o aluno não tiver matrícula, o INSERT falha (turma_id é NOT NULL).
-- =====================================================================

DELIMITER $$

CREATE FUNCTION fn_turma_do_aluno(p_aluno_id INT UNSIGNED, p_conselho_id INT UNSIGNED)
RETURNS INT UNSIGNED
READS SQL DATA
BEGIN
  RETURN (
    SELECT m.turma_id
    FROM matriculas m
    JOIN turmas t   ON t.id = m.turma_id
    JOIN periodos p ON p.id = t.periodo_id
    LEFT JOIN conselhos_turmas ct
           ON ct.turma_id = m.turma_id
          AND ct.conselho_id = p_conselho_id
    WHERE m.aluno_id = p_aluno_id
    ORDER BY ct.turma_id IS NULL, m.status = 'Ativo' DESC, p.ano DESC, p.semestre DESC, m.id DESC
    LIMIT 1
  );
END$$

CREATE TRIGGER trg_registros_docentes_bi BEFORE INSERT ON registros_docentes
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

CREATE TRIGGER trg_registros_docentes_bu BEFORE UPDATE ON registros_docentes
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

CREATE TRIGGER trg_conselhos_deliberacoes_bi BEFORE INSERT ON conselhos_deliberacoes
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

CREATE TRIGGER trg_conselhos_deliberacoes_bu BEFORE UPDATE ON conselhos_deliberacoes
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

CREATE TRIGGER trg_encaminhamentos_bi BEFORE INSERT ON encaminhamentos
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

CREATE TRIGGER trg_encaminhamentos_bu BEFORE UPDATE ON encaminhamentos
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

CREATE TRIGGER trg_atendimentos_bi BEFORE INSERT ON atendimentos
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NULL);
  END IF;
END$$

CREATE TRIGGER trg_atendimentos_bu BEFORE UPDATE ON atendimentos
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NULL);
  END IF;
END$$

DELIMITER ;

-- =====================================================================
-- 9. DADOS INICIAIS (server/data)
-- =====================================================================

INSERT INTO perfis (id, nome) VALUES
  (1, 'Professor'),
  (2, 'Coordenador de Curso'),
  (3, 'Equipe Pedagógica/NAE'),
  (4, 'Servidor Geral');

INSERT INTO funcoes (id, nome) VALUES
  -- Equipe Pedagógica / NAE
  (1,  'Pedagogo(a)'),
  (2,  'Psicólogo(a) Educacional'),
  (3,  'Assistente Social'),
  (4,  'Tradutor(a) e Intérprete de LIBRAS'),
  (5,  'Orientador(a) Educacional'),
  (6,  'Técnico(a) em Assuntos Educacionais'),
  (7,  'Apoio ao Núcleo de Acessibilidade (NAPNE)'),
  -- Gestão e Coordenação
  (8,  'Coordenador(a) de Curso'),
  (9,  'Coordenador(a) de Ensino'),
  (10, 'Coordenador(a) de Pesquisa e Extensão'),
  (11, 'Coordenador(a) de Estágios'),
  (12, 'Coordenador(a) de Turno Matutino'),
  (13, 'Coordenador(a) de Turno Vespertino'),
  (14, 'Coordenador(a) de Turno Noturno'),
  -- Secretaria Acadêmica e Administração
  (15, 'Secretário(a) Acadêmico(a)'),
  (16, 'Assistente Administrativo'),
  (17, 'Apoio à Secretaria'),
  (18, 'Atendimento ao Estudante'),
  (19, 'Gestor(a) de Protocolo e Documentos'),
  -- Docência e Laboratórios
  (20, 'Professor(a) Regente'),
  (21, 'Professor(a) Orientador(a) de TCC'),
  (22, 'Técnico(a) de Laboratório'),
  (23, 'Responsável por Laboratório de Informática'),
  -- Suporte Geral e TI
  (24, 'Suporte de TI e Infraestrutura'),
  (25, 'Administrador(a) de Sistemas'),
  (26, 'Apoio Operacional / Logística');

INSERT INTO periodos (id, ano, semestre, ativo) VALUES
  (1, '2025', '2', FALSE),
  (2, '2026', '1', FALSE),
  (3, '2026', '2', TRUE);

-- curso_id é preenchido após a inserção dos cursos (referência circular)
INSERT INTO usuarios (id, siape, nome, email, senha, perfil_id) VALUES
  (1, '1234567', 'Servidor Exemplo', 'servidor@ifsc.edu.br',    '$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy', 3),
  (2, '7654321', 'Carlos Lima',      'professor@ifsc.edu.br',   '$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy', 1),
  (3, '9876543', 'Maria Santos',     'coordenador@ifsc.edu.br', '$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy', 2),
  (4, '2342342', 'Joao Pedro',       'joao.pedro@ifsc.edu.br',  NULL,                                                           4);

INSERT INTO cursos (id, codigo, nome, tipo, grau, modalidade, ppc, fases, coordenador_id) VALUES
  (1, 'TDS', 'Técnico em Desenvolvimento de Sistemas', 'Técnico',  'Integrado ao EM', 'Presencial', 'PPC 2023', 3,  3),
  (2, 'MEC', 'Técnico em Mecatrônica',                 'Técnico',  'Subsequente',     'Presencial', 'PPC 2023', 4,  NULL),
  (3, 'ADM', 'Técnico em Administração',               'Técnico',  'Integrado ao EM', 'Presencial', 'PPC 2025', 2,  NULL),
  (4, 'ENF', 'Técnico em Enfermagem',                  'Técnico',  'Concomitante',    'Presencial', 'PPC 2025', 6,  NULL),
  (5, 'CCP', 'Ciência da Computação',                  'Superior', 'Bacharelado',     'EAD',        'PPC 2023', 8,  NULL),
  (6, 'ENM', 'Engenharia Mecânica',                    'Superior', 'Bacharelado',     'Presencial', 'PPC 2023', 10, NULL);

UPDATE usuarios SET curso_id = 1 WHERE id IN (1, 3);

INSERT INTO disciplinas (id, codigo, sigla, nome, carga_horaria, fase_oferta, curso_id) VALUES
  (1,  '101', 'ALG',  'Algoritmos e Programação', '80h', '1ª Fase', 1),
  (2,  '102', 'BD',   'Banco de Dados',           '60h', '2ª Fase', 1),
  (3,  '103', 'PW',   'Programação Web',          '80h', '2ª Fase', 1),
  (4,  '104', 'ED',   'Estrutura de Dados',       '80h', '3ª Fase', 1),
  (5,  '105', 'SO',   'Sistemas Operacionais',    '72h', '4ª Fase', 1),
  (6,  '106', 'ES',   'Engenharia de Software',   '72h', '4ª Fase', 1),
  (7,  '107', 'ING',  'Inglês Técnico',           '40h', '1ª Fase', 1),
  (8,  '108', 'ELE',  'Eletrônica Digital',       '72h', '3ª Fase', 2),
  (9,  '109', 'MAT',  'Matemática Aplicada',      '60h', '2ª Fase', 2),
  (10, '110', 'HID',  'Hidráulica e Pneumática',  '60h', '3ª Fase', 2),
  (11, '111', 'GES',  'Gestão Empresarial',       '60h', '1ª Fase', 3),
  (12, '112', 'CONT', 'Contabilidade Básica',     '60h', '2ª Fase', 3);

INSERT INTO usuarios_funcoes (usuario_id, funcao_id) VALUES
  (1, 1);

INSERT INTO usuarios_disciplinas (usuario_id, disciplina_id) VALUES
  (1, 1),
  (2, 1),
  (2, 2);

INSERT INTO turmas (id, nome, curso_id, periodo_id, alunos_qtd) VALUES
  (1, 'TDS - 1ª Fase',           1, 2, 28),
  (2, 'TDS - 2ª Fase',           1, 2, 25),
  (3, 'TDS - 3ª Fase',           1, 2, 22),
  (4, 'Mecatrônica - 2ª Fase',   2, 2, 20),
  (5, 'Mecatrônica - 4ª Fase',   2, 2, 18),
  (6, 'Administração - 1ª Fase', 3, 2, 24);

INSERT INTO alunos (id, matricula, nome, email, status) VALUES
  (1,  '202110806528', 'João Pedro Silva',       'joao.silva@aluno.ifsc.edu.br',      'Ativo'),
  (2,  '202210809911', 'Maria Eduarda Oliveira', 'maria.oliveira@aluno.ifsc.edu.br',  'Ativo'),
  (3,  '202310804422', 'Carlos Henrique Souza',  'carlos.souza@aluno.ifsc.edu.br',    'Ativo'),
  (4,  '202110801345', 'Ana Beatriz Ferreira',   'ana.ferreira@aluno.ifsc.edu.br',    'Ativo'),
  (5,  '202210812788', 'Lucas Mendes Costa',     'lucas.costa@aluno.ifsc.edu.br',     'Inativo'),
  (6,  '202310807654', 'Fernanda Costa Lima',    'fernanda.lima@aluno.ifsc.edu.br',   'Ativo'),
  (7,  '202110811234', 'Rafael Augusto Neves',   'rafael.neves@aluno.ifsc.edu.br',    'Ativo'),
  (8,  '202210803321', 'Isabela Rocha Martins',  'isabela.martins@aluno.ifsc.edu.br', 'Ativo'),
  (9,  '202310809876', 'Thiago Alves Pereira',   'thiago.pereira@aluno.ifsc.edu.br',  'Ativo'),
  (10, '202110814499', 'Camila Dias Santos',     'camila.santos@aluno.ifsc.edu.br',   'Inativo');

INSERT INTO matriculas (id, aluno_id, turma_id, status) VALUES
  -- server/data/matriculas.js
  (1,  1,  2, 'Ativo'),
  (2,  2,  1, 'Ativo'),
  (3,  3,  5, 'Ativo'),
  (4,  4,  3, 'Ativo'),
  (5,  5,  4, 'Ativo'),
  (6,  6,  6, 'Ativo'),
  -- server/data/alunos.js (turmas_id)
  (7,  1,  1, 'Ativo'),
  (8,  2,  6, 'Ativo'),
  (9,  3,  3, 'Ativo'),
  (10, 4,  2, 'Ativo'),
  (11, 5,  2, 'Inativo'),
  (12, 6,  3, 'Ativo'),
  (13, 7,  4, 'Ativo'),
  (14, 8,  5, 'Ativo'),
  (15, 9,  4, 'Ativo'),
  (16, 10, 1, 'Inativo');

INSERT INTO diarios (id, codigo, disciplina_id, turma_id, professor_id, carga_horaria, aulas_previstas) VALUES
  (1, 'DIR-2026-01', 1,  2, 2, '60h', 72),
  (2, 'DIR-2026-02', 3,  2, 2, '80h', 96),
  (3, 'DIR-2026-03', 4,  2, 2, '80h', 96),
  (4, 'DIR-2026-04', 9,  2, 3, '60h', 72),
  (5, 'DIR-2026-05', 8,  2, 3, '72h', 86),
  (6, 'DIR-2026-06', 11, 3, 2, '60h', 72),
  (7, 'DIR-2026-07', 7,  2, 2, '40h', 48),
  (8, 'DIR-2026-08', 5,  2, 2, '72h', 86),
  (9, 'DIR-2026-09', 10, 2, 3, '60h', 72);

INSERT INTO notas_frequencias (id, matricula_id, diario_id, media, infrequencia) VALUES
  (1, 1, 1, 5.2, 12),
  (2, 2, 2, 7.5, 28),
  (3, 3, 1, 4.8, 26),
  (4, 4, 2, 5.8, 18),
  (5, 5, 1, 4.1, 31),
  (6, 6, 2, 6.9, 22);
