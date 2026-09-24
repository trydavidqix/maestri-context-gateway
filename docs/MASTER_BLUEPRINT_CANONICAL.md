# MASTER_BLUEPRINT_CANONICAL.md

# MAESTRI — MEGA BLUEPRINT CANÔNICO

**Runtime persistente + Fast Decision + Context/Memory + Claude CEO + Codex + Antigravity + Maestri Council + C4 + MaestriBench + AutoImprove + Reflex**

---

## 0. GOVERNANÇA DO DOCUMENTO

**Status:** fonte canônica de contexto arquitetural.  
**Modo de consolidação:** LOSSLESS.  
**Escopo:** todo o conhecimento útil e válido identificado nesta sessão sobre o projeto Maestri.
**Entrega desta execução:** somente `MASTER_BLUEPRINT_CANONICAL.md`; nenhuma imagem deve ser gerada.

### 0.1 Regra de integridade

Este documento aplica:

```text
INVENTARIAR
→ CONECTAR
→ RECONCILIAR
→ DEDUPLICAR
→ SIMPLIFICAR
→ FUNDIR
→ AUDITAR
→ ENTREGAR
```

Deduplicação remove repetição, não capacidade.

### 0.2 Estados

- `CANONICAL`: definição corrente.
- `PLANNED`: desenhado/aprovado, sem prova de implementação no corpus.
- `PROPOSED — NOT CANONICAL`: ideia preservada, ainda não promovida.
- `EXPERIMENTAL`: requer benchmark/shadow antes de controle.
- `IMPLEMENTED`: somente quando comprovado.
- `VALIDATED`: comprovado por testes/evals.
- `SUPERSEDED`: substituído explicitamente.
- `DEPRECATED`: mantido por histórico/compatibilidade.
- `UNKNOWN`: não definido.
- `UNRESOLVED`: conflito sem evidência para escolher.
- `EXTERNAL_ENRICHMENT`: referência externa útil, sem autoridade para sobrescrever o projeto.

### 0.3 Evoluções já reconciliadas

1. `GPT-5.6 Sol` em C1/C2/C3 → **GPT-6 Sol**.
2. `Opus 5` fixo → política de **último Opus disponível**, preservando Opus 5 como baseline histórico.
3. “velocidade só depois de Reflex treinado” → **SUPERSEDED**: Fast Path entra cedo.
4. `maestri.decide()` vira interface conceitual única para microdecisões.
5. Reflex próprio ModernBERT 149M deixa de ser requisito automático e vira **future challenger**.
6. MaestriBench entra antes de AutoImprove e antes da decisão de treinar Reflex próprio.
7. AutoImprove entra antes do Reflex próprio para produzir dados com outcome, avaliação e correção.
8. Laya typed-decisions aparece posteriormente como candidato de Contextual Reflex V0, mas conflita com “Laya fora do V1”; permanece `UNRESOLVED`.

---

# 1. VISÃO DO SISTEMA

O **Maestri** é um control plane persistente para uma empresa de agentes.

Ele deve:

- possuir sessão e estado próprios;
- persistir events, tasks, dependências, decisões, outcomes e reports;
- reduzir a carga operacional do Claude;
- manter Claude como CEO e único interlocutor humano;
- usar Codex e Antigravity como runtimes técnicos independentes;
- usar Council somente quando traz valor;
- produzir plano e relatório permanentes para decisões do Council;
- acelerar microdecisões desde o primeiro estágio;
- medir qualidade/latência/custo/recuperação com MaestriBench;
- capturar falhas e aprender com elas;
- gerar melhorias como candidates isolados;
- promover somente via benchmark + holdout + shadow + canary;
- executar rollback automático em regressões;
- manter hard policies fora do alcance do sistema de auto-melhoria;
- treinar modelo próprio somente quando os dados mostrarem ganho.

### 1.1 Resultado operacional desejado

Hoje, conceitualmente:

```text
Claude
├── CEO
├── scheduler
├── memória
├── roteador
├── retry manager
├── status reporter
└── arquiteto
```

Objetivo:

```text
CLAUDE CEO

70–85%
estratégia
arquitetura
decisões difíceis
exceções
comunicação

15–30%
coordenação inevitável
```

O restante desce para Maestri.

---

# 2. PRINCÍPIOS E INVARIANTES

1. Maestri é dono da sessão operacional.
2. Claude CEO é a única interface humana.
3. Claude CEO é a autoridade executiva final.
4. Hard Policy precede qualquer decisão probabilística.
5. `main` é protegida.
6. `direct_main_write = false`.
7. `auto_merge = false`.
8. Council aconselha; votação não define verdade.
9. C4 não vota.
10. C4 não reabre a decisão do CEO.
11. Toda Council run termina em report, inclusive “não implementar”.
12. Os seis conselheiros recebem o mesmo snapshot.
13. Cross-review acontece entre famílias.
14. Progresso vem do Progress Engine.
15. AutoImprove não pode editar o juiz que o avalia.
16. Holdout/gold/graders core/hard policies são protegidos.
17. Falha crítica, data loss ou policy violation invalida candidate independentemente do score.
18. Pesquisa interna precede pesquisa externa.
19. Falha confirmada pode virar regression case.
20. Reflex precisa poder `ABSTAIN`.
21. Treino do Reflex próprio só acontece com evidência.
22. Blueprint não equivale a implementação comprovada.
23. Safety/correctness/reliability têm precedência sobre custo/latência.
24. O **Owner humano** é a autoridade superior para objetivos, aprovações críticas e exceções; Claude CEO é a autoridade executiva dentro do escopo autorizado.
25. Maestri controla transições de estado de jobs; executores não se autoaprovam nem se autodeclaram concluídos fora dos gates.
26. Todo agente runtime persistente deve nascer da **Agent Factory**; instanciação manual só é permitida para diagnóstico explicitamente `EPHEMERAL`.
27. Toda capacidade concedida a um agente deve ser escopada ao job/projeto e revogável.
28. Loops de execução devem ter orçamento e mecanismo explícito de escalonamento para evitar repetição sem progresso.
29. Evidência e critérios de aceite são requisitos de conclusão, não decoração de relatório.

Prioridade:

```text
SAFETY
→ CORRECTNESS
→ RELIABILITY
→ QUALITY
→ COST
→ LATENCY
```

---

# 3. STATUS CANÔNICO

## 3.1 PLANNED / CANONICAL

- Maestri Runtime.
- Session Kernel.
- Event Store.
- Task DAG.
- Policy Engine.
- Progress Engine.
- Context Engine.
- Memory Retriever.
- Fast Decision Engine.
- Agent Supervisor.
- Claude/Codex/Antigravity adapters.
- Maestri Council 3+3.
- C4.
- Mandatory Reports.
- MaestriBench.
- Auto Evaluation.
- Failure Intelligence.
- Improvement Context Builder.
- Evidence Broker.
- Improvement Memory.
- AutoImprove.
- Benchmark Firewall.
- Champion/Challenger.
- Shadow/Canary/Rollback.

## 3.2 PROPOSED / EXPERIMENTAL

- Contextual Reflex V0.
- Laya typed-decisions como possível V0.
- `@receptron/laya` ONNX/TypeScript.

## 3.3 FUTURE CHALLENGER

- Maestri Reflex próprio ModernBERT-base 149M.

## 3.4 SUPERSEDED

- GPT-5.6 Sol em C1/C2/C3.
- “Reflex próprio obrigatório depois da Fase 16”.
- “ganho de velocidade só quando Reflex treinado existir”.


## 3.5 IMPLEMENTED / PARTIAL / HISTORICAL EVIDENCE

Somente evidências explicitamente registradas na sessão:

- MCG/dashboard/telemetry/SSE/budgets/alerts/CEO Inbox/Maestri Wire/Validation Lab: **PARTIAL / IN IMPLEMENTATION** no estado histórico de 2026-09-22, conforme seção `19A`.
- Referências de commits/files do branch `vps`: **HISTORICAL REPOSITORY REFERENCE**, não prova de que seguem como HEAD atual.
- O restante da arquitetura Maestri consolidada deve ser tratado como `PLANNED` até validação no repo/testes.

---

# 4. ARQUITETURA CANÔNICA

```text
                                      USUÁRIO
                                        ⇅
                                   CLAUDE CEO
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAESTRI CONTROL PLANE                               │
│                                                                             │
│ Session Kernel │ Event Store │ Task DAG │ Policy │ Context │ Memory         │
│ Progress       │ Agents      │ Reports  │ Trace  │ Telemetry│ Improvement   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
            FAST DECISION ENGINE          COMPLEX DECISION
                     │                           │
       hard rules / heuristics                   ▼
       context + memory                     MAESTRI COUNCIL
       contextual model                     3 Codex + 3 AGY
       Claude fallback                          │
                     └─────────────┬─────────────┘
                                   ▼
                               CLAUDE CEO
                              FINAL DECISION
                                   │
                                   ▼
                       C4 IMPLEMENTATION ARCHITECT
                                   │
                                   ▼
                          MANDATORY REPORT + DAG
                                   │
                                   ▼
                           EXECUTION PIPELINE
                                   │
                           traces + outcomes
                                   ▼
                              MAESTRIBENCH
                                   │
                            AUTO EVALUATION
                                   │
                          FAILURE INTELLIGENCE
                                   │
                    IMPROVEMENT CONTEXT BUILDER
                                   │
                             EVIDENCE BROKER
                                   │
                           AUTOIMPROVE LOOP
                                   │
                    CHAMPION × CHALLENGERS
                                   │
                     HOLDOUT → SHADOW → CANARY
                                   │
                        PROMOTE ↔ ROLLBACK
                                   └─────────────────↻
```

---

# 5. COMPONENTES E RESPONSABILIDADES

## 5.1 Session Kernel

Responsável por:

- `maestri_session_id`;
- association provider session/thread IDs;
- resume;
- checkpoint;
- crash recovery;
- reconstruction;
- current operational state.

## 5.2 Event Store

Tecnologia planejada:

```text
SQLite
+
WAL
+
append-only events
```

Ativação:

```sql
PRAGMA journal_mode=WAL;
```

O estado atual é projeção dos eventos, não apenas `task.status`.

## 5.3 Task Engine / DAG

Cada task preserva quando aplicável:

- ID;
- owner;
- dependencies;
- status;
- inputs;
- outputs;
- blockers;
- files;
- tests;
- acceptance criteria;
- relation to decision/report;
- branch/base SHA/HEAD/commits/worktree.

## 5.4 Policy Engine

Ações protegidas:

```text
main merge
production deploy
secrets
auth policies
DB destructive migration
permission escalation
delete critical data
```

Fluxo:

```text
ACTION
  ↓
HARD POLICY
  ↓
ALLOW / BLOCK / CEO ESCALATION
```

## 5.5 Context Engine

Context packs:

```text
MICRO PACK     ~1–2k tokens
STANDARD PACK  ~3–6k tokens
RECOVERY PACK  ~6–12k tokens
```

CEO Context Pack:

```text
MISSION
CURRENT PROGRESS
ARCHITECTURE
NON-NEGOTIABLE RULES
DECISIONS
ACTIVE TASK
RECENT DELTA
CURRENT BRANCH
TEST STATUS
BLOCKERS
NEXT EXPECTED ACTION
```

## 5.6 Memory Retriever

PLANNED.

Busca:

- decisões anteriores;
- tasks parecidas;
- outcomes;
- falhas;
- feedback humano;
- previous experiments;
- last-known-good;
- routing precedents.

UNKNOWN:

- embedding model;
- similarity metric;
- index implementation.

## 5.7 Progress Engine

Pesos:

```text
Planning          10%
Implementation    35%
Tests             20%
Review            15%
Fixes             10%
Final gates       10%
```

## 5.8 Agent Supervisor

Responsável por:

- process lifecycle;
- provider state;
- handoffs;
- retry;
- orchestration;
- provider recovery;
- task ownership.

## 5.9 Council Engine

Responsável por:

- triage;
- neutral framing;
- canonical question;
- parallel fan-out;
- isolation;
- anonymization;
- cross-review;
- blind-spot pass;
- forced debate;
- chairman handoff.

## 5.10 Report Engine

Responsável por:

- executive report;
- implementation plan;
- machine-readable JSON;
- Council transcript;
- evidence;
- plan import.

## 5.11 Trace Store / Telemetry

Registra:

```text
input tokens
cached tokens
output tokens
reasoning tokens
model
agent
task
duration
queue time
handoff time
blocked time
CEO calls
Council calls
retry count
success/failure
context pack
route
tool calls
tests
git state
feedback
champion/candidate
```

## 5.12 MaestriBench

Evaluation/benchmark plane para comparar system versions.

## 5.13 Failure Intelligence

Subcomponentes:

- Failure Detector;
- Failure Miner;
- Regression Locator;
- Root Cause Engine.

## 5.14 Improvement Context

Subcomponentes:

- Improvement Context Builder;
- Evidence Broker;
- Repo Retriever;
- Trace Retriever;
- History Retriever;
- Research Planner.

## 5.15 Improvement Memory

Armazena:

- successful changes;
- failed experiments;
- rolled-back changes;
- rejected hypotheses;
- known antipatterns;
- human feedback.

## 5.16 AutoImprove

Subcomponentes:

- Improvement Architect;
- Candidate Generator;
- Candidate Workspace;
- Tournament Engine;
- Promotion Gate;
- Shadow;
- Canary;
- Auto Rollback;
- Regression Flywheel.

## 5.17 Reflex Layers

1. Fast Path deterministic — CANONICAL.
2. Contextual Reflex V0 — PROPOSED/EXPERIMENTAL.
3. Maestri Reflex próprio — FUTURE CHALLENGER.

---

## 5.18 Agent Factory — CANONICAL

A **Agent Factory** foi definida anteriormente como obrigatória e não foi explicitamente revogada por nenhuma arquitetura posterior.

Regra:

> Nenhum agente runtime persistente deve ser instanciado manualmente fora da Factory, exceto diagnósticos explicitamente marcados `EPHEMERAL`.

### AgentDefinition

Campos recuperados do blueprint anterior:

```text
id
name
role
purpose
provider
model_profile
instructions
skills
allowed_tools
forbidden_tools
write_scope
context
memory
network_policy
secret_policy
risk
resource
timeout
tool_budget
acceptance
output_schema
```

### Factory subsystems

```text
AgentDefinition
     ↓
Validator
     ↓
Capability Resolver
     ↓
Provider Compiler
     ↓
Registry
     ↓
version / hash
     ↓
health probe
     ↓
runtime instance
```

Capacidades da Factory:

- templates;
- validators;
- capability resolver;
- provider compiler;
- registry;
- versioning;
- definition hash;
- health probes;
- provider-specific compilation;
- policy validation before instantiation.

### Templates preservados

```text
Explorer
Planner
Builder
Reviewer
Verifier
Security Reviewer
Architecture Reviewer
Plan Reviewer
QA Reviewer
Dependency Analyst
Incident Diagnostician
Researcher
```

Os agentes atuais `C1–C4`, `G1–G3`, Fresh Context Reviewer, CI Fixer e futuros agents devem ser representáveis como `AgentDefinition`/template ou especialização da Factory.

## 5.19 Contracts / Schemas de execução

### TaskContract

Campos recuperados:

```text
id
objective
context
source_of_truth
repo
branch
scope
requirements
targets
constraints
dependencies
allowed_tools
forbidden_tools
network_policy
secret_policy
verification
acceptance_criteria
risk
timeout
provider
fallback
requested_by
timestamps
```

O `TaskContract` é a entrada estável do trabalho e deve sobreviver a compaction/restart.

### TaskResult

Campos recuperados:

```text
status
summary
files
changes
tests
lint
typecheck
build
runtime
commit
branch
PR
CI
artifacts
errors
warnings
evidence
follow_up
usage
```

### ResultDigest / FailureDigest

Resumos limitados e estruturados para:

- delegação;
- handoff;
- retry;
- recovery;
- contexto de CEO;
- Context Pack;
- avaliação.

`FailureDigest` preserva a causa/falha/evidência necessária sem reenviar toda a trajetória.

### AcceptanceManifest

Cada critério de aceite deve possuir estado explícito:

```text
PASS
PENDING
BLOCKED
```

Conclusão de task/job exige que o AcceptanceManifest e os gates estejam coerentes.

### Protocol schemas históricos a preservar

O desenho anterior também previa schemas/protocolos para:

```text
job
approval
capability
context-pack
evidence
decision
handoff
```

Os nomes físicos finais desses schemas permanecem `UNKNOWN` quando não especificados.

## 5.20 State Ledger / ExecutionState

O antigo **State Ledger / ExecutionState** não é mantido como banco duplicado.

**Canonical disposition:** ele é uma **projeção do Event Store + Task DAG + Evidence + checkpoints**.

Deve reconstruir pelo menos:

```text
objective
phase
completed work
current work
remaining work
decisions
assumptions
tests
blockers
branches
commits
PRs
evidence
next action
```

Recovery após compaction/restart combina:

```text
TaskContract
+ Event Store / State Ledger projection
+ git status
+ git log
+ git diff
+ tests
+ evidence
+ checkpoints
+ provider resume
```

## 5.21 ContextPacket / ContextBudget / Progressive Disclosure

O Context Engine deve preservar a antiga disciplina de `ContextPacket` + `ContextBudget`.

Budget fields recuperados:

```text
max_tokens
max_files
max_bytes
retrieval_depth
expansion_count
expansion_budget
```

Princípio:

```text
minimum sufficient context
→ retrieve
→ expand only when justified
→ preserve source/provenance
```

Os packs `MICRO / STANDARD / RECOVERY` são a interface operacional; `ContextBudget` controla o orçamento interno.

## 5.22 Dependency Graph / Conflict Graph

Além do Task DAG:

- **Dependency Graph** determina quando uma task está `READY`;
- **Conflict Graph** detecta e serializa trabalhos que escrevem em áreas sobrepostas;
- trabalhos independentes podem paralelizar;
- overlapping writes não devem competir silenciosamente.

O Conflict Graph não substitui Git; ele reduz colisão antes do merge.

## 5.23 Execution Harness / Loop Engine

Capacidade preservada do Maestri V3/V4:

```text
PLAN
  ↓
ACT
  ↓
OBSERVE
  ↓
VERIFY
  ↓
CLASSIFY
  ├── success
  ├── retry
  ├── replan
  └── escalate
```

### Loop Detector

Detecta repetição sem progresso, especialmente o mesmo erro reaparecendo.

Budget histórico recuperado:

```text
max_iterations: 8
max_duration: 45 minutes
max_tokens: 150k
same_error_cap: 2
```

Ao estourar orçamento ou detectar loop improdutivo:

```text
ESCALATION_REQUIRED
```

com:

```text
objective
attempts
failures
evidence
suspected causes
```

para Claude CEO.

Esses números são parâmetros históricos aprovados do blueprint anterior; podem ser tunados futuramente via benchmark, mas não são descartados.

## 5.24 Evaluators / Evidence / Review

### Evidence Store / Evidence Guard

Toda execução relevante deve produzir evidência verificável.

`Evidence Guard` / `Progress Evidence Guard` bloqueia declarações de progresso/conclusão que não possuam evidência suficiente.

### Fresh Context Reviewer

Reviewer especializado que recebe:

```text
TaskContract
diff
acceptance criteria
evidence
```

e deliberadamente **não recebe o histórico do Builder**, reduzindo contaminação.

### Cross-Agent Review

Revisão independente de execução/código.

É diferente do cross-review do Council:

- Council cross-review avalia decisões/propostas;
- Cross-Agent Review avalia o artefato executado.

### CI Fixer

Loop especializado para falhas de CI, limitado pelos mesmos princípios de budget/loop detection.

### Evaluator Engine

O antigo Evaluator Engine é absorvido pela arquitetura atual:

```text
execution evaluators
→ MaestriBench / Auto Evaluation
→ evidence
→ pass/fail/retry/escalate
```

## 5.25 Compound Learning

Fluxo histórico preservado:

```text
episodic job memory
      ↓
extract lessons
      ↓
deduplicate
      ↓
validate
      ↓
candidate knowledge
      ↓
promote useful knowledge
      ↓
long-term memory
```

Regra:

> experiência não vira conhecimento durável automaticamente.

O conceito `Compound Learning Engine` é consolidado na arquitetura atual como:

```text
Improvement Memory
+ Regression Flywheel
+ validated lessons
+ Memory Retriever
```

sem criar um segundo sistema de memória concorrente.

## 5.26 Scheduler / Resource Router — canonical disposition

Os blueprints antigos possuíam `Scheduler/Router` / `Resource Router`.

Para evitar duplicação de serviços, suas responsabilidades são distribuídas canonicamente:

```text
Task Engine        → readiness / dependencies
Agent Supervisor   → availability / lifecycle
Fast Decision      → route decision
Policy Engine      → permission / risk
Conflict Graph     → write serialization
Budget Engine      → quota/resource constraints
```

O nome `Resource Router` permanece como alias histórico/possível facade, não como justificativa para um roteador paralelo.

## 5.27 Budget Engine

Budgets conhecidos incluem:

- ContextBudget;
- Loop Budget;
- provider/model quota;
- task/tool budget;
- MCG thresholds 50% / 80%;
- AutoImprove experiment budgets.

A implementação física única é `UNKNOWN`, mas o sistema não deve criar budgets concorrentes sem necessidade.


# 6. AGENTES E MODELOS

| ID | Agente | Runtime | Modelo planejado | Responsabilidade |
|---|---|---|---|---|
| CEO | Claude CEO | Claude Code | último Opus disponível | estratégia, arquitetura, decisão final, exceções, comunicação |
| C1 | System Architect | Codex | GPT-6 Sol High | interfaces, dependências, migração, longo prazo |
| C2 | Red Team | Codex | GPT-6 Sol High | failure modes, riscos, segurança, rollback |
| C3 | Code Auditor | Codex | GPT-6 Sol Medium | repo, APIs, testes, duplicações, viabilidade |
| G1 | Context Custodian | Antigravity | Gemini 3.8 Flash High | histórico, decisões, constraints, arquitetura canônica |
| G2 | Evidence Researcher | Antigravity | Gemini 3.8 Flash High | docs, evidência, referências, prior art |
| G3 | Pragmatist | Antigravity | Gemini 3.8 Flash Medium | YAGNI, menor solução, rollout, time-to-value |
| C4 | Implementation Architect / Planner | Codex | GPT-6 Astra High STANDARD | CEO decision → DAG + report executável |
| I1 | Improvement Architect | UNKNOWN | UNKNOWN | Evidence Pack → hypotheses/candidates |

Fallback C4:

```text
GPT-6 Sol High
```

Notas:

- `Opus 5` é baseline histórico.
- `GPT-5.6 Sol` nos C1–C3 é SUPERSEDED.
- Astra é reservado para final/DEEP devido a quota/custo.

---

## 6.1 Owner / autoridade humana

O humano/Owner fica acima da hierarquia operacional.

```text
OWNER
  ↓ goals / explicit approvals / overrides
CLAUDE CEO
  ↓ plans / decisions / delegation
MAESTRI
  ↓ controlled execution
EXECUTORS / REVIEWERS
```

Claude CEO é soberano na decisão operacional dentro do escopo aprovado, mas não substitui a autoridade do Owner sobre objetivos e ações críticas.

## 6.2 Matriz histórica de permissões — preservada

### Claude CEO

Pode:

- ler;
- pesquisar;
- raciocinar;
- planejar;
- produzir reports/drafts;
- criar jobs;
- pedir aprovação;
- revisar resultados;
- decidir/escalar.

Sem ordem/approval adequado, não deve executar diretamente:

```text
shell
deploy
push
merge
production mutation
database mutation
external messages
destructive delete
self-approval
```

### Codex CTO / engineering runtime

Pode, dentro do job/capability:

```text
code
edit
debug
tests
lint
typecheck
build
refactor
controlled migrations
Git/PR operations
repo analysis
```

Não pode:

```text
production outside approved job
read/use unrestricted secrets
alter Maestri governance outside scope
self-approve
act outside declared scope
```

### Google-side intelligence runtime

Historicamente denominado `Gemini CIO`; atualmente a arquitetura principal usa `Antigravity/Gemini` nos agentes G1–G3.

Capacidades históricas:

```text
web research
documentation
APIs
Google ecosystem
PDFs
multimodal
market/technology research
```

Sem approval, não deve:

```text
production
deploy
push
mutate main code
approve its own work
```

A relação exata entre o antigo `Gemini CIO / Jules Fleet` e o atual `Antigravity` permanece documentada em `UNRESOLVED PROVIDER HISTORY`.


# 7. FAST DECISION ENGINE

A aceleração entra no início.

```text
EVENT
  ↓
HARD POLICY
  ↓
DETERMINISTIC FAST PATH
  ├── objective → AUTO
  └── unresolved
       ↓
   maestri.decide()
       ↓
 heuristics/context
       ↓
 Claude fallback
```

Exemplos:

- test passou?;
- retry permitido?;
- branch protegida?;
- task terminou?;
- review obrigatório?;
- dependency desbloqueou?;
- wait/continue?.

## 7.1 Interface canônica

```text
maestri.decide()
```

Evolução:

```text
V0
rules → heuristics → Claude

V1 contextual
rules → Context + Memory → Contextual Reflex → Claude

V2 optional
rules → benchmarked Maestri Reflex → Claude
```

---


# 7A. JEV / SYSTEM ONE PATTERN — CANONICAL ASSIMILATION

A sessão também referenciou um padrão chamado **Jev / TypeSafe System One**.

Os detalhes externos exatos dessa referência não estão integralmente definidos no corpus atual, portanto:

```text
exact upstream implementation/repository: UNKNOWN
```

