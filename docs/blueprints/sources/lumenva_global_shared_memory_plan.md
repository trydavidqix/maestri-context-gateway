# Lumenva Global Shared Memory — Plano de Implementação

## Objetivo

Criar uma **memória permanente, global e compartilhada no PC** entre:

- Claude Code
- Codex
- Gemini CLI
- Antigravity

A ideia é que qualquer uma dessas IAs consiga entender o ecossistema inteiro de projetos locais e reutilizar conhecimento já existente.

Exemplo:

> "Quero criar um novo sistema de reservas."

O Lumenva Brain deve conseguir responder com base em evidências reais dos projetos locais:

> "Já existem componentes equivalentes em CRM, Scheduler e Commerce. Aproximadamente 75% das capacidades necessárias já existem e podem ser reutilizadas."

O objetivo não é apenas memória de conversa. É criar um **cérebro global do workspace**.

---

# 1. Arquitetura principal

```text
                    SEU PC
                      │
       ┌──────────────┴───────────────┐
       │                              │
  TODOS OS PROJETOS              AI CLIENTS
       │                              │
       │              ┌───────────────┼───────────────┐
       │              │               │               │
       │         Claude Code       Codex        Gemini/Antigravity
       │              │               │               │
       │              └───────────────┼───────────────┘
       │                              │
       │                    GLOBAL MEMORY MCP
       │                              │
       └──────────► LUMENVA BRAIN DAEMON ◄───────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
         Project Index    Memory Core    Capability Graph
              │               │                │
              └───────────────┼────────────────┘
                              │
                    HYBRID STORAGE
                              │
             ┌────────────────┴──────────────┐
             │                               │
       LOCAL HOT CACHE                 FIREBASE
       SQLite/vector               SQL Connect
                                      │
                              Cloud SQL PostgreSQL
                                      │
                                   pgvector
                                      │
                                Vertex AI Embeddings
```

---

# 2. Princípio central

Não teremos:

```text
Claude memory
Codex memory
Gemini memory
Antigravity memory
```

Teremos:

```text
                 LUMENVA BRAIN
                       │
      ┌────────────────┼────────────────┐
      │                │                │
 Claude Code         Codex        Gemini/Antigravity
```

Cada IA usa o mesmo cérebro.

As memórias nativas de cada ferramenta podem existir como cache/contexto temporário, mas **não são a fonte da verdade**.

---

# 3. Global Project Intelligence

Para que qualquer IA descubra o que já foi construído, o Brain precisa indexar projetos, não apenas conversas.

Estrutura conceitual:

```text
PROJECT REGISTRY

CRM
├── auth
├── WhatsApp
├── scheduler
├── agents
├── database
└── notifications

Teacher
├── Remotion
├── FFmpeg
├── video rendering
├── agents
└── content pipeline

RouteLex
├── API
├── rules engine
├── Gemini
├── evidence
└── country packs
```

Além dos projetos, o Brain mantém um **Capability Graph**:

```text
capability: authentication
projects:
  CRM
  RouteLex

capability: agent-router
projects:
  Lumenva
  Helixforge

capability: video-rendering
projects:
  Teacher

capability: WhatsApp
projects:
  CRM
```

Cada capacidade aponta para evidências reais:

```text
project
repository
branch
commit
file
symbol
dependencies
tests
status
last_seen
```

Assim a IA não inventa uma porcentagem de reaproveitamento. Ela calcula cobertura por componentes/capacidades encontrados.

Exemplo:

```text
Novo projeto requer:

✓ autenticação        → já existe
✓ scheduler           → já existe
✓ agent router        → já existe
✓ notifications       → já existe
✗ billing             → não encontrado
✓ dashboard           → já existe

5 de 6 capacidades
≈ 83% de cobertura estrutural
```

---

# 4. Modelo do cérebro global

Quatro grandes níveis:

```text
GLOBAL
│
├── USER KNOWLEDGE
├── PROJECT KNOWLEDGE
├── CODE/CAPABILITY KNOWLEDGE
└── AGENT KNOWLEDGE
```

Entidades principais:

```text
projects
project_snapshots

repositories
branches
commits

files
symbols
components
capabilities
dependencies

memories
memory_events
memory_versions
memory_sources

entities
relationships
decisions
procedures
incidents

agent_sessions
agent_events
```

---

# 5. Knowledge/Capability Graph

Exemplo:

```text
CRM
 │
 ├── implements → WhatsApp integration
 ├── implements → authentication
 └── uses → PostgreSQL

Teacher
 │
 ├── implements → video generation
 └── uses → FFmpeg

NovoProjeto
 │
 └── requires → authentication
                 │
                 └── already_exists_in → CRM
```

O objetivo é saber o que existe, onde está, como funciona e se pode ser reutilizado.

---

# 6. Claude Code

Criar uma integração global:

```text
lumenva-brain-claude/
├── MCP
├── hooks
├── skills
└── instructions
```

Fluxo:

```text
SessionStart
     ↓
identifica repo atual
branch
tarefa
decisões recentes
     ↓
brain_context()
```

Depois:

```text
PostToolUse
     ↓
observa:
arquivos alterados
testes
decisões
resultados importantes
```

E:

```text
SessionEnd
     ↓
envia eventos relevantes
     ↓
Memory Compiler
```

A memória nativa do Claude fica opcional e secundária.

---

# 7. Gemini CLI + Antigravity

Criar uma extensão Google:

```text
lumenva-brain-google-extension/
```

Com:

```text
gemini-extension.json

MCP:
  lumenva-brain

Hooks:
  SessionStart
  BeforeAgent
  AfterTool
  AfterAgent
  SessionEnd

Skills:
  search-projects
  reuse-capability
  architecture-search
```

Gemini CLI e Antigravity apontam para o mesmo daemon.

```text
Gemini CLI ─────┐
                ├── Lumenva Brain
Antigravity ────┘
```

---

# 8. Codex / OpenAI

Criar integração global OpenAI:

```text
lumenva-brain-openai-plugin/
```

Com:

```text
MCP
  lumenva-brain

hooks
  SessionStart
  SessionEnd

skills
  global-project-search
  reuse-existing-code
```

Adicionar também uma regra global pequena em `~/.codex/AGENTS.md`:

```text
Before designing or implementing a new capability,
query the Lumenva Brain for existing projects,
components, decisions and reusable implementations.
```

A intenção é tornar o Brain parte natural do fluxo do Codex em qualquer projeto.

---

# 9. Contexto sob demanda, não contexto gigante

"Todas sabem tudo" não significa colocar todos os projetos no prompt.

Fluxo:

```text
Agent starts
     ↓
~contexto global pequeno
     ↓
usuário pede uma tarefa
     ↓
brain_search / brain_reuse
     ↓
recupera somente o necessário
```

Exemplo:

```text
User:
"Quero fazer um sistema de reservas."

Brain encontra:

CRM
 - calendar integration
 - scheduler
 - WhatsApp
 - customers

Project B
 - booking API

Project C
 - payment component
```

A IA recebe apenas o conjunto relevante.

---

# 10. Workspace Scanner

Componente novo e essencial:

```text
lumenva-brain/
│
├── brain-server
├── memory-core
├── workspace-scanner
├── capability-engine
├── retrieval-engine
├── compiler
└── connectors/
    ├── claude
    ├── google
    └── openai
```

O scanner recebe a raiz dos projetos:

```text
PROJECTS_ROOT
```

E detecta automaticamente:

```text
.git
package.json
pyproject.toml
requirements
Dockerfile
README
src/
tests/
APIs
schemas
migrations
```

Primeira indexação:

```text
PC
 ↓
discover repositories
 ↓
git metadata
 ↓
file/symbol index
 ↓
architecture extraction
 ↓
capability extraction
 ↓
embedding
 ↓
global brain
```

Depois usamos atualização incremental:

```text
filesystem watcher
+
git diff
+
commit watcher
```

Mudaram três arquivos? Apenas esses três são reprocessados.

---

# 11. Memory Compiler

Pipeline:

```text
Raw events
   ↓
Gemini / compiler
   ↓
distill
   ↓
classify
   ↓
extract capabilities
   ↓
extract decisions
   ↓
extract relationships
```

O compiler deve ser provider-neutral:

```text
compiler/
├── gemini
├── openai
└── claude
```

Preferência operacional:

```text
Gemini → compiler principal
Codex → análise especializada de código
Claude → candidate events / reasoning contextual
```

Mas nenhum modelo vira autoridade.

Autoridade é:

```text
source code
git
tests
documents
explicit user decisions
```

---

# 12. Storage híbrido

Fonte permanente:

```text
Firebase SQL Connect
        ↓
Cloud SQL PostgreSQL
        ↓
pgvector
```

No PC:

```text
SQLite/vector hot cache
```

Fluxo:

```text
READ
local cache
   ↓ miss
Cloud SQL
```

```text
WRITE
local journal
   ↓
Cloud SQL
```

O objetivo é baixa latência local + persistência remota.

---

# 13. Ferramentas do MCP

Superfície enxuta:

```text
brain_context
brain_search
brain_remember
brain_projects
brain_capabilities
brain_reuse
brain_trace
brain_status
```

Exemplo:

```text
brain_reuse(
   goal="plataforma de agendamento com WhatsApp"
)
```

Retorno:

```text
Existing coverage: 78%

Reusable:
CRM/auth
CRM/whatsapp
CRM/customers
Scheduler/calendar
Scheduler/jobs

Missing:
payment
booking-ui
```

---

# 14. Captura automática

Nenhuma IA precisa lembrar de "salvar memória".

Todos alimentam um event bus:

```text
Claude
   │
Codex
   │
Gemini
   │
Antigravity
   │
   ▼
EVENT BUS
   │
   ├── session started
   ├── user decision
   ├── file changed
   ├── test passed
   ├── commit created
   ├── task completed
   └── session ended
             │
             ▼
        Memory Compiler
```

Só conhecimento durável vira memória.

Evitar lixo como:

```text
"vou abrir o arquivo"
"teste começou"
"ok"
```

Guardar coisas como:

```text
"Auth foi migrada de JWT próprio para Firebase Auth porque..."
```

