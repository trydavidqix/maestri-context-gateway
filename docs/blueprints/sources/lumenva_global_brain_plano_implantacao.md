# Lumenva Global Brain — Plano de Implantação

## 1. Objetivo

Construir uma única memória permanente, global e compartilhada no PC entre:

- Claude Code
- Codex
- Gemini CLI
- Antigravity

Ela deve conhecer todos os projetos locais, código existente, funcionalidades implementadas, decisões arquiteturais, erros e soluções anteriores, dependências, APIs, branches/commits, documentação, preferências globais, procedimentos e sessões relevantes dos agentes.

Comportamento esperado:

> “Quero criar uma plataforma de reservas.”

O Brain deve responder com base em evidências reais:

> “CRM já possui autenticação, clientes, WhatsApp e notificações; Scheduler possui calendário, filas e agendamentos; Commerce possui checkout. Cobertura encontrada: 8/10 capacidades. Precisamos criar apenas X e Y.”

A porcentagem de reaproveitamento deve ser calculada a partir de capacidades verificadas, nunca estimada sem evidência.

---

## 2. Arquitetura final

```text
                         PC
                          │
              ┌───────────┴───────────┐
              │                       │
        WORKSPACE LOCAL             AGENTS
              │                       │
       15+ projetos        ┌──────────┼──────────┐
                           │          │          │
                       Claude      Codex      Gemini
                       Code                    │
                                              │
                                         Antigravity
                           │          │          │
                           └──────────┼──────────┘
                                      │
                              LUMENVA BRAIN MCP
                                      │
                                      ▼
                         ┌───────────────────────┐
                         │ LUMENVA BRAIN DAEMON │
                         └───────────┬───────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
       Workspace Index         Memory Engine        Capability Graph
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     │
                              Retrieval Engine
                                     │
                       ┌─────────────┴─────────────┐
                       │                           │
                  LOCAL HOT CACHE             REMOTE TRUTH
                  SQLite/vector        Firebase SQL Connect
                                                   │
                                           Cloud SQL PostgreSQL
                                                   │
                                                pgvector
                                                   │
                                          Vertex embeddings
```

---

## 3. Regra fundamental

O sistema será **local-first, cloud-backed**.

### No PC

- Lumenva Brain daemon
- SQLite/vector hot cache
- Workspace scanner
- File watcher
- Git watcher
- MCP server

### Na nuvem

- Firebase
- SQL Connect
- Cloud SQL PostgreSQL
- pgvector
- Vertex AI embeddings

Resultado:

```text
PC offline
→ continua consultando memória recente/local.

PC online
→ sincroniza automaticamente com a memória permanente.
```

---

## 4. Estrutura do projeto

```text
lumenva-brain/
│
├── apps/
│   ├── brain-server/
│   └── dashboard/
│
├── packages/
│   ├── memory-core/
│   ├── memory-compiler/
│   ├── retrieval-engine/
│   ├── capability-engine/
│   ├── workspace-scanner/
│   ├── sync-engine/
│   ├── graph-engine/
│   └── security/
│
├── integrations/
│   ├── claude-code/
│   ├── codex/
│   ├── gemini/
│   └── antigravity/
│
├── mcp/
│   └── lumenva-brain/
│
├── database/
│   ├── schema/
│   ├── migrations/
│   └── seeds/
│
├── tests/
│   ├── memory/
│   ├── retrieval/
│   ├── cross-agent/
│   └── workspace/
│
└── docs/
```

Não criar quatro sistemas de memória separados.

---

## 5. Fase 1 — Brain Core

Base operacional:

```text
mcp-memory-service
        +
padrões temporais/provenance do agent-memory
```

Manter:

- MCP
- REST
- tool routing
- knowledge graph
- conflict handling
- consolidation
- agent identity
- health
- observability

Criar interface central:

```text
MemoryStorage
```

Implementações:

```text
LocalMemoryStorage
FirebasePostgresMemoryStorage
```

Entrega:

```text
lumenva-brain start
```

Inicia MCP, REST, banco local, sync engine e health check.

Gate:

```text
brain_status → healthy
brain_remember → salva
brain_search → encontra
reiniciar daemon → memória continua
```

---

## 6. Fase 2 — Schema canônico

Tabelas principais:

```text
projects
repositories
branches
files
symbols

agents
sessions

memory_events
memories
memory_versions
memory_sources
memory_relations
memory_conflicts
memory_feedback
memory_acl

capabilities
project_capabilities
capability_sources
```

### memory_events

Append-only:

```text
id
event_type
agent_id
session_id
project_id
raw_content
source_type
source_uri
source_hash
created_at
```