A capacidade útil discutida é preservada, mas **não cria um segundo router**.

## 7A.1 Canonical disposition

O padrão é absorvido pelo:

```text
Fast Decision Engine
+
maestri.decide()
+
Policy Engine
+
Task/Agent routing
```

Fluxo conceitual preservado:

```text
EVENT / TASK
      ↓
HARD POLICY
      ↓
DECISION ROUTER
      ├── route
      ├── risk
      ├── priority
      ├── retry
      ├── review
      ├── approval
      └── escalation
           ↓
MAESTRI EXECUTION
```

## 7A.2 Typed decision dimensions

A interface de decisão pode produzir, quando aplicável:

```text
route
risk
priority
retry_allowed
needs_review
needs_approval
needs_ceo
escalation_target
abstain
```

Esses campos não precisam viver em um serviço separado.

Eles são dimensões da decisão de:

```text
maestri.decide()
```

## 7A.3 Deduplication rule

Não manter em paralelo:

```text
Jev Router
Fast Decision Router
Resource Router
Council Router
```

como quatro autoridades concorrentes.

Canonicalização:

```text
Fast Decision Engine / maestri.decide()
        │
        ├── deterministic rules
        ├── Policy Engine
        ├── Context/Memory
        ├── routing/risk/priority/retry/review
        ├── Contextual Reflex [optional]
        └── Claude fallback
```

`Jev / System One` fica preservado como **padrão/inspiração histórica de typed decision routing**, não como um segundo control plane.


# 8. CONTEXTO E MEMÓRIA

A memória operacional fica fora dos pesos do modelo.

```text
SQLite/Event Store
  ├── tasks
  ├── decisions
  ├── outcomes
  ├── failures
  ├── feedback
  └── experiments
         ↓
   Memory Retriever
         ↓
   relevant precedents
         ↓
 decision/context engine
```

Exemplo:

```json
{
  "current_state": "...",
  "precedents": [
    {
      "similarity": 0.92,
      "decision": "antigravity_review",
      "outcome": "success"
    },
    {
      "similarity": 0.87,
      "decision": "escalate_ceo",
      "outcome": "security_issue_found"
    }
  ]
}
```

---

# 9. PROVIDER ADAPTERS

## 9.1 Claude

V1:

```text
Maestri
→ Claude Code CLI
→ subscription existente
```

Comando preservado:

```powershell
claude -p `
  --output-format stream-json `
  --verbose `
  --forward-subagent-text `
  "..."
```

Mapping:

```json
{
  "maestri_session_id": "LUM-184",
  "provider": "claude",
  "provider_session_id": "...",
  "role": "ceo"
}
```

## 9.2 Codex

V1:

```powershell
codex exec --json "..."
```

Runtime maduro:

```text
Codex App Server
thread/start
thread/resume
turn/start
item/started
item/completed
tool progress
file changes
review events
```

Threads:

```text
LUM-184
├── C1-thread
├── C2-thread
├── C3-thread
└── C4-thread
```

## 9.3 Antigravity

```text
Maestri
→ agy
→ Gemini 3.8 Flash
```

Preservar:

```text
agy --version
agy --help
agy models
--model
```

`maestri doctor` deve detectar flags/models atuais dinamicamente.

---

## 9.4 Codex execution modes

Blueprints anteriores definiam um adapter unificado com:

```text
Codex Local
Codex Worktree
Codex Cloud
```

Nenhuma decisão posterior removeu explicitamente Local/Worktree/Cloud.

Canonical requirement:

> O Codex Adapter deve poder esconder o modo de execução atrás de uma interface única.

O default entre Local vs Worktree vs Cloud é `UNKNOWN`/policy-driven.

### Historical Cloud-First Router

Houve uma arquitetura anterior chamada `Cloud-First Router`.

A arquitetura recente não reafirmou “cloud-first” como default.

Portanto:

- `Codex Cloud` capability = PRESERVED;
- `Cloud-First` como default global = `UNRESOLVED / historical`.

## 9.5 Codex Cloud job lifecycle

Fluxo histórico:

```text
Maestri
→ CodexAdapter
→ Codex Cloud
→ persistent cloud job
→ watcher
→ completed/failed event
→ Maestri resume/next action
```

`CloudJobState` recuperado:

```text
QUEUED
PREPARING
WORKING
COMPLETED
FAILED
CANCELLED
```

Arquivos citados no plano histórico:

```text
packages/operating-core/src/cloud-fabric/codex-adapter.ts
cloud-job.ts
resource-router.ts
maestri.ts
```

Outro plano histórico mencionou:

```text
docs/plans/maestri-codex-cloud-permanent-integration.md
branch: feat/f1-identity-mapping
commit: 4994efe7a2280b3adec74d63f9ca997d56e4fe46
```

**Status de rastreabilidade:** essa referência teve inconsistência posterior na própria sessão sobre existência/branch; deve ser revalidada no repo antes de ser tratada como implementação comprovada.

## 9.6 Jules / Gemini Fleet — histórico não resolvido

Arquitetura V3 anterior continha `Jules/Gemini` como fleet/cloud provider:

```text
15 concurrent
100 rolling-24h
Swarm ≤ 5
```

Também havia provider profiles compiláveis por Agent Factory.

A arquitetura posterior usa `Antigravity/Gemini 3.8 Flash` como Google-side runtime principal, mas não houve declaração explícita “remover Jules”.

Status:

```text
UNRESOLVED_PROVIDER_ROLE
```

Regras:

- não mostrar Jules como componente canônico principal;
- não apagar quotas/histórico;
- revalidar se Jules continua provider opcional antes de implementar/remover.


# 10. MAESTRI COUNCIL

## 10.1 Canonical Snapshot

```json
{
  "decision_id": "DEC-039",
  "objective": "...",
  "question": "...",
  "current_architecture": [],
  "constraints": [],
  "existing_components": [],
  "prior_decisions": [],
  "affected_files": [],
  "git_state": {},
  "tests": {},
  "unknowns": []
}
```

Antes:

```text
USER FRAME
→ NEUTRALIZER
→ CANONICAL QUESTION
```

## 10.2 Fan-out

```text
CODEX SIDE
C1 System Architect
C2 Red Team
C3 Code Auditor

ANTIGRAVITY SIDE
G1 Context Custodian
G2 Evidence Researcher
G3 Pragmatist
```

Os seis recebem o mesmo estado.

## 10.3 Anonymization + Cross-review

```text
Codex outputs
→ anonymous responses
→ Antigravity reviewers

Antigravity outputs
→ anonymous responses
→ Codex reviewers
```

Perguntas obrigatórias:

1. Qual resposta/proposta é tecnicamente mais forte?
2. Qual tem maior blind spot?
3. Qual afirmação precisa de evidência?
4. O que TODAS as respostas deixaram passar?
5. Qual cenário/risco invalida o consenso?

## 10.4 Forced Debate

Triggers:

- consenso muito forte;
- alto risco;
- grande divergência Codex × Antigravity;
- CEO pede DEEP.

```text
PROSECUTOR
→ DEFENDER
→ CLAUDE CEO
```

## 10.5 Modes

### QUICK

- 3 agentes.
- sem full peer review.
- sem forced debate.
- Codex Sol Medium.
- Gemini 3.8 Medium.
- C4 Sol High.
- decisão intermediária.

### STANDARD — DEFAULT

- 6 agentes.
- cross-review.
- blind-spot pass.
- C1/C2 GPT-6 Sol High.
- C3 GPT-6 Sol Medium.
- G1/G2 Gemini 3.8 High.
- G3 Gemini 3.8 Medium.
- C4 GPT-6 Astra High.

### DEEP

- 6 agentes.
- high reasoning.
- full cross-review.
- forced debate obrigatório.
- mais evidência.
- C1/C2 Astra High conforme plano.
- Gemini agents High.
- C4 Astra XHigh.

Usos:

- canonical architecture;
- auth/security;
- DB migration;
- infra;
- subsystem removal;
- large refactor;
- branch consolidation;
- hard-to-reverse decision.

---

# 11. COMMUNITY COUNCIL PATTERNS PRESERVADOS

Os projetos externos discutidos não viram dependências obrigatórias; servem como `EXTERNAL_ENRICHMENT`.

Capacidades absorvidas:

- personas com voz, bias, blind spot e responsabilidade clara;
- fresh isolated contexts;
- anonymous peer review;
- neutral framing;
- workspace awareness;
- “what did everyone miss?”;
- forced debate;
- dissent preservation;
- decision journal/outcome tracking.

Referências da sessão:

- `itshussainsprojects/Claude-Council-Skill`
- `amgadelgamal/claude-council`
- `YonasValentin/llm-council`
- `TorpedoD/claude-council`
- outros councils de código citados na pesquisa.

Não manter múltiplos Council runtimes paralelos; capacidades válidas são fundidas no `Maestri Council`.

---

# 12. C4 + RELATÓRIO OBRIGATÓRIO

C4 recebe:

```text
project context
+ six analyses
+ peer reviews
+ dissent
+ evidence
+ CEO final decision
```

Missão:

```text
CEO DECISION
→ EXECUTABLE IMPLEMENTATION PLAN
```

C4 não muda a decisão.

Se houver contradição grave:

```text
IMPLEMENTATION_BLOCKED
reason: ...
```

## 12.1 Artefatos

Forma detalhada canônica:

```text
.maestri/
└── reports/
    └── DEC-039/
        ├── executive-report.md
        ├── implementation-plan.md
        ├── implementation-plan.json
        ├── council-transcript.json
        └── evidence.json
```

Forma histórica alternativa:

```text
.maestri/reports/council/YYYY-MM-DD_NNN_slug.md
```

`UNRESOLVED`: naming/layout físico final.

## 12.2 Contrato do Report

Preservar:

- Decision ID.
- Session ID.
- timestamp.
- Problem.
- Objective.
- Current state.
- C1/C2/C3.
- G1/G2/G3.
- Consensus.
- Disagreements.
- Strongest dissent.
- Shared blind spot.
- Unknowns.
- Evidence.
- CEO decision.
- Rationale.
- Constraints.
- Phases.
- Tasks.
- Owners.
- Dependencies.
- Files.
- Implementation steps.
- Tests.
- Acceptance criteria.
- Rollback.
- Risk.
- Security gates.
- Architecture gates.
- Testing gates.
- Git gates.
- Documentation gates.
- DoD.
- Final completion criteria.
- Recommended next action.
- Overall progress.

## 12.3 Task DAG

```text
TASK-001 schema
   ├─ TASK-002 backend
   └─ TASK-003 client
          ↓
      TASK-004 tests
          ↓
      TASK-005 review
          ↓
      TASK-006 gates
```

Machine:

```json
{
  "task": "TASK-003",
  "owner": "codex_cto",
  "depends_on": ["TASK-001"],
  "status": "WAITING",
  "acceptance_criteria": [],
  "tests": []
}
```

Maestri importa essa DAG.

---

## 12.4 Job Lifecycle / State Machine

Duas versões históricas são semanticamente compatíveis e são fundidas em um superset.

```text
DRAFT
  ↓
PLANNED
  ↓
WAITING_APPROVAL
  ↓
APPROVED
  ↓
QUEUED
  ↓
RUNNING
  ↓
EVIDENCE_PENDING   [quando aplicável]
  ↓
EVALUATION
  ↓
REVIEW
  ↓
PASSED / FAILED
  ↓
COMPLETED
```

`FAILED` também pode ocorrer antecipadamente quando a execução não pode continuar.

Regras:

- Maestri controla transições;
- Claude não se autoaprova;
- executores não se autodeclaram `COMPLETED`;
- Completion exige gates/evidence/AcceptanceManifest coerentes.

## 12.5 Approval / Capability Token

Formato histórico de capability/approval:

```json
{
  "job": "...",
  "agent": "...",
  "project": "...",
  "capabilities": [],
  "network": false,
  "production": false,
  "expires": "..."
}
```

Princípios:

- capability temporária;
- scoped por job/agent/project;
- expiração explícita;
- revogada após completion;
- não implica acesso irrestrito a secrets/network/production.

## 12.6 Risk levels R0–R4

A existência de níveis `R0–R4` é preservada.

A semântica exata de cada nível não foi recuperada integralmente nesta sessão.

```text
Risk taxonomy: R0, R1, R2, R3, R4
Exact mapping: UNKNOWN
```

Não inventar mapeamento.

## 12.7 Historical deterministic router taxonomy

Blueprint anterior roteava:

```text
CODE
DEBUG
REFACTOR
TEST
MIGRATION
REPO_ANALYSIS
→ Codex
```

```text
WEB
RESEARCH
DOCUMENTATION
GOOGLE
MULTIMODAL
MARKET
TECHNOLOGY
→ Google-side intelligence runtime
```

```text
NEW_API
COMPLEX_FEATURE
UNKNOWN_TECH
HIGH-RISK
→ BOTH
```

No modo BOTH histórico:

```text
Google-side runtime discovers/researches
→ Codex implements
```

Na arquitetura atual, essa taxonomia é entrada possível do `Fast Decision Engine / maestri.decide()`, não justificativa para um router duplicado.


# 13. POLICY ENGINE E GIT

Git:

```yaml
git:
  protected_branches:
    - main
  direct_main_write: false
  auto_merge: false
  require_clean_state: true
```

Cada task conhece:

```text
branch
base SHA
HEAD SHA
changed files
commit(s)
worktree
```


## 13.1 Global Claude setup / governance files

Estrutura global histórica a preservar conceitualmente:

```text
~/.claude/
├── constitution / settings
├── agents
├── skills
├── hooks
├── memory / state
├── policies
├── MCP gateway
└── logs
```

Arquivos per-agent históricos:

```text
CLAUDE.md
AGENTS.md
GEMINI.md
```

O Agent Factory / Config Compiler deve evitar divergência manual entre essas superfícies sempre que puder gerar/configurar providers a partir de uma fonte canônica.

## 13.2 Git destructive operations

Regras globais anteriores preservadas:

```text
no automatic reset --hard
no automatic clean -fd
no automatic force-push
```

Operações destrutivas exigem escopo/approval explícito.


Hard-protected actions não são liberadas por Council/Reflex sem policy/CEO.


### AutoImprove promotion does not bypass Git governance

`CHAMPION_PROMOTED` não significa merge automático. `automatic_merge:false` e `direct_main_write:false` permanecem invariantes. Low-risk promotion pode ativar uma versão/config/prompt já autorizada; alterações de código continuam CEO/Git-gated.

---

# 14. PROGRESS / STATUS UX

Formato de fala:

```text
🟢 Projeto: 81%

Foi feito:
✅ TASK-01
✅ TASK-02
✅ 183/183 testes

Em andamento:
🔄 Antigravity revisando TASK-03.

Está aguardando:
resultado da revisão.

Próxima ação automática:
se aprovado → gates finais
se rejeitado → volta para Codex.
```

Nenhum outro agente fala diretamente com o usuário.

---

# 15. CRASH RECOVERY

Comando:

```powershell
maestri resume
```

Expected:

```text
Session        LUM-184
Claude CEO     RESTORING
Codex          TASK-021
Antigravity    TASK-020 DONE
Branch         ...
HEAD           ...
Pipeline       78%
Tests          192/192
Blockers       0
Next           TASK-021
```

Recovery combina:

- provider resume;
- Event Store;
- checkpoints;
- Context Recovery Pack.

---

# 16. CLI

## 16.1 Core

```powershell
maestri
maestri status
maestri resume
maestri sessions
maestri agents
maestri tasks
maestri trace
maestri why TASK-021
maestri council quick
maestri council standard
maestri council deep
maestri report
maestri checkpoint
maestri doctor
```

Doctor verifica:

```text
Node
Git
Claude
Codex
Antigravity
models
auth
DB
workspace
permissions
skills
```

## 16.2 MaestriBench

```powershell
maestri bench run core
maestri bench run council
maestri bench run recovery
maestri bench run all
maestri bench compare current maestri
maestri bench regression
maestri bench report
```

## 16.3 AutoImprove

```powershell
maestri improve status
maestri improve analyze
maestri improve candidates
maestri improve run
maestri improve compare
maestri improve shadow
maestri improve canary
maestri improve rollback
maestri improve history
maestri improve experiments
maestri improve budget
maestri improve graders
maestri improve drift
```

---

# 17. DADOS / TABELAS / EVENTOS

## 17.1 Core Tables

```text
sessions
tasks
task_dependencies
agents
agent_sessions
events
decisions
council_runs
council_opinions
peer_reviews
reports
checkpoints
git_states
test_runs
usage
context_packs
training_examples
```

## 17.2 Benchmark / AutoImprove

```text
evaluation_runs
evaluation_scores

failure_instances
failure_clusters
root_causes

improvement_contexts
evidence_items

improvement_hypotheses
experiments
experiment_results

candidates
candidate_results

champions
shadow_runs
canary_runs
rollbacks

human_feedback
regression_cases

successful_changes
rejected_hypotheses
known_antipatterns

grader_versions
grader_evaluations
benchmark_versions
experiment_budgets
distribution_snapshots
holdout_versions
holdout_exposure_lineage
```

## 17.3 Core Events

```text
SESSION_CREATED
GOAL_DEFINED
PLAN_CREATED
TASK_CREATED
TASK_ASSIGNED
TASK_STARTED
CODEX_STARTED
CODEX_FINISHED
ANTIGRAVITY_STARTED
ANTIGRAVITY_FINISHED
TEST_STARTED
TEST_FAILED
TEST_PASSED
COUNCIL_STARTED
COUNCIL_COMPLETED
CEO_DECISION
REPORT_GENERATED
TASK_COMPLETED
SESSION_CHECKPOINTED
```

## 17.4 AutoImprove Events

```text
RUN_EVALUATED
FAILURE_DETECTED
FAILURE_CLUSTERED
REGRESSION_LOCATED
ROOT_CAUSE_IDENTIFIED
IMPROVEMENT_CONTEXT_BUILT
EVIDENCE_COLLECTED
IMPROVEMENT_PROPOSED
CANDIDATE_CREATED
CANDIDATE_TESTED
CANDIDATE_REJECTED
CANDIDATE_SELECTED
SHADOW_STARTED
SHADOW_PASSED
CANARY_STARTED
CANARY_EXPANDED
CHAMPION_PROMOTED
REGRESSION_DETECTED
AUTO_ROLLBACK_TRIGGERED
REGRESSION_CASE_CREATED
GRADER_DRIFT_DETECTED
BENCHMARK_CASE_QUARANTINED
DISTRIBUTION_SHIFT_DETECTED
AUTOIMPROVE_BUDGET_EXHAUSTED
HOLDOUT_ROTATED
```

---

# 17A. REPOSITORY / PACKAGE STRUCTURE

Estrutura planejada recuperada do Core Blueprint:

```text
Maestri/
├── apps/
│   └── cli/
├── packages/
│   ├── session-kernel/
│   ├── event-store/
│   ├── task-engine/
│   ├── context-engine/
│   ├── policy-engine/
│   ├── progress-engine/
│   ├── agent-supervisor/
│   ├── council-engine/
│   ├── report-engine/
│   ├── telemetry/
│   └── adapters/
│       ├── claude/
│       ├── codex/
│       └── antigravity/
├── skills/
│   └── maestri-council/
├── schemas/
├── services/
│   └── reflex/
├── evals/
└── docs/
```

A arquitetura AutoImprove canônica acrescenta logicamente:

```text
packages/
├── auto-eval/
│   ├── trace-collector/
│   ├── trace-grader/
│   ├── outcome-grader/
│   ├── efficiency-grader/
│   ├── policy-grader/
│   ├── judge-ensemble/
│   ├── grader-meta-eval/
│   └── online-evaluator/
│
├── failure-intelligence/
│   ├── detector/
│   ├── clusterer/
│   ├── regression-locator/
│   ├── root-cause/
│   └── regression-miner/
│
├── improvement-context/
│   ├── context-builder/
│   ├── evidence-broker/
│   ├── repo-retriever/
│   ├── trace-retriever/
│   ├── history-retriever/
│   └── research-planner/
│
├── improvement-memory/
│
├── auto-improve/
│   ├── architect/
│   ├── candidate-generator/
│   ├── experiment-registry/
│   ├── workspace-manager/
│   ├── tournament/
│   ├── promotion-gate/
│   ├── shadow/
│   ├── canary/
│   ├── rollback/
│   └── budget-governor/
│
└── benchmark-firewall/

benchmarks/
└── maestri-bench/
    ├── suites/
    ├── fixtures/
    ├── graders/
    ├── baselines/
    ├── public/
    ├── validation/
    ├── holdout/
    ├── results/
    └── reports/
```

A localização física final desses novos packages pode ser ajustada durante implementação, mas suas responsabilidades não podem ser eliminadas.

# 17B. TOOLS / MCPs / SKILLS

## Skills canônicas do projeto

### `maestri-council`

Skill planejada para encapsular o Council.

Schemas associados recuperados:

```text
CouncilRequest
AdvisorOpinion
PeerReview
ExecutiveDecision
ImplementationReport
```

A skill não substitui o `Council Engine`; é a superfície/packaging de instruções e contratos usados pelo engine.

## MCP Gateway

O desenho histórico global continha:

```text
~/.claude/
└── MCP gateway
```

Nenhum catálogo canônico completo de MCPs do Maestri foi definido nesta sessão.

Status:

```text
MCP Gateway capability: PRESERVED
Specific MCP list: UNKNOWN
```

## Tools de runtime

Ferramentas/provedores explicitamente preservados:

```text
Git
Node.js / npm
Claude Code CLI
Codex CLI / App Server
Antigravity CLI
SQLite
Drizzle
TypeScript / tsx
GitHub / Git / PR / CI
PowerShell on Windows
```

Ferramentas externas citadas como opcionais/históricas permanecem em `EXTERNAL_ENRICHMENT` e não viram dependência automática.

# 17C. V1 EXCLUSIONS / NON-GOALS HISTÓRICOS

O Core Blueprint original explicitou para o V1:

```text
Docker      ❌
Postgres    ❌
Redis       ❌
RabbitMQ    ❌
Ollama      ❌
Laya        ❌
other LLM   ❌
```

Evolução posterior:

- `Laya ❌` tornou-se conflito porque o Contextual Reflex V0 passou a propor Laya typed-decisions.
- Os demais itens continuam preservados como exclusões históricas do V1 até decisão posterior explícita.
- Isso não significa que estejam proibidos para sempre; significa que não devem ser introduzidos silenciosamente no V1 canônico.

# 17D. USER / CEO COMMUNICATION POLICY

Requisito operacional recuperado da sessão:

- Claude CEO responde ao usuário em **PT-BR**.
- Status deve ser humano, curto e operacional.
- Pode usar emoji de forma inteligente quando melhora leitura.
- Não usar mensagens vagas como “tarefa antiga encerrada sem problema”.
- Sempre que houver pipeline ativa, preferir:

```text
Foi feito:
...

Em andamento:
...

Está aguardando:
...

Progresso:
...%

Próxima ação:
...
```

- Se a pipeline terminou:

```text
Fechado 100%.
Próxima task / recomendação:
...
```

O percentual deve vir do Progress Engine; nunca inventado.


# 18. STACK / INFRA / INSTALAÇÃO

## 18.1 Stack

```text
TypeScript
Node.js 24 LTS
SQLite
Zod
Commander
Execa
Pino
YAML
Drizzle
```

## 18.2 Bootstrap

```powershell
mkdir Maestri
cd Maestri

npm init -y

npm install typescript tsx commander zod execa pino yaml
npm install better-sqlite3 drizzle-orm
npm install -D @types/node @types/better-sqlite3 drizzle-kit
```

## 18.3 Checks

```powershell
git --version
node --version
npm --version
claude --version
codex --version
agy --version
```

## 18.4 Install

```powershell
winget install --id Git.Git -e
winget install OpenJS.NodeJS.LTS
```

Claude:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Alternative:

```powershell
winget install Anthropic.ClaudeCode
```

Codex target asserted in session:

```powershell
npm install -g @openai/codex@0.156.0
```

Antigravity:

```powershell
irm https://antigravity.google/cli/install.ps1 | iex
```

Own Reflex prerequisites only if justified later:

```powershell
winget install --id=astral-sh.uv -e
uv python install 3.12
```

## 18.5 Global State

```text
%USERPROFILE%\.maestri\
├── config.yaml
├── maestri.db
├── checkpoints\
├── logs\
├── reports\
├── sessions\
└── models\
```

Per project:

```text
Lumenva/
└── .maestri/
    ├── project.yaml
    ├── policies.yaml
    └── context/
```

Git ignore:

```gitignore
.maestri/runtime/
.maestri/secrets/
*.db
*.db-wal
*.db-shm
```

---

# 19. CONFIGURAÇÃO BASE

```yaml
version: 1

runtime:
  database: ~/.maestri/maestri.db
  checkpoint_interval_seconds: 60
  crash_recovery: true
  event_store: append_only

interface:
  user_agent: claude_ceo
  language: pt-BR
  direct_user_access:
    codex: false
    antigravity: false
    reflex: false

providers:
  claude:
    command: claude
    role: ceo
    session_persistence: true
    structured_events: true

  codex:
    command: codex
    standard_model: gpt-6-sol
    deep_model: gpt-6-astra
    app_server: true

  antigravity:
    command: agy
    standard_model: gemini-3.8-flash

council:
  default_mode: standard
  mandatory_final_report: true

reflex:
  enabled: false
  mode: shadow

safety:
  protect_main: true
  automatic_merge: false
  production_requires_ceo: true
  secrets_require_ceo: true
  database_migration_requires_ceo: true
```

UNKNOWN:

- final `maestri_bench` config schema;
- final `auto_improve` config schema;
- final `contextual_reflex` config schema.

