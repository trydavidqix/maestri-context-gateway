# Lumenva Global Brain — Plano Completo de Implantação

## Objetivo

Construir um único cérebro permanente e global, compartilhado por:

- Claude Code
- Codex
- Gemini CLI
- Antigravity

Esse Brain deve funcionar em qualquer projeto, conhecer todo o ecossistema, reutilizar capacidades existentes e permanecer independente do PC.

---

## Princípios

1. Um Brain global.
2. Uma memória canônica.
3. Todos os agentes usam a mesma memória.
4. PC contém o mínimo possível.
5. GitHub = verdade do código/configuração.
6. Google = verdade do estado/memória.
7. Backup Google independente.
8. Histórico não é sobrescrito silenciosamente.
9. IA não transforma inferência em verdade automaticamente.
10. Zero treinamento próprio no V1.

---

## Arquitetura

```text
                         SEU PC
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
 Claude Code            Codex          Gemini / Antigravity
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                     Remote MCP
                           │
                           ▼
              ┌─────────────────────────┐
              │   GOOGLE CLOUD          │
              │   LUMENVA BRAIN         │
              │   Cloud Run             │
              └────────────┬────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
 Decision Plane       Memory Core      Project Intelligence
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    Retrieval Engine
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
     BM25              pgvector          Capability Graph
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │
                Cloud SQL PostgreSQL
                           │
              ┌────────────┴────────────┐
              │                         │
            GitHub              Google Backup Vault
         code/config                immutable
```

---

## Divisão de responsabilidades

### PC

- Claude Code
- Codex
- Gemini CLI
- Antigravity
- Git
- Remote MCP config
- Tiny Edge
- cache temporário

### GitHub

- código
- branches
- commits
- PRs
- schemas
- migrations
- skills/hooks
- IaC
- documentação
- workflows

### Google

- Lumenva Brain
- Remote MCP
- Cloud SQL PostgreSQL
- pgvector
- Memory Compiler
- Project Index
- Capability Graph
- embeddings
- Event Store
- backups
- PITR
- recovery

---

## Estrutura do repositório

```text
lumenva-brain/
│
├── apps/
│   ├── brain-api/
│   ├── mcp-server/
│   ├── indexer/
│   ├── backup-worker/
│   └── dashboard/
│
├── packages/
│   ├── memory-core/
│   ├── retrieval/
│   ├── decision-plane/
│   ├── capability-engine/
│   ├── project-engine/
│   ├── compiler/
│   ├── graph/
│   ├── provenance/
│   ├── auth/
│   └── sync/
│
├── integrations/
│   ├── claude/
│   ├── codex/
│   ├── gemini/
│   └── antigravity/
│
├── infrastructure/
│   ├── google/
│   ├── github/
│   └── terraform/
│
├── database/
│   ├── schema/
│   ├── migrations/
│   └── seeds/
│
└── tests/
```

---

## Fase 0 — Contratos

Definir contratos estáveis para:

```text
agent_id
user_id
project_id
repo
branch
session_id
task
cwd
timestamp
```

Memórias:

```text
source
authority
confidence
valid_from
invalid_at
superseded_by
```

---

## Fase 1 — Infraestrutura Google

Provisionar:

```text
Google Cloud Project
├── Cloud Run
├── Cloud SQL PostgreSQL
├── Cloud Storage
├── Cloud Scheduler
├── Cloud Run Jobs
├── IAM
├── Secret Manager
├── Logging
└── Monitoring
```

Ativar `pgvector`.

Gate: Cloud Run consegue ler/escrever no PostgreSQL.

---

## Fase 2 — Brain Core

Serviço central:

```text
brain-api
```

Responsabilidades:

```text
identity
scope
memory
projects
capabilities
retrieval
events
provenance
health
```

Endpoints:

```text
/health
/events
/memory
/search
/context
/projects
/capabilities
/reuse
/trace
```

---

## Fase 3 — Banco canônico

Tabelas:

```text
users
agents
projects
repositories
branches
commits
files
symbols
dependencies
capabilities
project_capabilities
capability_sources
memory_events
memories
memory_versions
memory_sources
memory_relations
memory_conflicts
sessions
agent_events
feedback
```

`memory_events` é append-only.

---

## Fase 4 — Remote Memory MCP

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

O MCP é único e compartilhado por todos os agentes.

---

## Fase 5 — GitHub Project Intelligence

```text
GitHub Push
    ↓
Webhook / Action
    ↓
Cloud Indexer
    ↓
repository
branch
commit
files changed
symbols
dependencies
capabilities
    ↓
Brain
```

A cloud aprende diretamente do GitHub.

---