### memories

Conhecimento consolidado:

```text
id
type
subject
content
summary
scope_type
scope_id
valid_from
invalid_at
superseded_by
confidence
importance
authority
created_by_agent
created_at
updated_at
embedding
```

### memory_sources

Provenance:

```text
memory_id
project_id
repository
branch
commit_sha
file_path
symbol
session_id
message_pointer
source_type
created_at
```

---

## 7. Fase 3 — Workspace Scanner

Definir:

```text
PROJECTS_ROOT=<pasta dos projetos>
```

Detectar automaticamente:

```text
.git
package.json
pyproject.toml
requirements.txt
go.mod
Cargo.toml
README
AGENTS.md
CLAUDE.md
GEMINI.md
src/
apps/
packages/
api/
schemas/
migrations/
tests/
```

Fluxo:

```text
discover
   ↓
classify project
   ↓
read manifests
   ↓
read Git metadata
   ↓
map architecture
   ↓
map files
   ↓
map symbols
   ↓
map dependencies
```

Primeiro usar análise determinística; enviar ao modelo somente o que precisa de interpretação semântica.

---

## 8. Fase 4 — Indexação incremental

Depois do primeiro scan:

```text
filesystem watcher
+
git watcher
+
commit watcher
```

Arquivo alterado:

```text
hash diferente?
     ↓
parse arquivo
     ↓
atualiza symbols
     ↓
recalcula capabilities afetadas
     ↓
gera embedding
```

Commit:

```text
git commit
   ↓
Brain registra branch, SHA, arquivos e capabilities relacionadas
```

---

## 9. Fase 5 — Capability Engine

O Brain deve entender capacidades, não apenas arquivos.

Exemplo:

```text
CRM/src/auth.ts existe
```

deve virar:

```text
CRM implementa autenticação
```

Modelo:

```text
capability

id
name
description
category
maturity
confidence
project_id
```

Exemplos:

- authentication
- whatsapp
- calendar
- scheduler
- payments
- notifications
- RAG
- memory
- voice
- video-rendering
- social-publishing
- CRM

Cada capability aponta para evidências reais:

```text
authentication
   │
   ├── CRM/src/auth/*
   ├── RouteLex/apps/web/auth/*
   ├── migrations/users.sql
   └── tests/auth/*
```

---

## 10. Fase 6 — Global Project Graph

Relações:

```text
PROJECT
   │
   ├── implements → CAPABILITY
   ├── uses → TECHNOLOGY
   ├── depends_on → COMPONENT
   └── related_to → PROJECT
```

Exemplo:

```text
CRM
 ├── implements → WhatsApp
 ├── implements → Notifications
 ├── implements → Authentication
 └── uses → PostgreSQL

Teacher
 ├── implements → Video Rendering
 ├── uses → FFmpeg
 └── uses → Remotion
```

---

## 11. Fase 7 — Memory Compiler

Fluxo:

```text
RAW EVENT
   ↓
Candidate Detector
   ↓
durável?
   ├── não → archive
   └── sim
         ↓
     classify
         ↓
     extract entities
         ↓
     extract capabilities
         ↓
     provenance check
         ↓
     dedup
         ↓
     contradiction check
         ↓
     canonical memory
```

Interface:

```text
MemoryCompiler
```

Adapters:

```text
GeminiCompiler
OpenAICompiler
ClaudeCompiler
```

Preferência operacional:

- Gemini → compiler principal
- Codex → análise especializada de código
- Claude → candidate events/reasoning contextual

Nenhum modelo é autoridade por si só.

Autoridade vem de:

```text
source code
git
tests
documents
explicit user decisions
```

---

## 12. Tipos de memória

Começar com:

```text
profile
preference
fact
decision
procedure
experience
architecture
configuration
policy
incident
solution
entity
event
reference
capability
project-state
```

---

## 13. Fase 8 — Memória temporal

Mudanças importantes nunca sobrescrevem o passado.

Exemplo:

```text
memory A
content: Supabase
valid_from: 2026-01
invalid_at: 2026-09
superseded_by: B

memory B
content: Firebase
valid_from: 2026-09
invalid_at: null
```

Consultas:

```text
brain_search(current)
→ Firebase

brain_search(as_of=2026-05)
→ Supabase
```

---

## 14. Fase 9 — Retrieval Engine

Busca híbrida:

```text
query
 │
 ├── semantic vector
 ├── lexical/full text
 ├── project
 ├── capability
 ├── symbols
 ├── entities
 ├── graph
 ├── temporal
 ├── authority
 ├── freshness
 └── importance
 │
 ▼
fusion/reranking
 │
 ▼
context pack
```