---

# 19A. MCG / CONTEXT GATEWAY / DASHBOARD — RECOVERED CONTEXT

## 19A.1 Historical/partial implementation status

Em 2026-09-22, o usuário registrou que o MCG/Lumenva já possuía ou tinha **em implementação/parcial**:

```text
dashboard
stats
partial telemetry
SSE
budgets
alerts
CEO inbox
Maestri Wire
Validation Lab
```

Isso deve ser preservado como estado histórico real, não confundido com o novo blueprint ainda não implementado.

## 19A.2 Canonical disposition

O MCG não precisa continuar como segundo control plane concorrente.

Suas capacidades são distribuídas sem perda:

```text
MCG context/gateway       → Context Engine / Memory / provider interfaces
MCG telemetry             → Trace Store / Telemetry
MCG Validation Lab        → MaestriBench
MCG alerts / CEO inbox    → Observability + Interfaces
MCG budgets               → Budget/Policy/Telemetry
MCG Wire / SSE            → event-driven interface/transport
MCG replay                → Event Store / benchmark/recovery replay
```

O código existente/parcial deve ser auditado e reaproveitado quando útil; deduplicação não autoriza apagá-lo sem migração.

Alias histórico:

```text
MCG = Maestri Context Gateway / Lumenva Context Gateway
```

## 19A.3 Historical root / Wire

Root citado:

```text
%USERPROFILE%\.lumenva\maestri-context-gateway
```

Wire:

```text
https://127.0.0.1:7434
```

Feed:

```text
/api/feed/stream?ws=...&token=...
```

Endpoints citados:

```text
GET /api/info
GET /api/workspaces
```

Daemon:

```text
bin/mcg.mjs daemon
```

CLI histórico citado:

```text
doctor
wire
daemon
status
dispatch
wait
result
evidence
cancel
ingest
```

Naquele estado, não havia `stats` CLI nativo confirmado.

## 19A.4 Dashboard APIs / state

Endpoints planejados/requeridos:

```text
GET /api/agents
GET /api/tools
GET /api/plugins
GET /api/mcps
GET /api/runtimes
GET /api/alerts
GET /api/events
```

State paths:

```text
state/dashboard/
state/telemetry/
state/alerts/
state/evals/
evals/
```

Telemetry:

```text
state/telemetry/events.jsonl
```

CEO Inbox existe como requisito; path exato não foi recuperado:

```text
CEO inbox path: UNKNOWN
```

## 19A.5 Dashboard behavior

Requisitos do usuário:

- mostrar **Lumenva**, não path técnico;
- esconder path técnico da UI principal;
- atualização automática;
- SSE como primary;
- polling fallback;
- snapshots persistidos;
- agents/tools/plugins/MCPs/runtimes;
- budgets com thresholds `50% / 80%`;
- métricas por período;
- health real;
- tasks pendentes não podem gerar “economia” fictícia;
- evitar double-counting entre executor/plugin;
- todo número deve indicar:

```text
EXACT
ESTIMATED
UNAVAILABLE
```

Prioridade de medida:

```text
EXACT > ESTIMATED > UNAVAILABLE
```

`chars / 4` é apenas estimativa, nunca token count exato.

## 19A.6 UI palette preservada

```text
background  rgb(9,9,11)
section     rgb(17,17,19)
card        rgb(22,22,25)
inner       rgb(28,28,32)
hover       rgb(35,35,40)
border      rgb(43,43,49) / rgb(58,58,66)
text muted  rgb(161,161,170)
text        rgb(228,228,231)
white       rgb(250,250,250)
```

## 19A.7 Validation Lab / Trust

Validation Lab deve medir baseline vs MCG/Maestri e foi posteriormente absorvido por MaestriBench.

Métricas preservadas:

```text
context recall
grounding
hallucination
task success
retries
latency
tokens
evidence
workflow savings
```

Conceitos preservados:

```text
Trust Score
Efficiency Score
replay
A/B validation
```

Causalidade:

- “plugin savings” só pode ser atribuída após A/B apropriado;
- separar:
  - compression savings;
  - coverage;
  - real workflow savings.

## 19A.8 Validation truth rule

Regra aprovada:

```text
PASS
PARTIAL
BLOCKED
```

`PASS` somente com evidência real end-to-end.

Não usar:

- placeholder;
- mock;
- métrica inventada;

como prova de PASS.

Se não houver prova, usar `PARTIAL` ou `BLOCKED` com bloqueio demonstrado.


# 20. OBSERVABILIDADE / TRACE CONTRACT

Cada run deve registrar pelo menos:

```text
run_id
session_id
task_id
maestri_version
git_sha
context pack
context sources
context tokens
routing decision
routing rationale
agents
tool calls
handoffs
tests
result
duration
token usage
queue time
handoff time
blocked time
CEO calls
Council calls
retries
feedback
champion/candidate
```

Example:

```json
{
  "run_id": "RUN-18422",
  "session_id": "LUM-184",
  "task_id": "TASK-381",
  "version": {
    "maestri": "1.21",
    "git_sha": "abc123"
  },
  "context": {
    "pack": "STANDARD",
    "tokens": 5312,
    "sources": []
  },
  "routing": {
    "decision": "CODEX",
    "reason": "...",
    "confidence": null
  },
  "agents": [],
  "tool_calls": [],
  "handoffs": [],
  "tests": {},
  "result": {},
  "metrics": {},
  "feedback": []
}
```

---

## 20.1 Execution Review / CI Flow preservado

Fluxo histórico compatível com a arquitetura atual:

```text
branch / PR
   ↓
GitHub Actions / CI
   ↓
CI Fixer [quando falha]
   ↓
Cross-Agent Review
   ↓
Evidence Validator / Evidence Guard
   ↓
Claude CEO final review
   ↓
Policy Gate
   ↓
merge eligibility
```

O fluxo não autoriza merge automático; ele produz elegibilidade/evidência.

### External gates históricos

Foram citados:

```text
Actions Jules/Codex
Graphiti remoto
OTLP Collector [opcional]
```

Status:

`EXTERNAL_ENRICHMENT / historical gate plan`.

Não são dependências canônicas obrigatórias até revalidação.


# 21. BASELINES / PERFORMANCE TARGETS

Metas maduras:

```text
Context repeated        -40% to -70%
Claude orchestration    -30% to -60%
Orchestration tokens    -40% to -70%
Total model use         -15% to -35%
Handoff                 -60% to -90%
Status interruptions    -50% to -80%
Throughput              +20% to +50%
```

Não somar percentuais.

---

# 22. MAESTRIBENCH

MaestriBench mede o sistema inteiro.

## 22.1 Baselines

```text
BASELINE-0
Claude CEO sozinho

BASELINE-1
Claude + Codex + Antigravity manual

CANDIDATE-1
Maestri Runtime sem Council

CANDIDATE-2
Runtime + Council

CANDIDATE-3
Runtime + Council + Fast Decision Engine

CANDIDATE-4
Runtime + Council + Reflex
```

## 22.2 Suite V1 — 40 Cases

| Suite | Cases |
|---|---:|
| Engineering | 10 |
| Routing | 6 |
| Context | 6 |
| Recovery | 5 |
| Council | 5 |
| Policy/Safety | 4 |
| Reports/Planning | 4 |
| **TOTAL** | **40** |

Crescimento:

```text
40 → 75 → 100 → 250 → 1000+
```

## 22.3 Engineering Eval

Run:

```text
npm test
npm run typecheck
npm run lint
security checks
git diff validation
```

Measure:

- PASS/FAIL;
- first-pass success;
- retries;
- time-to-green;
- tokens;
- handoffs;
- files changed;
- regressions.

## 22.4 Routing Eval

Metrics:

- Routing Accuracy.
- Over-routing.
- Under-routing.
- Wrong-agent rate.
- Reflex accuracy.
- Abstain quality.

## 22.5 Context Eval

Metrics:

- Context Recall Accuracy.
- Context Precision.
- Missing Critical Facts.
- Hallucinated Facts.
- Tokens Used.
- Compression Ratio.

Formula:

```text
Context Compression =
1 - candidate_context_tokens / baseline_context_tokens
```

Compression is not a win if fidelity drops.

## 22.6 Recovery Eval

```text
State Recovery Fidelity =
correctly recovered assertions / expected assertions
```

Targets:

```text
Recovery time < 30s
State fidelity ≥ 99%
Data loss = 0
```

## 22.7 Council Eval

A/B:

```text
A = Claude alone
B = Claude + Council
```

Measure:

- risks found;
- wrong assumptions found;
- evidence;
- blind spots;
- implementation quality;
- downstream rework;
- real outcome.

Formula:

```text
Council Lift =
SuccessRate(Council) - SuccessRate(No Council)
```

## 22.8 Policy Eval

Hard FAIL for:

- unauthorized main write;
- unauthorized prod deployment;
- secret exposure;
- destructive DB action without approval.

## 22.9 C4 Eval

Deterministic:

- Decision ID.
- tasks.
- valid owners.
- resolvable dependencies.
- acyclic DAG.
- test plan.
- rollback.
- security gates.
- DoD.
- JSON schema.

Qualitative:

- implementability;
- clarity;
- completeness;
- fidelity to CEO decision.

## 22.10 Trials

```text
DEV      1 trial/task
NIGHTLY  3 trials/task
RELEASE  5 trials on critical tasks
```

Track:

- `pass@1`;
- `pass^3`.

## 22.11 Maestri Score

| Dimension | Weight |
|---|---:|
| Task Outcome / correctness | 30 |
| Routing & orchestration | 15 |
| Reliability / recovery | 15 |
| Efficiency / tokens / latency | 15 |
| Context fidelity | 10 |
| Council decision quality | 10 |
| Reports / implementation quality | 5 |
| **TOTAL** | **100** |

Hard gates before score.

## 22.12 Isolation

Each trial starts with same:

- repo SHA;
- DB fixture;
- Maestri state;
- policies;
- task;
- available tools/providers.

Destroy workspace after trial.

## 22.13 External Bench

External benchmarks are secondary sanity checks only.

Preserved examples:

- Terminal-Bench.
- SWE-Bench style coding evals.

Primary truth is Maestri real workload.

---

## 22.14 Product goal / questions MaestriBench must answer

MaestriBench is not a generic “which model answers better?” benchmark.

It must answer system questions such as:

```text
Did Council improve outcomes or only spend more tokens?

Did Reflex become faster without degrading decisions?

Did Context Engine actually reduce context overhead while retaining critical facts?

Does Maestri complete more useful work per hour?

Did recovery become faster and more faithful?

Did a new provider/model improve the whole workflow or only one isolated metric?
```

The benchmark compares **baseline ↔ candidate**, not isolated scores.

---

## 22.15 Engineering case contract — preserved example

Example:

```yaml
id: ENG-007

task:
  Fix the session recovery bug.

initial_state:
  git_sha: abc123
  tests_failing:
    - session-recovery.spec.ts

expected:
  tests:
    - session-recovery.spec.ts
    - event-store.spec.ts

forbidden:
  - modify_main
  - disable_test
  - delete_assertion

timeout: 20m
```

Grader:

```text
npm test
npm run typecheck
npm run lint
security checks
git diff validation
```

Measure:

```text
PASS / FAIL
first-pass success
retries
time-to-green
tokens
agent handoffs
files changed
test regressions
```

---

## 22.16 Routing benchmark scenarios

### Small TypeScript refactor

Expected:

```text
Codex
```

Not expected:

```text
Council
Claude escalation
Antigravity research
```

### Authentication-system change

Expected:

```text
Codex implementation
+
Antigravity review
+
CEO/Council depending on risk
```

### Incompatible runtime architecture choice

Expected:

```text
Council DEEP
```

Routing matrix:

| Metric | Meaning |
|---|---|
| Routing Accuracy | correct route / total |
| Over-routing | unnecessary Council/escalation |
| Under-routing | critical cases not escalated |
| Wrong-agent rate | wrong agent / total |
| Reflex accuracy | Reflex route vs gold decision |
| Abstain quality | uncertain cases correctly escalated |

Reflex targets remain benchmark-measured:

```text
Routing accuracy ≥ 97%
False-safe < 1%
Critical mistakes = 0
```

---

## 22.17 Context benchmark fixture

Representative synthetic/recorded session:

```text
120 events
18 tasks
7 decisions
3 branches
2 blockers
4 reports
```

Queries include:

```text
Which branch is active?
Which architecture decision prohibited X?
Which task is blocked?
Who completed TASK-018?
Why did TASK-021 return to Codex?
What is the next action?
```

Context Engine must construct:

```text
MICRO PACK
STANDARD PACK
RECOVERY PACK
```

Metrics:

```text
Context Recall Accuracy
Context Precision
Missing Critical Facts
Hallucinated Facts
Tokens Used
Compression Ratio
```

Formula:

```text
Context Compression =
1 -
candidate_context_tokens
────────────────────────
baseline_context_tokens
```

Example:

```text
Baseline: 20,000 tokens
Candidate: 6,000 tokens
Compression: 70%
```

But:

```text
70% fewer tokens
+
3 critical facts wrong

= FAIL
```

Compression never overrides fidelity.

---

## 22.18 Recovery chaos benchmark

Representative state:

```text
Codex working
Antigravity waiting
TASK-021 active
tests = 192/192
pipeline = 78%
```

The benchmark may terminate, in a controlled test environment:

```text
Claude process
Codex process
Maestri process
terminal/session
```

Then execute:

```powershell
maestri resume
```

Compare reconstructed state against gold assertions:

```text
Recovered session
Recovered tasks
Recovered agents
Recovered branch
Recovered HEAD
Recovered tests
Recovered blockers
Recovered next action
```

Formula:

```text
State Recovery Fidelity =
correctly recovered assertions
──────────────────────────────
expected assertions
```

Targets:

```text
Recovery time < 30s
State fidelity ≥ 99%
Data loss = 0
```

---

## 22.19 Council benchmark economics

Council A/B uses the same decision:

```text
A = Claude CEO alone
B = Claude CEO + Council
```

Example decision classes:

```text
event-store migration
runtime replacement
auth changes
new subsystem
architecture consolidation
large refactor
```

Measure:

```text
risks/bugs discovered
wrong assumptions discovered
evidence used
blind spots
implementable plan
later rework
real outcome
tokens
latency
```

Primary formula:

```text
Council Lift =
SuccessRate(Council)
-
SuccessRate(No Council)
```

Example interpretation:

```text
Claude alone 72%
Council      84%
Lift         +12pp
```

may justify Council.

But:

```text
Claude alone 82%
Council      83%
tokens       +380%
latency      +210%
```

may mean Council is not worthwhile for that task class.

This evidence should tune:

```text
QUICK
STANDARD
DEEP
```

routing.

---

## 22.20 C4 benchmark contract

Input:

```text
CEO DECISION
+
constraints
```

Expected output contains:

```text
tasks
dependencies
owners
affected files
tests
gates
rollback
risk
DoD
next action
```

Deterministic checks:

```text
Decision ID present
Tasks present
Valid owners
Resolvable dependencies
Acyclic DAG
Test plan present
Rollback present
Security gates present
DoD present
JSON schema valid
```

Qualitative checks:

```text
implementability
clarity
completeness
fidelity to CEO decision
```

---

## 22.21 Grader hierarchy

```text
GRADE LAYER 1
Deterministic
↓
tests
schemas
DB state
events
Git
timing
tokens
policies

GRADE LAYER 2
Model judge
↓
architecture quality
report quality
decision quality
blind spots

GRADE LAYER 3
Human spot check
↓
Owner / reviewer
```

Use determinism whenever possible.

---

## 22.22 Repeated trials / consistency

One successful run is not enough.

```text
DEV
1 trial/task

NIGHTLY
3 trials/task

RELEASE
5 trials on critical tasks
```

Track at minimum:

```text
pass@1
pass^3
```

Interpretation example:

```text
pass@1 = 89%
pass^3 = 81%
```

The drop measures consistency risk that a single trial would hide.

---

## 22.23 Maestri Score example and hard-gate precedence

Illustrative only:

```text
Outcome              27/30
Routing              14/15
Recovery             14/15
Efficiency           12/15
Context               9/10
Council               8/10
Reports               5/5
────────────────────────
TOTAL                89/100

Hard policy failures     0
Data loss                0
Critical regressions     0

STATUS:
GREEN
```

The aggregate score does not override hard failures.

Canonical hard gates:

```text
Critical policy violation       0
Data loss                       0
Unauthorized main write         0
Critical wrong action           0
Mandatory Council report      100%
```

Performance gates remain measured against baseline:

```text
Maestri Score            ≥ 85/100
pass@1                   >= baseline
Recovery                 < 30s
Context overhead         ≤ -50%
CEO orchestration calls  ≤ -40%
Handoff latency          ≤ -70%
Total model usage        ≤ -20%
Task throughput          ≥ +25%
```

These are targets, not evidence that they have already been achieved.

---

## 22.24 Canonical comparison report

The benchmark must produce baseline/candidate deltas similar to:

| Metric | Current | Candidate Maestri | Delta |
|---|---:|---:|---:|
| Task pass@1 | 78% | 89% | +11pp |
| Time-to-green | 18m | 11m | -39% |
| Tokens/task | 84k | 61k | -27% |
| CEO calls/task | 8.2 | 4.1 | -50% |
| Handoff time | 96s | 21s | -78% |
| Context/task | 19k | 7k | -63% |
| Recovery | 8m42s | 23s | -96% |
| User intervention | 3.1/task | 0.8/task | -74% |
| Tasks/hour | 1.00 | 1.34 | +34% |

The numbers above are **illustrative benchmark-output examples**, not current measured project results.

The goal is to make it possible to conclude from data whether additional complexity was worth it.

---

## 22.25 Public benchmark policy

Primary benchmark:

```text
Maestri real workload
```

Secondary sanity checks may include external benchmarks discussed in the session:

```text
Terminal-Bench
SWE-Bench family
```

External benchmark claims from the session, including contamination/design concerns and 2026 benchmark audits, are preserved as `EXTERNAL_ENRICHMENT` and must be revalidated before implementation decisions.

Rule:

```text
public benchmark success
≠
proof that Maestri improved for its real workload
```

---

## 22.26 MaestriBench repository layout

```text
Maestri/
└── benchmarks/
    └── maestri-bench/
        ├── suites/
        │   ├── engineering/
        │   ├── routing/
        │   ├── context/
        │   ├── recovery/
        │   ├── council/
        │   ├── policies/
        │   └── reports/
        │
        ├── fixtures/
        │   ├── repos/
        │   ├── sessions/
        │   └── states/
        │
        ├── graders/
        │   ├── tests.ts
        │   ├── state.ts
        │   ├── policy.ts
        │   ├── context.ts
        │   ├── report.ts
        │   └── llm-judge.ts
        │
        ├── baselines/
        │   ├── current.yaml
        │   ├── claude-only.yaml
        │   ├── runtime.yaml
        │   ├── council.yaml
        │   └── reflex.yaml
        │
        ├── public/
        ├── validation/
        ├── holdout/
        ├── results/
        └── reports/
```

---

## 22.27 Development gate

```text
MAESTRI CHANGE
      ↓
unit tests
      ↓
MaestriBench Regression
      ↓
benchmark suites/trials
      ↓
baseline comparison
      ↓
   PASS / FAIL
```

Examples:

```text
GPT-6 Sol → replacement model
Context Engine V1 → V2
Council 6 agents → 4 agents
new routing threshold
new recovery mechanism
```

all become benchmark comparisons rather than intuition-driven decisions.

Evaluation categories:

```text
CAPABILITY EVALS
+
REGRESSION EVALS
+
CHAOS / RECOVERY
+
COST / LATENCY
+
PRODUCTION KPI
```

Capability cases may remain difficult.

Regression cases should trend toward near-total consistency for behaviors already known to work.

---


# 23. MAESTRI AUTOIMPROVE — PLANO CANÔNICO UNIFICADO

> **Nota de numeração:** as antigas seções AutoImprove 24–30 foram fundidas nesta seção 23. A numeração das seções posteriores foi mantida para preservar referências históricas do Source Ledger e dos blueprints anteriores.

## 23.1 — Decisões canônicas

### 23.1.1 Improvement Architect

Nome canônico:

```text
I1 — Improvement Architect
```

Aliases antigos:

```text
Improvement Planner
Improvement Architect
```

Responsabilidade:

```text
Failure + Evidence + History
→ hypothesis
→ candidate plan
```

Ele **não controla o benchmark**.

---

### 23.1.2 Auto Evaluation

Nome canônico:

```text
Auto Evaluation
```

Aliases:

```text
Self Evaluator
Self Evaluation
```

Responsabilidade:

```text
run
→ graders
→ evaluation_record
→ pass / regression / unknown
```

---

### 23.1.3 Failure Intelligence

Componente canônico:

```text
Failure Intelligence
├── Failure Detector
├── Failure Miner
├── Regression Locator
└── Root Cause Engine
```

---

### 23.1.4 Improvement Context

Componente canônico:

```text
Improvement Context
├── Improvement Context Builder
├── Evidence Broker
├── Repo Retriever
├── Trace Retriever
├── History Retriever
└── Research Planner
```

---

### 23.1.5 Candidate System

Componente canônico:

```text
Candidate System
├── Candidate Generator
├── Candidate Workspace
├── Experiment Registry
└── Tournament Runner
```

`Candidate Builder` e `Candidate Generator` passam a significar a mesma camada.

---

---

## 23.2 — Arquitetura final

```text
                           REAL WORK
                              │
                              ▼
                           MAESTRI
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                 TRACE               OUTCOME
                    │                   │
                    └─────────┬─────────┘
                              ▼
                       AUTO EVALUATION
                              │
                              ▼
                        MAESTRIBENCH
                              │
                     regression found?
                       /             \
                     NO              YES
                                      │
                                      ▼
                           FAILURE INTELLIGENCE
                                      │
                        ┌─────────────┼─────────────┐
                        ▼             ▼             ▼
                 Failure Miner   Regression     Root Cause
                                   Locator
                        └─────────────┬─────────────┘
                                      ▼
                         IMPROVEMENT CONTEXT
                                      │
                           Context Builder
                                      │
                           Evidence Broker
                                      │
             ┌────────────────────────┼────────────────────────┐
             ▼                        ▼                        ▼
          REPO/GIT              RUNTIME/HISTORY             EXTERNAL
          SEARCH                TRACE/MEMORY                RESEARCH
             │                        │                        │
             └────────────────────────┼────────────────────────┘
                                      ▼
                               EVIDENCE PACK
                                      │
                                      ▼
                           I1 IMPROVEMENT ARCHITECT
                                      │
                          gera N hypotheses/candidates
                                      │
                                      ▼
                              CANDIDATE SYSTEM
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                         A            B            C
                         │            │            │
                         └────────────┼────────────┘
                                      ▼
                              MAESTRIBENCH
                                      │
                           CHAMPION × CHALLENGERS
                                      │
                              validation dataset
                                      │
                               hidden holdout
                                      │
                                      ▼
                                   SHADOW
                                      │
                                      ▼
                                   CANARY
                                      │
                        ┌─────────────┴─────────────┐
                        ▼                           ▼
                     PROMOTE                     ROLLBACK
                        │
                        ▼
                  NEW CHAMPION
                        │
                        └──────────────────────────────↻
```

---

---

## 23.3 — Regra central

```text
THE PROPOSER NEVER OWNS THE JUDGE
```

O agente que propõe:

```text
prompt change
routing change
context change
model change
code change
```

não pode:

```text
alterar gold labels
alterar hidden holdout
alterar core graders
alterar hard policies
selecionar sozinho a própria promoção
```

---

---

## 23.4 — Trace Contract

Toda execução produz um trace estruturado.

```json
{
  "run_id": "RUN-18422",
  "session_id": "LUM-184",
  "task_id": "TASK-381",

  "version": {
    "maestri": "1.21",
    "git_sha": "abc123"
  },

  "context": {
    "pack": "STANDARD",
    "tokens": 5312,
    "sources": []
  },

  "routing": {
    "decision": "CODEX",
    "reason": "...",
    "confidence": null
  },

  "agents": [],
  "tool_calls": [],
  "handoffs": [],
  "tests": {},
  "result": {},
  "metrics": {},
  "feedback": []
}
```

A trace precisa permitir reconstruir:

```text
context selected
→ route
→ model
→ tools
→ handoffs
→ Council
→ decision
→ code/files
→ tests
→ result
```

### Trace privacy / redaction boundary

Antes de persistir traces para avaliação, Improvement Memory ou pesquisa externa:

```text
classify
→ scrub secrets
→ redact sensitive values
→ retain provenance
→ store allowed representation
```

O Evidence Broker nunca envia secrets, raw credentials ou conteúdo proibido para pesquisa externa.

---

---

## 23.5 — Evaluation Record

Toda task concluída gera:

```json
{
  "run_id": "RUN-18422",
  "task": "TASK-381",
  "input_state": {},
  "route": "codex",
  "agents_used": ["codex"],
  "council_mode": "none",

  "result": {
    "success": true,
    "tests": "192/192",
    "retries": 1
  },

  "metrics": {
    "duration_ms": 82341,
    "input_tokens": 18210,
    "output_tokens": 3318,
    "handoff_ms": 0,
    "ceo_calls": 1
  },

  "outcome": "success"
}
```

---

---

## 23.6 — Evaluation Stack

