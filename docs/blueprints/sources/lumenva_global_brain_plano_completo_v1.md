# Lumenva Global Brain — Plano Completo de Implantação

## 1. Objetivo final

Construir um único cérebro permanente para:

- Claude Code
- Codex
- Gemini CLI
- Antigravity

Todos compartilham o mesmo **Lumenva Global Brain**, independente do projeto, sessão, agente ou PC.

O Brain deve conhecer simultaneamente:

- todos os projetos;
- código reutilizável;
- decisões arquiteturais;
- erros e soluções;
- procedimentos;
- componentes;
- dependências;
- capabilities;
- histórico temporal;
- fontes/proveniência;
- sessões relevantes;
- estado dos agentes.

Exemplo esperado:

> Quero criar um sistema de reservas.

O Brain responde com evidências:

- CRM já possui autenticação, clientes, WhatsApp e notificações.
- Scheduler já possui calendário e agendamento.
- Commerce já possui pagamentos.
- Das 9 capacidades necessárias, 7 já existem total ou parcialmente.
- Precisamos criar apenas o que falta.

A cobertura deve ser calculada a partir de capacidades verificadas, não por estimativa inventada.

---

## 2. Princípios arquiteturais

1. Um Brain global.
2. Uma memória canônica.
3. Todos os agentes compartilham a mesma memória.
4. PC contém o mínimo possível.
5. GitHub = verdade do código.
6. Google = verdade do estado/memória.
7. Backup Google independente.
8. Histórico não é sobrescrito.
9. IA não transforma inferência em verdade automaticamente.
10. Não treinamos modelos no V1.
11. Código resolve tarefas exatas.
12. Retrieval encontra conhecimento.
13. Modelos pré-treinados resolvem microdecisões.
14. Claude/Codex/Gemini entram quando é necessário raciocínio profundo.
15. O PC deve ser descartável sem perda de conhecimento.

---

## 3. Arquitetura final

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
              │                         │
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

## 4. Divisão entre PC, GitHub e Google

| Local | GitHub | Google |
|---|---|---|
| Claude Code | código | Brain API |
| Codex | branches | Remote MCP |
| Gemini | commits | Cloud SQL |
| Antigravity | PRs | pgvector |
| Git | schemas | embeddings |
| MCP config | migrations | Memory Compiler |
| Tiny Edge | skills/hooks | Project Index |
| cache temporário | IaC | Capability Graph |
| working tree | documentação | Event Store |
| | workflows | backups |
| | | PITR/restore |

O PC pode desaparecer. Nada canônico depende dele.

---

## 5. Repositório principal

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

## 6. Fase 0 — Congelar contratos

Antes da implementação, definir interfaces estáveis.

Todo request do Brain carrega quando aplicável:

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

Toda memória pode carregar:

```text
source
authority
confidence
valid_from
invalid_at
superseded_by
```

### Gate
Schemas e contratos MCP aprovados.

---

## 7. Fase 1 — Infraestrutura Google

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

Firebase/SQL Connect pode ser usado como camada complementar para UI/apps e integrações Google.

Ativar PostgreSQL + pgvector e mecanismo de busca lexical/BM25 adequado.

### Gate
Cloud Run consegue escrever e consultar o PostgreSQL.

---

## 8. Fase 2 — Brain Core

Implementar `brain-api`.

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

Endpoints internos:

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

### Gate

```text
write memory
restart service
read memory
```

Tudo funcionando na cloud.

---

## 9. Fase 3 — Banco canônico

Estrutura mínima:

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
routing_events
```

### memory_events

Append-only:

```text
id
agent_id
session_id
project_id
event_type
raw_content
source
hash
created_at
```

### memories

```text
id
type
subject
content
summary

scope_type
scope_id

confidence
importance
authority

valid_from
invalid_at
superseded_by

created_at
updated_at
```

### memory_sources

```text
memory_id
repository
branch
commit_sha
file
symbol
session_id
agent_id
source_type
```

---

## 10. Fase 4 — Remote Memory MCP

Ferramentas do V1:

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

Recebe projeto, branch e task e retorna apenas o contexto relevante.

### brain_reuse

Recebe um objetivo, decompõe em capacidades e procura implementações existentes em todo o ecossistema.

---

## 11. Fase 5 — GitHub Project Intelligence

A cloud aprende os projetos diretamente do GitHub:

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

O conhecimento dos projetos commitados não depende do PC.

---

## 12. Fase 6 — Workspace Intelligence

O indexer analisa:

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

Descobre:

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

Primeiro análise determinística; IA apenas para interpretação semântica necessária.

---

## 13. Fase 7 — Capability Engine

Transformar código em conhecimento reutilizável.

Não basta:

```text
src/auth/firebase.ts
```

O Brain deve saber:

```text
Project CRM
IMPLEMENTS
Authentication
```

Modelo:

```text
capability:
  authentication

evidence:
  project
  repo
  branch
  commit
  files
  symbols
  tests

maturity:
  experimental
  partial
  production
```

Exemplos de capabilities:

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

---

## 14. Fase 8 — Global Capability Graph

Representar:

```text
Project
 ├── implements → Capability
 ├── uses → Technology
 ├── depends_on → Component
 └── related_to → Project
