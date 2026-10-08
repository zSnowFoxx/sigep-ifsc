# Sistema de Gestão e Estratégia Pedagógica - SIGEP

Plataforma web desenvolvida para o monitoramento e a gestão de dados acadêmicos, provendo um acompanhamento preventivo de riscos de evasão de alunos. O sistema centraliza o controle de dados educacionais e provê indicadores em tempo real para apoio à tomada de decisão pedagógica.

---

## Tecnologias Utilizadas

* **Frontend:** React + TypeScript
* **Backend:** Node.js + Express
* **Banco de Dados:** MySQL 8.0
* **Comunicação do Servidor:** API REST
* **Build Tool:** Vite
* **Estilização:** Tailwind CSS (com Design Tokens flexíveis)
* **Ícones:** Lucide React
* **Arquitetura UI:** Componentes primitivos reutilizáveis e modulares

---

## Principais Módulos e Páginas

### 1. Painel de Monitoramento de Risco Acadêmico (Dashboard)

Acompanhamento em tempo real de estudantes em situação de vulnerabilidade ou risco de evasão.

* **Métricas de Alerta:** Cálculo automático baseado na Média Parcial (limite mínimo de 6.0) e % de Infrequência (limite LDB de 25%).
* **Classificação de Risco:** Categorização visual em níveis **Médio**, **Alto** e **Crítico**.
* **Fatores de Alerta:** Exibição detalhada dos motivos que geraram a sinalização.
* **Fluxo de Atendimento:** Ação direta para iniciar o atendimento pedagógico/NAE com o aluno.

### 2. Autenticação e Controle de Acesso

Fluxo completo de segurança para entrada e gerenciamento de contas de usuários na plataforma.

* **Login de Usuários:** Autenticação segura para acesso aos módulos restritos do sistema.
* **Cadastro de Usuário:** Registro e criação de novas contas no sistema.
* **Recuperação de Acesso:** Fluxo de "Esqueci a senha" para redefinição e recuperação da conta.

### 3. Módulo de Realização e Gerenciamento de Conselhos de Classe

Digitalização completa do fluxo colegiado, cobrindo todas as etapas regulamentares do conselho de classe.

* **Gestão de Conselhos:** Centralização das sessões em abas de **Conselhos em Aberto** e **Histórico de Realizados**, com agrupamento por **Conselhos Intermediários** e **Conselhos Finais**, busca rápida e filtros por curso.
* **Pré-Conselho e Conselho Intermediário:** Interface em modo tela cheia estruturada em duas abas principais:
  * **Demandas Gerais:** Registro dos representantes de turma, síntese diagnóstica, *checkboxes* de pontos positivos/dificuldades e tabela de demandas com classificação por nível de gravidade (*Não Urgente*, *Urgente* e *Crítica*).
  * **Registros e Encaminhamentos:** Tabela de relatos docentes com consulta automática de notas/frequências críticas do aluno e atrelamento direto a novos ou existentes encaminhamentos.
* **Reutilização de Dados já Existentes:** Botão dedicado para inserção e carga automatizada de dados via planilhas eletrônicas.
* **Agendamento e Convocação:** Modal com herança automática de dados da turma e busca dinâmica de docentes convocados por nome ou SIAPE.
* **Execução do Conselho Final:** Interface adaptativa em 4 abas (**Participantes**, **Pautas Coletivas**, **Registros e Encaminhamentos** e **Avaliação Discente** em padrão *Master-Detail*), com indicação visual de médias, faltas, emissão de pareceres qualitativos e sinalização de risco de evasão.
* **Fechamento e Emissão de Atas:** Trava de segurança que impede o encerramento da sessão até que todos os discentes recebam parecer, com disponibilização da Ata Oficial em PDF para *download*.

### 4. Monitoramento de Encaminhamentos Pedagógicos

Painel interativo para acompanhamento contínuo e gestão do ciclo de vida das intervenções deliberadas.

* **Quadro Kanban:** Visualização dinâmica dos encaminhamentos divididos nas colunas de status **Pendentes**, **Em Andamento** e **Finalizados**.
* **Linha do Tempo (Histórico de Evolução):** Acompanhamento detalhado de todas as etapas da intervenção, do início ao fim, permitindo registrar novos passos, pareceres e atualizações de progresso.
* **Detalhamento do Registro:** Consulta completa dos dados do encaminhamento, incluindo categoria, aluno atendido, servidor/setor responsável e prazos estabelecidos.

### 5. Atendimentos e Acompanhamento Individual

Módulo de uso da equipe pedagógica e NAE para registro e monitoramento de atendimentos individuais com estudantes.

* **Listagem Cronológica:** Exibição dos atendimentos organizados em ordem de realização, destacando a data, o discente atendido, o servidor responsável e o assunto/motivo do contato.
* **Detalhamento Expandido:** Recursos de expansão de linha para visualização rápida dos relatos pedagógicos completos e dados do atendimento.
* **Vínculo com Encaminhamentos:** Permite atribuir ou originar um encaminhamento pedagógico a partir do atendimento individualizado quando houver necessidade de acompanhamento contínuo.

### 6. Visualização do Perfil do Usuário

Painel individual para consulta de credenciais e gestão de segurança pessoal.