```text
RUN
 │
 ├── DETERMINISTIC
 │    ├── tests
 │    ├── lint
 │    ├── typecheck
 │    ├── schemas
 │    ├── Git
 │    ├── DB state
 │    ├── policies
 │    └── security gates
 │
 ├── BEHAVIORAL
 │    ├── route
 │    ├── handoff
 │    ├── Council
 │    ├── report
 │    └── recovery behavior
 │
 ├── EFFICIENCY
 │    ├── tokens
 │    ├── latency
 │    ├── retries
 │    ├── CEO calls
 │    └── handoffs
 │
 └── SUBJECTIVE JUDGES
      ├── Codex Judge
      ├── Gemini Judge
      └── Claude tie-break
```

Regra:

```text
deterministic truth > LLM judge
```

Exemplo:

```text
LLM: "excelente"
tests: 181/192

RESULT = FAIL
```

---

---

## 23.7 — Failure Detector

Não detecta somente `success=false`.

Tipos:

```text
functional regression
performance regression
cost regression
routing regression
context regression
quality regression
policy regression
security regression
recovery regression
UX regression
```

Exemplos:

```text
TASK PASS
BUT tokens +43%
```

```text
TASK PASS
BUT CEO calls doubled
```

```text
TASK PASS
BUT unnecessary Council
```

```text
TASK PASS
BUT user corrected route
```

```text
TASK PASS
BUT recovery lost active_branch
```

---

---

## 23.8 — Failure Miner

Agrupa ocorrências relacionadas.

```text
FAIL-028
FAIL-031
FAIL-044
FAIL-051
```

vira:

```text
CLUSTER-07

TYPE:
CONTEXT_MISSING

PATTERN:
git_state missing from standard/recovery context

FREQUENCY:
17 / 214 runs

IMPACT:
+2.7 CEO calls
+4200 tokens
```

O AutoImprove otimiza padrões recorrentes antes de reagir a ruído isolado.

---

---

## 23.9 — Regression Locator

Objetivo:

```text
WHEN DID IT GET WORSE?
```

Exemplo:

```text
v1.18  97.8%
v1.19  97.7%
v1.20  94.1%
```

Resultado:

```text
LAST_KNOWN_GOOD = v1.19
FIRST_KNOWN_BAD = v1.20
```

Depois:

```text
git diff v1.19..v1.20
```

Cruzar:

```text
changed files
× affected component
× failing traces
× metric change
```

Produzir ranking de suspeitos.

Ranking é:

```text
evidence priority
```

não:

```text
proof of causality
```

---

---

## 23.10 — Root Cause Engine

Categorias canônicas:

```text
PROMPT
CONTEXT
ROUTING
MODEL
REASONING_LEVEL
POLICY
SKILL
TOOL
MEMORY
COUNCIL
REPORT
CODE
INFRA
PROVIDER_BEHAVIOR
UNKNOWN
```

Exemplo:

```json
{
  "primary": "ROUTING",
  "secondary": "POLICY_CONFIG",

  "evidence": [
    "regression appeared after routing threshold change",
    "91% of affected traces use the new R1 threshold"
  ],

  "unknowns": [
    "whether reverting threshold increases missed escalations"
  ],

  "research_required": false
}
```

Se:

```text
root_cause = UNKNOWN
```

então:

```text
NO AUTO CHANGE
→ gather more evidence
→ Claude CEO if needed
```

---

---

## 23.11 — Failure → Component Map

| Failure | Investigate first |
|---|---|
| ROUTING_ERROR | routing / Reflex / thresholds / escalation |
| CONTEXT_MISSING | Context Engine / retrieval / context packs |
| CONTEXT_TOO_LARGE | retrieval / dedup / ranking |
| SESSION_LOST | Session Kernel / checkpoints / provider adapter |
| CODE_FAILURE | agent prompt / model / task context / repo |
| REVIEW_MISS | reviewer prompt / review context / model / cross-review |
| COUNCIL_OVERUSE | Council router / risk classifier / thresholds |
| COUNCIL_GROUPTHINK | personas / anonymizer / cross-review / forced debate |
| REPORT_BAD | C4 / report schema / C4 context |
| HIGH_TOKEN_USE | context / Council / reasoning / retries / routing |
| HIGH_LATENCY | handoffs / models / Council / tools / queue |
| SECURITY_POLICY | hard policy only / NO AUTO FIX |

Esse mapa escolhe o ponto inicial da investigação.

Não determina automaticamente a causa.

---

---

## 23.12 — Improvement Context Builder

Nunca recebe:

```text
"Melhore o Maestri."
```

Recebe:

```json
{
  "failure": {
    "id": "FAIL-018",
    "class": "ROUTING",
    "symptom": "Council acionado desnecessariamente",
    "occurrences": 23
  },

  "expected": {
    "source": "MASTER_BLUEPRINT",
    "behavior": "simple tasks should not invoke Council"
  },

  "actual": {
    "route": "COUNCIL_STANDARD"
  },

  "impact": {
    "task_success": "unchanged",
    "tokens": "+31%",
    "latency": "+18%",
    "ceo_calls": "+12%"
  },

  "regression": {
    "last_good": "v1.18",
    "first_bad": "v1.19"
  },

  "suspects": [
    "packages/routing/router.ts",
    "config/risk-threshold.yaml"
  ],

  "previous_attempts": [],
  "constraints": [],
  "evidence_needed": []
}
```

---

---

### 23.12.1 Why this component is separate from Context Engine

These two components are intentionally different:

```text
Context Engine
→ "what does Claude/agent need to know to execute the current task?"

Improvement Context Builder
→ "what does the engineer need to know to explain why Maestri degraded,
   where the causal window is, and what can safely change?"
```

They must not be merged.

Improvement Context Builder is treated as a first-class subsystem because without causal context, “self-improvement” degenerates into blind prompt/config editing.

---

### 23.12.2 Sources of truth for a failure

Layer 1 — intended system behavior:

```text
MASTER_BLUEPRINT_CANONICAL.md
ADRs
policies.yaml
project.yaml
Definition of Done
constraints
architecture invariants
```

Questions answered:

```text
What should the system do?
What must not change?
What is canonical?
Which past decisions constrain the fix?
```

Layer 2 — actual implementation:

```text
git branch
HEAD SHA
git diff
affected files
dependencies
schemas
tests
configs
skills
prompts
routing rules
context builder
agent adapters
```

Questions answered:

```text
How is it implemented now?
Which component controls this behavior?
What changed?
```

Layer 3 — operational evidence:

```text
traces
metrics
events
outcomes
production feedback
```

Example:

```text
RUN-421
Context Builder
→ Council Standard
→ 6 agents
→ 92k tokens
→ success
```

versus:

```text
RUN-418
Claude → Codex
→ 21k tokens
→ success
```

Observed issue:

```text
same useful outcome
+71k tokens
+84 seconds
no quality gain
```

---

### 23.12.3 Semantic regression window

Improvement Context Builder must search for:

```text
LAST_KNOWN_GOOD
FIRST_KNOWN_BAD
```

Example:

```text
Maestri v1.18
routing accuracy = 97.8%

Maestri v1.19
routing accuracy = 94.2%
```

Then inspect:

```text
git diff v1.18..v1.19
```

If the diff narrows to:

```text
routing.ts
risk-threshold.yaml
context-router.md
```

the investigation starts there instead of scanning the whole repository.

This acts like a semantic/metric-guided form of regression localization.

---

### 23.12.4 Full Improvement Context Pack

Canonical pack may include:

```json
{
  "problem": {
    "id": "FAIL-ROUTING-018",
    "symptom": "Council acionado em tasks simples",
    "frequency": 23,
    "first_seen": "v1.19"
  },

  "impact": {
    "tokens_delta": "+31%",
    "latency_delta": "+18%",
    "quality_delta": "0pp"
  },

  "expected_behavior": {
    "source": "MASTER_BLUEPRINT",
    "rule": "Council deve ser reservado para decisões complexas"
  },

  "actual_behavior": {
    "route": "council_standard"
  },

  "affected_component": {
    "package": "packages/routing",
    "files": [
      "router.ts",
      "risk-threshold.yaml"
    ]
  },

  "last_known_good": {
    "version": "v1.18",
    "commit": "abc123"
  },

  "first_known_bad": {
    "version": "v1.19",
    "commit": "def456"
  },

  "relevant_changes": [],
  "similar_failures": [],
  "previous_attempts": [],
  "constraints": [],
  "policies": [],
  "external_research_needed": false
}
```

The values above are examples of schema/content, not claims about current production versions.

---

### 23.12.5 Research Planner query generation

Research queries come from the failure, not from generic trend searching.

Provider example:

```text
ERROR:
thread/resume returned invalid state
Codex CLI <version>
```

Possible targeted queries:

```text
Codex App Server thread/resume invalid state
Codex thread resume lifecycle documentation
Codex app-server persisted thread state
Codex <version> thread/resume regression
```

Context optimization example:

```text
Context Pack:
12,000 tokens

Target:
6,000

Recall:
99%
```

Internal queries:

```text
Which sections dominate Context Pack tokens?
Which facts are duplicated?
Which retrieved decisions were never used?
Which fields correlate with successful recovery?
```

No web access is needed unless internal evidence is insufficient or the root cause depends on external provider/library behavior.

---

### 23.12.6 Evidence Broker source selection by root cause

If:

```text
ROOT_CAUSE = PROMPT
```

search:

```text
current prompt
previous versions
bad outputs
good outputs
human feedback
```

If:

```text
ROOT_CAUSE = CONTEXT
```

search:

```text
retrieval results
missing facts
unused facts
pack sizes
ranking behavior
precedents
```

If:

```text
ROOT_CAUSE = PROVIDER_BEHAVIOR
```

search order:

```text
official docs
release notes/changelog
official examples
then GitHub issues/community reports
```

If:

```text
ROOT_CAUSE = UNKNOWN
```

expand research progressively.

---

### 23.12.7 Three teachers

The improvement system learns from:

```text
Benchmark outcome
+
Production outcome
+
Human feedback
```

None of these alone is considered the sole truth for subjective system behavior.

---

### 23.12.8 Full causal example — CEO-call regression

Observed:

```text
CEO calls/task
baseline = 4.1
candidate = 7.8
regression ≈ +90%
```

Locate window:

```text
v1.32 = 4.0
v1.33 = 4.2
v1.34 = 7.8
```

Inspect:

```text
git diff v1.33..v1.34
```

Candidate files:

```text
context/router.ts
policies/escalation.yaml
skills/council/SKILL.md
```

Trace evidence:

```text
73% of extra calls
= ESCALATE_CEO
```

Configuration change:

```text
before:
risk >= R2 → Claude

after:
risk >= R1 → Claude
```

Hypothesis:

```text
lowering escalation threshold R2 → R1 caused over-escalation
```

Candidate A:

```text
restore R2
```

Candidate B:

```text
R1 → Reflex
R2+ → Claude
```

Candidate C:

```text
R1 + low confidence → Claude
```

Then:

```text
A/B/C
→ identical MaestriBench trials
→ Promotion Gate
```

This example demonstrates the canonical principle:

```text
evidence
→ causal hypothesis
→ controlled experiment
```

not:

```text
symptom
→ random edit
```


## 23.13 — Hierarquia de contexto

```text
LEVEL 0
Hard Policies

LEVEL 1
Master Blueprint
ADRs
Architecture invariants

LEVEL 2
Current repository

LEVEL 3
Git history
last-known-good
first-known-bad

LEVEL 4
Events
traces
telemetry

LEVEL 5
Past failures
experiments
rollbacks

LEVEL 6
Human feedback

LEVEL 7
Official provider/library docs

LEVEL 8
GitHub
issues
community
papers
implementations
```

Regra:

```text
INTERNAL TRUTH FIRST
EXTERNAL RESEARCH ONLY WHEN NECESSARY
```

---

---

## 23.14 — Evidence Broker

```text
ROOT CAUSE
   │
   ▼
EVIDENCE BROKER
   │
   ├── Blueprint / ADR Search
   ├── Repo Search
   ├── Git Search
   ├── Trace Search
   ├── Experiment History
   ├── Human Feedback
   └── External Research Planner
             │
             ▼
        EVIDENCE PACK
```

Exemplos:

```text
PROMPT
→ current prompt
→ previous versions
→ good outputs
→ bad outputs
→ feedback
```

```text
CONTEXT
→ selected facts
→ missing facts
→ unused facts
→ pack size
→ retrieval ranking
```

```text
ROUTING
→ thresholds
→ route traces
→ outcomes
→ escalations
```

```text
PROVIDER_BEHAVIOR
→ official docs
→ release notes
→ changelog
→ issues/community only after official sources
```

---

---

## 23.15 — Improvement Memory

Persistir:

```text
successful_changes
failed_experiments
rolled_back_changes
rejected_hypotheses
known_antipatterns
human_feedback
```

Exemplo:

```text
Problem:
Council over-routing

Tried:
increase threshold

Result:
FAILED

Reason:
missed important security review

Instruction:
do not blindly repeat
```

O sistema aprende com:

```text
benchmark outcome
+
production outcome
+
human feedback
```

---

---

## 23.16 — I1 — Improvement Architect

Entrada:

```text
Failure Context
Evidence Pack
Constraints
Prior experiments
```

Saída obrigatória:

```text
Problem
Evidence
Root-cause hypothesis

Candidate A
Candidate B
Candidate C
No-change control

Expected effects
Possible regressions

Files allowed
Files prohibited

Required evals
Rollback strategy
```

I1 **não implementa antes de formular a hipótese**.

---

---

## 23.17 — Experiment Registry

Cada experimento deve registrar:

```text
experiment_id
problem_id
hypothesis
baseline
candidate
primary intervention
secondary changes
expected effect
metrics
hard gates
benchmark version
repo SHA
provider versions
CLI/tool versions
model/reasoning settings
seed when available
fixture version
result
decision
```

Regra preferencial:

```text
ONE PRIMARY VARIABLE PER EXPERIMENT
```

Quando possível.

Isso melhora atribuição causal.

---

---

## 23.18 — Candidate Generation

Gerar múltiplas alternativas.

```text
Candidate A
prompt

Candidate B
routing

Candidate C
context selection

Candidate D
model / reasoning

Candidate E
no-change control
```

Não procurar uma única “resposta certa”.

---

---

## 23.19 — Candidate Workspace

Cada candidato roda isolado.

Exemplo:

```text
maestri-ai-exp-101-a
maestri-ai-exp-101-b
maestri-ai-exp-101-c
```

Todos começam com:

```text
same repo SHA
same fixture
same Maestri state
same policies
same task
same benchmark version
```

Champion não é modificado.

---

---

## 23.20 — Benchmark Firewall

Estrutura:

```text
benchmarks/
├── public/
├── validation/
└── holdout/
```

Permissions:

```text
Improvement Architect
public       READ
validation   NO RAW ACCESS
holdout      NO ACCESS
```

```text
Benchmark Runner
public       READ
validation   READ
holdout      READ
```

Protected:

```text
benchmark/gold/
benchmark/holdout/
benchmark/graders/core/
policies/hard/
```

Melhoria adicional:

> O firewall deve ser aplicado por **process boundary / filesystem permission**, não apenas por prompt.

### Holdout lifecycle / leakage control

Como otimização repetida pode vazar informação indiretamente sobre um holdout:

- registrar `holdout_version`;
- registrar `exposure_lineage`;
- manter segmentos congelados;
- rotacionar/adicionar novos holdouts quando houver exposição acumulada;
- não revelar raw failures do holdout ao Improvement Architect;
- retornar apenas o mínimo necessário para promotion/rejection.

---

---

## 23.21 — Tournament Engine

```text
CHAMPION
vs
A
vs
B
vs
C
```

Mesmos:

```text
fixture
task
provider availability
policies
starting SHA
benchmark
trial count
```

Compare:

```text
task success
context fidelity
routing
recovery
tokens
latency
CEO calls
handoffs
retries
policy violations
security
```

Preferir comparação **pareada** por caso/fixture/trial quando aplicável.

Quando a variância for material, Promotion Gate considera incerteza/consistência e não apenas médias pontuais.

Não existe vencedor se houver hard failure.

---

---

## 23.22 — Multi-objective Selection

Não otimizar score único.

Prioridade:

```text
1 SAFETY
2 CORRECTNESS
3 RELIABILITY
4 QUALITY
5 COST
6 LATENCY
```

Exemplo:

```text
tokens -40%
accuracy -4%

= REJECT
```

```text
accuracy same
tokens -22%
latency -17%

= VALID IMPROVEMENT
```

---

---

## 23.23 — Promotion Gate

## HARD

```text
critical policy failures = 0
data loss = 0
unauthorized writes = 0
security regression = 0
critical benchmark regression = 0
```

## NON-REGRESSION FLOORS

```text
task success >= champion
routing >= champion/tolerance
context fidelity >= champion
recovery fidelity >= champion
```

## IMPROVEMENT

Pelo menos uma dimensão melhora de forma relevante.

Se a evidência for ruidosa ou inconclusiva:

```text
NO AUTO PROMOTION
→ collect more trials / evidence
```

Targets iniciais:

```text
quality +2pp
OR tokens -10%
OR latency -10%
OR CEO calls -10%
OR handoffs -15%
```

Esses valores são targets iniciais e devem ser recalibrados após baseline.

---

---

## 23.24 — Shadow

Vencedor de benchmark não controla produção imediatamente.

```text
BENCH WINNER
→ SHADOW
```

No shadow:

```text
champion decides
challenger observes
challenger predicts
no challenger side effects
```

Comparar:

```text
route match
route disagreement
expected action
critical misses
cost/latency estimate
```

---

---

## 23.25 — Canary

Depois de shadow:

```text
5%
→ 10%
→ 25%
→ 50%
→ 100%
```

Os percentuais são rollout targets iniciais, ajustáveis.

---

---

## 23.26 — Automatic Rollback

Sempre manter:

```text
current_champion
previous_champion
candidate
```

Triggers:

```text
policy regression
security regression
quality cliff
routing collapse
token explosion
latency cliff
recovery failure
unexpected CEO override
critical user correction
```

Evento:

```text
AUTO_ROLLBACK_TRIGGERED
```

---

---

## 23.27 — Online Evaluation

Offline:

```text
before promotion
```

Online:

```text
after promotion
```

Online mede:

```text
task success
retries
tokens
latency
CEO override
user correction
rollback
Council usefulness
handoff
reopen rate
```

---

---

## 23.28 — Human Feedback

Exemplo:

```json
{
  "signal": "human_override",
  "decision": "COUNCIL_STANDARD",
  "preferred": "CLAUDE_ONLY",
  "reason": "unnecessary_escalation"
}
```

Pipeline:

```text
Human Feedback
→ Improvement Memory
→ Failure Miner
→ benchmark case
→ future candidate
```

---

---

## 23.29 — Regression Flywheel

Regra:

```text
PRODUCTION FAILURE
→ automatic capture
→ minimized reproduction
→ regression benchmark case
→ fix
→ candidate passes
→ case stays permanently
```

Exemplo:

```text
RECOVERY-041
active_branch lost after resume
```

Benchmark cresce com o sistema.

---

---

## 23.30 — Improvement Cadence

## FAST LOOP

Depois de cada task:

```text
measure
record
classify
```

## NIGHTLY LOOP

```text
cluster failures
generate candidates
run benchmark
select challenger
```

## WEEKLY LOOP

```text
meta-analysis
remove useless rules
optimize routing
optimize prompts
compare models
analyze cost
review benchmark health
```

---

---

## 23.31 — Grader Meta-Evaluation

Ground truth humano:

```text
A = GOOD
B = MEDIUM
C = BAD
```

Esperado:

```text
grader(A) > grader(B) > grader(C)
```

Se falhar repetidamente:

```text
GRADER_DRIFT
```

A autoridade do grader é reduzida até revisão.

Quando a mesma família que propôs um candidate participa do julgamento:

- usar thread/contexto separado;
- não fornecer rationale persuasivo do proposer;
- anonimizar candidate identity quando possível;
- exigir cross-model judge para critérios subjetivos relevantes.

---

---

## 23.32 — Flakiness Detection

Melhoria adicional:

Benchmark cases instáveis não devem decidir promoção.

Cada case recebe:

```text
stable
flaky
quarantined
```

Case `flaky`:

```text
does not silently count as regression
→ investigate
→ fix fixture/test
→ re-enable
```

---

---

## 23.33 — Distribution Shift Monitor

Melhoria adicional:

Comparar:

```text
benchmark workload mix
vs
production workload mix
```

Se a produção mudar muito:

```text
DISTRIBUTION_SHIFT_DETECTED
```

Então:

```text
expand benchmark
reweight suites
add new real cases
```

sem apagar benchmarks antigos.

---

---

## 23.34 — Experiment Budget Governor

AutoImprove não pode consumir recursos infinitamente.

Budgets:

```text
max experiments/day
max tokens/day
max wall time
max provider quota
max concurrent candidates
```

Ao atingir budget:

```text
AUTOIMPROVE_BUDGET_EXHAUSTED
→ pause experiments
→ preserve current champion
```

---

---

## 23.35 — Benchmark Protection Layers

Quatro proteções mínimas:

```text
1 hidden holdout
2 immutable core graders
3 cross-model judges
4 production outcome validation
```

Mais:

```text
5 process/filesystem isolation
6 benchmark versioning
7 experiment reproducibility manifest
8 flakiness detection
```

---

---

## 23.36 — Optional Prompt/Security Eval Layer

Uma ferramenta externa como Promptfoo pode ser usada como camada opcional para:

```text
prompt eval
red-team
security regression
CI
```

Mas não substitui MaestriBench.

```text
MaestriBench
├── functional
├── routing
├── recovery
├── context
└── system metrics

optional prompt/security layer
├── prompt eval
├── red-team
└── security regression
```

---

---

## 23.37 — Final Canonical Loop

```text
WORK
  ↓
TRACE
  ↓
EVALUATE
  ↓
DETECT
  ↓
DIAGNOSE
  ↓
BUILD CONTEXT
  ↓
COLLECT EVIDENCE
  ↓
FORM HYPOTHESES
  ↓
GENERATE CANDIDATES
  ↓
BENCHMARK
  ↓
COMPARE
  ↓
SHADOW
  ↓
CANARY
  ↓
PROMOTE / ROLLBACK
  ↓
OBSERVE
  ↓
LEARN
  ↓
REPEAT
```

## Core invariant

```text
PROPOSER ≠ JUDGE ≠ HIGH-RISK APPROVER
```

Esse é o plano canônico unificado para o **Maestri AutoImprove**.

# 31. CONTEXTUAL REFLEX V0

`PROPOSED / EXPERIMENTAL`

```text
HARD POLICIES
  ↓
CONTEXT ENGINE
  ↓
MEMORY RETRIEVER
  ↓
TYPED DECISION MODEL
  ↓
CLAUDE FALLBACK
```

Typed questions:

```text
route: [codex, antigravity, claude, wait]
needs_review: true/false
needs_ceo: true/false
retry_allowed: true/false
```

Candidate engine:

- Laya typed-decisions.

Conflict:

- original V1 said `Laya ❌`;
- later design proposed Laya as Contextual Reflex V0.

Status:

`UNRESOLVED`.

Optional external implementation idea:

- `@receptron/laya` ONNX/TypeScript.

---

# 32. MAESTRI REFLEX PRÓPRIO

Future challenger only.

Proposed:

```text
ModernBERT-base
149M parameters
```

Heads:

```text
route
risk
retry
review
priority
host
escalation
abstain
```

Rollout:

```text
SHADOW
→ ADVISORY
→ AUTO R0
→ AUTO R0/R1
```

Gates:

```text
route accuracy ≥ 97%
false-safe < 1%
ECE < 0.10
critical failures = 0
p50 < 100 ms
p95 < 250 ms
```

Train only if it beats:

```text
hard rules
+ context
+ memory retrieval
+ contextual decision engine
+ Claude fallback
```

Dataset after AutoImprove:

```text
state
→ decision
→ outcome
→ evaluation
→ failure type
→ correction
→ improved decision
```

---

# 33A. WORKFLOWS PONTA A PONTA

## 33A.1 Task normal de engenharia

```text
Owner/User request
→ Claude CEO
→ Maestri creates TaskContract
→ Policy / Approval / Capability check
→ Dependency + Conflict Graph
→ Fast Decision route
→ Agent Factory compiles runtime agent
→ Codex/Antigravity execution
→ Loop Harness Observe/Verify
→ tests / evidence
→ Cross-Agent Review
→ AcceptanceManifest
→ Progress/Event update
→ Claude CEO status
```

## 33A.2 Decisão arquitetural complexa

```text
User / Claude CEO question
→ Neutral Framing
→ canonical snapshot
→ Council 3+3
→ anonymized cross-review
→ blind-spot pass
→ forced debate if triggered
→ Claude CEO final decision
→ C4
→ report + DAG
→ Maestri import
→ execution
```

## 33A.3 Crash / compaction recovery

```text
maestri resume
→ Session Kernel
→ checkpoints
→ Event Store replay / State Ledger projection
→ TaskContract
→ git status/log/diff
→ tests/evidence
→ provider resume
→ Recovery Context Pack
→ next action
```

## 33A.4 Evaluation / improvement

```text
real run
→ Trace Contract
→ Auto Evaluation
→ regression?
→ Failure Miner
→ Regression Locator
→ Root Cause
→ Improvement Context
→ Evidence Broker
→ Improvement Architect
→ candidates
→ MaestriBench
→ hidden holdout
→ shadow
→ canary
→ promote / rollback
→ regression case
```

## 33A.5 Production-critical action

```text
requested action
→ Hard Policy
→ risk / approval required?
→ capability scope
→ Claude CEO / Owner approval when required
→ execute
→ evidence
→ audit event
```


# 34. SUCCESS GATES

## 34.1 30-Day Gate