Retorno pequeno e útil, não despejar todos os projetos no contexto.

---

## 15. Fase 10 — Universal Memory MCP

Ferramentas:

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

### brain_context

```text
brain_context(
  cwd="...",
  task="implementar login"
)
```

Retorna:

- current project
- current architecture
- important decisions
- relevant procedures
- related capabilities
- recent incidents
- reusable components

### brain_reuse

```text
brain_reuse(
  goal="sistema de reservas com WhatsApp e pagamentos"
)
```

Decompõe o objetivo e procura em todos os projetos.

---

## 16. Fase 11 — Claude Code

Integração global:

```text
integrations/claude-code/
```

Usar:

- MCP
- hooks
- skills
- global instructions

SessionStart:

```text
Claude abre
   ↓
detect cwd
   ↓
brain_context
   ↓
recebe contexto atual
```

Durante a sessão:

- file edited
- test passed
- decision made
- task completed

viram candidates.

SessionEnd:

```text
important events
   ↓
Brain
   ↓
distillation
```

---

## 17. Fase 12 — Codex

Configurar MCP global.

Adicionar instrução global:

```text
Antes de implementar uma nova capacidade,
consulte o Lumenva Brain para verificar
se já existe implementação reutilizável.
```

Codex usa:

```text
brain_context
```

ao entrar num repo e:

```text
brain_reuse
```

antes de criar arquitetura nova.

---

## 18. Fase 13 — Gemini CLI

Criar:

```text
lumenva-brain-google-extension
```

Com:

- MCP
- hooks
- skills

Skills:

```text
search-projects
reuse-existing-code
search-architecture
find-previous-solution
```

---

## 19. Fase 14 — Antigravity

Antigravity usa o mesmo endpoint MCP.

```text
Gemini CLI ─────┐
                ├── Lumenva Brain
Antigravity ────┘
```

Detectar:

- workspace atual
- repo
- branch
- task

e chamar `brain_context`.

---

## 20. Fase 15 — Captura automática

Event Bus:

```text
Claude ───────┐
Codex ────────┤
Gemini ───────┤
Antigravity ──┘
       │
       ▼
 BRAIN EVENT BUS
       │
       ├── SESSION_STARTED
       ├── TOOL_USED
       ├── FILE_CHANGED
       ├── TEST_RESULT
       ├── COMMIT_CREATED
       ├── DECISION
       ├── TASK_COMPLETED
       └── SESSION_ENDED
```

Regra:

```text
event != memory
```

Events são material bruto. O compiler decide o que vira memória.

---

## 21. Fase 16 — Proteção contra alucinação

Nunca:

```text
AI says X
    ↓
X becomes truth
```

Sempre:

```text
AI says X
    ↓
candidate
    ↓
source/evidence
    ↓
validation
    ↓
canonical memory
```

Hierarquia de autoridade:

```text
1. user explicit decision
2. repository/code
3. tests
4. configuration
5. official documents
6. agent inference
```

---

## 22. Fase 17 — Conflitos

Quando agentes discordarem, criar um registro de conflito em vez de escolher silenciosamente.

```text
memory_conflict

A
B
sources
authority
timestamps
status
```

Resolver por evidência, não por “qual modelo parece mais inteligente”.

---

## 23. Fase 18 — Armazenamento híbrido

```text
FirebaseHybridMemoryStorage
```

### Write

```text
Brain
 ↓
local journal
 ↓
PostgreSQL
 ↓
ack
```

### Read

```text
Brain
 ↓
SQLite hot cache
 ↓
hit → return

miss
 ↓
Cloud SQL
 ↓
update cache
 ↓
return
```

---

## 24. Fase 19 — Sincronização

Estados:

```text
pending
synced
failed
conflict
```

Cada write:

```text
event_id
device_id
timestamp
hash
sync_status
```

---

## 25. Fase 20 — Startup global

Quando o PC iniciar:

```text
Windows starts
    ↓
Lumenva Brain daemon
    ↓
local DB
    ↓
workspace watcher
    ↓
sync
    ↓
MCP ready
```

Claude Code, Codex, Gemini e Antigravity encontram o Brain automaticamente.

---

## 26. Bootstrap dos projetos existentes

Primeiro uso:

```text
brain scan <PROJECTS_ROOT>
```

Pipeline:

```text
discover projects
      ↓
Git scan
      ↓
manifest scan
      ↓
architecture scan
      ↓
symbols
      ↓
capabilities
      ↓
embeddings
      ↓
cross-project graph
```

Gerar:

```text
GLOBAL_PROJECT_MAP
```