```

No V1, PostgreSQL é suficiente. Não adicionar Neo4j sem necessidade comprovada.

---

## 15. Fase 9 — Retrieval Engine

Pipeline híbrido:

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

Retornar apenas o necessário para a tarefa.

---

## 16. Fase 10 — Decision Plane

Substituir o Jev pago por componentes abertos/pré-treinados.

Arquitetura:

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

### Camada 0 — Código

Resolver sem IA:

```text
file exists?
test passed?
branch?
hash?
permission?
```

### Camada 1 — Retrieval/similarity

Resolver casos semanticamente claros.

### Camada 2 — Pretrained routing

Usar classificadores e routing pré-treinados.

### Camada 3 — Laya

Para:

```text
yes/no
choice
score
classification
```

### Camada 4 — modelos grandes

Somente quando a decisão continuar ambígua.

---

## 17. Zero treinamento próprio no V1

Fluxo correto:

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

Fine-tuning pequeno somente como última opção.

Talvez nunca seja necessário.

---

## 18. Agent Capability Registry

Guardar capacidades como dados, não dentro dos pesos do modelo.

```text
agent: codex

capabilities:
  coding
  refactor
  tests
```

```text
agent: gemini

capabilities:
  google
  multimodal
  research
```

```text
agent: claude

capabilities:
  architecture
  planning
  reasoning
```

Router combina:

```text
task
context
capability
availability
permissions
session
quota
```

---

## 19. Fase 11 — Memory Compiler

Eventos não viram memória diretamente.

```text
EVENT
 ↓
fast filter
 ↓
candidate?
 ↓ yes
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

Gemini pode ser o compiler principal inicialmente, mas a interface deve permanecer provider-neutral:

```text
CompilerProvider
  ├── Gemini
  ├── OpenAI
  └── Claude
```

---

## 20. Memória temporal

Nunca sobrescrever silenciosamente.

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

Permite consultar estado atual e estado histórico.

---

## 21. Provenance

Toda memória importante deve responder:

> Como sabemos disso?

Fluxo:

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

## 22. Integração Claude Code

Usar globalmente:

```text
Remote MCP
hooks
skills
global instructions
```

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

## 23. Integração Codex

Configurar Remote MCP uma vez.

Regra global:

```text
Antes de implementar uma nova capability,
consulte o Lumenva Brain.
```

Fluxo:

```text
Codex starts project
      ↓
brain_context
```

Antes de criar algo novo:

```text
brain_reuse
```

---

## 24. Integração Gemini

Criar extensão global com:

```text
Remote MCP
hooks
skills
```

Skills:

```text
search-projects
reuse-existing-code
find-architecture
find-previous-solution
```

---

## 25. Integração Antigravity

Usar o mesmo Brain e Remote MCP.

Nada de memória própria.

---

## 26. Tiny Edge no PC

Único componente nosso relevante localmente.

Responsabilidades:

```text
detect current repo
detect branch
detect git diff
detect new files
detect current workspace
send lightweight events
```

Não guarda memória canônica.

---

## 27. Proteção do trabalho não commitado

Código commitado:

```text
PC
 ↓
GitHub
```

Código ainda não commitado:

```text
PC
 ↓
Tiny Edge
 ↓
encrypted workspace snapshot
 ↓
Google Cloud Storage
```

Não usar auto-commit como mecanismo de backup.

---

## 28. Sistema de backup

Nunca criar `latest.zip`.

Cada execução cria objetos únicos:

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

Cada backup tem:

```text
timestamp
UUID
hash
source commit
backup run ID
```

---

## 29. Estratégia de backup

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

A frequência exata será ajustada conforme custo e volume.

---

## 30. Três níveis de recuperação

### Level 1

```text
Git/GitHub history
memory_events
database history
```

### Level 2

```text
Cloud SQL backup + PITR
```

### Level 3

```text
Google immutable backup vault
```

Usar soft-delete onde fizer sentido.

---

## 31. Segurança GitHub → Google

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

Evitar service-account key permanente.

Secrets ficam em Google Secret Manager.

---

## 32. Bootstrap dos projetos existentes

```text
GitHub account/org
       ↓
discover repositories
       ↓
read metadata
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

Gerar o `GLOBAL PROJECT MAP`.

---

## 33. Reuse Engine

Fluxo:

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

Sempre com evidências.

---

## 34. Learning sem treinamento

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

Registrar em:

```text
routing_events
```

No V1 isso alimenta:

```text
metrics
threshold calibration
bad-route analysis
examples
evaluation
```

Não retreinar automaticamente.

---

## 35. Observabilidade

Dashboard mínimo:

```text
Brain status
Projects indexed
Files indexed
Capabilities
Memories
MCP calls
Search latency
Cache hit rate
Decision routes
Fallback rate
Wrong-route reports
Pending snapshots
Backup status
Open conflicts
```

---

## 36. Testes obrigatórios

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

## 37. Teste de desastre

Cenário:

```text
OLD PC = DESTROYED
```

PC novo:

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

## 38. Ordem real de implantação

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

## 39. O que NÃO entra no V1

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

## 40. Arquitetura final resumida

```text
                     USER
                      │
          ┌───────────┼───────────┐
          │           │           │
       Claude       Codex      Gemini/Antigravity
          │           │           │
          └───────────┼───────────┘
                      │
                 Remote MCP
                      │
                      ▼
               LUMENVA BRAIN
                      │
        ┌─────────────┼──────────────┐
        │             │              │
    Decision       Memory         Project
     Plane          Core        Intelligence
        │             │              │
Rules + pretrained   │        Capability Graph
classifiers + Laya   │              │
        │             │              │
        └─────────────┼──────────────┘
                      │
               Retrieval Engine
                      │
         BM25 + pgvector + graph
                      │
              Cloud SQL PostgreSQL
                      │
          ┌───────────┴────────────┐
          │                        │
        GitHub              Google Backup Vault
         CODE                  RECOVERY
```

---

## Princípio operacional final

> **Código resolve o exato. Retrieval encontra o que já sabemos. Modelos pré-treinados tomam microdecisões. Claude/Codex/Gemini raciocinam quando necessário. O Lumenva Brain lembra de tudo. GitHub guarda o código. Google guarda o estado e o backup. O PC é descartável.**