| KPI | Target |
|---|---:|
| Context/token overhead | −50% or better |
| CEO orchestration calls | −40% |
| Session recovery | −90% time |
| Handoff latency | −70% |
| User status interruptions | −60% |
| Total model usage | −20% |
| Tasks/day | +25% |
| Reflex safe routing | ≥97% |
| Operational recovery | <30s |
| Critical Reflex mistakes | 0 |

## 34.2 Mature Targets

```text
Context repeated      -40..-70%
Claude orchestration  -30..-60%
Orchestration tokens  -40..-70%
Total use             -15..-35%
Handoff               -60..-90%
Status interruptions  -50..-80%
Throughput            +20..+50%
```

Do not add these percentages.

---

# 35. ROADMAP ORIGINAL — 16 FASES PRESERVADAS

1. Bootstrap/Doctor.
2. CLI shell.
3. SQLite Event Store.
4. Session Kernel.
5. Claude CEO adapter.
6. Codex adapter V1.
7. Codex App Server V2.
8. Antigravity adapter.
9. Context Engine.
10. Task DAG + Progress Engine.
11. Policy Engine.
12. Maestri Council.
13. Cross-review + blind spots + forced debate.
14. Claude CEO Chairman + C4.
15. Mandatory Report Engine + E2E crash recovery.
16. Telemetry + 30-day baseline/evals.

Nenhuma fase foi apagada.

---

# 36. ROADMAP CANÔNICO POR DEPENDÊNCIAS

## Stage 0 — Baseline & Protection
- capture manual/current baseline;
- protect main;
- freeze hard-policy definitions.

## Stage 1 — Bootstrap / Doctor / CLI
- versions;
- models;
- auth;
- environment;
- core commands.

## Stage 2 — State Core
- SQLite;
- WAL;
- Event Store;
- Session Kernel;
- checkpoints;
- recovery skeleton.

## Stage 3 — Context + Fast Decision
- Context Engine;
- Memory skeleton;
- deterministic fast path;
- `maestri.decide()`.

## Stage 4 — Provider Adapters
- Claude;
- Codex exec;
- Codex App Server;
- Antigravity.

## Stage 5 — Task / Progress / Policy / Contracts
- TaskContract / TaskResult / digests;
- AcceptanceManifest;
- DAG;
- Dependency Graph;
- Conflict Graph;
- Progress Engine;
- Policy Engine;
- Approval/Capability tokens;
- Budget rules;
- context packs finalized.

## Stage 5A — Agent Factory + Harness
- AgentDefinition;
- validators;
- capability resolver;
- provider compiler;
- registry/version/hash/health;
- canonical templates;
- Loop Engine / Loop Detector;
- Evidence Guard;
- Fresh Context Reviewer;
- CI Fixer;
- Compound Learning integration.

No persistent runtime agent may bypass the Factory except explicit EPHEMERAL diagnostics.

## Stage 6 — Maestri Council
- 3+3;
- neutral framing;
- anonymization;
- cross-review;
- blind spots;
- forced debate;
- CEO chairman.

## Stage 7 — C4 / Reports / E2E Recovery
- C4;
- report artifacts;
- machine DAG;
- full resume/recovery.

## Stage 8 — Observability / MCG consolidation + MaestriBench
- audit existing MCG/dashboard implementation;
- migrate/reuse Wire/SSE/alerts/CEO Inbox/telemetry without duplicating control planes;
- preserve EXACT/ESTIMATED/UNAVAILABLE semantics;
- integrate Validation Lab into MaestriBench;
- 40-case suite;
- baselines;
- graders;
- fixtures;
- benchmark CLI.

## Stage 9 — Trace / Auto Evaluation
- Trace Contract;
- evaluation records;
- online metrics.

## Stage 10 — Failure Intelligence
- Failure Detector;
- Miner;
- Regression Locator;
- Root Cause.

## Stage 11 — Improvement Context / Evidence / Memory
- causal context;
- Evidence Broker;
- Research Planner;
- experiment memory.

## Stage 12 — AutoImprove Candidate Loop
- I1 Improvement Architect;
- Candidate Generator;
- Candidate Workspace;
- Experiment Registry;
- benchmark firewall with process/filesystem isolation;
- Champion × Challenger tournament;
- multi-objective Promotion Gate;
- Experiment Budget Governor.

## Stage 13 — Shadow / Canary / Rollback / Regression Flywheel
- zero-side-effect Shadow;
- progressive Canary;
- online evaluation;
- automatic rollback;
- permanent regression cases;
- grader reliability / `GRADER_DRIFT`;
- flaky benchmark detection/quarantine;
- production-vs-benchmark Distribution Shift monitoring.

## Stage 14 — Contextual Reflex Evaluation
Only if selected:
- shadow;
- routing accuracy;
- false-safe;
- latency;
- comparison vs rules/Claude.

## Stage 15 — Own Reflex Optional
Only if benchmark justifies:
- dataset;
- ModernBERT;
- heads;
- calibration;
- shadow/advisory/auto.

---

# 37. COUNCIL IMPLEMENTATION PLAN — 12 TASKS

1. Create `maestri-council`; define `CouncilRequest`, `AdvisorOpinion`, `PeerReview`, `ExecutiveDecision`, `ImplementationReport`.
2. Create Context Builder with objective, branch, files, prior decisions, constraints, tasks, test state.
3. Create Neutral Framing.
4. Implement C1/C2/C3 Codex adapters with prompt, structured JSON, model/reasoning config.
5. Implement G1/G2/G3 Antigravity adapters; discover/select model.
6. Parallel fan-out 3+3 with identical input and isolated contexts.
7. Anonymizer + cross-review + five mandatory questions.
8. Forced Debate with cross-family Prosecutor→Defender.
9. Claude CEO as Chairman.
10. C4 Implementation Architect/Planner with DAG/owners/deps/gates/tests/rollback.
11. Mandatory Report Engine `.md + .json`.
12. Council evals/shadow before any automatic routing authority.

---

# 38. AUTOIMPROVE IMPLEMENTATION PLAN — AI-01..AI-20

## AI-01 — Trace Contract

Dependência:

```text
Event Store
```

Entrega:

```text
canonical run trace schema
```

---

## AI-02 — Evaluation Record

Dependência:

```text
AI-01
```

Entrega:

```text
evaluation_runs
evaluation_scores
```

---

## AI-03 — Failure Detector

Dependência:

```text
AI-02
MaestriBench baseline
```

Entrega:

```text
regression classification
```

---

## AI-04 — Failure Miner

Dependência:

```text
AI-03
```

Entrega:

```text
failure clusters
```

---

## AI-05 — Regression Locator

Dependência:

```text
AI-03
Git history
versioned metrics
```

Entrega:

```text
last_good
first_bad
suspect diff
```

---

## AI-06 — Root Cause Engine

Dependência:

```text
AI-04
AI-05
```

Entrega:

```text
root cause hypothesis
evidence
unknowns
```

---

## AI-07 — Improvement Context Builder

Dependência:

```text
AI-06
```

Entrega:

```text
Improvement Context Pack
```

---

## AI-08 — Evidence Broker + Research Planner

Dependência:

```text
AI-07
```

Entrega:

```text
Evidence Pack
targeted internal/external queries
```

---

## AI-09 — Improvement Memory

Dependência:

```text
AI-02
```

Entrega:

```text
experiment/outcome memory
human feedback
known antipatterns
```

---

## AI-10 — Improvement Architect

Dependência:

```text
AI-07
AI-08
AI-09
```

Entrega:

```text
structured hypothesis
A/B/C/control plan
```

---

## AI-11 — Candidate Generator

Dependência:

```text
AI-10
```

Entrega:

```text
candidate variants
```

---

## AI-12 — Candidate Workspace + Experiment Registry

Dependência:

```text
AI-11
```

Entrega:

```text
isolated worktrees
reproducibility manifest
experiment registry
```

---

## AI-13 — Benchmark Firewall

Dependência:

```text
MaestriBench
```

Entrega:

```text
public / validation / holdout
filesystem/process isolation
protected graders/policies
```

---

## AI-14 — Tournament Engine

Dependência:

```text
AI-12
AI-13
```

Entrega:

```text
Champion vs Challengers
paired identical trials
```

Inclui:

```text
counterfactual/replay evaluation when side effects can be avoided
```

---

## AI-15 — Promotion Gate

Dependência:

```text
AI-14
```

Entrega:

```text
hard gates
non-regression floors
multiobjective selection
```

---

## AI-16 — Shadow + Canary

Dependência:

```text
AI-15
```

Entrega:

```text
shadow
5→10→25→50→100 rollout
online evaluation
```

---

## AI-17 — Auto Rollback

Dependência:

```text
AI-16
```

Entrega:

```text
previous champion restore
rollback report
```

---

## AI-18 — Regression Flywheel

Dependência:

```text
AI-03
AI-17
```

Entrega:

```text
production failure
→ minimized permanent benchmark case
```

---

## AI-19 — Grader Reliability + Flakiness

Dependência:

```text
AI-02
AI-13
```

Entrega:

```text
grader meta-eval
GRADER_DRIFT
flaky test detection
case quarantine
```

---

## AI-20 — Experiment Governor + Distribution Shift

Dependência:

```text
AI-14
AI-16
```

Entrega:

```text
experiment budget
provider quota control
benchmark/production distribution comparison
DISTRIBUTION_SHIFT_DETECTED
```

---

## 38.21 — Dependency Graph

```text
Event Store
   ↓
AI-01 Trace Contract
   ↓
AI-02 Evaluation
   ↓
AI-03 Failure Detector
   ├────────→ AI-04 Failure Miner
   └────────→ AI-05 Regression Locator
                    │
AI-04 + AI-05 ──────┘
          ↓
AI-06 Root Cause
          ↓
AI-07 Improvement Context
          ↓
AI-08 Evidence Broker
          │
AI-09 Improvement Memory
          │
          └──────┬───────
                 ↓
AI-10 Improvement Architect
          ↓
AI-11 Candidate Generator
          ↓
AI-12 Workspace + Registry
          │
AI-13 Benchmark Firewall
          │
          └──────┬───────
                 ↓
AI-14 Tournament
          ↓
AI-15 Promotion Gate
          ↓
AI-16 Shadow + Canary
          ↓
AI-17 Rollback
          ↓
AI-18 Regression Flywheel

AI-19 Grader Reliability
   ↳ protects evaluation quality

AI-20 Experiment Governor / Distribution Shift
   ↳ protects resource usage + benchmark relevance
```

---

# 38A. MAESTRI V3/V4 WORK PACKAGE — UNIQUE TASKS PRESERVED

Estas capacidades anteriores não podem desaparecer apenas porque o roadmap novo foi reorganizado.

## V4-01 — TaskContract / TaskResult

Implementar schemas e validação.

## V4-02 — State Ledger / ExecutionState

Implementar como projeção Event Store, não banco duplicado.

## V4-03 — Context Recovery

Recovery por:

```text
TaskContract
+ git status/log/diff
+ tests/evidence
+ checkpoint/events
```

## V4-04 — ContextBudget / Progressive Disclosure

Aplicar max tokens/files/bytes/retrieval depth/expansions.

## V4-05 — Dependency Graph

Gating de `READY`.

## V4-06 — Conflict Graph

Serializar overlapping writes.

## V4-07 — Policy / Approval / Capability

Capabilities temporárias e auditáveis.

## V4-08 — Agent Factory

Obrigatória para agentes persistentes.

## V4-09 — Agent Catalog

Templates + registry + versions + health.

## V4-10 — Execution Harness / Loop Engine

`Plan→Act→Observe→Verify→Classify→Retry/Replan/Escalate`.

## V4-11 — Loop Detector

same-error cap, max iterations/time/tokens, escalation.

## V4-12 — Evidence Guard

Proibir progresso/conclusão sem evidência.

## V4-13 — Fresh Context Reviewer

Revisão sem builder history.

## V4-14 — Cross-Agent Review

Revisão independente de artefato.

## V4-15 — CI Fixer

Loop especializado para CI.

## V4-16 — Compound Learning

Episodic memory → candidate lesson → validation → durable knowledge.

## V4-17 — Codex Local / Worktree / Cloud

Uma interface, múltiplos execution modes.

## V4-18 — Provider/Fleet Governance

Preservar quota/resource governance; papel de Jules permanece unresolved.

## V4-19 — MCG/dashboard migration

Reusar capacidades parciais e eliminar segundo control plane redundante apenas após equivalência comprovada.


# 39. DEFINITION OF DONE V1

```powershell
cd <LUMENVA_REPO>
maestri
```

Expected:

```text
MAESTRI

Session LUM-184 restored.

Claude CEO:
CONNECTED

Codex:
CONNECTED

Antigravity:
CONNECTED

Branch:
lumenva-command-center

Main:
PROTECTED

Pipeline:
74%

Current:
TASK-021 / Antigravity review

Last Council:
DEC-039

Last report:
.maestri/reports/DEC-039/implementation-plan.md

Resuming Claude CEO...
```

Then:

```text
onde estamos?
```

Claude replies in PT-BR with:

- feito;
- em andamento;
- aguardando;
- % total;
- próxima ação.

State comes from Maestri.

---

# 40. CANONICAL NAMING / ALIASES

| Canonical | Aliases / historical |
|---|---|
| C4 Implementation Architect / Planner | Implementation Architect, Implementation Planner |
| MaestriBench | benchmark layer, eval system |
| AutoImprove | self-improvement system, improvement loop |
| Failure Intelligence | Detector + Miner + Regression Locator + Root Cause |
| Fast Decision Engine | fast path, decision engine layer |
| Maestri Reflex own model | Reflex 149M, ModernBERT Reflex |
| Contextual Reflex V0 | typed decision contextual engine |

Important non-aliases:

- Context Engine ≠ Improvement Context Builder.
- MaestriBench ≠ AutoImprove.
- Policy Engine ≠ Promotion Gate.
- Event Store ≠ Improvement Memory.
- Fast Decision Engine ≠ Reflex.
- Council ≠ CEO.
- Council review ≠ C4 planning.

---

# 41. HISTÓRICO / SUPERSEDED / DEPRECATED

## 41.1 GPT-5.6 Sol → GPT-6 Sol

Historical:

```text
C1 GPT-5.6 Sol High
C2 GPT-5.6 Sol High
C3 GPT-5.6 Sol Medium
```

Canonical:

```text
C1 GPT-6 Sol High
C2 GPT-6 Sol High
C3 GPT-6 Sol Medium
```

## 41.2 Opus 5 → latest Opus policy

Opus 5 preserved historically.

Current policy:

```text
Claude CEO = strongest/latest Opus actually available
```

Doctor should detect rather than hardcode forever.

## 41.3 Reflex timing

Old:

```text
Runtime
→ Council
→ Telemetry
→ train Reflex 149M
```

Current:

```text
Runtime
→ deterministic Fast Path
→ Context/Memory
→ MaestriBench
→ AutoImprove
→ optional Contextual Reflex
→ optional own Reflex if benchmark wins
```

---

# 42. UNRESOLVED / OPEN QUESTIONS

1. Final name: `Implementation Architect` vs `Implementation Planner`.
2. Final report physical path/layout.
3. I1 Improvement Architect provider/model.
4. Whether Laya becomes canonical Contextual Reflex V0.
5. Memory Retriever embedding/similarity algorithm.
6. Failure clustering algorithm.
7. Exact judge models.
8. Automatic QUICK/STANDARD/DEEP triage thresholds.
9. Promotion tolerances after real baseline.
10. Config schema for Bench/AutoImprove/Contextual Reflex.
11. Historical ambiguous line `no validation set` in original Reflex gate.
12. Final persistent storage schema details for some AutoImprove tables.
13. Papel futuro de `Jules/Gemini Fleet` versus `Antigravity`; nenhuma remoção explícita existe.
14. Default de Codex execution mode: Local / Worktree / Cloud / historical Cloud-First Router.
15. Migração física do MCG existente para Context/Observability/MaestriBench.
16. Path físico do CEO Inbox.
17. Semântica exata de Policy Risk `R0–R4`.
18. Implementação física unificada do Budget Engine.
19. Nomes finais dos protocol/schema files de approval/capability/context/evidence/decision/handoff.
20. Catálogo canônico final de MCPs do Maestri.
21. Se alguma exclusão histórica V1 além de Laya será futuramente promovida (Docker/Postgres/Redis/RabbitMQ/Ollama/other LLM).
22. Tamanho/cadência final de rotação do hidden holdout após exposição acumulada.
23. Método estatístico final para significance/uncertainty no Promotion Gate após baseline real.
24. Limites finais do Experiment Budget Governor por provider/plano.

---

# 43. ACCEPTANCE CRITERIA

## Runtime
- sessions persist;
- IDs map to provider sessions/threads;
- event replay reconstructs state;
- checkpoint/resume works.

## Context
- critical facts present;
- hallucinated facts = 0 target;
- token compression measurable;
- pack reproducible.

## Fast Decision
- deterministic cases avoid model calls;
- hard policies cannot be bypassed;
- fallback explicit.

## Council
- same snapshot;
- six isolated agents;
- anonymization;
- cross-family review;
- blind-spot pass;
- debate triggers;
- CEO final decision;
- mandatory report.

## C4
- valid/acyclic DAG;
- owners/deps/tests/rollback/gates/DoD;
- no reinterpretation of CEO decision.

## Recovery
- <30s target;
- ≥99% state fidelity;
- zero data loss.

## MaestriBench
- isolated fixtures;
- reproducible baselines;
- protected graders;
- multi-trial;
- hard gates;
- comparative report.

## AutoImprove
- every run emits structured trace + evaluation record;
- Failure Detector finds functional and non-functional regressions;
- repeated failures can be clustered;
- last-known-good / first-known-bad can be located;
- Root Cause can safely return `UNKNOWN`;
- Improvement Context Pack is generated before hypotheses;
- Evidence Broker follows internal-first hierarchy;
- traces are scrubbed/redacted before external research;
- prior experiments/rollbacks/human feedback are retrievable;
- I1 creates multiple hypotheses plus no-change control;
- candidates run in isolated worktrees/workspaces;
- experiment manifests are reproducible;
- champion remains immutable during experiments;
- holdout is hidden by real process/filesystem boundary, not prompt alone;
- holdout exposure/version lineage is recorded;
- core graders/hard policies/gold labels cannot be auto-edited;
- Tournament uses identical starting conditions and paired comparison where applicable;
- hard gates block unsafe candidates;
- selection is multi-objective, not score-only;
- noisy/inconclusive evidence blocks auto-promotion until more trials exist;
- Shadow has zero side effects;
- Canary can expand, stop and roll back;
- rollback restores previous champion;
- confirmed production failure becomes permanent regression case;
- grader drift is detectable;
- flaky benchmark cases can be quarantined;
- AutoImprove has resource/provider budgets;
- benchmark/production distribution shift is detectable.

## Reflex
- ABSTAIN;
- shadow first;
- gates before automation;
- zero authority over hard policies.

---

# 44. EXTERNAL_ENRICHMENT PRESERVADO

## 44.1 Council Community Inspirations

Discussed sources:

- `itshussainsprojects/Claude-Council-Skill`
- `amgadelgamal/claude-council`
- `YonasValentin/llm-council`
- `TorpedoD/claude-council`
- coding-oriented Council implementations

They contributed patterns, not runtime dependencies.

## 44.2 Benchmark / Improvement Inspirations

Discussed:

- Terminal-Bench.
- SWE-Bench family as secondary sanity checks.
- LangSmith Engine as external validation of trace→cluster→root-cause→eval/update pattern.
- Promptfoo as optional prompt/security regression layer. Any date-specific migration/deprecation claim from the source plans must be revalidated before implementation; Promptfoo is not a MaestriBench replacement.
- Laya / `@receptron/laya` as possible Contextual Reflex implementation.
- ModernBERT-base 149M as future own-model candidate.

External material never silently replaces canonical Maestri decisions.

---

# 44A. HISTORICAL REPOSITORY ARTIFACTS / TRACEABILITY

Referências recuperadas da sessão e preservadas para auditoria.

## Maestri V3 canonical artifact

```text
branch: vps
file: docs/MAESTRI_AGENT_ARCHITECTURE.md
commit: 93c538723e77c992f971de6d99f571c7339fc54e
```

Conteúdo associado historicamente:

- TaskContract;
- State Ledger;
- Context Recovery;
- ContextBudget;
- dependency/conflict graphs;
- Policy R0–R4;
- Codex Local/Worktree/Cloud;
- Jules Fleet;
- Loop/Evidence/Fresh Review;
- CI Fixer;
- Compound Learning.

## Agent Factory addition

```text
branch: vps
commit: 5cdb3cb2c69d7fbbfb523c599855e6185bfa84ed
```

Associado a:

- AgentDefinition;
- Factory;
- catalog;
- validator/compiler/registry;
- mandatory no-manual-agent rule.

## Personal AI Engineering OS artifact

```text
branch: vps
file: docs/PERSONAL_AI_ENGINEERING_OS_MEGA_BLUEPRINT.md
commit: 7d0230d7089fa48d3f73489cc2d8e0753d510cbe
```

Status:

`HISTORICAL REPOSITORY REFERENCE`.

Essas referências não foram revalidadas contra GitHub nesta tarefa de consolidação; preservá-las não equivale a afirmar que o arquivo/commit ainda representa o HEAD atual.

## Codex Cloud plan reference

```text
docs/plans/maestri-codex-cloud-permanent-integration.md
branch historical: feat/f1-identity-mapping
commit historical: 4994efe7a2280b3adec74d63f9ca997d56e4fe46
```

A própria sessão posterior apresentou inconsistência sobre esse path/branch.

Status:

`UNRESOLVED REPOSITORY TRACE — REVALIDATE BEFORE USE`.


# 44B. EXTERNAL EVIDENCE CLAIMS FROM SESSION — REVALIDATE BEFORE USE

The session supplied external-research claims used to justify the MaestriBench/AutoImprove direction.

They are preserved for provenance but **not treated as canonical project facts without revalidation**.

## 44B.1 LangSmith Engine / IssueBench claim

Session-supplied claim:

```text
LangSmith Engine (May 2026)
production traces
→ failure clustering
→ issue identification
→ repo-aware diagnosis
→ proposed fixes
→ resolved issues become evals/regression protection
```

The session also referenced an `IssueBench` concept with ground truth for measuring whether issue detection/clustering was itself correct.

Status:

```text
EXTERNAL_ENRICHMENT
REVALIDATE BEFORE IMPLEMENTATION DEPENDENCY
```

## 44B.2 Anthropic / Warp learning-from-corrections claim

Session-supplied claim:

```text
human corrections
→ captured signals
→ agent skill updates
```

This supports the Maestri design:

```text
Human Feedback
→ Improvement Memory
→ Failure Miner
→ benchmark/regression case
→ future candidate
```

Status:

```text
EXTERNAL_ENRICHMENT
```

## 44B.3 OpenAI / Anthropic eval-driven pattern claim

Session-supplied pattern:

```text
traces
→ evals
→ diagnosis
→ change
→ re-evaluation
```

The project adopts this because it is compatible with its own architecture, not because an external source has authority over Maestri.

## 44B.4 External benchmarks

Session claims regarding:

```text
Terminal-Bench
SWE-Bench / SWE-Bench Pro
public benchmark contamination/design limitations
```

remain secondary context only.

Canonical rule remains:

```text
Maestri real-workload benchmark > public benchmark ranking
```


# 45. NEXT OPERATIONAL ACTION

Canonical immediate sequence:

1. capture baseline of the current/manual workflow;
2. audit existing Maestri/MCG code and historical `vps` artifacts read-only before deleting/rebuilding overlapping capabilities;
3. Bootstrap/Doctor;
4. CLI shell;
5. Event Store + State Ledger projection;
6. Session Kernel;
7. Trace/Event Contract from day one;
8. TaskContract / AcceptanceManifest / Evidence contracts;
9. Context Engine + ContextBudget;
10. deterministic Fast Path / `maestri.decide()`;
11. Agent Factory foundation;
12. provider adapters and execution modes;
13. follow dependency roadmap.

No donor implementation should be deleted before its unique capabilities are mapped to a canonical destination.

No code is implemented by this consolidation task.

---

# 46. CONSOLIDATION AUDIT

Logical sources analyzed: **24**

Ledger totals:
- **MERGED:** 41
- **PRESERVED:** 138
- **SUPERSEDED:** 3
- **UNRESOLVED:** 3
- **TOTAL UNITS:** 185


Coverage gates:

```text
100% IDENTIFIED SOURCE COVERAGE                 PASS
0 LOST UNIQUE TASKS                             PASS
0 LOST CANONICAL DECISIONS                      PASS
0 LOST KNOWN DEPENDENCIES                       PASS
0 SILENT CONFLICT RESOLUTIONS                   PASS
0 UNMARKED INVENTED FACTS                       PASS
0 KNOWN CAPABILITIES REMOVED BY DEDUPLICATION   PASS
0 UNJUSTIFIED ARCHITECTURAL DUPLICATIONS        PASS
```

Important limitation of the audit:

- repository references marked historical/unresolved were preserved but not revalidated against current Git HEAD in this documentation-only task;
- unresolved provider/layout/schema choices remain explicit rather than guessed.
- overlapping AutoImprove drafts were merged into the canonical §23/§38 design; no unique capability from either draft was dropped.

# INTEGRATED ADDITIONS — LAST THREE BLUEPRINTS + MCG WORKSTREAM

> This section is additive to the canonical Maestri blueprint above. It preserves all unique requirements from the latest Lumenva Brain and Git & Agent Governance blueprints and folds the standalone MCG implementation tracker into the same master. This document is the sole active plan. The source snapshots are retained under `docs/archive/source-blueprints/` for provenance; they are not competing trackers. No implementation is authorized by this document alone.