Exemplo:

```text
15 projects
112 capabilities
37 shared technologies
29 reusable components
18 architecture decisions
11 duplicate implementations
```

---

## 27. Reuse Engine

Função principal:

```text
brain_reuse()
```

Fluxo:

```text
goal
 ↓
decompose capabilities
 ↓
search projects
 ↓
search capabilities
 ↓
search symbols
 ↓
check maturity
 ↓
check tests
 ↓
check freshness
 ↓
coverage
```

Exemplo:

```text
required capabilities = 10

fully reusable = 6
partially reusable = 2
missing = 2
```

Retorno:

```text
Full reuse: 60%
Partial reuse: 20%
Missing: 20%
```

sempre com evidências.

---

## 28. Testes obrigatórios

- Claude escreve → Codex encontra.
- Codex escreve → Gemini encontra.
- Gemini escreve → Claude encontra.
- Antigravity escreve → Codex encontra.
- Fechar todas as IAs → memória continua.
- Reiniciar PC → memória continua.
- Trocar modelo → memória continua.
- Criar novo chat → memória continua.
- Mudar branch → contexto muda corretamente.
- Projeto A → encontra capability de projeto B.
- Memory antiga → continua consultável.
- Memory superseded → não aparece como atual.
- Source → sempre rastreável.
- Internet cai → Brain local funciona.
- Internet volta → sincroniza.
- Inferência sem fonte não vira verdade canônica.

---

## 29. Observabilidade

Métricas:

```text
memories_total
events_today
projects_indexed
capabilities_total
cache_hit_rate
retrieval_latency
pending_sync
conflicts_open
compiler_runs
compiler_failures
```

`brain_status` deve retornar algo como:

```text
Brain: ONLINE

Projects: 15/15
Files indexed: 18,420
Capabilities: 132
Memories: 4,815

Local cache: healthy
Cloud sync: synced

Pending events: 0
Conflicts: 3
```

---

## 30. Dashboard depois do V1

```text
/brain

Overview
Projects
Capabilities
Memories
Graph
Sources
Conflicts
Agents
Sessions
Sync
Health
```

Tela de projeto:

```text
CRM

Architecture
Capabilities
Decisions
Components
Dependencies
Incidents
Reusable Code
Related Projects
```

---

## 31. Ordem real de execução

### Milestone 1 — Memory

```text
01 Brain Core
02 Local storage
03 Cloud PostgreSQL
04 Hybrid sync
05 Memory schema
06 MCP
```

Entrega: memória permanente.

### Milestone 2 — PC Intelligence

```text
07 Workspace scanner
08 Git scanner
09 File/symbol index
10 Incremental watcher
11 Capability Engine
12 Project Graph
```

Entrega: Brain conhece os projetos.

### Milestone 3 — Multi-AI

```text
13 Claude Code integration
14 Codex integration
15 Gemini integration
16 Antigravity integration
17 Event Bus
18 Memory Compiler
```

Entrega: todos usam o mesmo cérebro.

### Milestone 4 — Intelligence

```text
19 Hybrid retrieval
20 Temporal memory
21 Provenance
22 Conflict engine
23 Reuse Engine
24 Coverage calculation
```

Entrega: Brain sabe o que reutilizar.

### Milestone 5 — Production

```text
25 Cross-agent E2E
26 Offline tests
27 Sync recovery
28 Security/ACL
29 Observability
30 Global startup service
```

---

## 32. Fora do V1

Não colocar inicialmente:

```text
Neo4j
Graphiti obrigatório
Mem0
Cognee
Letta

quatro bancos vetoriais
quatro memories
múltiplos MCPs duplicados
```

Começar com:

```text
1 Brain
1 MCP
1 canonical DB
1 local cache
1 project graph
```

---

## 33. Estado final esperado

Você entra em qualquer projeto e abre:

```text
claude
codex
gemini
Antigravity
```

e pergunta:

> “Quero criar um agente para responder clientes, marcar horários e enviar WhatsApp.”

Qualquer IA consulta:

```text
LUMENVA BRAIN
────────────────────────

Relevant existing projects:

CRM
✓ customers
✓ WhatsApp
✓ handoff
✓ notifications

Scheduler
✓ appointments
✓ availability
✓ calendar

Voice
✓ customer identification

Reusable capabilities:
8

Partially reusable:
2

Missing:
1

Relevant files:
...

Relevant decisions:
...

Relevant tests:
...
```

Se um dia Claude Code, Codex, Gemini ou Antigravity forem substituídos, o conhecimento permanece.

## Princípio final

> **Os agentes são substituíveis. A memória pertence à Lumenva.**
