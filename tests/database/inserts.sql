-- =====================================================================
-- SIGEP — Sistema de Gestão e Estratégia Pedagógica
-- Script de inserção de dados no banco de dados (MySQL 8.0.16+)
-- =====================================================================

INSERT IGNORE INTO periodos (id, ano, semestre, ativo) VALUES
  (1, '2025', '2', FALSE),
  (2, '2026', '1', FALSE),
  (3, '2026', '2', TRUE);

INSERT IGNORE INTO perfis (id, nome) VALUES
  (1, 'Professor'),
  (2, 'Coordenador de Curso'),
  (3, 'Equipe Pedagógica/NAE'),
  (4, 'Servidor Geral');

INSERT IGNORE INTO funcoes (id, nome) VALUES
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

-- curso_id é preenchido após a inserção dos cursos (referência circular)
-- inserção de usuários padrão para testes e desenvolvimento (senha = "teste")
INSERT IGNORE INTO usuarios (id, siape, nome, email, senha, perfil_id) VALUES
  (1, '1234567', 'Servidor Exemplo',    'servidor@ifsc.edu.br',    '$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy', 4),
  (2, '2222222', 'Professor Exemplo',   'professor@ifsc.edu.br',   '$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy', 1),
  (3, '4343434', 'Coordenador Exemplo', 'coordenador@ifsc.edu.br', '$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy', 2),
  (4, '7654321', 'Equipe Pedagógica',   'equipe@ifsc.edu.br',      '$2b$10$abcdefghijklmnopqrstuun5X9sI3N72casQ.UG9TGLnV1MAprdMy', 3),

  -- Coordenadores de curso
  (5,  '5555555', 'Coordenador TDS', 'coord.tds@ifsc.edu.br', NULL, 2),
  (6,  '6666666', 'Coordenador MEC', 'coord.mec@ifsc.edu.br', NULL, 2),
  (7,  '7777777', 'Coordenador ADM', 'coord.adm@ifsc.edu.br', NULL, 2),
  (8,  '8888888', 'Coordenador ENF', 'coord.enf@ifsc.edu.br', NULL, 2),
  (9,  '9999999', 'Coordenador CCP', 'coord.ccp@ifsc.edu.br', NULL, 2),

  -- Professores
  (10, '1010101', 'Carlos Silva',   'carlos.silva@ifsc.edu.br',   NULL, 1),
  (11, '1111111', 'Ana Souza',      'ana.souza@ifsc.edu.br',      NULL, 1),
  (12, '1212121', 'Roberto Santos', 'roberto.santos@ifsc.edu.br', NULL, 1),
  (13, '1313131', 'Juliana Lima',   'juliana.lima@ifsc.edu.br',   NULL, 1),

  -- Equipe Pedagógica / NAE
  (14, '1414141', 'Mariana Costa',    'mariana.costa@ifsc.edu.br',    NULL, 3),
  (15, '1515151', 'Fernanda Oliveira','fernanda.oliveira@ifsc.edu.br',NULL, 3),
  (16, '1616161', 'Lucas Martins',    'lucas.martins@ifsc.edu.br',    NULL, 3),
  (17, '1717171', 'Camila Rodrigues', 'camila.rodrigues@ifsc.edu.br', NULL, 3),

  -- Servidores Gerais
  (18, '1818181', 'Ricardo Alves',    'ricardo.alves@ifsc.edu.br',    NULL, 4);

INSERT IGNORE INTO cursos (id, codigo, nome, tipo, grau, modalidade, ppc, fases) VALUES
  (1, 'TDS', 'Técnico em Desenvolvimento de Sistemas', 'Técnico',  'Concomitante',    'Presencial', 'PPC 2023', 3),
  (2, 'MEC', 'Técnico em Mecatrônica',                 'Técnico',  'Subsequente',     'Presencial', 'PPC 2023', 4),
  (3, 'ADM', 'Administração',                          'Técnico',  'Subsequente',     'Presencial', 'PPC 2025', 2),
  (4, 'ENF', 'Técnico em Enfermagem',                  'Técnico',  'Concomitante',    'Presencial', 'PPC 2025', 6),
  (5, 'CCP', 'Ciência da Computação',                  'Superior', 'Bacharelado',     'EAD',        'PPC 2023', 8),
  (6, 'ENM', 'Engenharia Mecânica',                    'Superior', 'Bacharelado',     'Presencial', 'PPC 2023', 10);

-- Sincroniza automaticamente o curso_id dos coordenadores (trigger)
UPDATE usuarios SET curso_id = 1 WHERE id = 5;
UPDATE usuarios SET curso_id = 2 WHERE id = 6;
UPDATE usuarios SET curso_id = 3 WHERE id = 7;
UPDATE usuarios SET curso_id = 4 WHERE id = 8;
UPDATE usuarios SET curso_id = 5 WHERE id = 9;
UPDATE usuarios SET curso_id = 6 WHERE id = 3;

INSERT IGNORE INTO disciplinas (id, codigo, sigla, nome, carga_horaria, fase_oferta, curso_id) VALUES
  -- Curso 1: Técnico em Desenvolvimento de Sistemas (TDS) - 3 Fases
  (1,  '101', 'ALG',   'Algoritmos e Programação',          '80h', '1ª Fase', 1),
  (2,  '102', 'BD',    'Banco de Dados',                    '60h', '2ª Fase', 1),
  (3,  '103', 'PW',    'Programação Web',                   '80h', '2ª Fase', 1),
  (4,  '104', 'ED',    'Estrutura de Dados',                '80h', '3ª Fase', 1),
  (5,  '105', 'ES',    'Engenharia de Software',            '72h', '3ª Fase', 1),

  -- Curso 2: Técnico em Mecatrônica (MEC) - 4 Fases
  (6,  '106', 'ELE',   'Eletrônica Digital',                '72h', '1ª Fase', 2),
  (7,  '107', 'MAT',   'Matemática Aplicada',               '60h', '1ª Fase', 2),
  (8,  '108', 'HID',   'Hidráulica e Pneumática',           '60h', '2ª Fase', 2),
  (9,  '109', 'AUT',   'Automação Industrial',              '80h', '3ª Fase', 2),
  (10, '110', 'ROB',   'Robótica Industrial',               '72h', '4ª Fase', 2),

  -- Curso 3: Administração (ADM) - 2 Fases
  (11, '111', 'GES',   'Gestão Empresarial',                '60h', '1ª Fase', 3),
  (12, '112', 'CONT',  'Contabilidade Básica',              '60h', '1ª Fase', 3),
  (13, '113', 'MKT',   'Marketing e Vendas',                '60h', '1ª Fase', 3),
  (14, '114', 'RH',    'Gestão de Pessoas',                 '60h', '2ª Fase', 3),
  (15, '115', 'FIN',   'Administração Financeira',          '72h', '2ª Fase', 3),

  -- Curso 4: Técnico em Enfermagem (ENF) - 6 Fases
  (16, '116', 'ANA',   'Anatomia e Fisiologia Humana',      '80h', '1ª Fase', 4),
  (17, '117', 'MCR',   'Microbiologia e Parasitologia',     '60h', '2ª Fase', 4),
  (18, '118', 'FAR',   'Farmacologia Aplicada',             '60h', '3ª Fase', 4),
  (19, '119', 'ENFU',  'Enfermagem em Urgência e Emergência','80h', '4ª Fase', 4),
  (20, '120', 'UTI',   'Cuidados Intensivos em Enfermagem', '80h', '5ª Fase', 4),

  -- Curso 5: Ciência da Computação (CCP) - 8 Fases
  (21, '121', 'FPROG', 'Fundamentos de Programação',        '80h', '1ª Fase', 5),
  (22, '122', 'ALGLIN','Álgebra Linear',                    '60h', '2ª Fase', 5),
  (23, '123', 'SO',    'Sistemas Operacionais',             '72h', '3ª Fase', 5),
  (24, '124', 'IA',    'Inteligência Artificial',           '80h', '5ª Fase', 5),
  (25, '125', 'REDES', 'Redes de Computadores',             '72h', '6ª Fase', 5),

  -- Curso 6: Engenharia Mecânica (ENM) - 10 Fases
  (26, '126', 'DES',   'Desenho Técnico Mecânico',          '60h', '1ª Fase', 6),
  (27, '127', 'CALC',  'Cálculo Diferencial e Integral',    '80h', '2ª Fase', 6),
  (28, '128', 'MATER', 'Ciência dos Materiais',             '72h', '3ª Fase', 6),
  (29, '129', 'TERMO', 'Termodinâmica Aplicada',            '72h', '4ª Fase', 6),
  (30, '130', 'ELEM',  'Elementos de Máquinas',             '80h', '5ª Fase', 6);

INSERT IGNORE INTO usuarios_disciplinas (usuario_id, disciplina_id) VALUES
  -- Coordenador TDS (ID 5) -> 3 disciplinas
  (5, 1), -- Algoritmos e Programação
  (5, 2), -- Banco de Dados
  (5, 3), -- Programação Web

  -- Coordenador MEC (ID 6) -> 3 disciplinas
  (6, 6), -- Eletrônica Digital
  (6, 7), -- Matemática Aplicada
  (6, 8), -- Hidráulica e Pneumática

  -- Coordenador ADM (ID 7) -> 3 disciplinas
  (7, 11), -- Gestão Empresarial
  (7, 12), -- Contabilidade Básica
  (7, 13), -- Marketing e Vendas

  -- Coordenador ENF (ID 8) -> 3 disciplinas
  (8, 16), -- Anatomia e Fisiologia Humana
  (8, 17), -- Microbiologia e Parasitologia
  (8, 18), -- Farmacologia Aplicada

  -- Coordenador CCP (ID 9) -> 3 disciplinas
  (9, 21), -- Fundamentos de Programação
  (9, 22), -- Álgebra Linear
  (9, 23), -- Sistemas Operacionais

  -- Coordenador ENM (ID 3) -> 3 disciplinas
  (3, 26), -- Desenho Técnico Mecânico
  (3, 27), -- Cálculo Diferencial e Integral
  (3, 28), -- Ciência dos Materiais

  -- Prof. Carlos Silva (ID 10) -> 4 disciplinas (TDS e CCP)
  (10, 4),  -- Estrutura de Dados
  (10, 5),  -- Engenharia de Software
  (10, 24), -- Inteligência Artificial
  (10, 25), -- Redes de Computadores

  -- Prof. Ana Souza (ID 11) -> 4 disciplinas (MEC e ENM)
  (11, 9),  -- Automação Industrial
  (11, 10), -- Robótica Industrial
  (11, 29), -- Termodinâmica Aplicada
  (11, 30), -- Elementos de Máquinas

  -- Prof. Roberto Santos (ID 12) -> 2 disciplinas (ADM)
  (12, 14), -- Gestão de Pessoas
  (12, 15), -- Administração Financeira

  -- Prof.ª Juliana Lima (ID 13) -> 2 disciplinas (ENF)
  (13, 19), -- Enfermagem em Urgência e Emergência
  (13, 20);  -- Cuidados Intensivos em Enfermagem

INSERT IGNORE INTO usuarios_funcoes (usuario_id, funcao_id) VALUES
  -- ID 5: Coordenador TDS
  (5, 8),  -- Coordenador(a) de Curso
  (5, 23), -- Responsável por Laboratório de Informática

  -- ID 6: Coordenador MEC
  (6, 8),  -- Coordenador(a) de Curso
  (6, 11), -- Coordenador(a) de Estágios

  -- ID 7: Coordenador ADM
  (7, 8),  -- Coordenador(a) de Curso
  (7, 10), -- Coordenador(a) de Pesquisa e Extensão

  -- ID 8: Coordenador ENF
  (8, 8),  -- Coordenador(a) de Curso
  (8, 9),  -- Coordenador(a) de Ensino

  -- ID 9: Coordenador CCP
  (9, 8),  -- Coordenador(a) de Curso
  (9, 25), -- Administrador(a) de Sistemas

  -- ID 10: Carlos Silva
  (10, 20), -- Professor(a) Regente
  (10, 21), -- Professor(a) Orientador(a) de TCC

  -- ID 11: Ana Souza
  (11, 20), -- Professor(a) Regente
  (11, 22), -- Técnico(a) de Laboratório

  -- ID 12: Roberto Santos
  (12, 20), -- Professor(a) Regente

  -- ID 13: Juliana Lima
  (13, 20), -- Professor(a) Regente
  (13, 21), -- Professor(a) Orientador(a) de TCC

  -- ID 14: Mariana Costa
  (14, 1), -- Pedagogo(a)
  (14, 5), -- Orientador(a) Educacional

  -- ID 15: Fernanda Oliveira
  (15, 2), -- Psicólogo(a) Educacional

  -- ID 16: Lucas Martins
  (16, 3), -- Assistente Social
  (16, 7), -- Apoio ao Núcleo de Acessibilidade (NAPNE)

  -- ID 17: Camila Rodrigues
  (17, 4), -- Tradutor(a) e Intérprete de LIBRAS
  (17, 6), -- Técnico(a) em Assuntos Educacionais

  -- ID 18: Ricardo Alves
  (18, 24), -- Suporte de TI e Infraestrutura
  (18, 26);  -- Apoio Operacional / Logística