---

# 15. Memória temporal

Mudanças de arquitetura não sobrescrevem o passado.

Exemplo:

```text
Janeiro:
backend = Supabase

Setembro:
backend = Firebase
```

Persistência:

```text
Supabase
valid_from = Jan
invalid_at = Sep

Firebase
valid_from = Sep
invalid_at = null
```

Então qualquer agente pode consultar:

```text
Como era em março?
```

e recuperar o estado histórico.

---

# 16. Provenance

Toda memória deve apontar para a origem.

Exemplo:

```text
memory
 ↓
source
 ↓
project
 ↓
repository
 ↓
branch
 ↓
commit
 ↓
file
 ↓
symbol / line range
 ↓
session / agent
```

Assim qualquer IA pode responder:

```text
"Essa conclusão veio de X, confirmada por Y e testada em Z."
```

---

# 17. Segurança contra contaminação

Agent output não vira automaticamente verdade.

Fluxo:

```text
agent observation
       ↓
memory candidate
       ↓
provenance check
       ↓
dedup / contradiction
       ↓
canonical memory
```

Uma IA pode sugerir conhecimento.

O Brain decide se vira conhecimento canônico com base nas evidências.

---

# 18. Reutilização global

Essa será a função mais importante.

Quando você pedir um projeto novo:

```text
brain_reuse(goal)
```

O Brain:

1. decompõe o objetivo em capacidades;
2. procura capacidades existentes;
3. encontra projetos equivalentes;
4. encontra arquivos/símbolos relevantes;
5. verifica maturidade/testes;
6. calcula cobertura estrutural;
7. retorna o que deve ser reutilizado;
8. retorna o que realmente precisa ser criado.

Exemplo:

```text
Quero criar:
plataforma de reservas + WhatsApp + calendário + pagamentos

Encontrado:
✓ auth
✓ WhatsApp
✓ customers
✓ scheduler
✓ calendar
✓ notifications

Falta:
✗ payment orchestration
✗ booking UI

Cobertura estimada por capacidades:
~75%
```

---

# 19. Ordem de implementação

## Fase 1 — Brain Core

- fork limpo do `mcp-memory-service`
- daemon global no PC
- uma configuração global
- endpoint MCP único

## Fase 2 — Firebase Hybrid Backend

- local SQLite/vector
- Firebase SQL Connect
- Cloud SQL PostgreSQL
- pgvector
- sincronização

## Fase 3 — Workspace Intelligence

- descobrir todos os projetos
- indexar Git
- indexar manifests
- indexar estrutura
- indexar símbolos
- incremental watcher

## Fase 4 — Capability Graph

- extrair capacidades
- mapear dependências
- mapear reutilização
- mapear equivalências entre projetos

## Fase 5 — Universal MCP

- `brain_context`
- `brain_search`
- `brain_projects`
- `brain_capabilities`
- `brain_reuse`
- `brain_trace`
- `brain_status`

## Fase 6 — Native Integrations

- Claude Code plugin/hooks/skills
- Codex plugin/hooks/AGENTS
- Gemini extension/hooks/skills
- Antigravity → mesmo MCP

## Fase 7 — Automatic Memory

- event bus
- capture
- distillation
- provenance
- temporal history
- conflict handling

## Fase 8 — Global Reuse Engine

- goal decomposition
- capability matching
- project matching
- code/symbol lookup
- coverage calculation
- reuse recommendations

---

# 20. Resultado final esperado

Você entra em qualquer diretório e abre:

```text
claude
codex
gemini
Antigravity
```

Pergunta:

> "Quero montar uma plataforma de reservas com WhatsApp, calendário e pagamentos."

Qualquer IA consulta automaticamente:

```text
LUMENVA BRAIN

Projects scanned: 15

Relevant projects:
CRM             4 capabilities
Scheduler       3 capabilities
Commerce        2 capabilities

Reusable existing code:
✓ WhatsApp
✓ Customer CRM
✓ Scheduler
✓ Calendar
✓ Authentication
✓ Notifications

Missing:
✗ payment orchestration
✗ booking UI

Estimated reusable coverage:
~75%
```

A IA passa a agir como se conhecesse todo o histórico técnico do seu PC.

---

# Decisão arquitetural

## Claude Code

Usar ao máximo:

- MCP
- hooks
- plugins
- skills
- global instructions

## Google

Usar ao máximo:

- Gemini CLI
- Gemini hooks
- Gemini extensions
- Antigravity
- Firebase SQL Connect
- Cloud SQL PostgreSQL
- Vertex AI embeddings

## OpenAI

Usar ao máximo:

- Codex
- MCP
- plugins
- hooks
- global `AGENTS.md`

## Núcleo independente

Continuar com:

```text
Lumenva Brain
```

como única memória canônica compartilhada entre os três ecossistemas.

---

# Princípio final

> **Os agentes são substituíveis. A memória pertence à Lumenva.**

Claude Code, Codex, Gemini e Antigravity podem mudar de versão, modelo ou até ser substituídos.

O conhecimento acumulado dos projetos continua existindo no mesmo Brain.