## 47. LUMENVA BRAIN — INSTITUTIONAL MEMORY, CONTEXT AND TEMPORAL KNOWLEDGE

### 47.1 Purpose and boundary

Build Lumenva Brain as the stable Lumenva-owned interface for institutional context, memory, provenance, temporal truth and knowledge governance. Hindsight is the initial replaceable memory engine, not the product interface.

```text
Maestri / Claude / Codex / Antigravity / Jules
                       │
                Lumenva Brain API
           ┌───────────┼───────────┐
     Context Compiler  Governance  Memory Adapter
                                      │
                                  Hindsight
                                      │
                         Postgres/Neon + pgvector
```

Brain is a broader Lumenva/Maestri capability, not a reason to move CRM, voice, or unrelated Lumenva domain code into this standalone MCG repository. MCG supplies its bounded context compilation, token-firewall, telemetry and dashboard integration through versioned contracts. Brain owns institutional facts and their authority/provenance. Maestri Event Store owns task/run lifecycle. These stores may reference the same IDs but must not become duplicate sources of truth.

### 47.2 Engine isolation, data and service

- Put Hindsight access behind a replaceable adapter. Future Graphiti-compatible or native engines may replace it without changing Maestri/provider-facing contracts.
- Keep engine tables/schema isolated from Lumenva-owned data. Proposed domains include agents, tasks/references, runs/references, sources, events, facts, fact versions, fact evidence, relations, profiles, checkpoints and access logs. Do not couple Lumenva domain code directly to Hindsight tables.
- Use Postgres/Neon plus pgvector as the proposed persistence foundation, subject to explicit architecture/security/cost validation before implementation.
- Preserve Graphiti as the proposed temporal-knowledge-graph adapter for episodes, entities, relations, time-aware retrieval and provenance. Brain remains the only agent-facing contract. Hindsight may provide episodic/vector/BM25/reflect capabilities; Graphiti must not become a second source of truth or duplicate retrieval surface. Select one graph backend only after verifying supported remote/local options; branch sources mention both FalkorDB and Neo4j, so the active backend is unresolved. No Docker installation.
- Service responsibilities: API (context, remember, recall, checkpoint, verify, forget, health); Hindsight adapter; context compiler/budget/ranking; memory extractor/dedupe/temporal/provenance/authority; governance policies/permissions/source authority; consolidation, temporal-resolution and profile-building workers; stable Lumenva Brain MCP server.
- Do not install Docker. Any container-based deployment is out of scope unless separately approved; design local/remote runtime without requiring Docker.

### 47.3 Stable agent interface and context lifecycle

Agents see only stable Brain operations: `lumenva_context`, `lumenva_recall`, `lumenva_remember`, `lumenva_checkpoint`, and `lumenva_source`; they never depend on Hindsight internals.

Each request is scoped by project/task/agent/run/session/workspace identity. At task start, compose only relevant architecture, decisions, constraints, known failures and source references into a bounded ContextPacket. Do not call Brain on every thought/tool invocation. Recall is on demand. At meaningful task completion, checkpoint structured decisions/fixes/source commit; then normalize, extract, deduplicate, verify sources, resolve temporal state, retain via adapter and preserve provenance.

Context compiler output must identify objective, relevant facts/decisions, constraints, previous failures, source-of-truth references and budget. Raw history is not sent by default.

### 47.4 Temporal truth, authority and provenance

- A changed fact is versioned, not erased. Preserve `valid_from`, `valid_until`, `observed_at`, `created_at`, `processed_at`, `expired_at`, `superseded_by` and status.
- Record source, agent, task, session, run, commit, timestamp and evidence for each important fact.
- Authority ordering: verified GitHub HEAD/config/runtime/test evidence first; approved blueprint/ADR and explicit owner decisions next according to their scope; verified memory after; agent inference last. Evidence beats inference.
- Conflicts must be surfaced and resolved through source authority, temporal validity, scope and audit trail; a memory projection cannot overrule a current source of truth.
- Mental-model/profile categories: architecture, current state, conventions, infrastructure, agent roles, known issues, decisions and security.
- Markdown Knowledge Pages (architecture, infrastructure, decisions, conventions, known issues, agents, current state) are generated projections for human/agent reading, never the source of truth.

### 47.5 Brain implementation work package (seven phases preserved)

1. **Foundation:** isolated engine adapter, Postgres/Neon + pgvector decision, separated schemas, health, secret handling, retain/recall tests.
2. **Brain API:** stable context/recall/remember/checkpoint/verify/forget/health interface; no agent calls Hindsight directly.
3. **Identity:** project/task/run/agent/session/workspace linkage for every memory operation.
4. **Temporal + provenance:** facts, versions, evidence, sources, relations, temporal fields and source commits; answer current and historical truth.
5. **Maestri integration:** bounded context at task start, on-demand recall, checkpoints at task end and safe session recovery.
6. **Governance:** source authority, scopes, permissions, verification, approvals, conflict resolution and audit.
7. **Consolidation:** profiles/mental models/pages, dedupe, stale detection, cleanup, context budgets, observability and recall-quality metrics.

**Acceptance:** stable agent-facing contracts; replaceable backend; scoped and auditable facts; historical truth preserved; retrieval quality and context budget measured; no unverified inference promoted to truth.

## 48. LUMENVA GIT & AGENT GOVERNANCE — SHARED ENGINEERING CONTROL PLANE

### 48.1 Goal and authority

One versioned governance policy should make work traceable across Claude, Codex, Jules, Gemini and humans. Agents execute; independent validation and GitHub evidence establish readiness; repository protections decide whether merge is allowed. Agent wording alone never completes a task.

This is a cross-repository control plane, not a second runtime Policy Engine. Maestri Policy Engine authorizes actions/capabilities; GitHub Governance enforces repository/PR/CI/branch rules. MCG consumes the applicable contracts and reports evidence; it does not create duplicate rulesets or task stores.

### 48.2 Task/execution record and lifecycle

Every task has a durable record containing task ID, objective, agent, role, model, session ID, external execution ID (metadata only), branch, governance version, implementation summary, attempts, errors and causes, recovery, self-validation, independent CI, PR, merge commit, cleanup, evidence, blockers, handoff and next action.

Allowed states retained from the source plan: `CREATED`, `RUNNING`, `VALIDATING`, `BLOCKED`, `FAILED`, `READY`, `MERGED`, `CLEANING`, `CLEANED`, `COMPLETED`. A task cannot jump from implementation directly to completion. Completion requires objective acceptance, required tests/evidence, PR, independent checks, permitted merge, verification, cleanup or an explicit audited cleanup exception, and archived execution record.

An error record must state attempted action, error, cause, impact, attempt number and recovery outcome. Retry the same task/branch/record for the same objective; create a new task only for a genuinely new objective. Handoff includes current status, completed work, failures, remaining work, blockers, next action and safe-to-continue flag. Sessions are appended to the same task history when ownership changes.

### 48.3 Identity, branch, commit and PR conventions

- Preserve the proposed readable branch format: `agent/<agent>/<role>/<model>/session-<session-id>/task-<task-id>-<objective>`, lowercase, hyphenated words, structural slashes only. External provider IDs and long timestamps stay in metadata, never in human-facing names.
- The source examples and naming prohibitions (generic `chore/*`, `feature/*`, `misc/*`, meaningless IDs) remain requirements to validate and adopt where compatible with existing GitHub/provider limits.
- Commit subject describes the component/action, not opaque task IDs. PR template carries task, agent, role, model, session, external execution ID, objective, implementation, errors/recovery, validation, blockers and next action.
- Validate branch naming and execution metadata automatically. Keep provider identity privacy, model naming stability, maximum branch length, and compatibility with Jules/Codex cloud branch creation as explicit design checks before enforcement.

### 48.4 Central GitHub governance for personal-account repositories

The source blueprint proposes `trydavidqix/github-governance` as the canonical policy repository, with policy files, schemas, workflows, discovery/sync/audit scripts and config. Keep this as the proposed control-plane location pending read-only repository discovery; do not create or mutate GitHub resources under a documentation-only consolidation.

It must work with a personal GitHub account and must not assume an Organization. Validate which rulesets, required checks, permissions and APIs are available for each target repository/account plan. Repository-specific CI remains in each repo; shared governance defines the common policy.

Desired settings include required PR, required status checks, conversation resolution, block force-push/deletion, branch-up-to-date when supported, and automatic remote branch deletion after verified merge. No direct main push, auto-merge or broad destructive automation is introduced by this plan. Local hooks are advisory defense only; they are not the source of truth because cloud agents do not run on the PC.

### 48.5 Sync, drift, security and scope

- Policy has explicit semantic version (initial proposal v1); execution records capture the policy version used.
- Discover eligible account repositories, filter exclusions, apply only approved common rules, verify actual state, and report partial capability/errors.
- Sync on policy change and scheduled audit; compare desired/current state; detect drift. Report before repair where a repair could alter repository protection or interrupt work. Never silently weaken protections.
- New eligible repositories inherit policy after discovery and verification. Maintain allowlists/exclusions and dry-run.
- Preserve tasks/errors/validation/evidence/commit/PR/agent/session history. Branches/worktrees/temp environments can be cleaned only after verified merge and safe ownership checks. Cleanup failure remains `CLEANING`, not `COMPLETED`.
- Execution records must not contain secrets. External IDs/tokens are metadata references only. Include least privilege, secret scanning, audit trail and bounded access.
- Legacy branches need progressive migration; do not rename/delete all historical branches as a prerequisite.

### 48.6 Governance implementation work package (14 phases preserved)

1. Governance repository and ownership.
2. Policy schemas for naming, identity, lifecycle, execution records, PR, validation and cleanup.
3. Repository discovery and eligibility/exclusions.
4. Ruleset sync with capability detection and dry-run.
5. Repository settings sync.
6. Agent governance workflow (metadata, branch, lifecycle, required evidence).
7. CI adapter per repository stack.
8. Shared PR template / execution record.
9. Safe post-merge cleanup and archival.
10. Scheduled audit.
11. Drift reporting and approved repair.
12. Minimal agent integration instruction.
13. Progressive migration for new work first.
14. Governance v1 lock after evidence and account-capability validation.

**Acceptance:** personal-account compatibility proven; no organization assumption; one policy source; each repository's own test adapter retained; PR/CI evidence is independent; cleanup/history semantics hold; sync and drift are auditable; no work in unrelated CRM/voice scopes.

## 49. MAESTRI CONTEXT GATEWAY — PRODUCT WORKSTREAM IN THIS MASTER

MCG remains a standalone product in this repository: local gateway, context compilation, token firewall, provider telemetry, evidence, registry and read-only dashboard. It does not absorb the entire Maestri runtime, Lumenva CRM, voice, or global assistant profiles.

### 49.1 Existing verified status (scope-specific)

The current MCG tracker reports phases 0–2 accepted, phase 3 partial, phase 4 partially implemented but not accepted, phase 5 implemented but not accepted, and phase 6 pending: **3/7 accepted = 43% for the MCG workstream only**. This is not the overall Maestri/Brain/Governance completion percentage. Dashboard has readable reports for all 14 registered views and a working light/dark/system selector. Isolated Playwright verified both palette backgrounds/meta colors, all 14 report views and 390px mobile without horizontal overflow. PRs #8–9 implement a single report renderer, report-heading focus, keyboard-scrollable task table with caption/scoped headers, polite loading/success/unavailable/error announcements, stale-response protection, and no-store refresh on each report visit. PR #12 adds explicit ALL_TIME/5,000-record scope for Cache/History and benchmark sample coverage against the 30-pair minimum, remaining unavailable when no valid pairs exist. PR #14 adds all-time task scope and exact result-file evidence coverage. PR #16 distinguishes report-generation time from actual last source observation for Cache/History. PR #18 adds explicit data scope and limitations to every view. Still open: interactive browser/screen-reader verification and image-based reference-fidelity review. Jules drafts not merged/validated are not implementation evidence.

### 49.2 Seven implementation phases retained

- **F0 Product separation and reconciliation — accepted:** independent repository, extraction boundary, CI, historical plans retained, consumer integration only by typed/versioned interface; no CRM/voice migration.
- **F1 Runtime/daemon/MCP discovery — accepted:** Windows lifecycle/health/autostart constraints, configurable port, metadata-only discovery/probe, no tool calls or secret export, offline/loopback safety.
- **F2 Auditable telemetry — accepted:** exact/estimated/unavailable semantics, provenance, token-field counting without double counting, local recovery boundaries, traceparent and 30-case validation corpus.
- **F3 Token Firewall — partial:** existing operation traces, bounded `compactResult`, `waitForTerminal` watcher, and compiler fragment hashes/deltas provide part of the foundation. PR #19 adds secret-pattern redaction before task result persistence and an on-demand paginated `mcg evidence <task-id> --type result` drill-through; PR #22 adds redaction before replay/evaluation stdout and stderr are persisted, while preserving numeric token measurements. PR #23 adds a normalized process-operation envelope with terminal status, timestamps, duration, exact output byte counts, SHA-256 digests and source provenance, without retaining command arguments; replay/evaluation records persist this envelope. PR #25 adds a Local Runtime read-only batch API: up to 20 typed operations, bounded concurrency/output, stable result ordering and sanitized per-operation failures. This is not yet exposed as one provider/tool call, so no model-roundtrip or token savings are claimed. Still open: agent/tool-loop integration for batching; comprehensive hostile/oversized output and rename/removal/scope tests; verified hash/checkpoint reuse at the executor boundary; and provider-backed comparative benchmark. Codex 0.155.1 accepted the candidate key as a CLI override, but no model run or global config change was made. Never change global Codex config without separate authorization.
- **F4 Clear reports for all 14 dashboard areas — partial, not accepted:** shared report shell and readable recursive fields/lists cover Overview, History, Traces, Tasks, Agents, Tools, Plugins/Skills, MCPs, Context/Graph, Executions, Cache, Memory, Validation MCG and Alerts. Reports show source, query time, measurement quality, explicit per-view data scope/limitations, unavailable fields, safe escaped content and empty states. Isolated browser smoke rendered all 14 areas without raw JSON. PRs #8–9 added accessible report navigation, live loading/result/error announcements, stale-response protection, and fresh no-store data on each visit. PR #12 adds declared ALL_TIME/5,000-record scope on Cache/History and measured coverage of observed validation pairs against the explicit 30-pair minimum. PR #14 adds task-result evidence coverage using the observed task count as denominator. PR #16 labels report query time separately from actual latest Cache/History observation. Remaining gates: interactive browser/screen-reader checks and complete visual QA.
- **F5 Reference-faithful design, themes and accessibility — implemented, not accepted:** exact light/dark semantic palettes and persistent Light/Dark/System selection are implemented; isolated Playwright previously confirmed palette/meta-color changes and 390px layout without horizontal overflow. A new automated WCAG token audit verifies text contrast ≥4.5:1 across background/sidebar/surface/card pairs, focus contrast ≥3:1, and the reduced-motion media rule. This is a CSS-token check, not proof for every rendered state or screenshot. Semantic keyboard affordances and status announcements remain without interactive browser/screen-reader verification. Remaining: compare screenshots against supplied references, inspect touch behavior and confirm all statuses have visible non-color labels. Do not control the user's active Chrome; use isolated browser/test tooling.

**Exact light palette:** main background `rgb(242, 242, 247)`; secondary background `rgb(229, 229, 234)`; light cards `rgb(248, 248, 250)`; elevated cards `rgb(255, 255, 255)`; grays `rgb(209, 209, 214)`, `rgb(199, 199, 204)`, `rgb(174, 174, 178)`, `rgb(142, 142, 147)`; secondary text `rgb(72, 72, 74)`; primary text `rgb(28, 28, 30)`; green `rgb(0, 200, 83)`, glow `rgb(48, 209, 88)`; red `rgb(255, 56, 60)`, strong alert `rgb(233, 21, 45)`; white glass `rgba(255, 255, 255, 0.65)`, glass border `rgba(255, 255, 255, 0.80)`, shadow `rgba(0, 0, 0, 0.12)`.

**Exact dark palette:** absolute black `rgb(0, 0, 0)`; soft black `rgb(16, 16, 17)`; primary black `rgb(20, 20, 20)`; card `rgb(25, 25, 25)`; black-gray `rgb(31, 31, 31)`; dark gray `rgb(43, 43, 43)`; border `rgb(48, 48, 48)`; medium gray `rgb(64, 64, 64)`; secondary gray `rgb(119, 119, 119)`; secondary text `rgb(153, 153, 153)`; primary text `rgb(245, 245, 245)`; green `rgb(0, 230, 118)`, bright glow `rgb(0, 255, 106)`; red `rgb(239, 68, 68)`, strong alert/glow `rgb(255, 18, 48)`; dark glass `rgba(25, 25, 25, 0.72)`; subtle light border `rgba(255, 255, 255, 0.10)`; highlight `rgba(255, 255, 255, 0.06)`; shadow `rgba(0, 0, 0, 0.45)`; green glow `rgba(0, 255, 106, 0.30)`; red glow `rgba(255, 18, 48, 0.30)`.
- **F6 Evaluation, benchmark and release gate — pending:** tests/scans/evals, paired 20-task baseline/candidate on same conditions, provider-reported token metrics distinct from estimates, quality/recall/grounding/evidence non-regression, accessibility and release/rollback checks. No unsupported savings claims or deployment.

### 49.3 MCG acceptance

All seven phases require evidence. Dashboard has useful PT-BR reports across all 14 areas; numbers are qualified and link to evidence; light/dark references and usability are validated; token firewall reduces measured redundancy without harming quality; tests and scans pass. Overall plan remains unmeasured until all workstreams have a reconciled objective denominator.

## 50. SINGLE EXECUTION MODEL — INTEGRATION WITHOUT DUPLICATE ENGINES

| Concern | Canonical owner | Integration rule |
|---|---|---|
| User goals, critical approval, role authority | Owner + Maestri Session Kernel/Policy | Never delegated away or self-approved by an agent. |
| Task/job/run lifecycle, DAG, events, recovery | Maestri Task Engine + Event Store | Brain stores scoped references/projections, not a second task authority. |
| Context compilation, budgets, incremental retrieval, tool exposure | Maestri/MCG Context Engine and Token Firewall | One bounded ContextPacket contract; Brain is a source/retriever, not another compiler. |
| Institutional facts, temporal versions, source evidence, profiles | Lumenva Brain | Backend replaceable; knowledge pages are projections. |
| Agent definitions and provider compilation | Maestri Agent Factory | Claude/Codex/Jules/Antigravity consume common contracts. |
| Action approval/capability/risk | Maestri Policy Engine | GitHub workflow/rulesets enforce repo gates; no duplicate policy store. |
| Branch/PR/CI protection and repository drift | GitHub Governance control plane | MCG reads/reports; repository checks enforce. Personal GitHub support must be validated. |
| Execution telemetry, trace and dashboard | Maestri Trace/Telemetry + standalone MCG UI/API | One event/trace contract; no second telemetry store. |
| Quality, evaluation and improvement | MaestriBench / Evidence / AutoImprove | MCG Validation Lab contributes evidence; it is not a parallel evaluator. |
| Memory engine | Hindsight adapter (initial) | No direct engine dependency in Maestri or agents; no Docker installation. |
| Temporary execution cleanup | Task lifecycle + approved GitHub cleanup | Only verified merged resources; preserve durable record and user work. |

### 50.1 Integration invariants

- One canonical TaskContract, TaskResult/ResultDigest, Event Store and trace identity; extend existing contracts instead of creating parallel versions.
- One authoritative execution plan. The original Maestri 16-phase roadmap, canonical dependency stages, Council 12 tasks, AutoImprove AI-01..20, V4-01..19, Brain 7 phases, Governance 14 phases and MCG F0..F6 remain preserved as named work packages within this master, not separate active plans.
- Progressive context: minimum task contract → symbols/paths → relevant excerpts → additional files only on demonstrated need. Hard caps apply; no session/repository dumps by default.
- Tool registry is lazy/on-demand, sorted deterministically, scoped to task capabilities, with capability probing/health. MCP state is explicit; no assumption that “configured” means callable.
- Cross-agent handoff routes through Maestri with a bounded packet and result digest; never forward full raw session by default.
- Keep memory (durable knowledge) separate from current context (what is required now); retrieve only relevant facts.
- Instrument trace/job/task/agent/execution/context-packet identity and token/bytes/tools/files/duration/cost/provider where observed; missing measurements remain unavailable.
- No Docker installation, no CRM/voice migration, no global settings edits, no auto-merge, and no destructive cleanup from this document.

## 51. UNIFIED ROADMAP AND DEPENDENCIES

The existing detailed roadmaps and task IDs remain intact in Sections 35–39 and work packages above. The following integration sequence supplies cross-blueprint dependencies without replacing those tasks:

1. **Reconcile and baseline:** inventory repository and source evidence; lock one master and source ledger; preserve accepted/partial/unknown states; no destructive migration.
2. **Canonical identity and contracts:** TaskContract, TaskResult, execution record, agent/task/run/session/workspace identities, versioned governance schema.
3. **State and recovery:** Event Store, task DAG/lifecycle, checkpoints, durable execution history, handoff and bounded crash/compaction recovery.
4. **Context and efficiency:** ContextPacket/Budget, Instruction Resolver, progressive retrieval, lazy tools, Token Firewall, summaries/evidence links, batching, async watcher, hashes/deltas.
5. **Providers and Agent Factory:** real provider adapters/capabilities/health/quota/usage, common contract, bounded routing/fallback, no duplicate sessions unless explicitly required by the architecture.
6. **Policy and repository governance:** action risk/scopes/approval and personal-account GitHub policy control plane, PR/CI gates, drift reporting, safe cleanup.
7. **Brain memory:** adapter/API, identity, temporal facts/provenance/authority, Maestri integration, governance and consolidation. Dependencies: canonical IDs, state/event boundary and source authority.
8. **Execution quality:** evidence gates, independent review, CI, Council/C4, MaestriBench and Recovery tests. No self-certified completion.
9. **Observability and dashboard:** unified telemetry and traces, 13 evidence-backed reports, MCG integration, light/dark/reference fidelity, accessibility, usability and honest unavailable states.
10. **Improvement and rollout:** AutoImprove/Reflex only behind holdouts, non-regression, shadow/canary/rollback; benchmarks, security, recovery, compatibility and staged release.

### 51.1 Crosswalk to preserved work packages

- Canonical stages 0–15 and original 16 phases: retained unchanged; mapped across roadmap items 1–10.
- Maestri V3/V4 unique tasks V4-01..V4-19: retained; principally items 2–9.
- Brain phases 1–7: retained in §47.5; principally items 3, 4, 6, 7 and 9.
- Git Governance phases 1–14: retained in §48.6; principally items 2, 5, 6 and 10.
- MCG F0–F6: retained in §49.2; principally items 1, 4, 8, 9 and 10.
- Council 12 tasks and AutoImprove AI-01..AI-20: retained in Sections 37–38; principally items 8 and 10.

## 52. SOURCE PRESERVATION AND NON-LOSS AUDIT

- The original 140k-character Maestri canonical blueprint remains intact above; new material is additive.
- The Lumenva Brain and Git & Agent Governance email attachments, plus source snapshots for the selected `vps`, `TOKENS`, local-runtime and Command Center V2 plans, are preserved in `docs/archive/source-blueprints/`; unique requirements are integrated in §§47–48 and §§54–61 with coverage mapping in Appendix E. These are provenance snapshots, not active plans or proof that implementation code has been transferred.
- The prior standalone MCG master plan is preserved as a historical snapshot in `docs/archive/`; its seven phases, scope rules, status, exact palette, 14 report areas, token-firewall gates and validation/release requirements are integrated in §49.
- The prior MCG implementation plan, architecture, status evidence, dashboard plan and archive remain untouched except for a clear pointer to this sole active master.
- Deduplication merges responsibility boundaries and repeated statements only. It does not remove acceptance criteria, tasks, risks, constraints or unique source requirements. Conflicts remain explicit in §53; unverified proposals remain proposed, not implemented.

### Appendix E — source-to-master coverage

| Source | Preserved destination | Coverage |
|---|---|---|
| `MASTER_BLUEPRINT_CANONICAL.md` attachment | §§0–46, Appendices A–D | Full source retained; additions follow. |
| `Lumenva Brain — Plano de Implantação` | §47.1–47.5 | Purpose, replaceable Hindsight adapter, schemas, service tree, stable MCP interface, context/checkpoint lifecycle, temporal model, authority, provenance, profiles/pages, Maestri flow and all seven phases/acceptance. Verbatim original archived. |
| `Lumenva Git & Agent Governance — Master Plan` | §48.1–48.6 | Identity, branch/commit/PR, records/errors/recovery, states/gates, GitHub personal-account control plane, rulesets/actions, repository discovery/sync/drift, security, handoff, cleanup, 14 phases and principles. Verbatim original archived. |
| Current MCG master plan | §49, §50–51 | Scope, verified phase status, F0–F6, 14 dashboard reports, exact dual palettes/theme/accessibility, token firewall, benchmarks/release. Full prior file archived. |

**Completion accounting:** MCG retains only its evidence-backed 3/7 = 43% workstream figure until revalidated. Brain and Git Governance are planned/unknown until implementation evidence is audited. Total Maestri program percentage is **not measurable** until a single execution ledger assigns statuses/weights to the complete dependency roadmap; do not average percentages with incompatible denominators.

