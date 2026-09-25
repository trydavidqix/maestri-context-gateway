# Lumenva Brain — Plano de Implantação

## Objetivo

Construir o **Lumenva Brain** como a camada central de contexto, memória institucional, governança e conhecimento temporal da Lumenva, usando **Hindsight como motor de memória**, mas mantendo toda a arquitetura específica da Lumenva desacoplada do engine.

A regra principal é:

> **Hindsight é o motor interno. Lumenva Brain é o produto e a interface que os agentes conhecem.**

Assim, o Hindsight pode ser substituído no futuro sem obrigar a reescrever Maestri, Claude, Codex, Gemini/Jules ou os demais agentes.

---

## 1. Arquitetura principal

```text
                         LUMENVA
                            │
                         MAESTRI
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
     Claude CEO        Codex Engineer     Gemini/Jules
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ LUMENVA BRAIN API   │
                 │     NOSSO CÓDIGO    │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼───────────────┐
             │              │               │
        CONTEXT         GOVERNANCE       MEMORY
        COMPILER          LAYER          ADAPTER
             │              │               │
             │              │               ▼
             │              │          HINDSIGHT
             │              │               │
             └──────────────┼───────────────┘
                            │
                            ▼
                     POSTGRES / NEON
                       + pgvector
```

### Princípio de desacoplamento

```text
Hindsight upstream
        │
        ▼
Hindsight Adapter
        │
        ▼
Lumenva Brain
```

Se no futuro surgir um engine melhor:

```text
Hindsight Adapter
        ↓
Graphiti Adapter
```

ou:

```text
Hindsight Adapter
        ↓
Lumenva Native Engine
```

O restante da Lumenva continua igual.

---

## 2. Banco de dados

Usar **Postgres/Neon + pgvector**, mantendo os dados do engine e os dados do domínio Lumenva separados.

```text
Postgres
│
├── hindsight.*
│      └── tabelas internas do Hindsight
│
└── lumenva_brain.*
       ├── agents
       ├── tasks
       ├── runs
       ├── sources
       ├── events
       ├── facts
       ├── fact_versions
       ├── fact_evidence
       ├── relations
       ├── profiles
       ├── checkpoints
       └── access_log
```

### Regra

Nunca acoplar o domínio da Lumenva diretamente às tabelas internas do Hindsight.

O acesso ao Hindsight passa sempre pelo adapter.

---

## 3. Estrutura do serviço Brain

```text
services/brain/
│
├── api/
│   ├── context
│   ├── remember
│   ├── recall
│   ├── checkpoint
│   ├── verify
│   └── forget
│
├── adapters/
│   └── hindsight/
│
├── context/
│   ├── compiler
│   ├── budget
│   └── ranking
│
├── memory/
│   ├── extractor
│   ├── dedupe
│   ├── temporal
│   ├── provenance
│   └── authority
│
├── governance/
│   ├── policies
│   ├── permissions
│   └── source-authority
│
├── workers/
│   ├── consolidate
│   ├── temporal-resolver
│   └── profile-builder
│
└── mcp/
    └── server
```

---

## 4. MCP próprio da Lumenva

Claude, Codex, Gemini/Jules e outros agentes **não acessam diretamente os detalhes internos do Hindsight**.

Eles enxergam somente ferramentas estáveis do Lumenva Brain:

```text
lumenva_context
lumenva_recall
lumenva_remember
lumenva_checkpoint
lumenva_source
```

Exemplo:

```text
lumenva_context(
    project="Lumenva",
    task="implementar inbox"
)
```

O Brain decide internamente como compor o contexto:

```text
Hindsight
+
fatos temporais
+
decisões
+
source-of-truth checks
+
profiles
+
context budget
```

---

## 5. Início de uma task

Quando um agente recebe uma tarefa, Maestri cria a identidade operacional:

```text
task_id = task_9821
project_id = lumenva
agent_id = codex-engineer
run_id = run_...
session_id = session_...
```

Depois executa:

```text
Maestri
   │
   ▼
brain.context()
   │
   ├── Hindsight Reflect
   ├── fatos recentes
   ├── arquitetura
   ├── decisões
   ├── convenções
   ├── bugs conhecidos
   └── task history
   │
   ▼
Context Compiler
```

O Context Compiler deve entregar somente o que é relevante para a task.

Exemplo de resposta:

```text
PROJECT
Lumenva

CURRENT ARCHITECTURE
...

RELEVANT DECISIONS
...

CURRENT TASK
...

KNOWN CONSTRAINTS
...

PREVIOUS FAILURES
...

SOURCE OF TRUTH
GitHub commit abc123
```

Objetivo: evitar enviar dezenas de milhares de tokens de histórico bruto ao agente.

---

## 6. Durante a task

Não consultar o Brain a cada pensamento ou tool call.

O agente trabalha normalmente:

```text
Codex
 │
 ├── lê código
 ├── implementa
 ├── testa
 ├── encontra bug
 └── resolve
```

O Brain é consultado novamente somente quando necessário:

```text
brain.recall(
  "por que escolhemos Neon?"
)
```

Isso reduz latência, custo e ruído.

---

## 7. Checkpoint no final da task

Toda task importante termina com:

```text
brain.checkpoint()
```

O agente envia dados estruturados:

```json
{
  "task_id": "task_9821",
  "agent_id": "codex-engineer",
  "decisions": [
    "Auth middleware agora roda no gateway."
  ],
  "bugs_fixed": [
    "Race condition durante token refresh."
  ],
  "source_commit": "abc123"
}
```

O Brain não armazena isso cegamente.

Pipeline:

```text
CHECKPOINT
    │
    ▼
normalize
    │
    ▼
extract facts
    │
    ▼
dedupe
    │
    ▼
source verification
    │
    ▼
temporal resolution
    │
    ▼
Hindsight retain
    │
    ▼
provenance
```

---

## 8. Camada temporal inspirada no Graphiti

Essa camada é código da Lumenva.

Quando um fato muda, não apagamos o anterior.

Exemplo:

Antes:

```text
Lumenva uses Supabase
```

Depois:

```text
Lumenva uses Neon
```

Registro antigo:

```text
FACT #1
subject: Lumenva
predicate: database
value: Supabase

valid_from: 2026-01
valid_until: 2026-09
status: SUPERSEDED
```

Registro atual:

```text
FACT #2
subject: Lumenva
predicate: database
value: Neon

valid_from: 2026-09
valid_until: null
status: ACTIVE
```

Relação:

```text
FACT #1
    │
    └── SUPERSEDED_BY → FACT #2
```

### Campos temporais

```text
valid_from
valid_until
observed_at
created_at
processed_at
expired_at
superseded_by
status
```

---

## 9. Authority Engine

Nem toda fonte possui o mesmo nível de autoridade.

Exemplo conceitual:

```text
GitHub HEAD                authority máxima
runtime/test comprovado    autoridade muito alta
config real                autoridade muito alta
blueprint aprovado         autoridade alta
usuário explícito          autoridade alta
agent inference            autoridade intermediária
```

A regra fundamental é:

> **Evidência real vence inferência de agente.**

Se a memória disser que produção está na Vercel, mas a configuração real mostrar VPS, o Brain deve corrigir a memória e manter a evidência.

---

## 10. Provenance

Cada fato importante deve apontar para sua origem.

```text
FACT
 ├── source
 ├── agent
 ├── task
 ├── session
 ├── run
 ├── commit
 ├── timestamp
 └── evidence
```

Exemplo:

```text
"Produção usa VPS"

source_type:
github_config

source:
docker/production...

commit:
67ab98...

discovered_by:
codex

verified_by:
claude
```

O objetivo é transformar memória em conhecimento auditável.

---

## 11. Responsabilidade do Hindsight

Não implementamos inicialmente do zero:

```text
embeddings
vector engine
BM25
graph retrieval
reflect
reranking
memory ingestion
mental models
observations
knowledge pages
```

Essas funções ficam com o Hindsight.

A Lumenva implementa o domínio específico:

```text
Agent
Task
Run
Commit
Authority
Approval
Temporal Truth
Source of Truth
Permissions
Project Scopes
```

---

## 12. Mental Models

Criar mental models fixos por projeto.

Exemplo para Lumenva:

```text
architecture
current_state
coding_conventions
infrastructure
agent_roles
known_problems
important_decisions
security_rules
```

Maestri poderá consultar diretamente:

```text
brain.profile("architecture")
```

sem disparar uma busca ampla em todo o histórico.

---

## 13. Knowledge Pages

Gerar visões Markdown automaticamente:

```text
brain/
├── architecture.md
├── infrastructure.md
├── decisions.md
├── conventions.md
├── known-issues.md
├── agents.md
└── current-state.md
```

### Importante

Knowledge Pages não são o Source of Truth.

São projeções do Brain para leitura humana e consumo dos agentes.

---

## 14. Maestri como controlador

Fluxo completo:

```text
                    USER
                      │
                      ▼
                   MAESTRI
                      │
                creates TASK
                      │
                      ▼
               LUMENVA BRAIN
                      │
               compile context
                      │
                      ▼
        Claude / Codex / Gemini / Jules
                      │
                    work
                      │
                      ▼
                  checkpoint
                      │
                      ▼
               LUMENVA BRAIN
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    Hindsight     temporal       provenance
        │          resolver           │
        └─────────────┼─────────────┘
                      │
                  consolidate
                      │
                      ▼
                updated knowledge
                      │
                      ▼
               next agent/task
```

---

# Plano de implantação — 7 fases

## Fase 1 — Foundation

Objetivo: subir a fundação do Brain com o mínimo de customização.

Entregas:

- Hindsight instalado e isolado por adapter.
- Neon/Postgres + pgvector configurado.
- Schemas `hindsight` e `lumenva_brain` separados.
- Health checks.
- Configuração segura de secrets.
- Testes básicos de retain/recall.

Critério de conclusão:

- Uma memória entra pelo adapter e pode ser recuperada de forma consistente.

---

## Fase 2 — Brain API

Objetivo: criar a API estável que os agentes usarão.

Endpoints/ações principais:

```text
context
recall
remember
checkpoint
verify
forget
health
```

Critério de conclusão:

- Nenhum agente precisa conhecer diretamente a API interna do Hindsight.

---

## Fase 3 — Identity

Objetivo: tornar toda memória contextualizada por execução.

Entidades:

```text
project_id
task_id
run_id
agent_id
session_id
workspace_id
```

Critério de conclusão:

- Toda nova memória pode ser rastreada até projeto, task, agente e execução.

---

## Fase 4 — Temporal + Provenance

Objetivo: implementar verdade temporal e rastreabilidade.

Componentes:

- facts
- fact_versions
- fact_evidence
- relations
- sources
- `valid_from`
- `valid_until`
- `superseded_by`
- versionamento
- source commits
- provenance

Critério de conclusão:

- O Brain consegue responder tanto "o que é verdade agora?" quanto "o que era verdade antes?".

---

## Fase 5 — Maestri Integration

Objetivo: integrar memória ao ciclo real de trabalho.

No começo de cada task:

```text
brain.context()
```

No final:

```text
brain.checkpoint()
```

Durante a task:

```text
brain.recall()
```

somente quando necessário.

Critério de conclusão:

- Claude/Codex/Gemini/Jules conseguem trocar de sessão sem perder o contexto essencial da task.

---

## Fase 6 — Governance

Objetivo: impedir que memória incorreta se torne "verdade".

Implementar:

- source authority
- permission scopes
- agent permissions
- verification
- approval requirements
- source-of-truth checks
- conflict resolution
- audit trail

Critério de conclusão:

- Fatos conflitantes são resolvidos usando evidência, temporalidade e autoridade da fonte.

---

## Fase 7 — Consolidation

Objetivo: transformar eventos e fatos brutos em conhecimento institucional limpo.

Implementar:

- profiles
- mental models
- knowledge pages
- dedupe
- stale detection
- cleanup
- context budgeting
- observabilidade
- métricas de recall
- métricas de qualidade

Critério de conclusão:

- O Brain consegue manter conhecimento útil sem crescimento descontrolado de contexto e memória.

---

# Resultado final

O sistema não será simplesmente um fork do Hindsight.

```text
Lumenva Brain
        │
        ├── Context OS
        ├── Governance
        ├── Temporal Knowledge
        ├── Agent Memory
        └── Hindsight Engine
```

O Hindsight continua sendo uma dependência interna substituível.

O Lumenva Brain é a camada canônica usada por Maestri, Claude, Codex, Gemini/Jules e qualquer agente futuro.

---

## Regra final de verdade

```text
GitHub / configuração / runtime
        >
Blueprint/ADR aprovado
        >
Memória verificada
        >
Inferência de agente
```

O Brain deve preservar contexto e histórico, mas nunca substituir uma fonte real e mais autoritativa por uma inferência antiga.