INSERT IGNORE INTO turmas (id, nome, curso_id, periodo_id, alunos_qtd) VALUES
  -- Curso 1: Técnico em Desenvolvimento de Sistemas (3 Fases)
  (1,  'TDS - 1ª Fase',                  1, 2, 20),
  (2,  'TDS - 2ª Fase',                  1, 2, 15),
  (3,  'TDS - 3ª Fase',                  1, 2, 12),

  -- Curso 2: Técnico em Mecatrônica (4 Fases)
  (4,  'Mecatrônica - 1ª Fase',          2, 2, 18),
  (5,  'Mecatrônica - 2ª Fase',          2, 2, 14),
  (6,  'Mecatrônica - 3ª Fase',          2, 2, 10),
  (7,  'Mecatrônica - 4ª Fase',          2, 2, 8),

  -- Curso 3: Administração (2 Fases)
  (8,  'Administração - 1ª Fase',        3, 2, 22),
  (9,  'Administração - 2ª Fase',        3, 2, 16),

  -- Curso 4: Técnico em Enfermagem (6 Fases)
  (10, 'Enfermagem - 1ª Fase',           4, 2, 21),
  (11, 'Enfermagem - 2ª Fase',           4, 2, 18),
  (12, 'Enfermagem - 3ª Fase',           4, 2, 15),
  (13, 'Enfermagem - 4ª Fase',           4, 2, 12),
  (14, 'Enfermagem - 5ª Fase',           4, 2, 9),
  (15, 'Enfermagem - 6ª Fase',           4, 2, 7),

  -- Curso 5: Ciência da Computação (8 Fases)
  (16, 'Ciência da Computação - 1ª Fase', 5, 2, 22),
  (17, 'Ciência da Computação - 2ª Fase', 5, 2, 19),
  (18, 'Ciência da Computação - 3ª Fase', 5, 2, 16),
  (19, 'Ciência da Computação - 4ª Fase', 5, 2, 14),
  (20, 'Ciência da Computação - 5ª Fase', 5, 2, 12),
  (21, 'Ciência da Computação - 6ª Fase', 5, 2, 10),
  (22, 'Ciência da Computação - 7ª Fase', 5, 2, 8),
  (23, 'Ciência da Computação - 8ª Fase', 5, 2, 6),

  -- Curso 6: Engenharia Mecânica (10 Fases)
  (24, 'Engenharia Mecânica - 1ª Fase',  6, 2, 22),
  (25, 'Engenharia Mecânica - 2ª Fase',  6, 2, 20),
  (26, 'Engenharia Mecânica - 3ª Fase',  6, 2, 18),
  (27, 'Engenharia Mecânica - 4ª Fase',  6, 2, 16),
  (28, 'Engenharia Mecânica - 5ª Fase',  6, 2, 14),
  (29, 'Engenharia Mecânica - 6ª Fase',  6, 2, 12),
  (30, 'Engenharia Mecânica - 7ª Fase',  6, 2, 10),
  (31, 'Engenharia Mecânica - 8ª Fase',  6, 2, 8),
  (32, 'Engenharia Mecânica - 9ª Fase',  6, 2, 7),
  (33, 'Engenharia Mecânica - 10ª Fase', 6, 2, 6);