## Fase 6 — Workspace Intelligence

Analisar:

```text
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
database/
migrations/
tests/
```

Descobrir:

```text
stack
services
APIs
dependencies
database
tests
components
entrypoints
```

---

## Fase 7 — Capability Engine

Converter código em capacidades reutilizáveis.

Exemplo:

```text
Project CRM
IMPLEMENTS
Authentication
```

Capabilities:

```text
authentication
payments
whatsapp
calendar
scheduler
notifications
voice
RAG
memory
video-rendering
social-publishing
```

Cada capability precisa de evidência:

```text
project
repo
branch
commit
files
symbols
tests
```

---

## Fase 8 — Capability Graph

```text
Project
 ├── implements → Capability
 ├── uses → Technology
 ├── depends_on → Component
 └── related_to → Project
```

PostgreSQL é suficiente no V1.

---

## Fase 9 — Retrieval Engine

Busca híbrida:

```text
QUERY
  │
  ├── lexical/BM25
  ├── pgvector
  ├── project
  ├── capabilities
  ├── symbols
  ├── graph
  ├── temporal
  ├── provenance
  ├── authority
  └── freshness
       │
       ▼
    RERANK
       │
       ▼
 CONTEXT PACK
```

---

## Fase 10 — Decision Plane

Sem Jev pago e sem treinamento próprio no V1.

```text
REQUEST / EVENT
       │
       ▼
Deterministic Rules
       │
       ▼
Semantic Signals
       │
       ▼
Pretrained Classifier
       │
       ▼
Laya System-One
       │
       ▼
Confidence Gate
       │
 ┌─────┴─────┐
 │           │
high       uncertain
 │           │
execute     Claude /
            Codex /
            Gemini
```

### Camadas

- Código/SQL para respostas exatas
- Retrieval para sinais semânticos
- Classificadores pré-treinados
- Laya para yes/no, choice, score
- Modelos grandes apenas para casos ambíguos

---

## Zero treinamento no V1

Fluxo:

```text
PRETRAINED
    ↓
works?
    ↓ yes
finished
```

Se não:

```text
threshold calibration
       ↓
examples
       ↓
rules
       ↓
evaluation
```

Fine-tuning só como último recurso.

---

## Agent Capability Registry

Manter como dados:

```text
Codex
  coding
  refactor
  tests

Gemini
  google
  multimodal
  research

Claude
  architecture
  planning
  reasoning
```

O router combina:

```text
task
context
capability
availability
permissions
session
```

---

## Fase 11 — Memory Compiler

```text
EVENT
 ↓
fast filter
 ↓
candidate?
 ↓
Memory Compiler
 ↓
classification
 ↓
entity extraction
 ↓
capability extraction
 ↓
source verification
 ↓
dedup
 ↓
contradiction detection
 ↓
canonical memory
```

Gemini pode ser o compiler principal, mas a interface deve ser provider-neutral.

---

## Memória temporal

Exemplo:

```text
Memory A
backend = Supabase
valid_from = Jan
invalid_at = Sep

Memory B
backend = Firebase
valid_from = Sep
invalid_at = null
```

Nada é sobrescrito silenciosamente.

---

## Provenance

Toda memória importante deve responder:

```text
Como sabemos disso?
```

Estrutura:

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
symbol
 ↓
agent/session
```

---

## Integração Claude Code

Usar:

- Remote MCP
- hooks
- skills
- global instructions

Fluxo:

```text
SessionStart
   ↓
brain_context()

important event
   ↓
brain event

SessionEnd
   ↓
candidate distillation
```

---

## Integração Codex

Configurar Remote MCP uma única vez.

Regra global:

```text
Antes de implementar uma nova capability,
consulte o Lumenva Brain.
```

Usar:

```text
brain_context
brain_reuse
```

---

## Integração Gemini

Criar integração/extensão global com:

- Remote MCP
- hooks
- skills

Skills:

```text
search-projects
reuse-existing-code
find-architecture
find-previous-solution
```

---

## Integração Antigravity

Usar o mesmo Brain e mesmo Remote MCP.

Nenhuma memória exclusiva.

---

## Tiny Edge

Único componente nosso relevante no PC.

Responsabilidades:

```text
detect current repo
detect branch
detect git diff
detect new files
detect workspace
send lightweight events
```

Não guarda memória canônica.

---

## Proteção de trabalho não commitado

```text
Committed code
PC → GitHub
```

```text
Uncommitted code
PC
 ↓
Tiny Edge
 ↓
encrypted workspace snapshot
 ↓