* **Visualização de Perfil:** Exibição detalhada das informações institucionais e dados de identificação do usuário conectado.
* **Alteração de Senha:** Interface dedicada para atualização segura e substituição de senha de acesso.

### 7. Cadastros Institucionais

Módulo centralizado em abas para gerenciamento completo (CRUD) de dados da instituição:

| Categoria | Descrição | Filtros Específicos |
| --- | --- | --- |
| **Alunos** | Gestão de discentes, matrículas e status de vínculo | Status (Ativo/Inativo) |
| **Servidores** | Controle de docentes, coordenadores e equipe pedagógica | Cargo e Função/Área |
| **Cursos** | Cadastro de cursos por nível e modalidade | Tipo, Grau e Modalidade |
| **Disciplinas** | Mapeamento de disciplinas atreladas a cursos e fases | Curso e Fase de Oferta |
| **Turmas** | Organização das turmas por período letivo | Período e Curso |
| **Diários** | Vínculo entre disciplinas, turmas e professores | Turma e Professor |

---

## Funcionalidades em Destaque

* **Busca Inteligente:** Motor de busca global (`matchQ`) imune a variações de maiúsculas/minúsculas e preparado para ignorar prefixos numéricos ou artigos no termo pesquisado.
* **Filtros Combinados:** Seletores dinâmicos por categoria que atuam de forma sincronizada com a barra de busca.
* **Componentização Modular:** Tabela única padronizada (`TablePrimitives`), modais de criação/edição dinâmicos (`ModalShell`) e formulários especializados.
* **Atribuição de Permições:** Padronização de permissões a acessos e funcionalidades para usuários de acordo com seu perfil, limitando o que podem ver e fazer
* **Aplicação do Modelo MVC Adaptado:** Organização do backend e do frontend de acordo com o modelo View-Controller, fazendo requisições ao backend pelos services no frontend.

---

## Estrutura do Projeto

```text
frontend/src/app/
├── components/
│   ├── Atendimentos/           # Componentes da tela de acompanhamento de atendimentos
│   ├── Cadastros/              # Componentes de interface do módulo de cadastros (header, cards, filtros)
│   │   ├── Forms/              # Formulários para cada modalidade de cadastro
│   │   ├── Tables/             # Tabelas específicas reutilizando os primitivos
│   ├── Conselho/               # Componentes das telas de gestão e realização de conselhos de classe
│   │   ├── Abas/               # Os subcomponentes das etapas realizadas em um conselho: Coleta de demandas, Registros docentes e Avaliação final
│   │   ├── Lista/              # Componentes da tela de listagem dos conselhos cadastrados, ativos e finalizados
│   │   ├── Modals/             # Modais de edição, cadastro e visualização de detalhes
│   ├── Dashboard/              # Componentes do painel de monitoramento e visualização de risco
│   ├── Encaminhamentos/        # Componentes da tela de monitoramento de encaminhamentos
│   ├── Login/                  # Componentes da tela de autenticação e controle de acesso
│   │   ├── Register/           # Formulário e fluxos para cadastro de novos usuários
│   │   ├── Reset/              # Formulário e fluxos para redefinição e recuperação de senha
│   ├── Profile/                # Componentes para exibição e edição do perfil do usuário
│   └── ui/                     # Componentes primitivos genéricos e reutilizáveis (tabelas, inputs, selects)
├── data/                       # Mock data, seeds institucionais e hooks utilizados no sistema
├── pages/                      # Views principais da aplicação associadas às rotas
├── services/                   # Camada de integração com o backend
├── types/                      # Interfaces e tipagens TypeScript
├── utils/                      # Métodos auxiliares de string e busca
└── App.tsx                     # Ponto de roteamento de páginas no sistema

```

---

## Estrutura do Servidor

```text
backend/src/
├── config/      
├── controllers/      
├── middlewares/      
├── models/                     
├── routes/    
├── utils/      
├── validators/                     
└── server.js                

```

---

## Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* Gerenciador de pacotes `npm` ou `yarn`
* [MySQL](https://www.mysql.com/) (versão 8.0 ou superior)

### Passo a Passo

1. **Clonar o repositório:**
```bash
git clone https://github.com/zSnowFoxx/sigep-ifsc.git

```


2. **Iniciar o Banco de Dados (MySQL):**
Certifique-se de que o serviço do MySQL está em execução na sua máquina e execute o script de criação da estrutura do banco.
Abra o gerenciador MySQL de sua preferência, conecte-se ao seu servidor e execute o conteúdo do arquivo tests/database/schema.sql.


3. **Iniciar o Servidor (Backend):**
Abra um terminal, acesse a pasta do servidor, instale as dependências e execute o serviço:
```bash
cd sigep-ifsc/backend
npm install
npm install bcrypt
nodemon server.js

```


4. **Iniciar a Aplicação (Frontend):**
Em outro terminal, acesse a pasta principal do projeto, instale as dependências e rode a interface:
```bash
cd sigep-ifsc/frontend
npm install
npm run dev

```


5. **Acessar a aplicação:**
Abra o navegador e acesse o endereço fornecido pelo terminal do frontend (geralmente `http://localhost:5173`).