INSERT IGNORE INTO alunos (id, matricula, nome, email, status) VALUES
  (1, '202110806528', 'João Pedro Silva', 'joao.silva@aluno.ifsc.edu.br', 'Ativo'),
  (2, '202210809911', 'Maria Eduarda Oliveira', 'maria.oliveira@aluno.ifsc.edu.br', 'Ativo'),
  (3, '202310804422', 'Carlos Henrique Souza', 'carlos.souza@aluno.ifsc.edu.br', 'Ativo'),
  (4, '202110801345', 'Ana Beatriz Ferreira', 'ana.ferreira@aluno.ifsc.edu.br', 'Ativo'),
  (5, '202210812788', 'Lucas Mendes Costa', 'lucas.costa@aluno.ifsc.edu.br', 'Ativo'),
  (6, '202310807654', 'Fernanda Costa Lima', 'fernanda.lima@aluno.ifsc.edu.br', 'Ativo'),
  (7, '202110811234', 'Rafael Augusto Neves', 'rafael.neves@aluno.ifsc.edu.br', 'Ativo'),
  (8, '202210803321', 'Isabela Rocha Martins', 'isabela.martins@aluno.ifsc.edu.br', 'Ativo'),
  (9, '202310809876', 'Thiago Alves Pereira', 'thiago.pereira@aluno.ifsc.edu.br', 'Ativo'),
  (10, '202110814499', 'Camila Dias Santos', 'camila.santos@aluno.ifsc.edu.br', 'Inativo'),
  (11, '202210842065', 'Larissa Fernandes', 'larissa.fernandes@aluno.ifsc.edu.br', 'Ativo'),
  (12, '202110884813', 'Aline Melo', 'aline.melo@aluno.ifsc.edu.br', 'Ativo'),
  (13, '202410887413', 'Bruna Teixeira', 'bruna.teixeira@aluno.ifsc.edu.br', 'Ativo'),
  (14, '202310880126', 'Vinicius Costa', 'vinicius.costa@aluno.ifsc.edu.br', 'Ativo'),
  (15, '202510862024', 'Livia Rocha', 'livia.rocha@aluno.ifsc.edu.br', 'Ativo'),
  (16, '202210815234', 'Caio Santos', 'caio.santos@aluno.ifsc.edu.br', 'Ativo'),
  (17, '202110834241', 'Daniela Rodrigues', 'daniela.rodrigues@aluno.ifsc.edu.br', 'Ativo'),
  (18, '202410848123', 'Matheus Ribeiro', 'matheus.ribeiro@aluno.ifsc.edu.br', 'Ativo'),
  (19, '202310871239', 'Gabriel Alves', 'gabriel.alves@aluno.ifsc.edu.br', 'Inativo'),
  (20, '202210892011', 'Leticia Gomes', 'leticia.gomes@aluno.ifsc.edu.br', 'Ativo'),
  (21, '202310818392', 'Guilherme Castro', 'guilherme.castro@aluno.ifsc.edu.br', 'Ativo'),
  (22, '202110877218', 'Carolina Lima', 'carolina.lima@aluno.ifsc.edu.br', 'Ativo'),
  (23, '202410855219', 'Felipe Santos', 'felipe.santos@aluno.ifsc.edu.br', 'Ativo'),
  (24, '202210843920', 'Beatriz Oliveira', 'beatriz.oliveira1@aluno.ifsc.edu.br', 'Ativo'),
  (25, '202510812903', 'Rodrigo Silva', 'rodrigo.silva@aluno.ifsc.edu.br', 'Ativo'),
  (26, '202310888291', 'Amanda Martins', 'amanda.martins@aluno.ifsc.edu.br', 'Ativo'),
  (27, '202110839210', 'Pedro Henrique Dias', 'pedro.dias@aluno.ifsc.edu.br', 'Ativo'),
  (28, '202410810293', 'Eduardo Pereira', 'eduardo.pereira@aluno.ifsc.edu.br', 'Ativo'),
  (29, '202210877301', 'Sophia Barbosa', 'sophia.barbosa@aluno.ifsc.edu.br', 'Ativo'),
  (30, '202310849201', 'Lara Carvalho', 'lara.carvalho@aluno.ifsc.edu.br', 'Ativo'),
  (31, '202110829103', 'Enzo Gabriel Ramos', 'enzo.ramos@aluno.ifsc.edu.br', 'Ativo'),
  (32, '202410838201', 'Manuela Araujo', 'manuela.araujo@aluno.ifsc.edu.br', 'Ativo'),
  (33, '202210819203', 'Vitor Hugo Souza', 'vitor.souza@aluno.ifsc.edu.br', 'Ativo'),
  (34, '202510882019', 'Alice Ferreira', 'alice.ferreira@aluno.ifsc.edu.br', 'Ativo'),
  (35, '202310873910', 'Leonardo Lopes', 'leonardo.lopes@aluno.ifsc.edu.br', 'Ativo'),
  (36, '202110848102', 'Laura Cardoso', 'laura.cardoso@aluno.ifsc.edu.br', 'Ativo'),
  (37, '202410829104', 'Luan Soares', 'luan.soares@aluno.ifsc.edu.br', 'Ativo'),
  (38, '202210810392', 'Mariana Freitas', 'mariana.freitas@aluno.ifsc.edu.br', 'Ativo'),
  (39, '202310892018', 'Bruno Marques', 'bruno.marques@aluno.ifsc.edu.br', 'Ativo'),
  (40, '202110838192', 'Gabriela Fernandes', 'gabriela.fernandes@aluno.ifsc.edu.br', 'Ativo'),
  (41, '202510872910', 'Gustavo Nogueira', 'gustavo.nogueira@aluno.ifsc.edu.br', 'Ativo'),
  (42, '202210810294', 'Rafaela Machado', 'rafaela.machado@aluno.ifsc.edu.br', 'Ativo'),
  (43, '202410882910', 'Daniel Andrade', 'daniel.andrade@aluno.ifsc.edu.br', 'Ativo'),
  (44, '202310819204', 'Luana Nunes', 'luana.nunes@aluno.ifsc.edu.br', 'Ativo'),
  (45, '202110873921', 'Aline Mendes', 'aline.mendes@aluno.ifsc.edu.br', 'Inativo'),
  (46, '202210829105', 'Thais Vieira', 'thais.vieira@aluno.ifsc.edu.br', 'Ativo'),
  (47, '202510883920', 'Natalia Pires', 'natalia.pires@aluno.ifsc.edu.br', 'Ativo'),
  (48, '202310810295', 'Jessica Rocha', 'jessica.rocha@aluno.ifsc.edu.br', 'Ativo'),
  (49, '202110872911', 'Patricia Moraes', 'patricia.moraes@aluno.ifsc.edu.br', 'Ativo'),
  (50, '202410819205', 'Vanessa Santana', 'vanessa.santana@aluno.ifsc.edu.br', 'Ativo'),
  (51, '202210838202', 'Lucas Gabriel Lima', 'lucas.lima@aluno.ifsc.edu.br', 'Ativo'),
  (52, '202310829106', 'Matheus Oliveira', 'matheus.oliveira1@aluno.ifsc.edu.br', 'Ativo'),
  (53, '202110873922', 'Giovanna Silva', 'giovanna.silva@aluno.ifsc.edu.br', 'Ativo'),
  (54, '202510810296', 'Felipe Santos', 'felipe.santos1@aluno.ifsc.edu.br', 'Ativo'),
  (55, '202210882911', 'Julia Souza', 'julia.souza@aluno.ifsc.edu.br', 'Ativo'),
  (56, '202410819206', 'Guilherme Ferreira', 'guilherme.ferreira@aluno.ifsc.edu.br', 'Ativo'),
  (57, '202310838203', 'Maria Clara Costa', 'maria.costa@aluno.ifsc.edu.br', 'Ativo'),
  (58, '202110829107', 'Pedro Alves', 'pedro.alves@aluno.ifsc.edu.br', 'Ativo'),
  (59, '202210873923', 'Beatriz Gomes', 'beatriz.gomes@aluno.ifsc.edu.br', 'Ativo'),
  (60, '202510810297', 'João Vitor Ribeiro', 'joao.ribeiro@aluno.ifsc.edu.br', 'Ativo'),
  (61, '202310882912', 'Ana Luiza Martins', 'ana.martins@aluno.ifsc.edu.br', 'Ativo'),
  (62, '202110819207', 'Gustavo Lopes', 'gustavo.lopes@aluno.ifsc.edu.br', 'Ativo'),
  (63, '202410838204', 'Isabela Carvalho', 'isabela.carvalho@aluno.ifsc.edu.br', 'Ativo'),
  (64, '202210829108', 'Rafael Dias', 'rafael.dias@aluno.ifsc.edu.br', 'Ativo'),
  (65, '202310873924', 'Sophia Rodrigues', 'sophia.rodrigues@aluno.ifsc.edu.br', 'Ativo'),
  (66, '202110810298', 'Thiago Barbosa', 'thiago.barbosa@aluno.ifsc.edu.br', 'Ativo'),
  (67, '202510882913', 'Lara Freitas', 'lara.freitas@aluno.ifsc.edu.br', 'Ativo'),
  (68, '202210819208', 'Eduardo Ramos', 'eduardo.ramos@aluno.ifsc.edu.br', 'Ativo'),
  (69, '202410838205', 'Mariana Soares', 'mariana.soares@aluno.ifsc.edu.br', 'Ativo'),
  (70, '202310829109', 'Luan Castro', 'luan.castro@aluno.ifsc.edu.br', 'Ativo'),
  (71, '202110873925', 'Alice Araujo', 'alice.araujo@aluno.ifsc.edu.br', 'Ativo'),
  (72, '202210810299', 'Caio Henrique Melo', 'caio.melo@aluno.ifsc.edu.br', 'Ativo'),
  (73, '202510882914', 'Laura Nogueira', 'laura.nogueira@aluno.ifsc.edu.br', 'Ativo'),
  (74, '202310819209', 'Bruno Mendes', 'bruno.mendes@aluno.ifsc.edu.br', 'Ativo'),
  (75, '202110838206', 'Camila Machado', 'camila.machado@aluno.ifsc.edu.br', 'Ativo'),
  (76, '202410829110', 'Daniel Cardoso', 'daniel.cardoso@aluno.ifsc.edu.br', 'Ativo'),
  (77, '202210873926', 'Luana Pires', 'luana.pires@aluno.ifsc.edu.br', 'Ativo'),
  (78, '202310810300', 'Rodrigo Andrade', 'rodrigo.andrade@aluno.ifsc.edu.br', 'Ativo'),
  (79, '202110882915', 'Amanda Vieira', 'amanda.vieira@aluno.ifsc.edu.br', 'Ativo'),
  (80, '202510819210', 'Fernanda Moraes', 'fernanda.moraes@aluno.ifsc.edu.br', 'Ativo'),
  (81, '202210838207', 'Lucas Ferreira', 'lucas.ferreira@aluno.ifsc.edu.br', 'Ativo'),
  (82, '202410829111', 'Gabriel Souza', 'gabriel.souza1@aluno.ifsc.edu.br', 'Ativo'),
  (83, '202310873927', 'Beatriz Silva', 'beatriz.silva1@aluno.ifsc.edu.br', 'Ativo'),
  (84, '202110810301', 'Matheus Santos', 'matheus.santos1@aluno.ifsc.edu.br', 'Ativo'),
  (85, '202210882916', 'Julia Oliveira', 'julia.oliveira1@aluno.ifsc.edu.br', 'Ativo'),
  (86, '202510819211', 'Pedro Henrique Costa', 'pedro.costa1@aluno.ifsc.edu.br', 'Inativo'),
  (87, '202310838208', 'Isabela Rodrigues', 'isabela.rodrigues@aluno.ifsc.edu.br', 'Ativo'),
  (88, '202110829112', 'Guilherme Alves', 'guilherme.alves1@aluno.ifsc.edu.br', 'Ativo'),
  (89, '202410873928', 'Mariana Lima', 'mariana.lima1@aluno.ifsc.edu.br', 'Ativo'),
  (90, '202210810302', 'Felipe Gomes', 'felipe.gomes1@aluno.ifsc.edu.br', 'Ativo'),
  (91, '202310882917', 'Sophia Martins', 'sophia.martins1@aluno.ifsc.edu.br', 'Ativo'),
  (92, '202110819212', 'Gustavo Ribeiro', 'gustavo.ribeiro1@aluno.ifsc.edu.br', 'Ativo'),
  (93, '202510838209', 'Ana Clara Carvalho', 'ana.carvalho@aluno.ifsc.edu.br', 'Ativo'),
  (94, '202210829113', 'João Pedro Dias', 'joao.dias1@aluno.ifsc.edu.br', 'Ativo'),
  (95, '202410873929', 'Laura Freitas', 'laura.freitas1@aluno.ifsc.edu.br', 'Ativo'),
  (96, '202310810303', 'Rafael Ramos', 'rafael.ramos1@aluno.ifsc.edu.br', 'Ativo'),
  (97, '202110882918', 'Lara Soares', 'lara.soares1@aluno.ifsc.edu.br', 'Ativo'),
  (98, '202210819213', 'Thiago Castro', 'thiago.castro1@aluno.ifsc.edu.br', 'Ativo'),
  (99, '202510838210', 'Alice Araujo', 'alice.araujo1@aluno.ifsc.edu.br', 'Ativo'),
  (100, '202310829114', 'Eduardo Nogueira', 'eduardo.nogueira1@aluno.ifsc.edu.br', 'Ativo'),
  (101, '202110873930', 'Carolina Melo', 'carolina.melo1@aluno.ifsc.edu.br', 'Ativo'),
  (102, '202410810304', 'Bruno Machado', 'bruno.machado1@aluno.ifsc.edu.br', 'Ativo'),
  (103, '202210882919', 'Gabriela Cardoso', 'gabriela.cardoso1@aluno.ifsc.edu.br', 'Ativo'),
  (104, '202310819214', 'Vitor Hugo Pires', 'vitor.pires1@aluno.ifsc.edu.br', 'Ativo'),
  (105, '202110838211', 'Camila Andrade', 'camila.andrade1@aluno.ifsc.edu.br', 'Ativo'),
  (106, '202510829115', 'Daniel Vieira', 'daniel.vieira1@aluno.ifsc.edu.br', 'Ativo'),
  (107, '202210873931', 'Luana Moraes', 'luana.moraes1@aluno.ifsc.edu.br', 'Ativo'),
  (108, '202410810305', 'Luan Santana', 'luan.santana1@aluno.ifsc.edu.br', 'Ativo'),
  (109, '202310882920', 'Rafaela Ferreira', 'rafaela.ferreira1@aluno.ifsc.edu.br', 'Ativo'),
  (110, '202110819215', 'Caio Souza', 'caio.souza1@aluno.ifsc.edu.br', 'Ativo'),
  (111, '202210838212', 'Amanda Silva', 'amanda.silva1@aluno.ifsc.edu.br', 'Ativo'),
  (112, '202510829116', 'Fernanda Santos', 'fernanda.santos1@aluno.ifsc.edu.br', 'Ativo'),
  (113, '202310873932', 'Rodrigo Oliveira', 'rodrigo.oliveira1@aluno.ifsc.edu.br', 'Inativo'),
  (114, '202110810306', 'Thais Costa', 'thais.costa1@aluno.ifsc.edu.br', 'Ativo'),
  (115, '202410882921', 'Natalia Rodrigues', 'natalia.rodrigues1@aluno.ifsc.edu.br', 'Ativo'),
  (116, '202210819216', 'Jessica Alves', 'jessica.alves1@aluno.ifsc.edu.br', 'Ativo'),
  (117, '202310838213', 'Patricia Lima', 'patricia.lima1@aluno.ifsc.edu.br', 'Ativo'),
  (118, '202110829117', 'Vanessa Gomes', 'vanessa.gomes1@aluno.ifsc.edu.br', 'Ativo'),
  (119, '202510873933', 'Lucas Ribeiro', 'lucas.ribeiro1@aluno.ifsc.edu.br', 'Ativo'),
  (120, '202210810307', 'Matheus Carvalho', 'matheus.carvalho1@aluno.ifsc.edu.br', 'Ativo'),
  (121, '202410882922', 'Gabriel Martins', 'gabriel.martins1@aluno.ifsc.edu.br', 'Ativo'),
  (122, '202310819217', 'Guilherme Dias', 'guilherme.dias1@aluno.ifsc.edu.br', 'Ativo'),
  (123, '202110838214', 'Felipe Freitas', 'felipe.freitas1@aluno.ifsc.edu.br', 'Ativo'),
  (124, '202210829118', 'Pedro Ramos', 'pedro.ramos1@aluno.ifsc.edu.br', 'Ativo'),
  (125, '202510873934', 'João Barbosa', 'joao.barbosa1@aluno.ifsc.edu.br', 'Ativo'),
  (126, '202310810308', 'Gustavo Soares', 'gustavo.soares1@aluno.ifsc.edu.br', 'Ativo'),
  (127, '202110882923', 'Enzo Castro', 'enzo.castro1@aluno.ifsc.edu.br', 'Ativo'),
  (128, '202410819218', 'Vitor Nogueira', 'vitor.nogueira1@aluno.ifsc.edu.br', 'Ativo'),
  (129, '202210838215', 'Leonardo Araujo', 'leonardo.araujo1@aluno.ifsc.edu.br', 'Ativo'),
  (130, '202310829119', 'Eduardo Melo', 'eduardo.melo1@aluno.ifsc.edu.br', 'Ativo'),
  (131, '202110873935', 'Bruno Machado', 'bruno.machado2@aluno.ifsc.edu.br', 'Ativo'),
  (132, '202510810309', 'Caio Cardoso', 'caio.cardoso1@aluno.ifsc.edu.br', 'Ativo'),
  (133, '202210882924', 'Daniel Pires', 'daniel.pires1@aluno.ifsc.edu.br', 'Ativo'),
  (134, '202410819219', 'Rodrigo Andrade', 'rodrigo.andrade1@aluno.ifsc.edu.br', 'Ativo'),
  (135, '202310838216', 'Luan Vieira', 'luan.vieira1@aluno.ifsc.edu.br', 'Ativo'),
  (136, '202110829120', 'Julia Moraes', 'julia.moraes1@aluno.ifsc.edu.br', 'Inativo'),
  (137, '202210873936', 'Sophia Santana', 'sophia.santana1@aluno.ifsc.edu.br', 'Ativo'),
  (138, '202510810310', 'Isabela Silva', 'isabela.silva1@aluno.ifsc.edu.br', 'Ativo'),
  (139, '202310882925', 'Maria Oliveira', 'maria.oliveira2@aluno.ifsc.edu.br', 'Ativo'),
  (140, '202110819220', 'Ana Santos', 'ana.santos1@aluno.ifsc.edu.br', 'Ativo'),
  (141, '202410838217', 'Giovanna Costa', 'giovanna.costa1@aluno.ifsc.edu.br', 'Ativo'),
  (142, '202210829121', 'Alice Souza', 'alice.souza1@aluno.ifsc.edu.br', 'Ativo'),
  (143, '202310873937', 'Laura Rodrigues', 'laura.rodrigues1@aluno.ifsc.edu.br', 'Ativo'),
  (144, '202110810311', 'Beatriz Ferreira', 'beatriz.ferreira1@aluno.ifsc.edu.br', 'Ativo'),
  (145, '202510882926', 'Mariana Alves', 'mariana.alves1@aluno.ifsc.edu.br', 'Ativo'),
  (146, '202210819221', 'Gabriela Pereira', 'gabriela.pereira1@aluno.ifsc.edu.br', 'Ativo'),
  (147, '202410838218', 'Rafaela Lima', 'rafaela.lima1@aluno.ifsc.edu.br', 'Ativo'),
  (148, '202310829122', 'Lara Gomes', 'lara.gomes1@aluno.ifsc.edu.br', 'Ativo'),
  (149, '202110873938', 'Luana Ribeiro', 'luana.ribeiro1@aluno.ifsc.edu.br', 'Ativo'),
  (150, '202210810312', 'Carolina Martins', 'carolina.martins1@aluno.ifsc.edu.br', 'Ativo'),
  (151, '202510882927', 'Camila Carvalho', 'camila.carvalho1@aluno.ifsc.edu.br', 'Ativo'),
  (152, '202310819222', 'Amanda Lopes', 'amanda.lopes1@aluno.ifsc.edu.br', 'Ativo'),
  (153, '202110838219', 'Fernanda Soares', 'fernanda.soares1@aluno.ifsc.edu.br', 'Ativo'),
  (154, '202410829123', 'Thais Freitas', 'thais.freitas1@aluno.ifsc.edu.br', 'Ativo'),
  (155, '202210873939', 'Natalia Ramos', 'natalia.ramos1@aluno.ifsc.edu.br', 'Ativo'),
  (156, '202310810313', 'Jessica Barbosa', 'jessica.barbosa1@aluno.ifsc.edu.br', 'Ativo'),
  (157, '202110882928', 'Patricia Dias', 'patricia.dias1@aluno.ifsc.edu.br', 'Ativo'),
  (158, '202510819223', 'Vanessa Nogueira', 'vanessa.nogueira1@aluno.ifsc.edu.br', 'Ativo'),
  (159, '202210838220', 'Lucas Castro', 'lucas.castro1@aluno.ifsc.edu.br', 'Ativo'),
  (160, '202410829124', 'Matheus Araujo', 'matheus.araujo1@aluno.ifsc.edu.br', 'Ativo'),
  (161, '202310873940', 'Gabriel Melo', 'gabriel.melo1@aluno.ifsc.edu.br', 'Ativo'),
  (162, '202110810314', 'Guilherme Machado', 'guilherme.machado1@aluno.ifsc.edu.br', 'Ativo'),
  (163, '202210882929', 'Felipe Cardoso', 'felipe.cardoso1@aluno.ifsc.edu.br', 'Ativo'),
  (164, '202510819224', 'Pedro Pires', 'pedro.pires1@aluno.ifsc.edu.br', 'Ativo'),
  (165, '202310838221', 'João Andrade', 'joao.andrade1@aluno.ifsc.edu.br', 'Ativo'),
  (166, '202110829125', 'Gustavo Vieira', 'gustavo.vieira1@aluno.ifsc.edu.br', 'Ativo'),
  (167, '202410873941', 'Enzo Moraes', 'enzo.moraes1@aluno.ifsc.edu.br', 'Inativo'),
  (168, '202210810315', 'Vitor Santana', 'vitor.santana1@aluno.ifsc.edu.br', 'Ativo'),
  (169, '202310882930', 'Leonardo Silva', 'leonardo.silva1@aluno.ifsc.edu.br', 'Ativo'),
  (170, '202110819225', 'Eduardo Santos', 'eduardo.santos1@aluno.ifsc.edu.br', 'Ativo'),
  (171, '202510838222', 'Bruno Oliveira', 'bruno.oliveira1@aluno.ifsc.edu.br', 'Ativo'),
  (172, '202210829126', 'Caio Costa', 'caio.costa1@aluno.ifsc.edu.br', 'Ativo'),
  (173, '202410873942', 'Daniel Souza', 'daniel.souza1@aluno.ifsc.edu.br', 'Ativo'),
  (174, '202310810316', 'Rodrigo Ferreira', 'rodrigo.ferreira1@aluno.ifsc.edu.br', 'Ativo'),
  (175, '202110882931', 'Luan Alves', 'luan.alves1@aluno.ifsc.edu.br', 'Ativo'),
  (176, '202210819226', 'Julia Pereira', 'julia.pereira1@aluno.ifsc.edu.br', 'Ativo'),
  (177, '202510838223', 'Sophia Lima', 'sophia.lima1@aluno.ifsc.edu.br', 'Ativo'),
  (178, '202310829127', 'Isabela Gomes', 'isabela.gomes1@aluno.ifsc.edu.br', 'Ativo'),
  (179, '202110873943', 'Maria Ribeiro', 'maria.ribeiro1@aluno.ifsc.edu.br', 'Ativo'),
  (180, '202410810317', 'Ana Martins', 'ana.martins1@aluno.ifsc.edu.br', 'Ativo'),
  (181, '202210882932', 'Giovanna Carvalho', 'giovanna.carvalho1@aluno.ifsc.edu.br', 'Ativo'),
  (182, '202310819227', 'Alice Lopes', 'alice.lopes1@aluno.ifsc.edu.br', 'Ativo'),
  (183, '202110838224', 'Laura Soares', 'laura.soares2@aluno.ifsc.edu.br', 'Ativo'),
  (184, '202510829128', 'Beatriz Freitas', 'beatriz.freitas1@aluno.ifsc.edu.br', 'Ativo'),
  (185, '202210873944', 'Mariana Ramos', 'mariana.ramos1@aluno.ifsc.edu.br', 'Ativo'),
  (186, '202410810318', 'Gabriela Barbosa', 'gabriela.barbosa1@aluno.ifsc.edu.br', 'Ativo'),
  (187, '202310882933', 'Rafaela Dias', 'rafaela.dias1@aluno.ifsc.edu.br', 'Inativo'),
  (188, '202110819228', 'Lara Nogueira', 'lara.nogueira1@aluno.ifsc.edu.br', 'Ativo'),
  (189, '202210838225', 'Luana Castro', 'luana.castro1@aluno.ifsc.edu.br', 'Ativo'),
  (190, '202510829129', 'Carolina Araujo', 'carolina.araujo1@aluno.ifsc.edu.br', 'Ativo'),
  (191, '202310873945', 'Camila Melo', 'camila.melo1@aluno.ifsc.edu.br', 'Ativo'),
  (192, '202110810319', 'Amanda Machado', 'amanda.machado1@aluno.ifsc.edu.br', 'Ativo'),
  (193, '202410882934', 'Fernanda Cardoso', 'fernanda.cardoso1@aluno.ifsc.edu.br', 'Ativo'),
  (194, '202210819229', 'Thais Pires', 'thais.pires1@aluno.ifsc.edu.br', 'Ativo'),
  (195, '202310838226', 'Natalia Andrade', 'natalia.andrade1@aluno.ifsc.edu.br', 'Ativo'),
  (196, '202110829130', 'Jessica Vieira', 'jessica.vieira1@aluno.ifsc.edu.br', 'Ativo'),
  (197, '202510873946', 'Patricia Moraes', 'patricia.moraes1@aluno.ifsc.edu.br', 'Ativo'),
  (198, '202210810320', 'Vanessa Santana', 'vanessa.santana1@aluno.ifsc.edu.br', 'Ativo'),
  (199, '202410882935', 'Lucas Silva', 'lucas.silva1@aluno.ifsc.edu.br', 'Ativo'),
  (200, '202310819230', 'Matheus Santos', 'matheus.santos2@aluno.ifsc.edu.br', 'Ativo'),
  (201, '202110838227', 'Gabriel Oliveira', 'gabriel.oliveira1@aluno.ifsc.edu.br', 'Ativo'),
  (202, '202210829131', 'Guilherme Costa', 'guilherme.costa1@aluno.ifsc.edu.br', 'Ativo'),
  (203, '202510873947', 'Felipe Souza', 'felipe.souza1@aluno.ifsc.edu.br', 'Ativo'),
  (204, '202310810321', 'Pedro Ferreira', 'pedro.ferreira1@aluno.ifsc.edu.br', 'Ativo'),
  (205, '202110882936', 'João Alves', 'joao.alves1@aluno.ifsc.edu.br', 'Ativo'),
  (206, '202410819231', 'Gustavo Pereira', 'gustavo.pereira1@aluno.ifsc.edu.br', 'Inativo'),
  (207, '202210838228', 'Enzo Lima', 'enzo.lima1@aluno.ifsc.edu.br', 'Ativo'),
  (208, '202310829132', 'Vitor Gomes', 'vitor.gomes1@aluno.ifsc.edu.br', 'Ativo'),
  (209, '202110873948', 'Leonardo Ribeiro', 'leonardo.ribeiro1@aluno.ifsc.edu.br', 'Ativo'),
  (210, '202510810322', 'Eduardo Martins', 'eduardo.martins1@aluno.ifsc.edu.br', 'Ativo'),
  (211, '202210882937', 'Bruno Carvalho', 'bruno.carvalho1@aluno.ifsc.edu.br', 'Ativo'),
  (212, '202410819232', 'Caio Lopes', 'caio.lopes1@aluno.ifsc.edu.br', 'Ativo'),
  (213, '202310838229', 'Daniel Soares', 'daniel.soares1@aluno.ifsc.edu.br', 'Ativo'),
  (214, '202110829133', 'Rodrigo Freitas', 'rodrigo.freitas1@aluno.ifsc.edu.br', 'Ativo'),
  (215, '202210873949', 'Luan Ramos', 'luan.ramos1@aluno.ifsc.edu.br', 'Ativo'),
  (216, '202510810323', 'Julia Barbosa', 'julia.barbosa1@aluno.ifsc.edu.br', 'Ativo'),
  (217, '202310882938', 'Sophia Dias', 'sophia.dias1@aluno.ifsc.edu.br', 'Ativo'),
  (218, '202110819233', 'Isabela Nogueira', 'isabela.nogueira1@aluno.ifsc.edu.br', 'Ativo'),
  (219, '202410838230', 'Maria Castro', 'maria.castro1@aluno.ifsc.edu.br', 'Ativo'),
  (220, '202210829134', 'Ana Araujo', 'ana.araujo1@aluno.ifsc.edu.br', 'Ativo'),
  (221, '202310873950', 'Giovanna Melo', 'giovanna.melo1@aluno.ifsc.edu.br', 'Ativo'),
  (222, '202110810324', 'Alice Machado', 'alice.machado1@aluno.ifsc.edu.br', 'Ativo'),
  (223, '202510882939', 'Laura Cardoso', 'laura.cardoso1@aluno.ifsc.edu.br', 'Ativo'),
  (224, '202210819234', 'Beatriz Pires', 'beatriz.pires1@aluno.ifsc.edu.br', 'Inativo'),
  (225, '202410838231', 'Mariana Andrade', 'mariana.andrade1@aluno.ifsc.edu.br', 'Ativo'),
  (226, '202310829135', 'Gabriela Vieira', 'gabriela.vieira1@aluno.ifsc.edu.br', 'Ativo'),
  (227, '202110873951', 'Rafaela Moraes', 'rafaela.moraes1@aluno.ifsc.edu.br', 'Ativo'),
  (228, '202210810325', 'Lara Santana', 'lara.santana1@aluno.ifsc.edu.br', 'Ativo'),
  (229, '202510882940', 'Luana Silva', 'luana.silva1@aluno.ifsc.edu.br', 'Ativo'),
  (230, '202310819235', 'Carolina Santos', 'carolina.santos1@aluno.ifsc.edu.br', 'Ativo'),
  (231, '202110838232', 'Camila Oliveira', 'camila.oliveira1@aluno.ifsc.edu.br', 'Ativo'),
  (232, '202410829136', 'Amanda Costa', 'amanda.costa1@aluno.ifsc.edu.br', 'Ativo'),
  (233, '202210873952', 'Fernanda Souza', 'fernanda.souza1@aluno.ifsc.edu.br', 'Ativo'),
  (234, '202310810326', 'Thais Ferreira', 'thais.ferreira1@aluno.ifsc.edu.br', 'Ativo'),
  (235, '202110882941', 'Natalia Alves', 'natalia.alves1@aluno.ifsc.edu.br', 'Ativo'),
  (236, '202510819236', 'Jessica Pereira', 'jessica.pereira1@aluno.ifsc.edu.br', 'Ativo'),
  (237, '202210838233', 'Patricia Lima', 'patricia.lima2@aluno.ifsc.edu.br', 'Ativo'),
  (238, '202410829137', 'Vanessa Gomes', 'vanessa.gomes2@aluno.ifsc.edu.br', 'Ativo'),
  (239, '202310873953', 'Lucas Ribeiro', 'lucas.ribeiro2@aluno.ifsc.edu.br', 'Ativo'),
  (240, '202110810327', 'Matheus Martins', 'matheus.martins1@aluno.ifsc.edu.br', 'Ativo'),
  (241, '202210882942', 'Gabriel Carvalho', 'gabriel.carvalho1@aluno.ifsc.edu.br', 'Ativo'),
  (242, '202510819237', 'Guilherme Lopes', 'guilherme.lopes1@aluno.ifsc.edu.br', 'Inativo'),
  (243, '202310838234', 'Felipe Soares', 'felipe.soares1@aluno.ifsc.edu.br', 'Ativo'),
  (244, '202110829138', 'Pedro Freitas', 'pedro.freitas1@aluno.ifsc.edu.br', 'Ativo'),
  (245, '202410873954', 'João Ramos', 'joao.ramos1@aluno.ifsc.edu.br', 'Ativo'),
  (246, '202210810328', 'Gustavo Barbosa', 'gustavo.barbosa1@aluno.ifsc.edu.br', 'Ativo'),
  (247, '202310882943', 'Enzo Dias', 'enzo.dias1@aluno.ifsc.edu.br', 'Ativo'),
  (248, '202110819238', 'Vitor Nogueira', 'vitor.nogueira2@aluno.ifsc.edu.br', 'Ativo'),
  (249, '202510838235', 'Leonardo Castro', 'leonardo.castro1@aluno.ifsc.edu.br', 'Ativo'),
  (250, '202210829139', 'Eduardo Araujo', 'eduardo.araujo1@aluno.ifsc.edu.br', 'Ativo'),
  (251, '202410873955', 'Bruno Melo', 'bruno.melo1@aluno.ifsc.edu.br', 'Ativo'),
  (252, '202310810329', 'Caio Machado', 'caio.machado1@aluno.ifsc.edu.br', 'Ativo'),
  (253, '202110882944', 'Daniel Cardoso', 'daniel.cardoso1@aluno.ifsc.edu.br', 'Ativo'),
  (254, '202210819239', 'Rodrigo Pires', 'rodrigo.pires1@aluno.ifsc.edu.br', 'Ativo'),
  (255, '202510838236', 'Luan Andrade', 'luan.andrade1@aluno.ifsc.edu.br', 'Ativo'),
  (256, '202310829140', 'Julia Vieira', 'julia.vieira1@aluno.ifsc.edu.br', 'Ativo'),
  (257, '202110873956', 'Sophia Moraes', 'sophia.moraes1@aluno.ifsc.edu.br', 'Ativo'),
  (258, '202410810330', 'Isabela Santana', 'isabela.santana1@aluno.ifsc.edu.br', 'Ativo'),
  (259, '202210882945', 'Maria Silva', 'maria.silva1@aluno.ifsc.edu.br', 'Ativo'),
  (260, '202310819240', 'Ana Santos', 'ana.santos2@aluno.ifsc.edu.br', 'Inativo'),
  (261, '202110838237', 'Giovanna Oliveira', 'giovanna.oliveira1@aluno.ifsc.edu.br', 'Ativo'),
  (262, '202510829141', 'Alice Costa', 'alice.costa1@aluno.ifsc.edu.br', 'Ativo'),
  (263, '202210873957', 'Laura Souza', 'laura.souza1@aluno.ifsc.edu.br', 'Ativo'),
  (264, '202410810331', 'Beatriz Ferreira', 'beatriz.ferreira2@aluno.ifsc.edu.br', 'Ativo'),
  (265, '202310882946', 'Mariana Alves', 'mariana.alves2@aluno.ifsc.edu.br', 'Ativo'),
  (266, '202110819241', 'Gabriela Pereira', 'gabriela.pereira2@aluno.ifsc.edu.br', 'Ativo'),
  (267, '202210838238', 'Rafaela Lima', 'rafaela.lima2@aluno.ifsc.edu.br', 'Ativo'),
  (268, '202510829142', 'Lara Gomes', 'lara.gomes2@aluno.ifsc.edu.br', 'Ativo'),
  (269, '202310873958', 'Luana Ribeiro', 'luana.ribeiro2@aluno.ifsc.edu.br', 'Ativo'),
  (270, '202110810332', 'Carolina Martins', 'carolina.martins2@aluno.ifsc.edu.br', 'Ativo'),
  (271, '202410882947', 'Camila Carvalho', 'camila.carvalho2@aluno.ifsc.edu.br', 'Ativo'),
  (272, '202210819242', 'Amanda Lopes', 'amanda.lopes2@aluno.ifsc.edu.br', 'Ativo'),
  (273, '202310838239', 'Fernanda Soares', 'fernanda.soares2@aluno.ifsc.edu.br', 'Ativo'),
  (274, '202110829143', 'Thais Freitas', 'thais.freitas2@aluno.ifsc.edu.br', 'Ativo'),
  (275, '202510873959', 'Natalia Ramos', 'natalia.ramos2@aluno.ifsc.edu.br', 'Ativo'),
  (276, '202210810333', 'Jessica Barbosa', 'jessica.barbosa2@aluno.ifsc.edu.br', 'Inativo'),
  (277, '202410882948', 'Patricia Dias', 'patricia.dias2@aluno.ifsc.edu.br', 'Ativo'),
  (278, '202310819243', 'Vanessa Nogueira', 'vanessa.nogueira2@aluno.ifsc.edu.br', 'Ativo'),
  (279, '202110838240', 'Lucas Castro', 'lucas.castro2@aluno.ifsc.edu.br', 'Ativo'),
  (280, '202210829144', 'Matheus Araujo', 'matheus.araujo2@aluno.ifsc.edu.br', 'Ativo'),
  (281, '202510873960', 'Gabriel Melo', 'gabriel.melo2@aluno.ifsc.edu.br', 'Ativo'),
  (282, '202310810334', 'Guilherme Machado', 'guilherme.machado2@aluno.ifsc.edu.br', 'Ativo'),
  (283, '202110882949', 'Felipe Cardoso', 'felipe.cardoso2@aluno.ifsc.edu.br', 'Ativo'),
  (284, '202410819244', 'Pedro Pires', 'pedro.pires2@aluno.ifsc.edu.br', 'Ativo'),
  (285, '202210838241', 'João Andrade', 'joao.andrade2@aluno.ifsc.edu.br', 'Ativo'),
  (286, '202310829145', 'Gustavo Vieira', 'gustavo.vieira2@aluno.ifsc.edu.br', 'Ativo'),
  (287, '202110873961', 'Enzo Moraes', 'enzo.moraes2@aluno.ifsc.edu.br', 'Ativo'),
  (288, '202510810335', 'Vitor Santana', 'vitor.santana2@aluno.ifsc.edu.br', 'Ativo'),
  (289, '202210882950', 'Leonardo Silva', 'leonardo.silva2@aluno.ifsc.edu.br', 'Ativo'),
  (290, '202410819245', 'Eduardo Santos', 'eduardo.santos2@aluno.ifsc.edu.br', 'Ativo'),
  (291, '202310838242', 'Bruno Oliveira', 'bruno.oliveira2@aluno.ifsc.edu.br', 'Ativo'),
  (292, '202110829146', 'Caio Costa', 'caio.costa2@aluno.ifsc.edu.br', 'Ativo'),
  (293, '202210873962', 'Daniel Souza', 'daniel.souza2@aluno.ifsc.edu.br', 'Ativo'),
  (294, '202510810336', 'Rodrigo Ferreira', 'rodrigo.ferreira2@aluno.ifsc.edu.br', 'Ativo'),
  (295, '202310882951', 'Luan Alves', 'luan.alves2@aluno.ifsc.edu.br', 'Ativo'),
  (296, '202110819246', 'Julia Pereira', 'julia.pereira2@aluno.ifsc.edu.br', 'Ativo'),
  (297, '202410838243', 'Sophia Lima', 'sophia.lima2@aluno.ifsc.edu.br', 'Ativo'),
  (298, '202210829147', 'Isabela Gomes', 'isabela.gomes2@aluno.ifsc.edu.br', 'Ativo'),
  (299, '202310873963', 'Maria Ribeiro', 'maria.ribeiro2@aluno.ifsc.edu.br', 'Ativo'),
  (300, '202110810337', 'Ana Martins', 'ana.martins2@aluno.ifsc.edu.br', 'Inativo'),
  (301, '202510882952', 'Giovanna Carvalho', 'giovanna.carvalho2@aluno.ifsc.edu.br', 'Ativo'),
  (302, '202210819247', 'Alice Lopes', 'alice.lopes2@aluno.ifsc.edu.br', 'Ativo'),
  (303, '202410838244', 'Laura Soares', 'laura.soares3@aluno.ifsc.edu.br', 'Ativo'),
  (304, '202310829148', 'Beatriz Freitas', 'beatriz.freitas2@aluno.ifsc.edu.br', 'Ativo'),
  (305, '202110873964', 'Mariana Ramos', 'mariana.ramos2@aluno.ifsc.edu.br', 'Ativo'),
  (306, '202210810338', 'Gabriela Barbosa', 'gabriela.barbosa2@aluno.ifsc.edu.br', 'Ativo'),
  (307, '202510882953', 'Rafaela Dias', 'rafaela.dias2@aluno.ifsc.edu.br', 'Ativo'),
  (308, '202310819248', 'Lara Nogueira', 'lara.nogueira2@aluno.ifsc.edu.br', 'Ativo'),
  (309, '202110838245', 'Luana Castro', 'luana.castro2@aluno.ifsc.edu.br', 'Ativo'),
  (310, '202410829149', 'Carolina Araujo', 'carolina.araujo2@aluno.ifsc.edu.br', 'Ativo'),
  (311, '202210873965', 'Camila Melo', 'camila.melo2@aluno.ifsc.edu.br', 'Ativo'),
  (312, '202310810339', 'Amanda Machado', 'amanda.machado2@aluno.ifsc.edu.br', 'Ativo'),
  (313, '202110882954', 'Fernanda Cardoso', 'fernanda.cardoso2@aluno.ifsc.edu.br', 'Ativo'),
  (314, '202510819249', 'Thais Pires', 'thais.pires2@aluno.ifsc.edu.br', 'Ativo'),
  (315, '202210838246', 'Natalia Andrade', 'natalia.andrade2@aluno.ifsc.edu.br', 'Ativo'),
  (316, '202410829150', 'Jessica Vieira', 'jessica.vieira2@aluno.ifsc.edu.br', 'Inativo'),
  (317, '202310873966', 'Patricia Moraes', 'patricia.moraes2@aluno.ifsc.edu.br', 'Ativo'),
  (318, '202110810340', 'Vanessa Santana', 'vanessa.santana2@aluno.ifsc.edu.br', 'Ativo'),
  (319, '202210882955', 'Lucas Silva', 'lucas.silva2@aluno.ifsc.edu.br', 'Ativo'),
  (320, '202510819250', 'Matheus Santos', 'matheus.santos3@aluno.ifsc.edu.br', 'Ativo'),
  (321, '202310838247', 'Gabriel Oliveira', 'gabriel.oliveira2@aluno.ifsc.edu.br', 'Ativo'),
  (322, '202110829151', 'Guilherme Costa', 'guilherme.costa2@aluno.ifsc.edu.br', 'Ativo'),
  (323, '202410873967', 'Felipe Souza', 'felipe.souza2@aluno.ifsc.edu.br', 'Ativo'),
  (324, '202210810341', 'Pedro Ferreira', 'pedro.ferreira2@aluno.ifsc.edu.br', 'Ativo'),
  (325, '202310882956', 'João Alves', 'joao.alves2@aluno.ifsc.edu.br', 'Ativo'),
  (326, '202110819251', 'Gustavo Pereira', 'gustavo.pereira2@aluno.ifsc.edu.br', 'Ativo'),
  (327, '202510838248', 'Enzo Lima', 'enzo.lima2@aluno.ifsc.edu.br', 'Ativo'),
  (328, '202210829152', 'Vitor Gomes', 'vitor.gomes2@aluno.ifsc.edu.br', 'Ativo'),
  (329, '202410873968', 'Leonardo Ribeiro', 'leonardo.ribeiro2@aluno.ifsc.edu.br', 'Ativo'),
  (330, '202310810342', 'Eduardo Martins', 'eduardo.martins2@aluno.ifsc.edu.br', 'Ativo'),
  (331, '202110882957', 'Bruno Carvalho', 'bruno.carvalho2@aluno.ifsc.edu.br', 'Ativo'),
  (332, '202210819252', 'Caio Lopes', 'caio.lopes2@aluno.ifsc.edu.br', 'Inativo'),
  (333, '202510838249', 'Daniel Soares', 'daniel.soares2@aluno.ifsc.edu.br', 'Ativo'),
  (334, '202310829153', 'Rodrigo Freitas', 'rodrigo.freitas2@aluno.ifsc.edu.br', 'Ativo'),
  (335, '202110873969', 'Luan Ramos', 'luan.ramos2@aluno.ifsc.edu.br', 'Ativo'),
  (336, '202410810343', 'Julia Barbosa', 'julia.barbosa2@aluno.ifsc.edu.br', 'Ativo'),
  (337, '202210882958', 'Sophia Dias', 'sophia.dias2@aluno.ifsc.edu.br', 'Ativo'),
  (338, '202310819253', 'Isabela Nogueira', 'isabela.nogueira2@aluno.ifsc.edu.br', 'Ativo'),
  (339, '202110838250', 'Maria Castro', 'maria.castro2@aluno.ifsc.edu.br', 'Ativo'),
  (340, '202510829154', 'Ana Araujo', 'ana.araujo2@aluno.ifsc.edu.br', 'Ativo'),
  (341, '202210873970', 'Giovanna Melo', 'giovanna.melo2@aluno.ifsc.edu.br', 'Ativo'),
  (342, '202410810344', 'Alice Machado', 'alice.machado2@aluno.ifsc.edu.br', 'Ativo'),
  (343, '202310882959', 'Laura Cardoso', 'laura.cardoso2@aluno.ifsc.edu.br', 'Ativo'),
  (344, '202110819254', 'Beatriz Pires', 'beatriz.pires2@aluno.ifsc.edu.br', 'Ativo'),
  (345, '202210838251', 'Mariana Andrade', 'mariana.andrade2@aluno.ifsc.edu.br', 'Ativo'),
  (346, '202510829155', 'Gabriela Vieira', 'gabriela.vieira2@aluno.ifsc.edu.br', 'Ativo'),
  (347, '202310873971', 'Rafaela Moraes', 'rafaela.moraes2@aluno.ifsc.edu.br', 'Ativo'),
  (348, '202110810345', 'Lara Santana', 'lara.santana2@aluno.ifsc.edu.br', 'Inativo'),
  (349, '202410882960', 'Luana Silva', 'luana.silva2@aluno.ifsc.edu.br', 'Ativo'),
  (350, '202210819255', 'Carolina Santos', 'carolina.santos2@aluno.ifsc.edu.br', 'Ativo'),
  (351, '202310838252', 'Camila Oliveira', 'camila.oliveira2@aluno.ifsc.edu.br', 'Ativo'),
  (352, '202110829156', 'Amanda Costa', 'amanda.costa2@aluno.ifsc.edu.br', 'Ativo'),
  (353, '202510873972', 'Fernanda Souza', 'fernanda.souza2@aluno.ifsc.edu.br', 'Ativo'),
  (354, '202210810346', 'Thais Ferreira', 'thais.ferreira2@aluno.ifsc.edu.br', 'Ativo'),
  (355, '202410882961', 'Natalia Alves', 'natalia.alves2@aluno.ifsc.edu.br', 'Ativo'),
  (356, '202310819256', 'Jessica Pereira', 'jessica.pereira2@aluno.ifsc.edu.br', 'Ativo'),
  (357, '202110838253', 'Patricia Lima', 'patricia.lima3@aluno.ifsc.edu.br', 'Ativo'),
  (358, '202210829157', 'Vanessa Gomes', 'vanessa.gomes3@aluno.ifsc.edu.br', 'Ativo'),
  (359, '202510873973', 'Lucas Ribeiro', 'lucas.ribeiro3@aluno.ifsc.edu.br', 'Ativo'),
  (360, '202310810347', 'Matheus Martins', 'matheus.martins2@aluno.ifsc.edu.br', 'Ativo'),
  (361, '202110882962', 'Gabriel Carvalho', 'gabriel.carvalho2@aluno.ifsc.edu.br', 'Ativo'),
  (362, '202410819257', 'Guilherme Lopes', 'guilherme.lopes2@aluno.ifsc.edu.br', 'Ativo'),
  (363, '202210838254', 'Felipe Soares', 'felipe.soares2@aluno.ifsc.edu.br', 'Ativo'),
  (364, '202310829158', 'Pedro Freitas', 'pedro.freitas2@aluno.ifsc.edu.br', 'Ativo'),
  (365, '202110873974', 'João Ramos', 'joao.ramos2@aluno.ifsc.edu.br', 'Ativo'),
  (366, '202510810348', 'Gustavo Barbosa', 'gustavo.barbosa2@aluno.ifsc.edu.br', 'Ativo'),
  (367, '202210882963', 'Enzo Dias', 'enzo.dias2@aluno.ifsc.edu.br', 'Ativo'),
  (368, '202410819258', 'Vitor Nogueira', 'vitor.nogueira3@aluno.ifsc.edu.br', 'Ativo'),
  (369, '202310838255', 'Leonardo Castro', 'leonardo.castro2@aluno.ifsc.edu.br', 'Ativo'),
  (370, '202110829159', 'Eduardo Araujo', 'eduardo.araujo2@aluno.ifsc.edu.br', 'Ativo'),
  (371, '202210873975', 'Bruno Melo', 'bruno.melo2@aluno.ifsc.edu.br', 'Ativo'),
  (372, '202510810349', 'Caio Machado', 'caio.machado2@aluno.ifsc.edu.br', 'Ativo'),
  (373, '202310882964', 'Daniel Cardoso', 'daniel.cardoso2@aluno.ifsc.edu.br', 'Ativo'),
  (374, '202110819259', 'Rodrigo Pires', 'rodrigo.pires2@aluno.ifsc.edu.br', 'Ativo'),
  (375, '202410838256', 'Luan Andrade', 'luan.andrade2@aluno.ifsc.edu.br', 'Ativo'),
  (376, '202210829160', 'Julia Vieira', 'julia.vieira2@aluno.ifsc.edu.br', 'Ativo'),
  (377, '202310873976', 'Sophia Moraes', 'sophia.moraes2@aluno.ifsc.edu.br', 'Ativo'),
  (378, '202110810350', 'Isabela Santana', 'isabela.santana2@aluno.ifsc.edu.br', 'Ativo'),
  (379, '202510882965', 'Maria Silva', 'maria.silva2@aluno.ifsc.edu.br', 'Ativo'),
  (380, '202210819260', 'Ana Santos', 'ana.santos3@aluno.ifsc.edu.br', 'Inativo'),
  (381, '202410838257', 'Giovanna Oliveira', 'giovanna.oliveira2@aluno.ifsc.edu.br', 'Ativo'),
  (382, '202310829161', 'Alice Costa', 'alice.costa2@aluno.ifsc.edu.br', 'Ativo'),
  (383, '202110873977', 'Laura Souza', 'laura.souza2@aluno.ifsc.edu.br', 'Ativo'),
  (384, '202210810351', 'Beatriz Ferreira', 'beatriz.ferreira3@aluno.ifsc.edu.br', 'Ativo'),
  (385, '202510882966', 'Mariana Alves', 'mariana.alves3@aluno.ifsc.edu.br', 'Ativo'),
  (386, '202310819261', 'Gabriela Pereira', 'gabriela.pereira3@aluno.ifsc.edu.br', 'Ativo'),
  (387, '202110838258', 'Rafaela Lima', 'rafaela.lima3@aluno.ifsc.edu.br', 'Ativo'),
  (388, '202410829162', 'Lara Gomes', 'lara.gomes3@aluno.ifsc.edu.br', 'Ativo'),
  (389, '202210873978', 'Luana Ribeiro', 'luana.ribeiro3@aluno.ifsc.edu.br', 'Ativo'),
  (390, '202310810352', 'Carolina Martins', 'carolina.martins3@aluno.ifsc.edu.br', 'Ativo'),
  (391, '202110882967', 'Camila Carvalho', 'camila.carvalho3@aluno.ifsc.edu.br', 'Ativo'),
  (392, '202510819262', 'Amanda Lopes', 'amanda.lopes3@aluno.ifsc.edu.br', 'Ativo'),
  (393, '202210838259', 'Fernanda Soares', 'fernanda.soares3@aluno.ifsc.edu.br', 'Ativo'),
  (394, '202410829163', 'Thais Freitas', 'thais.freitas3@aluno.ifsc.edu.br', 'Ativo'),
  (395, '202310873979', 'Natalia Ramos', 'natalia.ramos3@aluno.ifsc.edu.br', 'Ativo'),
  (396, '202110810353', 'Jessica Barbosa', 'jessica.barbosa3@aluno.ifsc.edu.br', 'Inativo'),
  (397, '202210882968', 'Patricia Dias', 'patricia.dias3@aluno.ifsc.edu.br', 'Ativo'),
  (398, '202510819263', 'Vanessa Nogueira', 'vanessa.nogueira3@aluno.ifsc.edu.br', 'Ativo'),
  (399, '202310838260', 'Lucas Castro', 'lucas.castro3@aluno.ifsc.edu.br', 'Ativo'),
  (400, '202110829164', 'Matheus Araujo', 'matheus.araujo3@aluno.ifsc.edu.br', 'Ativo'),
  (401, '202410873980', 'Gabriel Melo', 'gabriel.melo3@aluno.ifsc.edu.br', 'Ativo'),
  (402, '202210810354', 'Guilherme Machado', 'guilherme.machado3@aluno.ifsc.edu.br', 'Ativo'),
  (403, '202310882969', 'Felipe Cardoso', 'felipe.cardoso3@aluno.ifsc.edu.br', 'Ativo'),
  (404, '202110819264', 'Pedro Pires', 'pedro.pires3@aluno.ifsc.edu.br', 'Inativo'),
  (405, '202510838261', 'João Andrade', 'joao.andrade3@aluno.ifsc.edu.br', 'Ativo'),
  (406, '202210829165', 'Gustavo Vieira', 'gustavo.vieira3@aluno.ifsc.edu.br', 'Ativo'),
  (407, '202410873981', 'Enzo Moraes', 'enzo.moraes3@aluno.ifsc.edu.br', 'Ativo'),
  (408, '202310810355', 'Vitor Santana', 'vitor.santana3@aluno.ifsc.edu.br', 'Ativo'),
  (409, '202110882970', 'Leonardo Silva', 'leonardo.silva3@aluno.ifsc.edu.br', 'Ativo'),
  (410, '202210819265', 'Eduardo Santos', 'eduardo.santos3@aluno.ifsc.edu.br', 'Ativo'),
  (411, '202510838262', 'Bruno Oliveira', 'bruno.oliveira3@aluno.ifsc.edu.br', 'Ativo'),
  (412, '202310829166', 'Caio Costa', 'caio.costa3@aluno.ifsc.edu.br', 'Inativo'),
  (413, '202110873982', 'Daniel Souza', 'daniel.souza3@aluno.ifsc.edu.br', 'Ativo'),
  (414, '202410810356', 'Rodrigo Ferreira', 'rodrigo.ferreira3@aluno.ifsc.edu.br', 'Ativo'),
  (415, '202210882971', 'Luan Alves', 'luan.alves3@aluno.ifsc.edu.br', 'Ativo'),
  (416, '202310819266', 'Julia Pereira', 'julia.pereira3@aluno.ifsc.edu.br', 'Ativo'),
  (417, '202110838263', 'Sophia Lima', 'sophia.lima3@aluno.ifsc.edu.br', 'Ativo'),
  (418, '202510829167', 'Isabela Gomes', 'isabela.gomes3@aluno.ifsc.edu.br', 'Ativo'),
  (419, '202210873983', 'Maria Ribeiro', 'maria.ribeiro3@aluno.ifsc.edu.br', 'Ativo'),
  (420, '202410810357', 'Ana Martins', 'ana.martins3@aluno.ifsc.edu.br', 'Inativo'),
  (421, '202310882972', 'Giovanna Carvalho', 'giovanna.carvalho3@aluno.ifsc.edu.br', 'Ativo'),
  (422, '202110819267', 'Alice Lopes', 'alice.lopes3@aluno.ifsc.edu.br', 'Ativo'),
  (423, '202210838264', 'Laura Soares', 'laura.soares4@aluno.ifsc.edu.br', 'Ativo'),
  (424, '202510829168', 'Beatriz Freitas', 'beatriz.freitas3@aluno.ifsc.edu.br', 'Ativo'),
  (425, '202310873984', 'Mariana Ramos', 'mariana.ramos3@aluno.ifsc.edu.br', 'Ativo'),
  (426, '202110810358', 'Gabriela Barbosa', 'gabriela.barbosa3@aluno.ifsc.edu.br', 'Ativo'),
  (427, '202410882973', 'Rafaela Dias', 'rafaela.dias3@aluno.ifsc.edu.br', 'Ativo'),
  (428, '202210819268', 'Lara Nogueira', 'lara.nogueira3@aluno.ifsc.edu.br', 'Inativo'),
  (429, '202310838265', 'Luana Castro', 'luana.castro3@aluno.ifsc.edu.br', 'Ativo'),
  (430, '202110829169', 'Carolina Araujo', 'carolina.araujo3@aluno.ifsc.edu.br', 'Ativo'),
  (431, '202510873985', 'Camila Melo', 'camila.melo3@aluno.ifsc.edu.br', 'Ativo'),
  (432, '202210810359', 'Amanda Machado', 'amanda.machado3@aluno.ifsc.edu.br', 'Ativo'),
  (433, '202410882974', 'Fernanda Cardoso', 'fernanda.cardoso3@aluno.ifsc.edu.br', 'Ativo'),
  (434, '202310819269', 'Thais Pires', 'thais.pires3@aluno.ifsc.edu.br', 'Ativo'),
  (435, '202110838266', 'Natalia Andrade', 'natalia.andrade3@aluno.ifsc.edu.br', 'Ativo'),
  (436, '202210829170', 'Jessica Vieira', 'jessica.vieira3@aluno.ifsc.edu.br', 'Inativo'),
  (437, '202510873986', 'Patricia Moraes', 'patricia.moraes3@aluno.ifsc.edu.br', 'Ativo'),
  (438, '202310810360', 'Vanessa Santana', 'vanessa.santana3@aluno.ifsc.edu.br', 'Ativo'),
  (439, '202110882975', 'Lucas Silva', 'lucas.silva3@aluno.ifsc.edu.br', 'Ativo'),
  (440, '202410819270', 'Matheus Santos', 'matheus.santos4@aluno.ifsc.edu.br', 'Ativo'),
  (441, '202210838267', 'Gabriel Oliveira', 'gabriel.oliveira3@aluno.ifsc.edu.br', 'Ativo'),
  (442, '202310829171', 'Guilherme Costa', 'guilherme.costa3@aluno.ifsc.edu.br', 'Ativo'),
  (443, '202110873987', 'Felipe Souza', 'felipe.souza3@aluno.ifsc.edu.br', 'Ativo'),
  (444, '202510810361', 'Pedro Ferreira', 'pedro.ferreira3@aluno.ifsc.edu.br', 'Inativo'),
  (445, '202210882976', 'João Alves', 'joao.alves3@aluno.ifsc.edu.br', 'Ativo'),
  (446, '202410819271', 'Gustavo Pereira', 'gustavo.pereira3@aluno.ifsc.edu.br', 'Ativo'),
  (447, '202310838268', 'Enzo Lima', 'enzo.lima3@aluno.ifsc.edu.br', 'Ativo'),
  (448, '202110829172', 'Vitor Gomes', 'vitor.gomes3@aluno.ifsc.edu.br', 'Ativo'),
  (449, '202210873988', 'Leonardo Ribeiro', 'leonardo.ribeiro3@aluno.ifsc.edu.br', 'Ativo'),
  (450, '202510810362', 'Eduardo Martins', 'eduardo.martins3@aluno.ifsc.edu.br', 'Ativo'),
  (451, '202310882977', 'Bruno Carvalho', 'bruno.carvalho3@aluno.ifsc.edu.br', 'Ativo'),
  (452, '202110819272', 'Caio Lopes', 'caio.lopes3@aluno.ifsc.edu.br', 'Inativo'),
  (453, '202410838269', 'Daniel Soares', 'daniel.soares3@aluno.ifsc.edu.br', 'Inativo'),
  (454, '202210829173', 'Rodrigo Freitas', 'rodrigo.freitas3@aluno.ifsc.edu.br', 'Ativo'),
  (455, '202310873989', 'Luan Ramos', 'luan.ramos3@aluno.ifsc.edu.br', 'Ativo'),
  (456, '202110810363', 'Julia Barbosa', 'julia.barbosa3@aluno.ifsc.edu.br', 'Inativo'),
  (457, '202510882978', 'Sophia Dias', 'sophia.dias3@aluno.ifsc.edu.br', 'Ativo');

