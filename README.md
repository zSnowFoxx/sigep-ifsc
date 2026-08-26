# Sistema de Gestão e Estratégia Pedagógica - SIGEP

Plataforma web desenvolvida para o monitoramento e a gestão de dados acadêmicos, provendo um acompanhamento preventivo de riscos de evasão de alunos. O sistema centraliza o controle de dados educacionais e provê indicadores em tempo real para apoio à tomada de decisão pedagógica.

---

## Tecnologias Utilizadas

* **Frontend:** React + TypeScript
* **Backend:** Node.js + Express
* **Comunicação do Servidor:** API REST
* **Build Tool:** Vite
* **Estilização:** Tailwind CSS (com Design Tokens flexíveis)
* **Ícones:** Lucide React
* **Arquitetura UI:** Componentes primitivos reutilizáveis e modulares

---

## Principais Módulos e Páginas (até o momento)

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

### 3. Visualização do Perfil do Usuário

Painel individual para consulta de credenciais e gestão de segurança pessoal.

* **Visualização de Perfil:** Exibição detalhada das informações institucionais e dados de identificação do usuário conectado.
* **Alteração de Senha:** Interface dedicada para atualização segura e substituição de senha de acesso.

### 4. Cadastros Institucionais

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

## Funcionalidades em Destaque (até o momento)

* **Busca Inteligente:** Motor de busca global (`matchQ`) imune a variações de maiúsculas/minúsculas e preparado para ignorar prefixos numéricos ou artigos no termo pesquisado.
* **Filtros Combinados:** Seletores dinâmicos por categoria que atuam de forma sincronizada com a barra de busca.
* **Componentização Modular:** Tabela única padronizada (`TablePrimitives`), modais de criação/edição dinâmicos (`ModalShell`) e formulários especializados.

---

## Estrutura do Projeto

```text
src/app/
├── components/
│   ├── Cadastros/              # Componentes de interface do módulo de cadastros (header, cards, filtros)
│   │   ├── Forms/              # Formulários para cada modalidade de cadastro
│   │   ├── Tables/             # Tabelas específicas reutilizando os primitivos
│   ├── Dashboard/              # Componentes do painel de monitoramento e visualização de risco
│   ├── Login/                  # Componentes da tela de autenticação e controle de acesso
│   │   ├── Register/           # Formulário e fluxos para cadastro de novos usuários
│   │   ├── Reset/              # Formulário e fluxos para redefinição e recuperação de senha
│   ├── Profile/                # Componentes para exibição e edição do perfil do usuário
│   └── ui/                     # Componentes primitivos genéricos e reutilizáveis (tabelas, inputs, selects)
├── data/                       # Mock data e seeds institucionais
├── pages/                      # Views principais da aplicação associadas às rotas
├── services/                   # Camada de integração com APIs externas e chamadas HTTP
├── types/                      # Interfaces e tipagens TypeScript
└── utils/                      # Métodos auxiliares de string e busca

```

---

## Estrutura do Servidor

```text
server/
├── data/                        # Persistência local, arquivos de dados ou mocks do backend
├── routes/                      # Definição das rotas e endpoints da API RESTful
└── server.js                    # Ponto de entrada e inicialização do servidor Node.js

```

---

## Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* Gerenciador de pacotes `npm` ou `yarn`

### Passo a Passo

1. **Clonar o repositório:**
```bash
git clone https://github.com/zSnowFoxx/sigep-ifsc.git

```


2. **Iniciar o Servidor (Backend):**
Abra um terminal, acesse a pasta do servidor, instale as dependências e execute o serviço:
```bash
cd sigep-ifsc/server
npm install
nodemon server.js

```


3. **Iniciar a Aplicação (Frontend):**
Em outro terminal, acesse a pasta principal do projeto, instale as dependências e rode a interface:
```bash
cd sigep-ifsc
npm install
npm run dev

```


4. **Acessar a aplicação:**
Abra o navegador e acesse o endereço fornecido pelo terminal do frontend (geralmente `http://localhost:5173`).