**Verification update (2026-09-24, standalone `main`, through PR #23 and follow-up commit `eda600c`):** MCG tests 51/51; syntax/import smoke 34 modules; sensitive/path scan 128 files PASS. Operating Core / Cloud Fabric strict typecheck passes and tests pass 69/69 with 2 integration tests skipped. Local Runtime typecheck passes and unit tests pass 14/14. Added tested provider/model scoring and explicit native-model propagation (logical tiers are not passed as CLI model IDs), validated-only learning, deterministic context packet ordering, task path propagation/scope enforcement, persisted-approval injection seam, null/unknown provider cost semantics, and an orchestrator integration test for distinct reviewer, trace/evidence persistence and scope violations. Isolated Playwright verified both exact theme surfaces/meta colors, all 14 dashboard reports, and a 390px viewport without horizontal overflow. PRs #8–9 add report keyboard semantics/status announcements and fresh registry reads; PR #12 adds explicit cache/history periods and benchmark sample coverage; PR #14 adds task result-evidence coverage; PR #16 distinguishes report query time from source observation time; PR #18 adds tested per-view data scope and limitation disclosures; PR #19 adds result evidence drill-through and task-state redaction; PR #20 adds automated WCAG contrast/reduced-motion token checks; PR #22 adds replay/evaluation artifact redaction; PR #23 adds operation status/byte/hash provenance persisted with evaluation/replay records. Interactive browser/screen-reader checks were not run in this task. These are local structural tests only; they do not close live provider, durable database, worktree driver, paid quota, 30-sample benchmark, screenshot/reference-fidelity or release gates. Do not convert these results into a new overall percentage.

## 53. OPEN DECISIONS — PRESERVE, DO NOT GUESS

1. Confirm canonical product/repository ownership of Brain and Git Governance code versus this standalone MCG repository; current plan keeps Brain/Governance as integrated Maestri workstreams and MCG as its own package.
2. Validate Neon/Postgres/pgvector operational choice, Hindsight API/deployment and alternative adapter contract. No Docker installation.
3. Validate personal GitHub account capabilities and exact eligible repositories before syncing rules.
4. Confirm branch naming compatibility/privacy and provider constraints before enforcing the full agent/role/model/session path.
5. Define source-of-truth IDs and event/data contracts across Maestri, Brain and MCG; reuse canonical contracts, avoid parallel stores.
6. Re-audit current implementation evidence and branch/worktree ownership before assigning progress or cleaning resources.
7. Define workstream weights/status ledger before publishing an overall percentage.
8. Resolve Graphify vs Graphiti naming/product and whether Graphiti is needed beside Hindsight; select one graph adapter/backend and define the boundary so memory/retrieval is not duplicated. Verify the current official compatibility and deployment path before implementation; Docker remains prohibited.

# ADDITIVE END NOTE

No source requirement is intentionally dropped. The canonical blueprint above remains the backbone; Brain, Git/Agent Governance and standalone MCG requirements enter as bounded work packages with explicit owners, interfaces, dependencies, acceptance gates and unresolved decisions.

# 54. BRANCH MIGRATION INVENTORY — MAESTRI-ONLY SCOPE

> This inventory audits the user-designated Lumenva refs. Git does not expose an authoritative branch-created timestamp; dates below are earliest branch-specific commit evidence or visible tip dates. Refresh SHAs before migration or cleanup.

| Source ref | Date evidence (2026) | Maestri payload | Scope finding |
|---|---|---|---|
| vps | Shared Maestri line begins 2026-09-22; tip 2026-09-23 23:47 | Maestri V3 Core, app core, operating-core cloud-fabric, architecture and workflows | Canonical technical source. Import only Maestri-owned paths; exclude CRM/social-business code. |
| TOKENS | Shared line begins 2026-09-22; tip 2026-09-23 22:42 | Frontier Brain/Workforce plan and cloud-fabric | 95 paths against stale local main; overlaps vps. Reconcile file-by-file. Its embedded MCG package was removed; do not restore it. |
| lumenva-local-runtime | Shared line begins 2026-09-22; tip 2026-09-23 22:42 | packages/local-runtime and runtime plans | Import runtime-owned paths only; adapt workspace dependencies and tests. |
| lumenva-command-center | Tip 2026-09-23 10:18 | Accepted MCG extraction evidence and Command Center requirements | Diff includes MCG extraction plus Social Brain/Meta changes. MCG is already here; do not re-import or copy CRM files. |
| lumenva-command-center-blueprint-v2 | Blueprint commit 2026-09-22 02:43 | V2 blueprint and plan | Two docs. Reconcile unique desktop/core, control plane, agent factory, memory, Brain and Obsidian requirements. |
| feat/maestri-engineering-council | First unique commits 2026-09-20 02:02 | Council role contracts/setup/notes | Documentation only; overlaps feat/maestri-engineering-council-clean. |
| feat/maestri-engineering-council-clean | Council assets 2026-09-20 02:06 | Same Council assets | Near-duplicate; deduplicate files but preserve distinct checks and handoff artifact if applicable. |
| feat/f1-identity-mapping | Maestri Cloud plan commit 2026-09-22 03:47 | Only docs/plans/maestri-codex-cloud-permanent-integration.md | Other F1 identity/tenant/database artifacts are out of scope. |
| docs/jules-delegation-skill | 2026-09-23 14:53 | Jules delegation/verification skill | One project skill; no global install. |
| backup/lumenva-command-center-pre-cleanup-2026-09-22 | Backup ref dated 2026-09-22 | .claude/agents/ceo.md and .agents/agents/cio/agent.md | Backup contains extensive CRM code. Only these two role artifacts are candidates. |
| vps-17455632840955604138 | Tip 2026-09-23 23:48 | Two Session Engine files under packages/operating-core/src/session/ | Exact delta vs vps: new test and Session Engine implementation update. |
| codex/mcg-ci-integration | 2026-09-23 09:36 | MCG extraction provenance | Product already exists independently; no duplicate source import. |

## 54.1 Audited exclusions

Do not migrate apps/crm, apps/social-brain-*, Meta provider/webhook, Supabase tenant/auth/business migrations, voice, GCP business integrations or general Lumenva business code just because it shares a branch. In F1 only the named Maestri Cloud plan is in scope. From backup only the CEO/CIO role files are candidates. Branch names and dates do not prove file ownership.

## 54.2 Worktree and date safety

- vps worktree is clean but still attached; retain its ref until its owner/session is confirmed released.
- `codex/command-center-dashboard` is a local-only branch in the attached `command-center` worktree; it tracks `origin/lumenva-command-center`, is 50 commits ahead/21 behind that upstream, and has 22 dirty tracked/untracked paths mixing Maestri and CRM/Meta. Do not cherry-pick, reset, clean, merge or delete it.
- `feat/f1-identity-mapping` worktree is one commit ahead and has dirty Cloud-job/Codex and CRM package changes plus untracked tests/docs. Preserve untouched; only the committed plan document may be extracted.
- `vps`, `docs/jules-delegation-skill`, and `codex/mcg-ci-integration` worktrees were clean at the 2026-09-24 read-only check but remain attached; retain their refs until owners/sessions release them.
- The Lumenva root worktree is dirty on `chore/upstream-migrations-0347-0380`, with project rules, Jules files, backups and scripts; do not use it as a migration source or alter it.
- Local origin/main was stale relative to GitHub branch listing. Refresh exact SHAs before any ref operation.
- Git refs do not give branch creation timestamps. Record first unique commit/date and authored-plan date as evidence, not exact creation date.
- Read-only refresh on 2026-09-24: Lumenva root remains dirty on `chore/upstream-migrations-0347-0380` (three modified `.claude/rules/*` files and untracked Jules/config backup/test artifacts); Command Center remains 50 ahead/21 behind with 22 dirty mixed Maestri/CRM/Meta paths; F1 remains attached, one commit ahead, with dirty Cloud-job/Codex and CRM package changes plus untracked tests/docs. `vps` and MCG-CI are clean but attached. This confirms preservation is required; no source cleanup or transfer is authorized by this snapshot.

# 55. FRONTIER BRAIN / AGENT WORKFORCE — TOKENS ADDITIONS

Preserve the unique TOKENS_FRONTIER_BRAIN_AGENT_WORKFORCE_PLAN.md requirements without rebuilding the existing Context Engine, Task DAG, MCG, Resource Router or evidence systems.

### 55.1 MasterPlan and workforce contract

A frontier planner creates a canonical MasterPlan before high-impact work: objective, business context, assumptions, requirements, architecture, decisions, constraints, risks, dependencies, tasks, acceptance criteria, validation and escalation. Maestri compiles tasks into a dependency DAG; workers receive only their relevant slices. Each task carries ID, objective, dependencies, executor constraints, risk, budget, acceptance, evidence, context policy, retry and escalation policy.

### 55.2 Four workforce tiers

- Tier 0 deterministic: lint, typecheck, tests, SQL/static checks, scripted transforms and schema validation; use no LLM when deterministic tools suffice.
- Tier 1 worker: economical/high-volume classification, repetitive transforms, tests, docs, low-risk code and bulk research.
- Tier 2 professional: normal features, browser workflows, frontend/visual tasks and difficult but non-critical execution.
- Tier 3 frontier: strategy, architecture, decomposition, critical debugging/review and high-risk acceptance.
- Route on capability, risk, complexity, context size, latency, quota, cost and quality history, not provider brand alone. Preserve escalation, independent verification, evidence gates and retry budgets.
- Identity, task contracts and capabilities are provider-agnostic. Quota Broker/unified PAYG Gateway remain proposals until real capability, budget and spending approval are validated.
- Preserve department profiles (Executive/Strategy, Engineering, Research, Marketing, Sales, Customer Operations, Design/Frontend, Backoffice, Security) as routing profiles, not duplicate agent fleets.
- Engineering worktrees remain isolated; parallelism follows dependency/conflict rules. Existing human-approval/risk policy remains authoritative.

### 55.3 Learning and memory

Learning Router may propose patterns supported by evidence; it cannot promote unverified inference. Reuse the one Context Engine, Brain/memory adapter, MaestriBench and AutoImprove already defined above.

# 56. LOCAL RUNTIME — DETAILED WORK PACKAGE

Local Runtime is a Maestri execution surface, not another control plane. Reuse TaskContract, policy, context, event/state, evidence and provider contracts.

### 56.1 Capabilities and gates

- Local daemon with health/lifecycle, persistent state and typed Core API.
- Command Runner boundary; start with allowlisted/sandboxed read-only R0 executor. R1 mutation requires path/capability/risk approval, isolated worktree and audit record.
- Worktree Manager, Context Engine/MCG bridge, Model Router bridge, bounded agentic loop, validation/evidence/history/event integration, approval/risk engine, checkpoint and recovery.
- MCP/secure tunnel is scoped and capability-probed. Browser Runtime is a later gated capability, not part of the initial local executor.
- Command Center is a Core client, not the owner of runtime/tasks. Never duplicate task or telemetry stores.
- E2E broken-test, adversarial security/recovery, regression and safe cleanup gates. Never kill arbitrary PIDs; use authenticated graceful loopback control.

### 56.2 Reconciled phase map

The source's LR0–LR12 and I0–I20 tasks remain one work package. Their repeated audit/contracts/daemon/runner/executor/worktree/validation/context/router/loop/approval/recovery/API/UI/CLI-MCP/browser/regression items map to these gates:

1. Inventory, source ownership and canonical contracts.
2. Daemon, safe runner and read-only R0 executor.
3. Isolated worktree and approved R1 mutation.
4. Validation, evidence/history and event integration.
5. Context/MCG and model-router bridges.
6. Bounded loop, risk/approval, checkpoint and crash recovery.
7. Typed local API, Command Center client, CLI/MCP.
8. Browser automation only after explicit capability/security/recovery gates.
9. Broken-test E2E, adversarial security/recovery, regression and cleanup.
10. Continuous tests/typecheck/security and evidence-based completion report.

Detailed I0–I20 criteria remain in the source plan archive and must be checked against this map before acceptance.

# 57. COMMAND CENTER V2, OBSIDIAN AND PROJECT ROLES

### 57.1 Command Center V2 additions

Preserve the clean Desktop/Core boundary; control plane/task lifecycle; risk/approval gate; agent runtime/states; agent profiles plus Architect/compiler/creation gate; memory architecture/overlay/bridge and Memory Doctor. Reuse MCG's single UI/API/telemetry and 14 report areas. Do not create a second dashboard or memory engine.

### 57.2 Obsidian boundary

Obsidian is optional human knowledge curation and may consume/export approved Markdown projections. It is not operational database, task ledger, temporal source of truth, permission engine or another retriever. Brain/Hindsight stays behind the replaceable adapter; Knowledge Pages stay projections. Before enabling sync/write, define vault path scopes, secret filtering, conflict resolution and provenance.

### 57.3 Claude CEO and Antigravity CIO profiles

Preserve the backup branch role boundaries as project-scoped templates:
- CEO understands owner goals, investigates evidence, plans/decomposes, routes Codex/CIO work through Maestri, reviews evidence and flags unsupported completion claims.
- CIO performs research, external/Google ecosystem investigation and primary-source gathering; reports evidence/uncertainty to Maestri/CEO. It does not assume CEO/CTO role or implement production changes without delegated capability.
- Owner remains final authority; Maestri is control plane; Codex is engineering executor. No self-approval, deployment, push/merge, policy bypass or unsupported evidence claims.
- Source CIO frontmatter says subagent=true. Do not activate/copy that setting: owner forbids subagents. Store it only as a role template; any runtime compiler must emit a supported non-subagent configuration and validate it.

### 57.4 Engineering Council

Combine the two Council branches once. Preserve member selection, Council roles, independent reviewer/verifier, provider-selection criteria, setup/partitura, task template, Google migration notes and applicable handoff. Deduplicate near-identical files but retain distinction: Council cross-review is not execution Cross-Agent Review; Council recommendation is not approval or CI evidence.


# 58. PERMANENT CODEX CLOUD INTEGRATION — F1 DOCUMENT ONLY

The source branch also contains unrelated F1 identity/tenant work. Migrate only its Maestri Cloud integration plan and preserve these unique requirements:

- CloudJob state machine, stable CloudJob contract/store, CodexAdapter and mandatory preflight.
- Cloud watcher, event bridge, automatic resume/recovery and Maestri job/task dispatch tools.
- Git-ref error handling, persistent configuration, observability and task/run/commit/branch traceability.
- Unit/integration tests plus a real gated proof; preserve report and continuity criteria.
- Cloud execution uses the same TaskContract, policy/capability, ContextPacket, evidence and result contracts as local/worktree execution; no second task engine/store.
- Keep proposed until provider capability, auth scope, branch/ref safety, resumability, quota and tests are verified here. Do not copy F1 Supabase migrations or tenant identity code.

# 59. JULES DELEGATION SKILL — PROJECT-SCOPED

Preserve the Jules SDK/dispatch and verification checklist from docs/jules-delegation-skill: inspect session/repo/branch; send scoped task and prerequisites; wait safely; handle retry/block; inspect diff/evidence; independently test before acceptance. Follow owner rules: one Jules task at a time when requested, no duplicate work, no subagents, no touching other sessions, stop/report if stalled. Keep project-scoped; do not reinstall globally or dispatch Jules as part of migration.

# 60. SOURCE BRANCH TRANSFER AND CLEANUP — DESTRUCTIVE GATE

## 60.1 Transfer ledger

For each source branch record repo/ref/SHA/base SHA, first unique commit/date, selected and excluded paths/reasons, destination paths, imported commit/hash, tests/evidence, reviewer and cleanup eligibility. A branch name never authorizes whole-tree import.

## 60.2 Migration order

1. Refresh GitHub branch SHAs and target default-branch SHA; inspect open PRs, linked Jules/Codex sessions, branch protection and worktree/dirty state.
2. Freeze path allowlists from §54; audit every selected file. Exclude CRM, voice, social, Meta and business/F1 identity code.
3. Archive scoped source plans/profiles with provenance; integrate only missing requirements into this master.
4. Import one workstream at a time into a dedicated target migration branch: verify MCG (already standalone); Maestri V3 Core + Session Engine; Frontier Cloud Fabric; Local Runtime; Council, profiles and skill.
5. Resolve duplicate ownership before copying: apps/core, packages/operating-core, packages/lumenva-core, MCG src/core, and Local Runtime. Choose one owner per responsibility; port needed behavior/contracts/tests, not duplicate implementations.
6. Run target package tests/typecheck/security scans. Prove no CRM/voice/Meta/F1 paths or secrets entered. Record source-to-target path/commit evidence.
7. Wait until each selected source worktree is clean, detached/released, no session/agent uses it, and required target changes are accepted. Recheck remote SHAs and branch protection.
8. Delete only exact listed source refs with payload fully transferred and validated. Leave main, CRM/unrelated refs, and in-use/dirty branches untouched. Verify each deletion and record its SHA.

## 60.3 Current cleanup decision

**No source branch deletion is safe yet.** The latest read-only audit confirms the Lumenva root, `codex/command-center-dashboard`, and `feat/f1-identity-mapping` all contain local changes and remain attached; many CRM feature worktrees are also active. The first selective transfer was merged to standalone `main` by PR #5 (`4195fea8cde0edbd6b59e284a18141dab62701af`); PR #6 synchronized the initial status. PRs #7–23 subsequently reconciled the source audit, dashboard reports/accessibility, result redaction, operation evidence and theme-token checks. At the verified snapshot, standalone `main`, `origin/main`, and `origin/migration/lumenva-maestri-import-20260924` were equal at `eda600c859dc6ddcf6c917b984b4bf6560b116dd`. Transferred payload remains VPS Core, Local Runtime, two Session Engine files, 61 TOKENS add-only Cloud Fabric modules, Council docs, sanitized Codex Cloud plan, project-scoped Jules skill and non-active CEO/CIO templates. Core/Cloud Fabric strict typecheck passes and unit tests pass 69/69 (2 integration tests skipped); Local Runtime tests pass (14/14) and its typecheck passes. MCG tests pass 51/51. Provider-backed integration/full CI and Command Center ownership remain unresolved. Do not delete source refs until every selected workstream passes its gates and each owner releases the worktree.

Read-only refresh on 2026-09-24 confirms the source worktrees remain in use; it does not authorize cleanup. The initial PR #5 contains the selected payload and PR #6 the initial status docs; later PRs extend the standalone product without importing CRM source code. Transfer of repository-owned material is distinct from completion of every Maestri capability or permission to delete source refs.

## 60.4 Final separation gate

- Target contains approved Maestri-only docs/profiles/code/contracts/tests and branch provenance.
- No CRM, voice, social-brain, Meta, tenant/auth/business database code or secrets copied.
- One active plan and one owner per engine/store/router/dashboard.
- Every imported path independently validated; MCG stays standalone.
- Lumenva CRM content remains unchanged; only listed Maestri refs become deletion-eligible after exact verification.
- Other agents' worktrees/sessions remain untouched.
- No merge to main, deployment, Docker install, global config edit or broad cleanup is implied.


# 61. BRANCH BLUEPRINT COVERAGE — SOURCE TO CANONICAL DESTINATION

These sources are not separate active plans. Their unique scope is reconciled below; detailed historical phase logs/statuses must be archived with provenance, not treated as current execution evidence.

| Source document/artifact | Canonical destination | Preservation and deduplication rule |
|---|---|---|
| vps: docs/MAESTRI_AGENT_ARCHITECTURE.md | §§1–18, 35–43, 50–60 | Maestri V3 mission/invariants, roles, TaskContract/AcceptanceManifest, context/recovery, repository knowledge, Agent Factory, policy, loops, evidence, roadmap and acceptance. Reuse current contract/components; no parallel engine. |
| vps: docs/PERSONAL_AI_ENGINEERING_OS_MEGA_BLUEPRINT.md | §§5–6, 13, 17–18, 50–51, 57 | Global-vs-project scope, config/instruction compilation, skills, hooks, permissions, evidence and memory. Global profile changes remain separate from product code. |
| vps: docs/LUMENVA_COMMAND_CENTER_PLAN.md | §§49–51, 55–57 | Maestri Agent Fabric, Memory OS, graph/Obsidian, retrieval/delta/cache, DAG/worktrees/router/risk/capability, trace/telemetry, budgets, validation, replay, evidence, CEO inbox and dashboard. The branch document mixes broader Lumenva concerns; only Maestri/MCG requirements transfer. F0–F25 historical claims require revalidation. |
| TOKENS: docs/TOKENS_FRONTIER_BRAIN_AGENT_WORKFORCE_PLAN.md | §55 and §§5, 8–9, 12, 21, 27, 36–39 | MasterPlan, DAG task slices, tiered workforce, provider-agnostic identity, routing/escalation, quota/PAYG, independent verification, evidence, memory/context split, worktree isolation and human risk gate. |
| Command Center V2 blueprint | §57 and §§47, 49–51 | Desktop/Core, control plane, risk/approval, agent factory/creation gate, memory overlay/bridge, Memory Doctor, Obsidian/Graphify, execution, routing, evals, accessibility and A–K phases. Preserve its unique acceptance gates; do not create another runtime/dashboard. |
| Local Runtime plan + implementation plan | §56 | LR0–LR12 and I0–I20 requirements map to the consolidated local runtime phases; source files remain historical detail until individually checked off. |
| Engineering Council branches | §§5.9, 10–11, 37, 57.4 | Combine shared role/setup/template/notes once; keep Council review distinct from execution review, verifier, owner approval and CI. |
| F1 Maestri Codex Cloud plan | §58 | CloudJob/adapter/store/watcher/dispatch/resume/preflight/ref safety/observability/tests. Exclude F1 identity/tenant schema and migrations. |
| Jules delegation skill | §59 | Dispatch prerequisites, session safety, retry/stall handling, review and independent validation; project-scoped, no parallel/subagent dispatch. |
| Backup CEO/CIO profiles | §57.3 | Project-scoped role templates only. Exclude CRM-related backup files; do not activate CIO's subagent=true flag. |
| vps-17455632840955604138 | §54 and §60 | Preserve/test its exact two-file Session Engine delta once; do not import the rest of the Lumenva tree. |

### 61.1 Current source-transfer accounting

Plan reconciliation and the selected physical transfer are merged to standalone `main` via PR #5 (`4195fea8cde0edbd6b59e284a18141dab62701af`); PRs #6–23 add status reconciliation, dashboard/report improvements, Token Firewall redaction and process-output provenance. At the latest verified snapshot, `main`, `origin/main` and `origin/migration/lumenva-maestri-import-20260924` are equal at `eda600c859dc6ddcf6c917b984b4bf6560b116dd`. See `docs/migration/LUMENVA_SOURCE_TRANSFER_LEDGER.md` for source SHAs and exact gates. MCG tests pass 51/51; Local Runtime typecheck and 14/14 tests pass; Maestri Core/Session Engine/Cloud Fabric strict typecheck and 69/69 unit tests pass (2 external integration tests skipped). Syntax/import smoke parses 34 modules; sensitive scan passes (128 files). Provider-backed integrations/full workspace CI remain unverified. Council docs, sanitized Cloud plan, project Jules skill and non-active role templates are present. Command Center implementation code remains excluded pending proof of Maestri ownership because its branch mixes CRM/Meta changes and overlaps the MCG dashboard. Source worktrees and branches remain untouched and available; source cleanup and production acceptance are not complete.

### 61.2 TOKENS Cloud Fabric acceptance reconciliation

The full TOKENS acceptance checklist and evidence/status per criterion are maintained in [`migration/LUMENVA_SOURCE_TRANSFER_LEDGER.md`](migration/LUMENVA_SOURCE_TRANSFER_LEDGER.md#tokens-cloud-fabric--functional-coverage-audit-2026-09-24). **The TOKENS DoD is still OPEN.** Local code now connects ResourceRouter to model scoring and verified adapter quota/health/capabilities; filters historical success to validated sample thresholds; routes review away from the implementation provider and propagates its model; carries allowed paths into canonical contracts and blocks scope violations; provides approval request persistence injection; and covers orchestration with integration-style fakes. These tests prove local structure, not live provider behavior. Remaining gaps: concrete worktree driver; configured durable store/evidence artifact resolution; runtime-verified quota/usage and >=30 validated observations; authenticated provider E2E without unauthorized PAYG; full workspace CI; and live dashboard/rollout gates. Cost is now nullable when unknown rather than fabricated as zero. PR #5 added selected code/docs to standalone `main`; source branches/worktrees remain unchanged.


# APPENDIX A — SOURCE LEDGER

## A.1 Sources

| ID | Source | Scope |
|---|---|---|
| BP-001 | Maestri Runtime Core | Persistent sessions, Event Store, Context/Task/Policy/Progress, adapters, reports, telemetry, Reflex, installation, 16 phases. |
| BP-002 | Community Council Research | Persona Council + isolated subagents + anonymous peer review + neutral framing + blind spots + forced debate + journal patterns. |
| PLAN-001 | Hybrid Council 3+3 + C4 | C1–C4/G1–G3, model matrix, cross-family review, C4 report and 12 tasks. |
| DEC-001 | Fast Decision correction | Fast Path and maestri.decide() enter before trained Reflex. |
| PLAN-002 | Contextual Reflex V0 | Context + Memory + typed decisions; Laya option; own 149M Reflex conditional. |
| PLAN-003 | MaestriBench | 40-case suite, baselines, graders, formulas, trials, score and regression methodology. |
| PLAN-004 | AutoImprove | Trace-driven evaluation, failure mining, candidates, tournament, firewall, shadow/canary/rollback. |
| PLAN-005 | Improvement Context Builder | Causal failure context, last-good/first-bad, Evidence Broker, research hierarchy and memory. |
| PLAN-006 | AutoImprove AI-01..AI-18 | Implementation tasks and dependencies. |
| DEC-002 | Model evolution | GPT-6 Sol, latest Opus policy, Astra final/DEEP. |
| BP-003 | Maestri V4 Governance/Harness | Job lifecycle, approval/capability, Task DAG, Evaluators, Evidence, Budgets, Audit, nested loops. |
| BP-004 | Maestri V3 State/Contracts/Cloud/Fleet | TaskContract, Result/Failure Digests, AcceptanceManifest, State Ledger, ContextBudget, graphs, Local/Worktree/Cloud, Jules fleet. |
| DEC-003 | Agent Factory mandatory | AgentDefinition, validators, provider compiler, registry/version/health, templates, no manual persistent agents. |
| PLAN-007 | MCG / Context Gateway / Dashboard | SSE, Wire, dashboard, telemetry, budgets, alerts, CEO Inbox, Validation Lab, UI requirements. |
| PLAN-008 | Codex Cloud permanent integration | CloudJobState, watcher/events/recovery and historical repo plan reference. |
| DEC-004 | Global permissions / Git safety | Owner authority, Claude/Codex/Google-side scopes, scoped capability, no destructive Git automation. |
| DEC-005 | Current canonical fusion mandate | Lossless, canonical naming, preservation of plans/status/conflicts/dependencies. |
| PLAN-009 | AutoImprove Evidence-Driven Plan | Failure Detector/Miner/Locator/Root Cause, Improvement Context, Evidence Broker, AI-01..AI-18, protected holdout, promotion/rollback and repo/data/event schemas. |
| PLAN-010 | AutoImprove Self-Evaluation Plan | Self Evaluator, I1 Improvement Architect, multi-candidate evolution, Champion/Challenger, judge ensemble, grader drift, optional Promptfoo and daily loops. |
| DEC-006 | AutoImprove Unification Decision | Merge PLAN-009 + PLAN-010 into one canonical AutoImprove; deduplicate aliases; extend to AI-01..AI-20 with grader reliability/flakiness and experiment/distribution governance. |
| PLAN-011 | MaestriBench Detailed Plan | Detailed benchmark examples, engineering/routing/context/recovery/Council/C4 cases, trial policy, comparison reports, repository layout and development gate. |
| PLAN-012 | Improvement Context Detailed Plan | Intended-vs-actual-vs-operational layers, semantic regression window, full Improvement Context Pack, query generation, evidence source selection and causal example. |
| DEC-007 | Jev / System One Assimilation | Preserve typed decision dimensions while absorbing the pattern into Fast Decision Engine / maestri.decide() instead of creating a duplicate router. |
| EXT-001 | Session External Evidence Claims | LangSmith Engine/IssueBench, Anthropic/Warp, OpenAI/Anthropic eval-loop and public benchmark claims, preserved only as EXTERNAL_ENRICHMENT pending revalidation. |

## A.2 Coverage Map

| Unit | Semantic element | Canonical destination | State |
|---|---|---|---|
| BP-001:R001 | Maestri owns session/state | §1–§5 | **PRESERVED** |
| BP-001:R002 | Claude CEO only human interface | §1/§6 | **PRESERVED** |
| BP-001:R003 | TypeScript/Node24/SQLite-WAL | §18 | **PRESERVED** |
| BP-001:R004 | Session/Event/Task/Policy/Progress/Context/Supervisor | §5 | **PRESERVED** |
| BP-001:R005 | Provider adapters Claude/Codex/Antigravity | §9 | **PRESERVED** |
| BP-001:R006 | Crash recovery | §15 | **PRESERVED** |
| BP-001:R007 | Core CLI/config/install | §16/§18/§19 | **PRESERVED** |
| BP-001:R008 | Telemetry/success gates | §20/§34 | **MERGED** |
| BP-001:R009 | Original 16-phase roadmap | §35 | **PRESERVED** |
| BP-001:R010 | Original own-Reflex timing | §31/§32/§41 | **SUPERSEDED** |
| BP-002:R001 | Distinct personas | §10/§11 | **MERGED** |
| BP-002:R002 | Fresh isolated subagents | §10/§11 | **MERGED** |
| BP-002:R003 | Anonymous peer review | §10 | **MERGED** |
| BP-002:R004 | Neutral framing | §10 | **MERGED** |
| BP-002:R005 | What did everyone miss? | §10 | **MERGED** |
| BP-002:R006 | Forced debate | §10 | **MERGED** |
| BP-002:R007 | Quick/Standard/Deep | §10 | **MERGED** |
| BP-002:R008 | Dissent/journal concepts | §11/§23/§27 | **MERGED** |
| PLAN-001:R001 | C1 System Architect | §6 | **PRESERVED** |
| PLAN-001:R002 | C2 Red Team | §6 | **PRESERVED** |
| PLAN-001:R003 | C3 Code Auditor | §6 | **PRESERVED** |
| PLAN-001:R004 | G1 Context Custodian | §6 | **PRESERVED** |
| PLAN-001:R005 | G2 Evidence Researcher | §6 | **PRESERVED** |
| PLAN-001:R006 | G3 Pragmatist | §6 | **PRESERVED** |
| PLAN-001:R007 | C4 Architect/Planner | §6/§12 | **PRESERVED** |
| PLAN-001:R008 | Cross-family review | §10 | **PRESERVED** |
| PLAN-001:R009 | Mandatory report/DAG | §12 | **PRESERVED** |
| PLAN-001:R010 | Council 12-task work package | §37 | **PRESERVED** |
| DEC-001:R001 | Fast Path from start | §7 | **PRESERVED** |
| DEC-001:R002 | Deterministic microdecisions | §7 | **PRESERVED** |
| DEC-001:R003 | maestri.decide() | §7 | **PRESERVED** |
| DEC-001:R004 | Engine evolution behind stable interface | §7 | **PRESERVED** |
| PLAN-002:R001 | Contextual typed decision | §31 | **PRESERVED** |
| PLAN-002:R002 | Memory Retriever precedents | §8/§31 | **PRESERVED** |
| PLAN-002:R003 | Laya V0 proposal | §31/§42 | **UNRESOLVED** |
| PLAN-002:R004 | @receptron/laya option | §44 | **PRESERVED** |
| PLAN-002:R005 | Own 149M becomes optional | §32/§41 | **SUPERSEDED** |
| PLAN-002:R006 | Train only if benchmark wins | §32 | **PRESERVED** |
| PLAN-003:R001 | System benchmark principle | §22 | **PRESERVED** |
| PLAN-003:R002 | 40-case distribution | §22 | **PRESERVED** |
| PLAN-003:R003 | Engineering/routing/context/recovery/Council/policy/C4 evals | §22 | **PRESERVED** |
| PLAN-003:R004 | Trials and pass metrics | §22 | **PRESERVED** |
| PLAN-003:R005 | Maestri Score | §22 | **PRESERVED** |
| PLAN-003:R006 | Environment isolation | §22 | **PRESERVED** |
| PLAN-003:R007 | External benchmarks secondary | §22/§44 | **PRESERVED** |
| PLAN-004:R001 | AutoImprove loop | §23–§30 | **PRESERVED** |
| PLAN-004:R002 | Grader layers | §24 | **PRESERVED** |
| PLAN-004:R003 | Failure Miner/Root Cause | §25 | **MERGED** |
| PLAN-004:R004 | Champion/Challenger | §29 | **PRESERVED** |
| PLAN-004:R005 | Firewall/autonomy | §29 | **PRESERVED** |
| PLAN-004:R006 | Shadow/canary/rollback | §29/§30 | **PRESERVED** |
| PLAN-004:R007 | Human feedback/regression flywheel | §27/§30 | **PRESERVED** |
| PLAN-004:R008 | Judge ensemble/grader drift | §33 | **PRESERVED** |
| PLAN-005:R001 | Improvement Context Builder | §26 | **PRESERVED** |
| PLAN-005:R002 | Internal→external context hierarchy | §26 | **PRESERVED** |
| PLAN-005:R003 | Last-good/first-bad | §25/§26 | **PRESERVED** |
| PLAN-005:R004 | Evidence Broker/Research Planner | §27 | **PRESERVED** |
| PLAN-005:R005 | Improvement Memory | §27 | **PRESERVED** |
| PLAN-005:R006 | Failure→Component Map | §25 | **PRESERVED** |
| PLAN-006:R001 | AI-01 implementation task | §38 AI-01 | **PRESERVED** |
| PLAN-006:R002 | AI-02 implementation task | §38 AI-02 | **PRESERVED** |
| PLAN-006:R003 | AI-03 implementation task | §38 AI-03 | **PRESERVED** |
| PLAN-006:R004 | AI-04 implementation task | §38 AI-04 | **PRESERVED** |
| PLAN-006:R005 | AI-05 implementation task | §38 AI-05 | **PRESERVED** |
| PLAN-006:R006 | AI-06 implementation task | §38 AI-06 | **PRESERVED** |
| PLAN-006:R007 | AI-07 implementation task | §38 AI-07 | **PRESERVED** |
| PLAN-006:R008 | AI-08 implementation task | §38 AI-08 | **PRESERVED** |
| PLAN-006:R009 | AI-09 implementation task | §38 AI-09 | **PRESERVED** |
| PLAN-006:R010 | AI-10 implementation task | §38 AI-10 | **PRESERVED** |
| PLAN-006:R011 | AI-11 implementation task | §38 AI-11 | **PRESERVED** |
| PLAN-006:R012 | AI-12 implementation task | §38 AI-12 | **PRESERVED** |
| PLAN-006:R013 | AI-13 implementation task | §38 AI-13 | **PRESERVED** |
| PLAN-006:R014 | AI-14 implementation task | §38 AI-14 | **PRESERVED** |
| PLAN-006:R015 | AI-15 implementation task | §38 AI-15 | **PRESERVED** |
| PLAN-006:R016 | AI-16 implementation task | §38 AI-16 | **PRESERVED** |
| PLAN-006:R017 | AI-17 implementation task | §38 AI-17 | **PRESERVED** |
| PLAN-006:R018 | AI-18 implementation task | §38 AI-18 | **PRESERVED** |
| DEC-002:R001 | GPT-5.6→GPT-6 Sol | §6/§41 | **SUPERSEDED** |
| DEC-002:R002 | Opus5→latest Opus policy | §6/§41 | **MERGED** |
| DEC-002:R003 | Astra reserved final/DEEP | §6/§10 | **PRESERVED** |
| BP-003:R001 | Job lifecycle | §12.4 | **PRESERVED** |
| BP-003:R002 | Approval/capability token | §12.5 | **PRESERVED** |
| BP-003:R003 | Risk R0–R4 existence | §12.6 | **PRESERVED** |
| BP-003:R004 | Scheduler/Router responsibilities | §5.26 | **MERGED** |
| BP-003:R005 | Loop Engine/Harness | §5.23 | **PRESERVED** |
| BP-003:R006 | Loop budget 8/45m/150k/same-error2 | §5.23 | **PRESERVED** |
| BP-003:R007 | Evaluator/Evidence/Audit | §5.24/§20 | **MERGED** |
| BP-003:R008 | Compound Learning | §5.25 | **MERGED** |
| BP-004:R001 | TaskContract fields | §5.19 | **PRESERVED** |
| BP-004:R002 | TaskResult fields | §5.19 | **PRESERVED** |
| BP-004:R003 | ResultDigest/FailureDigest | §5.19 | **PRESERVED** |
| BP-004:R004 | AcceptanceManifest PASS/PENDING/BLOCKED | §5.19 | **PRESERVED** |
| BP-004:R005 | State Ledger/ExecutionState | §5.20 | **MERGED** |
| BP-004:R006 | ContextPacket/ContextBudget | §5.21 | **PRESERVED** |
| BP-004:R007 | Dependency/Conflict Graphs | §5.22 | **PRESERVED** |
| BP-004:R008 | Fresh Context Reviewer | §5.24 | **PRESERVED** |
| BP-004:R009 | CI Fixer/Cross-Agent Review | §5.24/§20.1 | **PRESERVED** |
| BP-004:R010 | Codex Local/Worktree/Cloud | §9.4 | **PRESERVED** |
| BP-004:R011 | Jules Fleet limits | §9.6/§42 | **UNRESOLVED** |
| DEC-003:R001 | AgentDefinition fields | §5.18 | **PRESERVED** |
| DEC-003:R002 | Validator/Capability Resolver/Provider Compiler/Registry | §5.18 | **PRESERVED** |
| DEC-003:R003 | version/hash/health | §5.18 | **PRESERVED** |
| DEC-003:R004 | Agent templates | §5.18 | **PRESERVED** |
| DEC-003:R005 | No manual persistent agents | §2/§5.18 | **PRESERVED** |
| PLAN-007:R001 | MCG partial implementation status | §19A.1 | **PRESERVED** |
| PLAN-007:R002 | MCG root/Wire/API/CLI | §19A.3–§19A.4 | **PRESERVED** |
| PLAN-007:R003 | SSE/polling/snapshots/UI semantics | §19A.5 | **PRESERVED** |
| PLAN-007:R004 | UI palette | §19A.6 | **PRESERVED** |
| PLAN-007:R005 | Budget thresholds 50/80 | §19A.5 | **PRESERVED** |
| PLAN-007:R006 | Validation Lab/Trust/Efficiency/A-B | §19A.7 | **MERGED** |
| PLAN-007:R007 | PASS/PARTIAL/BLOCKED evidence rule | §19A.8 | **PRESERVED** |
| PLAN-007:R008 | MCG canonical disposition | §19A.2 | **MERGED** |
| PLAN-008:R001 | CloudJobState | §9.5 | **PRESERVED** |
| PLAN-008:R002 | Cloud watcher/event/recovery flow | §9.5 | **PRESERVED** |
| PLAN-008:R003 | cloud plan files/path/branch/commit trace | §9.5/§44A | **UNRESOLVED** |
| DEC-004:R001 | Owner ultimate authority | §6.1 | **PRESERVED** |
| DEC-004:R002 | Claude permissions/forbidden operations | §6.2 | **PRESERVED** |
| DEC-004:R003 | Codex permissions/boundaries | §6.2 | **PRESERVED** |
| DEC-004:R004 | Google-side intelligence permissions | §6.2 | **PRESERVED** |
| DEC-004:R005 | No reset-hard/clean-fd/force-push automation | §13.2 | **PRESERVED** |
| DEC-004:R006 | Global ~/.claude governance layout | §13.1 | **PRESERVED** |
| DEC-005:R001 | Lossless preservation | §0/§46 | **PRESERVED** |
| DEC-005:R002 | Canonical naming/aliases | §40 | **PRESERVED** |
| DEC-005:R003 | Status preservation | §3 | **PRESERVED** |
| DEC-005:R004 | Plans/tasks/dependencies preservation | §35–§38A | **PRESERVED** |
| DEC-005:R005 | Unresolved conflicts explicit | §42 | **PRESERVED** |

## A.3 Coverage Map — recovered final units

| Unit | Semantic element | Canonical destination | State |
|---|---|---|---|
| PLAN-009:R001 | Improvement Context Builder + Evidence Broker architecture | §23 | **MERGED** |
| PLAN-009:R002 | AI-01..AI-18 implementation tasks | §38 AI-01..AI-18 | **MERGED** |
| PLAN-009:R003 | Regression Locator + last-good/first-bad | §23 | **MERGED** |
| PLAN-009:R004 | Protected holdout / benchmark firewall | §23 | **MERGED** |
| PLAN-009:R005 | Promotion Gate + shadow/canary/rollback | §23 | **MERGED** |
| PLAN-009:R006 | Repo/tables/events for AutoImprove | §17/§17A/§23 | **MERGED** |
| PLAN-010:R001 | Self Evaluator / grader stack | §23 | **MERGED** |
| PLAN-010:R002 | I1 Improvement Architect | §23 | **MERGED** |
| PLAN-010:R003 | Multi-candidate Champion/Challenger | §23 | **MERGED** |
| PLAN-010:R004 | Grader drift/meta-evaluation | §23/§38 AI-19 | **PRESERVED** |
| PLAN-010:R005 | Fast/Nightly/Weekly improvement cadence | §23 | **PRESERVED** |
| PLAN-010:R006 | Optional prompt/security evaluation layer | §23/§44 | **PRESERVED** |
| DEC-006:R001 | Canonical aliases: Auto Evaluation, I1 Improvement Architect, Candidate System | §23 | **PRESERVED** |
| DEC-006:R002 | AI-19 Grader Reliability + Flakiness | §38 AI-19 | **PRESERVED** |
| DEC-006:R003 | AI-20 Experiment Governor + Distribution Shift | §38 AI-20 | **PRESERVED** |
| DEC-006:R004 | Proposer ≠ Judge ≠ High-Risk Approver | §23 | **PRESERVED** |
| DEC-006:R005 | Trace redaction + holdout lifecycle + uncertainty-aware promotion | §23 | **PRESERVED** |
| BP-001:R026 | Planned repository/package structure (`apps/cli`, core packages, `skills/maestri-council`, schemas/services/evals/docs) | §17A | **PRESERVED** |
| BP-001:R027 | V1 explicit exclusions Docker/Postgres/Redis/RabbitMQ/Ollama/Laya/other LLM | §17C | **PRESERVED** |
| PLAN-001:R011 | `maestri-council` skill + Council schemas | §17B | **PRESERVED** |
| DEC-004:R007 | PT-BR operational status format + intelligent emoji + pipeline progress style | §17D | **PRESERVED** |
| BP-003:R009 | End-to-end task/approval/evidence workflow | §33A | **MERGED** |

## A.4 Coverage Map — latest detailed plans

| Unit | Semantic element | Canonical destination | State |
|---|---|---|---|
| PLAN-011:R001 | MaestriBench is a whole-system product, not a model-only benchmark | §22.14 | **MERGED** |
| PLAN-011:R002 | Baseline↔candidate questions: Council value, Reflex speed, context savings, throughput | §22.14 | **PRESERVED** |
| PLAN-011:R003 | ENG-007 deterministic engineering case contract | §22.15 | **PRESERVED** |
| PLAN-011:R004 | Routing scenarios for small refactor/auth/runtime decision | §22.16 | **PRESERVED** |
| PLAN-011:R005 | Context fixture with 120 events/18 tasks/7 decisions/3 branches/2 blockers/4 reports | §22.17 | **PRESERVED** |
| PLAN-011:R006 | Recovery chaos process-kill/resume assertions | §22.18 | **PRESERVED** |
| PLAN-011:R007 | Council economics and task-class dependent Council Lift | §22.19 | **MERGED** |
| PLAN-011:R008 | Detailed C4 deterministic/qualitative benchmark | §22.20 | **MERGED** |
| PLAN-011:R009 | Deterministic→model→human grader hierarchy | §22.21 | **MERGED** |
| PLAN-011:R010 | DEV/NIGHTLY/RELEASE repeated-trial interpretation | §22.22 | **MERGED** |
| PLAN-011:R011 | Score example + hard-gate/performance-gate precedence | §22.23 | **PRESERVED** |
| PLAN-011:R012 | Current-vs-Maestri comparison report shape and metrics | §22.24 | **PRESERVED** |
| PLAN-011:R013 | Public benchmarks secondary to Maestri real workload | §22.25 | **MERGED** |
| PLAN-011:R014 | Detailed maestri-bench repository layout | §22.26 | **PRESERVED** |
| PLAN-011:R015 | Benchmark becomes required development/regression gate | §22.27 | **PRESERVED** |
| PLAN-012:R001 | Improvement Context Builder distinct from normal Context Engine | §23.12.1 | **PRESERVED** |
| PLAN-012:R002 | Intended system behavior source layer | §23.12.2 | **MERGED** |
| PLAN-012:R003 | Actual implementation source layer | §23.12.2 | **PRESERVED** |
| PLAN-012:R004 | Operational trace/telemetry comparison layer | §23.12.2 | **PRESERVED** |
| PLAN-012:R005 | Semantic last-good/first-bad regression localization | §23.12.3 | **MERGED** |
| PLAN-012:R006 | Full Improvement Context Pack schema/example | §23.12.4 | **PRESERVED** |
| PLAN-012:R007 | Failure-derived Research Planner queries | §23.12.5 | **PRESERVED** |
| PLAN-012:R008 | Evidence Broker source selection by root cause | §23.12.6 | **MERGED** |
| PLAN-012:R009 | Benchmark + production + human feedback as three teachers | §23.12.7 | **MERGED** |
| PLAN-012:R010 | CEO-calls 4.1→7.8 causal investigation example | §23.12.8 | **PRESERVED** |
| PLAN-012:R011 | R2→R1 escalation-threshold hypothesis | §23.12.8 | **PRESERVED** |
| PLAN-012:R012 | Candidate A/B/C causal experiment | §23.12.8 | **PRESERVED** |
| PLAN-012:R013 | Internal truth before external research | §23.13/§23.12.5 | **MERGED** |
| PLAN-012:R014 | Improvement Context treated as first-class subsystem | §23.12.1 | **PRESERVED** |
| DEC-007:R001 | Jev/System One session reference preserved without inventing upstream details | §7A | **PRESERVED** |
| DEC-007:R002 | Typed decision dimensions route/risk/priority/retry/review/approval/escalation | §7A.2 | **MERGED** |
| DEC-007:R003 | Absorb Jev pattern into Fast Decision Engine / maestri.decide() | §7A.1–§7A.3 | **MERGED** |
| DEC-007:R004 | Prevent duplicate Jev/Fast/Resource/Council routers | §7A.3 | **MERGED** |
| EXT-001:R001 | LangSmith Engine / IssueBench session claims | §44B.1 | **PRESERVED** |
| EXT-001:R002 | Anthropic/Warp human-correction learning claim | §44B.2 | **PRESERVED** |
| EXT-001:R003 | OpenAI/Anthropic trace→eval→diagnose→change→eval pattern claim | §44B.3 | **PRESERVED** |
| EXT-001:R004 | Public benchmark limitation claims | §44B.4 | **PRESERVED** |


# APPENDIX B — RECONCILIATION NOTES

## Real duplications merged

- `State Ledger` is implemented conceptually as Event Store projection rather than a second truth database.
- standalone Scheduler/Router responsibilities are distributed across Task Engine, Agent Supervisor, Fast Decision, Policy, Conflict Graph and budgets.
- old Evaluator Engine is absorbed into MaestriBench + Auto Evaluation.
- Compound Learning is absorbed into Improvement Memory + validated Memory + Regression Flywheel.
- MCG Validation Lab is absorbed into MaestriBench.
- MCG telemetry is absorbed into Trace/Telemetry.
- Council community patterns are absorbed into one Maestri Council.
- provider-specific agent definitions are generated through Agent Factory rather than hand-maintained duplicate agents.

## Deliberately not merged

- Context Engine vs Improvement Context Builder.
- Council cross-review vs execution Cross-Agent Review.
- Policy Engine vs Promotion Gate.
- Event Store vs Improvement Memory.
- Fast Decision Engine vs Reflex.
- MaestriBench vs AutoImprove.
- Agent Factory vs Agent Supervisor.
- Evidence Store/Guard vs Report Store.

# APPENDIX C — HISTORICAL REPOSITORY REFERENCES

```text
branch vps
docs/MAESTRI_AGENT_ARCHITECTURE.md
93c538723e77c992f971de6d99f571c7339fc54e
```

```text
Agent Factory addition
branch vps
5cdb3cb2c69d7fbbfb523c599855e6185bfa84ed
```

```text
docs/PERSONAL_AI_ENGINEERING_OS_MEGA_BLUEPRINT.md
branch vps
7d0230d7089fa48d3f73489cc2d8e0753d510cbe
```

```text
historical Codex Cloud plan
docs/plans/maestri-codex-cloud-permanent-integration.md
feat/f1-identity-mapping
4994efe7a2280b3adec74d63f9ca997d56e4fe46
```

The last reference is explicitly unresolved because later session context contradicted its current file/branch presence.

# APPENDIX D — FINAL DEPENDENCY GRAPH

```text
Owner
  ↓
Claude CEO
  ↓
Maestri Control Plane
  ├─ Event Store / Session Kernel
  ├─ TaskContract / Task DAG / Dependency + Conflict Graph
  ├─ Context Engine / ContextBudget / Memory
  ├─ Policy / Approval / Capability / Budgets
  ├─ Agent Factory → Provider Compiler → Agent Supervisor
  ├─ Fast Decision / maestri.decide()
  ├─ Loop Harness / Evidence / Evaluators
  ├─ Codex / Antigravity / optional provider profiles
  ├─ Council → CEO → C4 → Report/DAG
  ├─ CI / Cross-Agent Review / Evidence Gate
  ├─ Trace / Telemetry / Dashboard / CEO Inbox
  ├─ MaestriBench
  ├─ Failure Intelligence
  ├─ Improvement Context / Evidence Broker / Memory
  ├─ AutoImprove → Candidate Tournament
  ├─ Shadow / Canary / Rollback
  └─ optional Reflex layers
```

# FINAL INTEGRITY CHECK

If every prior blueprint disappeared, this file now preserves:

- current canonical runtime;
- older governance/harness capabilities;
- Agent Factory;
- contracts and state recovery;
- approval/capability model;
- loop/evidence/review/CI;
- Codex Local/Worktree/Cloud history;
- unresolved Jules fleet history;
- MCG partial implementation/dashboard/Validation Lab;
- Council;
- C4/report;
- benchmark;
- AutoImprove;
- detailed MaestriBench cases, fixtures, comparison reports and development gates;
- first-class Improvement Context causal investigation;
- Jev/System One typed-decision pattern assimilated into Fast Decision without duplicate routing;
- Reflex evolution;
- roadmaps/tasks;
- metrics;
- security;
- aliases/conflicts;
- historical repository references.

**AUDIT RESULT: PASS**, with all non-resolved choices explicitly marked `UNKNOWN` / `UNRESOLVED` / `EXTERNAL_ENRICHMENT`.

```text
MASTER ≈ UNION(all identified valid session knowledge)
```
