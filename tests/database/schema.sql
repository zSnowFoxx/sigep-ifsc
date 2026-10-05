-- =====================================================================
-- SIGEP — Sistema de Gestão e Estratégia Pedagógica
-- Script de criação do banco de dados (MySQL 8.0.16+)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS sigep
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE sigep;

-- =====================================================================
-- 1. TABELAS DE APOIO
-- =====================================================================

CREATE TABLE IF NOT EXISTS perfis (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_perfis_nome (nome)
);

CREATE TABLE IF NOT EXISTS funcoes (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_funcoes_nome (nome)
);

CREATE TABLE IF NOT EXISTS periodos (
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
CREATE TABLE IF NOT EXISTS usuarios (
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

CREATE TABLE IF NOT EXISTS cursos (
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
ALTER TABLE usuarios DROP FOREIGN KEY IF EXISTS fk_usuarios_curso;
ALTER TABLE usuarios
  ADD CONSTRAINT fk_usuarios_curso FOREIGN KEY (curso_id) REFERENCES cursos (id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS disciplinas (
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

CREATE TABLE IF NOT EXISTS turmas (
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

CREATE TABLE IF NOT EXISTS alunos (
  id        INT UNSIGNED             NOT NULL AUTO_INCREMENT,
  matricula VARCHAR(20)              NOT NULL,
  nome      VARCHAR(150)             NOT NULL,
  email     VARCHAR(150)             NULL,
  status    ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
  PRIMARY KEY (id),
  UNIQUE KEY uq_alunos_matricula (matricula)
);

-- Vínculo aluno x turma (as "turmas" de cada aluno no frontend)
CREATE TABLE IF NOT EXISTS matriculas (
  id       INT UNSIGNED             NOT NULL AUTO_INCREMENT,
  aluno_id INT UNSIGNED             NOT NULL,
  turma_id INT UNSIGNED             NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_matriculas_aluno_turma (aluno_id, turma_id),
  CONSTRAINT fk_matriculas_aluno FOREIGN KEY (aluno_id) REFERENCES alunos (id) ON DELETE CASCADE,
  CONSTRAINT fk_matriculas_turma FOREIGN KEY (turma_id) REFERENCES turmas (id) ON DELETE CASCADE
);

-- Diários de classe (disciplina x turma x professor)
CREATE TABLE IF NOT EXISTS diarios (
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
CREATE TABLE IF NOT EXISTS notas_frequencias (
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

CREATE TABLE IF NOT EXISTS usuarios_funcoes (
  usuario_id INT UNSIGNED NOT NULL,
  funcao_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (usuario_id, funcao_id),
  CONSTRAINT fk_usuarios_funcoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_usuarios_funcoes_funcao  FOREIGN KEY (funcao_id)  REFERENCES funcoes (id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuarios_disciplinas (
  usuario_id    INT UNSIGNED NOT NULL,
  disciplina_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (usuario_id, disciplina_id),
  CONSTRAINT fk_usuarios_disciplinas_usuario    FOREIGN KEY (usuario_id)    REFERENCES usuarios (id)    ON DELETE CASCADE,
  CONSTRAINT fk_usuarios_disciplinas_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas (id) ON DELETE CASCADE
);

-- =====================================================================
-- 3. CONSELHOS DE CLASSE
-- =====================================================================

CREATE TABLE IF NOT EXISTS conselhos_lista (
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
CREATE TABLE IF NOT EXISTS conselhos_turmas (
  conselho_id INT UNSIGNED NOT NULL,
  turma_id    INT UNSIGNED NOT NULL,
  PRIMARY KEY (conselho_id, turma_id),
  CONSTRAINT fk_conselhos_turmas_conselho FOREIGN KEY (conselho_id) REFERENCES conselhos_lista (id) ON DELETE CASCADE,
  CONSTRAINT fk_conselhos_turmas_turma    FOREIGN KEY (turma_id)    REFERENCES turmas (id)
);

-- Servidores relacionados ao conselho (participantes)
CREATE TABLE IF NOT EXISTS conselhos_servidores (
  conselho_id INT UNSIGNED NOT NULL,
  usuario_id  INT UNSIGNED NOT NULL,
  -- Lista de presença do conselho final. NULL = ainda não registrada.
  presente    BOOLEAN      NULL,
  PRIMARY KEY (conselho_id, usuario_id),
  CONSTRAINT fk_conselhos_servidores_conselho FOREIGN KEY (conselho_id) REFERENCES conselhos_lista (id) ON DELETE CASCADE,
  CONSTRAINT fk_conselhos_servidores_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios (id)
);

-- Demandas gerais: um formulário por turma do conselho
CREATE TABLE IF NOT EXISTS conselhos_demandas (
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

CREATE TABLE IF NOT EXISTS conselhos_demandas_gerais (
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

CREATE TABLE IF NOT EXISTS encaminhamentos (
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
CREATE TABLE IF NOT EXISTS encaminhamentos_acompanhamento (
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

CREATE TABLE IF NOT EXISTS registros_docentes (
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

CREATE TABLE IF NOT EXISTS conselhos_deliberacoes (
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

CREATE TABLE IF NOT EXISTS atendimentos (
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

CREATE TABLE IF NOT EXISTS logs_auditoria (
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
-- 8.1. TRIGGERS - TURMA AUTOMÁTICA A PARTIR DO ALUNO
-- Quando turma_id não é informado, usa a turma do aluno, priorizando:
-- turma que faz parte do conselho > matrícula ativa > período mais recente.
-- Se o aluno não tiver matrícula, o INSERT falha (turma_id é NOT NULL).
-- =====================================================================

DROP FUNCTION IF EXISTS fn_turma_do_aluno;
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

DROP TRIGGER IF EXISTS trg_registros_docentes_bi$$

CREATE TRIGGER trg_registros_docentes_bi BEFORE INSERT ON registros_docentes
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_registros_docentes_bu$$

CREATE TRIGGER trg_registros_docentes_bu BEFORE UPDATE ON registros_docentes
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_conselhos_deliberacoes_bi$$

CREATE TRIGGER trg_conselhos_deliberacoes_bi BEFORE INSERT ON conselhos_deliberacoes
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_conselhos_deliberacoes_bu$$

CREATE TRIGGER trg_conselhos_deliberacoes_bu BEFORE UPDATE ON conselhos_deliberacoes
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_encaminhamentos_bi$$

CREATE TRIGGER trg_encaminhamentos_bi BEFORE INSERT ON encaminhamentos
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_encaminhamentos_bu$$

CREATE TRIGGER trg_encaminhamentos_bu BEFORE UPDATE ON encaminhamentos
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NEW.conselho_id);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_atendimentos_bi$$

CREATE TRIGGER trg_atendimentos_bi BEFORE INSERT ON atendimentos
FOR EACH ROW
BEGIN
  IF NEW.turma_id IS NULL THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NULL);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_atendimentos_bu$$

CREATE TRIGGER trg_atendimentos_bu BEFORE UPDATE ON atendimentos
FOR EACH ROW
BEGIN
  IF NEW.aluno_id <> OLD.aluno_id AND NEW.turma_id = OLD.turma_id THEN
    SET NEW.turma_id = fn_turma_do_aluno(NEW.aluno_id, NULL);
  END IF;
END$$

DELIMITER ;

-- ============================================================
-- 8.2. TRIGGERS - SINCRONIZAÇÃO ENTRE USUÁRIOS E CURSOS (MySQL)
-- ============================================================

DELIMITER $$

-- Trigger para alterações na tabela USUARIOS
DROP TRIGGER IF EXISTS trg_usuarios_curso_sync$$

CREATE TRIGGER trg_usuarios_curso_sync
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    -- Evita recursão infinita entre triggers usando variável de sessão
    IF @disable_sync IS NULL OR @disable_sync = FALSE THEN
        SET @disable_sync = TRUE;

        -- Verifica se o curso_id mudou (equivalente ao IS DISTINCT FROM)
        IF NOT (OLD.curso_id <=> NEW.curso_id) THEN
            -- Se o usuário perdeu ou alterou o curso, limpa a referência no curso antigo
            IF OLD.curso_id IS NOT NULL THEN
                UPDATE cursos 
                SET coordenador_id = NULL 
                WHERE id = OLD.curso_id AND coordenador_id = NEW.id;
            END IF;

            -- Se um novo curso foi atribuído ao usuário, atualiza a tabela de cursos
            IF NEW.curso_id IS NOT NULL THEN
                UPDATE cursos 
                SET coordenador_id = NEW.id 
                WHERE id = NEW.curso_id AND NOT (coordenador_id <=> NEW.id);
            END IF;
        END IF;

        SET @disable_sync = FALSE;
    END IF;
END$$


-- Trigger para alterações na tabela CURSOS
DROP TRIGGER IF EXISTS trg_cursos_coordenador_sync$$

CREATE TRIGGER trg_cursos_coordenador_sync
AFTER UPDATE ON cursos
FOR EACH ROW
BEGIN
    -- Evita recursão infinita entre triggers usando variável de sessão
    IF @disable_sync IS NULL OR @disable_sync = FALSE THEN
        SET @disable_sync = TRUE;

        -- Verifica se o coordenador_id mudou
        IF NOT (OLD.coordenador_id <=> NEW.coordenador_id) THEN
            -- Se o curso perdeu ou mudou de coordenador, limpa o curso_id do coordenador antigo
            IF OLD.coordenador_id IS NOT NULL THEN
                UPDATE usuarios 
                SET curso_id = NULL 
                WHERE id = OLD.coordenador_id AND curso_id = NEW.id;
            END IF;

            -- Se um novo coordenador foi atribuído ao curso, atualiza a tabela de usuários
            IF NEW.coordenador_id IS NOT NULL THEN
                UPDATE usuarios 
                SET curso_id = NEW.id 
                WHERE id = NEW.coordenador_id AND NOT (curso_id <=> NEW.id);
            END IF;
        END IF;

        SET @disable_sync = FALSE;
    END IF;
END$$

DELIMITER ;