Google Cloud Storage
```

Não usar auto-commit como backup.

---

## Backup sem sobrescrever

Nunca:

```text
latest.zip
```

Sempre:

```text
vault/
2026/
09/
25/
run_<uuid>/
    postgres_<hash>.dump
    github_<hash>.bundle
    memories_<hash>.jsonl
    configs_<hash>.tar.zst
    manifest_<hash>.json
```

Cada backup inclui:

```text
timestamp
UUID
hash
source commit
backup run ID
```

---

## Frequência de backup

```text
REAL TIME
memory_events
GitHub commits

FREQUENT
workspace snapshots

HOURLY
Brain incremental checkpoint

DAILY
database backup
repository inventory
configs
schemas

WEEKLY
full disaster recovery package
restore verification
```

---

## Níveis de recuperação

```text
LEVEL 1
Git/GitHub history
memory_events
database history
```

```text
LEVEL 2
Cloud SQL backup + PITR
```

```text
LEVEL 3
Google immutable backup vault
```

---

## Segurança GitHub → Google

Preferir:

```text
GitHub Actions
     ↓
OIDC
     ↓
Google Workload Identity
     ↓
temporary credentials
```

Secrets em Google Secret Manager.

---

## Bootstrap inicial

```text
GitHub account/org
       ↓
discover repositories
       ↓
scan manifests
       ↓
scan architecture
       ↓
symbols
       ↓
capabilities
       ↓
embeddings
       ↓
cross-project graph
```

Gerar `GLOBAL PROJECT MAP`.

---

## Reuse Engine

```text
USER GOAL
   ↓
decompose requirements
   ↓
required capabilities
   ↓
search global Brain
   ↓
match projects
   ↓
match code
   ↓
check maturity/tests
   ↓
calculate coverage
```

Exemplo:

```text
Required capabilities: 10
Fully reusable: 6
Partially reusable: 2
Missing: 2

Full reuse: 60%
Partial reuse: 20%
Missing: 20%
```

Sempre com evidência.

---

## Learning sem treinamento

Guardar outcomes:

```text
decision
 ↓
execution
 ↓
tests
 ↓
build
 ↓
user acceptance
 ↓
result
```

Usar para:

```text
metrics
threshold calibration
bad-route analysis
examples
future evaluation
```

Não retreinar automaticamente.

---

## Observabilidade

Dashboard:

```text
Brain status
Projects indexed
Files indexed
Capabilities
Memories
MCP calls
Search latency
Decision routes
Fallback rate
Pending snapshots
Backup status
Open conflicts
```

---

## Testes obrigatórios

```text
Claude writes → Codex reads
Codex writes → Gemini reads
Gemini writes → Claude reads
Antigravity writes → Codex reads

new session → memory survives
new PC → memory survives

GitHub project → automatically indexed

project A → finds reusable code from project B

old memory → historically accessible
superseded memory → not current

source/provenance → always available

wrong AI inference → does not become truth

Cloud failure → safe retry
backup restore → successful
```

---

## Disaster Recovery

Simular:

```text
OLD PC = DESTROYED
```

Em PC novo:

```text
install Git
install Claude
install Codex
install Gemini
install Antigravity

authenticate
clone projects
connect Remote MCP
```

Resultado esperado:

```text
same projects
same memory
same capabilities
same decisions
same history
same Brain
```

---

## Ordem de implantação

| Milestone | Entrega |
|---|---|
| M0 | contratos e arquitetura |
| M1 | Google infrastructure |
| M2 | Brain Core + PostgreSQL |
| M3 | Remote MCP |
| M4 | GitHub Indexer |
| M5 | Project/Capability Intelligence |
| M6 | Retrieval híbrido |
| M7 | Decision Plane pré-treinado |
| M8 | Memory Compiler + temporal/provenance |
| M9 | Claude/Codex/Gemini/Antigravity |
| M10 | Tiny Edge + snapshots locais |
| M11 | Backup/PITR/Vault |
| M12 | Reuse Engine |
| M13 | observabilidade + E2E + disaster recovery |

---

## Fora do V1

```text
❌ treinar nosso LLM
❌ fine-tuning obrigatório
❌ Neo4j
❌ Graphiti obrigatório
❌ Mem0 + Letta + Cognee juntos
❌ várias memories
❌ vários bancos vetoriais
❌ Brain principal no PC
❌ auto-commit para backup
❌ agentes decidindo a verdade sozinhos
```

---

## Regra final

> **Código resolve o exato. Retrieval encontra o que já sabemos. Modelos pré-treinados tomam microdecisões. Claude/Codex/Gemini raciocinam quando necessário. O Lumenva Brain lembra de tudo. GitHub guarda o código. Google guarda o estado e o backup. O PC é descartável.**