INSERT IGNORE INTO matriculas (aluno_id, turma_id) VALUES
  -- Turma 1: TDS - 1ª Fase (20 alunos)
  (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
  (11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1), (20, 1),

  -- Turma 2: TDS - 2ª Fase (15 alunos)
  (21, 2), (22, 2), (23, 2), (24, 2), (25, 2), (26, 2), (27, 2), (28, 2), (29, 2), (30, 2),
  (31, 2), (32, 2), (33, 2), (34, 2), (35, 2),

  -- Turma 3: TDS - 3ª Fase (12 alunos)
  (36, 3), (37, 3), (38, 3), (39, 3), (40, 3), (41, 3), (42, 3), (43, 3), (44, 3), (45, 3),
  (46, 3), (47, 3),

  -- Turma 4: Mecatrônica - 1ª Fase (18 alunos)
  (48, 4), (49, 4), (50, 4), (51, 4), (52, 4), (53, 4), (54, 4), (55, 4), (56, 4), (57, 4),
  (58, 4), (59, 4), (60, 4), (61, 4), (62, 4), (63, 4), (64, 4), (65, 4),

  -- Turma 5: Mecatrônica - 2ª Fase (14 alunos)
  (66, 5), (67, 5), (68, 5), (69, 5), (70, 5), (71, 5), (72, 5), (73, 5), (74, 5), (75, 5),
  (76, 5), (77, 5), (78, 5), (79, 5),

  -- Turma 6: Mecatrônica - 3ª Fase (10 alunos)
  (80, 6), (81, 6), (82, 6), (83, 6), (84, 6), (85, 6), (86, 6), (87, 6), (88, 6), (89, 6),

  -- Turma 7: Mecatrônica - 4ª Fase (8 alunos)
  (90, 7), (91, 7), (92, 7), (93, 7), (94, 7), (95, 7), (96, 7), (97, 7),

  -- Turma 8: Administração - 1ª Fase (22 alunos)
  (98, 8), (99, 8), (100, 8), (101, 8), (102, 8), (103, 8), (104, 8), (105, 8), (106, 8), (107, 8),
  (108, 8), (109, 8), (110, 8), (111, 8), (112, 8), (113, 8), (114, 8), (115, 8), (116, 8), (117, 8),
  (118, 8), (119, 8),

  -- Turma 9: Administração - 2ª Fase (16 alunos)
  (120, 9), (121, 9), (122, 9), (123, 9), (124, 9), (125, 9), (126, 9), (127, 9), (128, 9), (129, 9),
  (130, 9), (131, 9), (132, 9), (133, 9), (134, 9), (135, 9),

  -- Turma 10: Enfermagem - 1ª Fase (21 alunos)
  (136, 10), (137, 10), (138, 10), (139, 10), (140, 10), (141, 10), (142, 10), (143, 10), (144, 10), (145, 10),
  (146, 10), (147, 10), (148, 10), (149, 10), (150, 10), (151, 10), (152, 10), (153, 10), (154, 10), (155, 10),
  (156, 10),

  -- Turma 11: Enfermagem - 2ª Fase (18 alunos)
  (157, 11), (158, 11), (159, 11), (160, 11), (161, 11), (162, 11), (163, 11), (164, 11), (165, 11), (166, 11),
  (167, 11), (168, 11), (169, 11), (170, 11), (171, 11), (172, 11), (173, 11), (174, 11),

  -- Turma 12: Enfermagem - 3ª Fase (15 alunos)
  (175, 12), (176, 12), (177, 12), (178, 12), (179, 12), (180, 12), (181, 12), (182, 12), (183, 12), (184, 12),
  (185, 12), (186, 12), (187, 12), (188, 12), (189, 12),

  -- Turma 13: Enfermagem - 4ª Fase (12 alunos)
  (190, 13), (191, 13), (192, 13), (193, 13), (194, 13), (195, 13), (196, 13), (197, 13), (198, 13), (199, 13),
  (200, 13), (201, 13),

  -- Turma 14: Enfermagem - 5ª Fase (9 alunos)
  (202, 14), (203, 14), (204, 14), (205, 14), (206, 14), (207, 14), (208, 14), (209, 14), (210, 14),

  -- Turma 15: Enfermagem - 6ª Fase (7 alunos)
  (211, 15), (212, 15), (213, 15), (214, 15), (215, 15), (216, 15), (217, 15),

  -- Turma 16: Ciência da Computação - 1ª Fase (22 alunos)
  (218, 16), (219, 16), (220, 16), (221, 16), (222, 16), (223, 16), (224, 16), (225, 16), (226, 16), (227, 16),
  (228, 16), (229, 16), (230, 16), (231, 16), (232, 16), (233, 16), (234, 16), (235, 16), (236, 16), (237, 16),
  (238, 16), (239, 16),

  -- Turma 17: Ciência da Computação - 2ª Fase (19 alunos)
  (240, 17), (241, 17), (242, 17), (243, 17), (244, 17), (245, 17), (246, 17), (247, 17), (248, 17), (249, 17),
  (250, 17), (251, 17), (252, 17), (253, 17), (254, 17), (255, 17), (256, 17), (257, 17), (258, 17),

  -- Turma 18: Ciência da Computação - 3ª Fase (16 alunos)
  (259, 18), (260, 18), (261, 18), (262, 18), (263, 18), (264, 18), (265, 18), (266, 18), (267, 18), (268, 18),
  (269, 18), (270, 18), (271, 18), (272, 18), (273, 18), (274, 18),

  -- Turma 19: Ciência da Computação - 4ª Fase (14 alunos)
  (275, 19), (276, 19), (277, 19), (278, 19), (279, 19), (280, 19), (281, 19), (282, 19), (283, 19), (284, 19),
  (285, 19), (286, 19), (287, 19), (288, 19),

  -- Turma 20: Ciência da Computação - 5ª Fase (12 alunos)
  (289, 20), (290, 20), (291, 20), (292, 20), (293, 20), (294, 20), (295, 20), (296, 20), (297, 20), (298, 20),
  (299, 20), (300, 20),

  -- Turma 21: Ciência da Computação - 6ª Fase (10 alunos)
  (301, 21), (302, 21), (303, 21), (304, 21), (305, 21), (306, 21), (307, 21), (308, 21), (309, 21), (310, 21),

  -- Turma 22: Ciência da Computação - 7ª Fase (8 alunos)
  (311, 22), (312, 22), (313, 22), (314, 22), (315, 22), (316, 22), (317, 22), (318, 22),

  -- Turma 23: Ciência da Computação - 8ª Fase (6 alunos)
  (319, 23), (320, 23), (321, 23), (322, 23), (323, 23), (324, 23),

  -- Turma 24: Engenharia Mecânica - 1ª Fase (22 alunos)
  (325, 24), (326, 24), (327, 24), (328, 24), (329, 24), (330, 24), (331, 24), (332, 24), (333, 24), (334, 24),
  (335, 24), (336, 24), (337, 24), (338, 24), (339, 24), (340, 24), (341, 24), (342, 24), (343, 24), (344, 24),
  (345, 24), (346, 24),

  -- Turma 25: Engenharia Mecânica - 2ª Fase (20 alunos)
  (347, 25), (348, 25), (349, 25), (350, 25), (351, 25), (352, 25), (353, 25), (354, 25), (355, 25), (356, 25),
  (357, 25), (358, 25), (359, 25), (360, 25), (361, 25), (362, 25), (363, 25), (364, 25), (365, 25), (366, 25),

  -- Turma 26: Engenharia Mecânica - 3ª Fase (18 alunos)
  (367, 26), (368, 26), (369, 26), (370, 26), (371, 26), (372, 26), (373, 26), (374, 26), (375, 26), (376, 26),
  (377, 26), (378, 26), (379, 26), (380, 26), (381, 26), (382, 26), (383, 26), (384, 26),

  -- Turma 27: Engenharia Mecânica - 4ª Fase (16 alunos)
  (385, 27), (386, 27), (387, 27), (388, 27), (389, 27), (390, 27), (391, 27), (392, 27), (393, 27), (394, 27),
  (395, 27), (396, 27), (397, 27), (398, 27), (399, 27), (400, 27),

  -- Turma 28: Engenharia Mecânica - 5ª Fase (14 alunos)
  (401, 28), (402, 28), (403, 28), (404, 28), (405, 28), (406, 28), (407, 28), (408, 28), (409, 28), (410, 28),
  (411, 28), (412, 28), (413, 28), (414, 28),

  -- Turma 29: Engenharia Mecânica - 6ª Fase (12 alunos)
  (415, 29), (416, 29), (417, 29), (418, 29), (419, 29), (420, 29), (421, 29), (422, 29), (423, 29), (424, 29),
  (425, 29), (426, 29),

  -- Turma 30: Engenharia Mecânica - 7ª Fase (10 alunos)
  (427, 30), (428, 30), (429, 30), (430, 30), (431, 30), (432, 30), (433, 30), (434, 30), (435, 30), (436, 30),

  -- Turma 31: Engenharia Mecânica - 8ª Fase (8 alunos)
  (437, 31), (438, 31), (439, 31), (440, 31), (441, 31), (442, 31), (443, 31), (444, 31),

  -- Turma 32: Engenharia Mecânica - 9ª Fase (7 alunos)
  (445, 32), (446, 32), (447, 32), (448, 32), (449, 32), (450, 32), (451, 32),

  -- Turma 33: Engenharia Mecânica - 10ª Fase (6 alunos)
  (452, 33), (453, 33), (454, 33), (455, 33), (456, 33), (457, 33);

INSERT IGNORE INTO diarios (id, codigo, disciplina_id, turma_id, professor_id, carga_horaria, aulas_previstas) VALUES
  -- Técnico em Desenvolvimento de Sistemas (TDS)
  (1,  'ALG-2026-01',    1,  1,  5,  '80h', 96),  -- Algoritmos e Programação | TDS 1ª Fase | Coord. TDS
  (2,  'BD-2026-01',     2,  2,  5,  '60h', 72),  -- Banco de Dados | TDS 2ª Fase | Coord. TDS
  (3,  'PW-2026-01',     3,  2,  5,  '80h', 96),  -- Programação Web | TDS 2ª Fase | Coord. TDS
  (4,  'ED-2026-01',     4,  3, 10,  '80h', 96),  -- Estrutura de Dados | TDS 3ª Fase | Prof. Carlos Silva
  (5,  'ES-2026-01',     5,  3, 10,  '72h', 86),  -- Engenharia de Software | TDS 3ª Fase | Prof. Carlos Silva

  -- Técnico em Mecatrônica (MEC)
  (6,  'ELE-2026-01',    6,  4,  6,  '72h', 86),  -- Eletrônica Digital | Mecatrônica 1ª Fase | Coord. MEC
  (7,  'MAT-2026-01',    7,  4,  6,  '60h', 72),  -- Matemática Aplicada | Mecatrônica 1ª Fase | Coord. MEC
  (8,  'HID-2026-01',    8,  5,  6,  '60h', 72),  -- Hidráulica e Pneumática | Mecatrônica 2ª Fase | Coord. MEC
  (9,  'AUT-2026-01',    9,  6, 11,  '80h', 96),  -- Automação Industrial | Mecatrônica 3ª Fase | Prof.ª Ana Souza
  (10, 'ROB-2026-01',   10,  7, 11,  '72h', 86),  -- Robótica Industrial | Mecatrônica 4ª Fase | Prof.ª Ana Souza

  -- Administração (ADM)
  (11, 'GES-2026-01',   11,  8,  7,  '60h', 72),  -- Gestão Empresarial | Administração 1ª Fase | Coord. ADM
  (12, 'CONT-2026-01',  12,  8,  7,  '60h', 72),  -- Contabilidade Básica | Administração 1ª Fase | Coord. ADM
  (13, 'MKT-2026-01',   13,  8,  7,  '60h', 72),  -- Marketing e Vendas | Administração 1ª Fase | Coord. ADM
  (14, 'RH-2026-01',    14,  9, 12,  '60h', 72),  -- Gestão de Pessoas | Administração 2ª Fase | Prof. Roberto Santos
  (15, 'FIN-2026-01',   15,  9, 12,  '72h', 86),  -- Administração Financeira | Administração 2ª Fase | Prof. Roberto Santos

  -- Técnico em Enfermagem (ENF)
  (16, 'ANA-2026-01',   16, 10,  8,  '80h', 96),  -- Anatomia e Fisiologia Humana | Enfermagem 1ª Fase | Coord. ENF
  (17, 'MCR-2026-01',   17, 11,  8,  '60h', 72),  -- Microbiologia e Parasitologia | Enfermagem 2ª Fase | Coord. ENF
  (18, 'FAR-2026-01',   18, 12,  8,  '60h', 72),  -- Farmacologia Aplicada | Enfermagem 3ª Fase | Coord. ENF
  (19, 'ENFU-2026-01',  19, 13, 13,  '80h', 96),  -- Enfermagem em Urgência e Emergência | Enfermagem 4ª Fase | Prof.ª Juliana Lima
  (20, 'UTI-2026-01',   20, 14, 13,  '80h', 96),  -- Cuidados Intensivos em Enfermagem | Enfermagem 5ª Fase | Prof.ª Juliana Lima

  -- Ciência da Computação (CCP)
  (21, 'FPROG-2026-01', 21, 16,  9,  '80h', 96),  -- Fundamentos de Programação | Ciência da Computação 1ª Fase | Coord. CCP
  (22, 'ALGLIN-2026-01',22, 17,  9,  '60h', 72),  -- Álgebra Linear | Ciência da Computação 2ª Fase | Coord. CCP
  (23, 'SO-2026-01',    23, 18,  9,  '72h', 86),  -- Sistemas Operacionais | Ciência da Computação 3ª Fase | Coord. CCP
  (24, 'IA-2026-01',    24, 20, 10,  '80h', 96),
  (25, 'REDES-2026-01', 25, 21, 10,  '72h', 86),  -- Redes de Computadores | Ciência da Computação 6ª Fase | Prof. Carlos Silva

  -- Engenharia Mecânica (ENM)
  (26, 'DES-2026-01',   26, 24,  3,  '60h', 72),  -- Desenho Técnico Mecânico | Engenharia Mecânica 1ª Fase | Coord. ENM
  (27, 'CALC-2026-01',  27, 25,  3,  '80h', 96),  -- Cálculo Diferencial e Integral | Engenharia Mecânica 2ª Fase | Coord. ENM
  (28, 'MATER-2026-01', 28, 26,  3,  '72h', 86),  -- Ciência dos Materiais | Engenharia Mecânica 3ª Fase | Coord. ENM
  (29, 'TERMO-2026-01', 29, 27, 11,  '72h', 86),  -- Termodinâmica Aplicada | Engenharia Mecânica 4ª Fase | Prof.ª Ana Souza
  (30, 'ELEM-2026-01',  30, 28, 11,  '80h', 96);   -- Elementos de Máquinas | Engenharia Mecânica

INSERT IGNORE INTO notas_frequencias (id, matricula_id, diario_id, media, infrequencia) VALUES
  (1, 1, 1, 7.8, 8),
  (2, 2, 1, 8.5, 12),
  (3, 3, 1, 6.2, 18),
  (4, 4, 1, 9.1, 4),
  (5, 5, 1, 4.2, 32),
  (6, 6, 1, 7.4, 10),
  (7, 7, 1, 8.0, 15),
  (8, 8, 1, 6.8, 22),
  (9, 9, 1, 9.5, 2),
  (10, 10, 1, 3.8, 28),
  (11, 11, 1, 7.1, 14),
  (12, 12, 1, 5.5, 12),
  (13, 13, 1, 8.3, 6),
  (14, 14, 1, 6.9, 20),
  (15, 15, 1, 7.6, 16),
  (16, 16, 1, 8.9, 8),
  (17, 17, 1, 6.5, 21),
  (18, 18, 1, 9.2, 5),
  (19, 19, 1, 4.0, 35),
  (20, 20, 1, 7.7, 11),
  (21, 21, 2, 8.1, 9),
  (22, 22, 2, 6.4, 17),
  (23, 23, 2, 7.9, 13),
  (24, 24, 2, 9.0, 6),
  (25, 25, 2, 8.4, 10),
  (26, 26, 2, 6.7, 24),
  (27, 27, 2, 7.2, 31),
  (28, 28, 2, 8.8, 7),
  (29, 29, 2, 6.1, 19),
  (30, 30, 2, 9.4, 3),
  (31, 31, 2, 7.3, 15),
  (32, 32, 2, 8.6, 11),
  (33, 33, 2, 6.6, 22),
  (34, 34, 2, 4.9, 18),
  (35, 35, 2, 7.5, 14),
  (36, 36, 4, 8.2, 8),
  (37, 37, 4, 6.3, 16),
  (38, 38, 4, 9.1, 5),
  (39, 39, 4, 7.8, 12),
  (40, 40, 4, 8.7, 9),
  (41, 41, 4, 6.0, 23),
  (42, 42, 4, 3.5, 38),
  (43, 43, 4, 7.9, 10),
  (44, 44, 4, 8.4, 14),
  (45, 45, 4, 4.5, 29),
  (46, 46, 4, 6.8, 17),
  (47, 47, 4, 9.3, 4),
  (48, 48, 6, 7.1, 13),
  (49, 49, 6, 8.0, 11),
  (50, 50, 6, 6.5, 20),
  (51, 51, 6, 5.2, 15),
  (52, 52, 6, 8.8, 8),
  (53, 53, 6, 7.6, 18),
  (54, 54, 6, 9.0, 6),
  (55, 55, 6, 6.2, 22),
  (56, 56, 6, 8.3, 10),
  (57, 57, 6, 7.4, 12),
  (58, 58, 6, 8.9, 7),
  (59, 59, 6, 6.7, 19),
  (60, 60, 6, 7.8, 27),
  (61, 61, 6, 8.1, 15),
  (62, 62, 6, 6.9, 14),
  (63, 63, 6, 9.5, 2),
  (64, 64, 6, 7.3, 16),
  (65, 65, 6, 8.6, 9),
  (66, 66, 8, 6.4, 21),
  (67, 67, 8, 8.2, 11),
  (68, 68, 8, 4.8, 30),
  (69, 69, 8, 7.7, 13),
  (70, 70, 8, 9.2, 5),
  (71, 71, 8, 6.1, 18),
  (72, 72, 8, 8.5, 8),
  (73, 73, 8, 7.0, 24),
  (74, 74, 8, 8.7, 10),
  (75, 75, 8, 6.6, 17),
  (76, 76, 8, 9.0, 6),
  (77, 77, 8, 5.7, 12),
  (78, 78, 8, 7.3, 15),
  (79, 79, 8, 8.4, 9),
  (80, 80, 9, 6.8, 22),
  (81, 81, 9, 8.9, 7),
  (82, 82, 9, 7.5, 14),
  (83, 83, 9, 9.3, 3),
  (84, 84, 9, 6.2, 19),
  (85, 85, 9, 7.1, 33),
  (86, 86, 9, 3.2, 40),
  (87, 87, 9, 8.0, 11),
  (88, 88, 9, 6.5, 20),
  (89, 89, 9, 8.7, 8),
  (90, 90, 10, 7.4, 16),
  (91, 91, 10, 9.1, 4),
  (92, 92, 10, 6.3, 18),
  (93, 93, 10, 5.1, 15),
  (94, 94, 10, 8.2, 10),
  (95, 95, 10, 7.8, 12),
  (96, 96, 10, 8.6, 9),
  (97, 97, 10, 6.9, 21),
  (98, 98, 11, 8.3, 7),
  (99, 99, 11, 7.0, 19),
  (100, 100, 11, 9.4, 2),
  (101, 101, 11, 6.6, 28),
  (102, 102, 11, 7.5, 13),
  (103, 103, 11, 8.8, 8),
  (104, 104, 11, 6.1, 23),
  (105, 105, 11, 8.0, 11),
  (106, 106, 11, 7.7, 15),
  (107, 107, 11, 9.2, 5),
  (108, 108, 11, 6.4, 18),
  (109, 109, 11, 8.5, 10),
  (110, 110, 11, 4.3, 34),
  (111, 111, 11, 7.9, 12),
  (112, 112, 11, 8.6, 9),
  (113, 113, 11, 3.9, 26),
  (114, 114, 11, 6.7, 20),
  (115, 115, 11, 9.0, 6),
  (116, 116, 11, 7.3, 14),
  (117, 117, 11, 8.1, 8),
  (118, 118, 11, 5.8, 16),
  (119, 119, 11, 6.5, 22),
  (120, 120, 14, 8.4, 11),
  (121, 121, 14, 7.1, 17),
  (122, 122, 14, 9.3, 4),
  (123, 123, 14, 6.2, 21),
  (124, 124, 14, 8.8, 9),
  (125, 125, 14, 7.6, 13),
  (126, 126, 14, 8.0, 10),
  (127, 127, 14, 6.9, 30),
  (128, 128, 14, 9.1, 5),
  (129, 129, 14, 6.4, 19),
  (130, 130, 14, 8.2, 12),
  (131, 131, 14, 7.5, 15),
  (132, 132, 14, 8.7, 8),
  (133, 133, 14, 6.0, 24),
  (134, 134, 14, 7.8, 14),
  (135, 135, 14, 4.6, 18),
  (136, 136, 16, 3.4, 38),
  (137, 137, 16, 8.3, 9),
  (138, 138, 16, 7.0, 16),
  (139, 139, 16, 9.2, 3),
  (140, 140, 16, 6.6, 20),
  (141, 141, 16, 8.5, 11),
  (142, 142, 16, 7.9, 13),
  (143, 143, 16, 8.8, 7),
  (144, 144, 16, 5.3, 11),
  (145, 145, 16, 6.1, 22),
  (146, 146, 16, 8.0, 10),
  (147, 147, 16, 7.4, 18),
  (148, 148, 16, 9.0, 6),
  (149, 149, 16, 6.7, 19),
  (150, 150, 16, 8.4, 8),
  (151, 151, 16, 7.2, 15),
  (152, 152, 16, 8.9, 27),
  (153, 153, 16, 6.3, 21),
  (154, 154, 16, 7.7, 12),
  (155, 155, 16, 8.1, 14),
  (156, 156, 16, 6.5, 17),
  (157, 157, 17, 9.4, 2),
  (158, 158, 17, 7.8, 10),
  (159, 159, 17, 8.2, 13),
  (160, 160, 17, 6.0, 23),
  (161, 161, 17, 4.1, 17),
  (162, 162, 17, 8.6, 8),
  (163, 163, 17, 7.1, 18),
  (164, 164, 17, 9.0, 5),
  (165, 165, 17, 6.8, 19),
  (166, 166, 17, 8.3, 11),
  (167, 167, 17, 3.6, 42),
  (168, 168, 17, 7.5, 15),
  (169, 169, 17, 8.7, 9),
  (170, 170, 17, 6.4, 29),
  (171, 171, 17, 9.1, 4),
  (172, 172, 17, 7.3, 16),
  (173, 173, 17, 8.5, 12),
  (174, 174, 17, 6.9, 20),
  (175, 175, 18, 8.0, 10),
  (176, 176, 18, 7.6, 14),
  (177, 177, 18, 9.3, 6),
  (178, 178, 18, 6.2, 22),
  (179, 179, 18, 5.0, 13),
  (180, 180, 18, 8.8, 8),
  (181, 181, 18, 7.4, 17),
  (182, 182, 18, 8.1, 11),
  (183, 183, 18, 6.7, 19),
  (184, 184, 18, 9.2, 3),
  (185, 185, 18, 7.0, 18),
  (186, 186, 18, 8.4, 9),
  (187, 187, 18, 2.9, 36),
  (188, 188, 18, 6.5, 21),
  (189, 189, 18, 8.6, 12),
  (190, 190, 19, 7.8, 15),
  (191, 191, 19, 9.0, 7),
  (192, 192, 19, 6.1, 24),
  (193, 193, 19, 8.3, 10),
  (194, 194, 19, 7.5, 13),
  (195, 195, 19, 8.7, 8),
  (196, 196, 19, 4.7, 20),
  (197, 197, 19, 6.9, 18),
  (198, 198, 19, 9.4, 4),
  (199, 199, 19, 7.2, 16),
  (200, 200, 19, 8.5, 11),
  (201, 201, 19, 6.3, 22),
  (202, 202, 20, 8.1, 9),
  (203, 203, 20, 7.7, 14),
  (204, 204, 20, 6.8, 32),
  (205, 205, 20, 9.1, 5),
  (206, 206, 20, 3.7, 39),
  (207, 207, 20, 8.0, 12),
  (208, 208, 20, 6.4, 19),
  (209, 209, 20, 8.9, 8),
  (210, 210, 20, 7.3, 15),
  (211, 211, 20, 8.6, 10),
  (212, 212, 20, 6.6, 21),
  (213, 213, 20, 5.4, 16),
  (214, 214, 20, 9.3, 3),
  (215, 215, 20, 7.1, 17),
  (216, 216, 20, 8.2, 13),
  (217, 217, 20, 6.0, 23),
  (218, 218, 21, 8.7, 7),
  (219, 219, 21, 7.5, 16),
  (220, 220, 21, 9.0, 6),
  (221, 221, 21, 6.8, 20),
  (222, 222, 21, 7.9, 28),
  (223, 223, 21, 8.4, 11),
  (224, 224, 21, 4.2, 45),
  (225, 225, 21, 6.2, 18),
  (226, 226, 21, 8.8, 9),
  (227, 227, 21, 7.4, 14),
  (228, 228, 21, 9.2, 4),
  (229, 229, 21, 6.5, 22),
  (230, 230, 21, 5.8, 10),
  (231, 231, 21, 8.1, 12),
  (232, 232, 21, 7.6, 15),
  (233, 233, 21, 8.9, 8),
  (234, 234, 21, 6.3, 19),
  (235, 235, 21, 8.5, 13),
  (236, 236, 21, 7.0, 17),
  (237, 237, 21, 9.4, 2),
  (238, 238, 21, 6.7, 21),
  (239, 239, 21, 4.9, 30),
  (240, 240, 22, 8.2, 10),
  (241, 241, 22, 7.3, 16),
  (242, 242, 22, 3.1, 33),
  (243, 243, 22, 9.1, 5),
  (244, 244, 22, 6.9, 18),
  (245, 245, 22, 8.6, 9),
  (246, 246, 22, 7.8, 14),
  (247, 247, 22, 8.0, 12),
  (248, 248, 22, 5.6, 17),
  (249, 249, 22, 6.4, 23),
  (250, 250, 22, 8.7, 7),
  (251, 251, 22, 7.1, 15),
  (252, 252, 22, 9.3, 3),
  (253, 253, 22, 6.6, 20),
  (254, 254, 22, 8.3, 11),
  (255, 255, 22, 7.7, 13),
  (256, 256, 22, 8.5, 30),
  (257, 257, 22, 6.1, 22),
  (258, 258, 22, 8.9, 8),
  (259, 259, 23, 7.4, 16),
  (260, 260, 23, 4.0, 27),
  (261, 261, 23, 9.0, 6),
  (262, 262, 23, 6.8, 19),
  (263, 263, 23, 8.1, 12),
  (264, 264, 23, 7.5, 14),
  (265, 265, 23, 5.3, 11),
  (266, 266, 23, 8.8, 9),
  (267, 267, 23, 6.2, 21),
  (268, 268, 23, 8.4, 10),
  (269, 269, 23, 7.9, 15),
  (270, 270, 23, 9.2, 4),
  (271, 271, 23, 6.5, 23),
  (272, 272, 23, 8.6, 8),
  (273, 273, 23, 7.2, 34),
  (274, 274, 23, 6.0, 18),
  (275, 275, 23, 8.3, 13),
  (276, 276, 23, 3.3, 41),
  (277, 277, 23, 7.7, 17),
  (278, 278, 23, 9.1, 5),
  (279, 279, 23, 6.9, 20),
  (280, 280, 23, 8.5, 9),
  (281, 281, 23, 7.1, 16),
  (282, 282, 23, 4.8, 15),
  (283, 283, 23, 8.0, 11),
  (284, 284, 23, 6.4, 22),
  (285, 285, 23, 8.7, 7),
  (286, 286, 23, 7.3, 14),
  (287, 287, 23, 9.5, 2),
  (288, 288, 23, 6.6, 19),
  (289, 289, 24, 8.2, 12),
  (290, 290, 24, 7.8, 15),
  (291, 291, 24, 6.7, 26),
  (292, 292, 24, 8.9, 8),
  (293, 293, 24, 6.1, 21),
  (294, 294, 24, 8.4, 10),
  (295, 295, 24, 7.6, 13),
  (296, 296, 24, 9.0, 6),
  (297, 297, 24, 6.3, 18),
  (298, 298, 24, 8.1, 14),
  (299, 299, 24, 7.5, 17),
  (300, 300, 24, 4.4, 32),
  (301, 301, 25, 8.8, 9),
  (302, 302, 25, 6.9, 20),
  (303, 303, 25, 9.3, 4),
  (304, 304, 25, 7.2, 16),
  (305, 305, 25, 8.5, 11),
  (306, 306, 25, 6.0, 24),
  (307, 307, 25, 8.3, 8),
  (308, 308, 25, 5.1, 12),
  (309, 309, 25, 7.9, 13),
  (310, 310, 25, 8.6, 10),
  (311, 311, 25, 6.4, 19),
  (312, 312, 25, 9.1, 5),
  (313, 313, 25, 7.7, 15),
  (314, 314, 25, 8.0, 12),
  (315, 315, 25, 6.5, 22),
  (316, 316, 25, 3.8, 37),
  (317, 317, 25, 8.4, 9),
  (318, 318, 25, 7.0, 18),
  (319, 319, 25, 9.2, 3),
  (320, 320, 25, 6.8, 21),
  (321, 321, 25, 8.7, 7),
  (322, 322, 25, 7.3, 14),
  (323, 323, 25, 8.1, 11),
  (324, 324, 25, 6.2, 20),
  (325, 325, 26, 8.9, 8),
  (326, 326, 26, 7.4, 29),
  (327, 327, 26, 9.0, 6),
  (328, 328, 26, 6.6, 17),
  (329, 329, 26, 8.2, 10),
  (330, 330, 26, 7.8, 13),
  (331, 331, 26, 8.5, 9),
  (332, 332, 26, 4.1, 36),
  (333, 333, 26, 6.1, 23),
  (334, 334, 26, 8.7, 7),
  (335, 335, 26, 5.5, 14),
  (336, 336, 26, 7.1, 16),
  (337, 337, 26, 9.4, 2),
  (338, 338, 26, 6.3, 21),
  (339, 339, 26, 8.0, 12),
  (340, 340, 26, 7.6, 15),
  (341, 341, 26, 8.8, 8),
  (342, 342, 26, 6.9, 19),
  (343, 343, 26, 7.2, 32),
  (344, 344, 26, 8.3, 11),
  (345, 345, 26, 6.7, 18),
  (346, 346, 26, 9.1, 5),
  (347, 347, 27, 7.5, 14),
  (348, 348, 27, 3.5, 28),
  (349, 349, 27, 8.6, 10),
  (350, 350, 27, 6.4, 20),
  (351, 351, 27, 8.9, 6),
  (352, 352, 27, 4.8, 16),
  (353, 353, 27, 7.0, 17),
  (354, 354, 27, 8.2, 12),
  (355, 355, 27, 6.0, 22),
  (356, 356, 27, 8.4, 9),
  (357, 357, 27, 7.8, 13),
  (358, 358, 27, 9.3, 4),
  (359, 359, 27, 6.5, 21),
  (360, 360, 27, 8.1, 11),
  (361, 361, 27, 7.3, 35),
  (362, 362, 27, 8.7, 8),
  (363, 363, 27, 6.2, 19),
  (364, 364, 27, 8.5, 10),
  (365, 365, 27, 7.1, 16),
  (366, 366, 27, 9.0, 7),
  (367, 367, 28, 6.8, 18),
  (368, 368, 28, 8.3, 12),
  (369, 369, 28, 7.6, 15),
  (370, 370, 28, 5.0, 10),
  (371, 371, 28, 8.8, 9),
  (372, 372, 28, 6.1, 24),
  (373, 373, 28, 8.0, 11),
  (374, 374, 28, 7.4, 14),
  (375, 375, 28, 9.2, 3),
  (376, 376, 28, 6.6, 20),
  (377, 377, 28, 8.4, 8),
  (378, 378, 28, 6.9, 27),
  (379, 379, 28, 7.7, 13),
  (380, 380, 28, 3.0, 44),
  (381, 381, 28, 8.1, 10),
  (382, 382, 28, 6.3, 22),
  (383, 383, 28, 8.6, 7),
  (384, 384, 28, 7.2, 17),
  (385, 385, 29, 8.9, 6),
  (386, 386, 29, 6.5, 19),
  (387, 387, 29, 4.3, 12),
  (388, 388, 29, 8.2, 11),
  (389, 389, 29, 7.0, 16),
  (390, 390, 29, 9.1, 5),
  (391, 391, 29, 6.7, 21),
  (392, 392, 29, 8.5, 9),
  (393, 393, 29, 7.3, 15),
  (394, 394, 29, 8.0, 13),
  (395, 395, 29, 6.2, 23),
  (396, 396, 29, 3.9, 31),
  (397, 397, 29, 8.7, 8),
  (398, 398, 29, 7.1, 18),
  (399, 399, 29, 8.4, 10),
  (400, 400, 29, 6.8, 20),
  (401, 401, 30, 9.0, 4),
  (402, 402, 30, 7.6, 14),
  (403, 403, 30, 8.3, 12),
  (404, 404, 30, 4.6, 25),
  (405, 405, 30, 5.7, 11),
  (406, 406, 30, 6.4, 22),
  (407, 407, 30, 8.8, 7),
  (408, 408, 30, 7.2, 16),
  (409, 409, 30, 8.1, 10),
  (410, 410, 30, 6.0, 23),
  (411, 411, 30, 8.6, 9),
  (412, 412, 30, 3.2, 40),
  (413, 413, 30, 7.5, 13),
  (414, 414, 30, 8.2, 33),
  (415, 415, 30, 6.9, 17),
  (416, 416, 30, 9.3, 3),
  (417, 417, 30, 7.1, 15),
  (418, 418, 30, 8.4, 11),
  (419, 419, 30, 6.3, 21),
  (420, 420, 30, 4.1, 37),
  (421, 421, 30, 8.7, 8),
  (422, 422, 30, 5.4, 18),
  (423, 423, 30, 7.8, 12),
  (424, 424, 30, 8.0, 10),
  (425, 425, 30, 6.6, 19),
  (426, 426, 30, 8.9, 6),
  (427, 427, 30, 7.4, 16),
  (428, 428, 30, 3.8, 29),
  (429, 429, 30, 8.5, 9),
  (430, 430, 30, 6.1, 24),
  (431, 431, 30, 7.7, 30),
  (432, 432, 30, 8.2, 13),
  (433, 433, 30, 6.7, 18),
  (434, 434, 30, 9.1, 5),
  (435, 435, 30, 7.0, 15),
  (436, 436, 30, 3.6, 43),
  (437, 437, 30, 8.3, 11),
  (438, 438, 30, 6.5, 20),
  (439, 439, 30, 8.8, 7),
  (440, 440, 30, 4.9, 14),
  (441, 441, 30, 7.3, 17),
  (442, 442, 30, 8.6, 10),
  (443, 443, 30, 6.2, 22),
  (444, 444, 30, 3.1, 35),
  (445, 445, 30, 8.0, 12),
  (446, 446, 30, 7.9, 15),
  (447, 447, 30, 9.2, 4),
  (448, 448, 30, 6.8, 19),
  (449, 449, 30, 7.1, 28),
  (450, 450, 30, 8.4, 8),
  (451, 451, 30, 6.0, 21),
  (452, 452, 30, 2.8, 48),
  (453, 453, 30, 3.4, 36),
  (454, 454, 30, 7.6, 13),
  (455, 455, 30, 8.7, 9),
  (456, 456, 30, 3.9, 42),
  (457, 457, 30, 8.1, 26);
