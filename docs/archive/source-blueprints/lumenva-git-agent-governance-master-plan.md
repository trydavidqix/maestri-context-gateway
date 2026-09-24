# Lumenva Git & Agent Governance — Master Plan

## 1. Objetivo

Criar um padrão único e obrigatório para todos os projetos e todos os agents da Lumenva.

O sistema precisa garantir:

- branches legíveis e rastreáveis;
- identificação do agent que executou o trabalho;
- role utilizada;
- modelo utilizado;
- session ID;
- task ID;
- histórico dos erros encontrados;
- histórico das correções;
- validação independente;
- PR obrigatório;
- CI obrigatório;
- merge somente quando realmente validado;
- limpeza automática das branches temporárias;
- preservação do histórico das tasks;
- mesma política em todos os repositórios;
- funcionamento com conta pessoal GitHub;
- nenhum requisito de GitHub Organization;
- nenhum agent podendo inventar seu próprio fluxo.

A regra central será:

> Agents executam. GitHub valida. A governança decide se o trabalho está concluído.

---

## 2. Problema atual

Hoje existem branches semelhantes a:

```text
chore/f8-gcp-ci-workflow-3472599334636875907

f8-j3-publish-workflow-2470113440388419535

feature/f7-j3-meta-adapter-368541147442802420

feature/f8-j2-gcp-secrets-11517427039554397630
```

Problemas:

- `chore` não explica o domínio;
- `feature` é genérico;
- `F8/J3` depende de contexto externo;
- IDs gigantes deixam o Git ilegível;
- não sabemos quem executou;
- não sabemos qual role;
- não sabemos qual modelo;
- não sabemos qual sessão;
- outro agent precisa investigar para entender;
- branches acabam acumulando lixo.

O novo sistema elimina isso.

---

## 3. Padrão canônico de Branch

Formato obrigatório:

```text
agent/<agent>/<role>/<model>/session-<session-id>/task-<task-id>-<objective>
```

Exemplo:

```text
agent/jules/backend-engineer/gemini-3-1-pro/session-a82f/task-f8-configure-gcp-secrets
```

Apenas lendo a branch sabemos:

```text
Agent:      Jules
Role:       Backend Engineer
Model:      Gemini 3.1 Pro
Session:    A82F
Task:       F8
Objective:  Configure GCP Secrets
```

---

## 4. Regras de Naming

Branches precisam:

- usar lowercase;
- usar `-` entre palavras;
- usar `/` somente para separação estrutural;
- conter agent;
- conter role;
- conter model;
- conter session ID;
- conter task ID;
- conter objetivo legível.

Proibido:

```text
chore/*
feature/*
changes/*
stuff/*
misc/*
update/*
fix-things/*
task/*
```

Também proibido:

- IDs gigantes no nome da branch;
- IDs externos do Jules;
- IDs internos do Codex;
- IDs internos do Claude;
- IDs internos do Gemini;
- timestamps enormes;
- nomes sem significado humano.

IDs externos continuam existindo, mas ficam na metadata.

---

## 5. External Execution ID

Exemplo:

```text
EXTERNAL_EXECUTION_ID:
3472599334636875907
```

Esse ID não aparece na branch.

Ele fica associado ao Execution Record.

Isso preserva rastreabilidade sem destruir a legibilidade.

---

## 6. Padrão de Commit

Commits precisam explicar a mudança realizada.

Formato:

```text
<Action> <component/object>
```

Exemplos:

```text
Add GCP CI workflow

Configure GCP secret management

Implement Meta adapter

Document Jules delegation skill

Fix Codex result delivery

Integrate Jules task execution

Refactor agent resource router
```

Evitar:

```text
chore: stuff

update

changes

fix things

task done

F8

Jules task
```

---

## 7. Agent Execution Record

Toda Task executada por agent precisa gerar um registro estruturado.

Formato:

```text
TASK: T-042

AGENT: Jules
ROLE: Backend Engineer
MODEL: Gemini 3.1 Pro
SESSION: A82F

EXTERNAL_EXECUTION_ID:
3472599334636875907

BRANCH:
agent/jules/backend-engineer/gemini-3-1-pro/session-a82f/task-t042-configure-gcp-secrets
```

---

## 8. Objetivo da Task

Cada registro precisa conter claramente:

```text
OBJECTIVE:
Configure GCP Secret Manager integration for application deployment.
```

Nada de:

```text
Do F8.
```

O objetivo precisa ser compreensível sem contexto externo.

---

## 9. Registro da execução

O agent deve documentar:

```text
EXECUTION:

1. Inspected existing configuration.
2. Added Secret Manager integration.
3. Updated IAM references.
4. Added environment configuration.
5. Ran validation.
```

---

## 10. Registro de erros

Nunca pode existir simplesmente:

```text
deu erro
```

O formato deve ser:

```text
ERROR-01

ACTION:
Attempted deployment.

ERROR:
Permission denied accessing Secret Manager.

CAUSE:
Service account lacked secretAccessor permission.

IMPACT:
Deployment blocked.
```

---

## 11. Recuperação

Depois:

```text
RECOVERY:

Attempt 1:
Updated service account configuration.

Result:
FAILED

Attempt 2:
Added required IAM permission.

Result:
SUCCESS
```

---

## 12. Validação

Todo agent precisa registrar evidências.

Exemplo:

```text
VALIDATION:

lint        PASS
typecheck   PASS
tests       PASS
build       PASS
security    PASS
deployment  PASS
```

---

## 13. Status oficiais das Tasks

Estados permitidos:

```text
CREATED
RUNNING
VALIDATING
BLOCKED
FAILED
READY
MERGED
CLEANING
CLEANED
COMPLETED
```

Fluxo normal:

```text
CREATED
   ↓
RUNNING
   ↓
VALIDATING
   ↓
READY
   ↓
MERGED
   ↓
CLEANING
   ↓
CLEANED
   ↓
COMPLETED
```

Fluxo com erro:

```text
RUNNING
   ↓
VALIDATING
   ↓
FAILED
   ↓
RUNNING
   ↓
VALIDATING
```

Fluxo bloqueado:

```text
RUNNING
   ↓
BLOCKED
```

---

## 14. Regra crítica de conclusão

Proibido:

```text
RUNNING → COMPLETED
```

O agent terminar de escrever código NÃO significa Task concluída.

Para uma Task chegar a:

```text
COMPLETED
```

ela precisa passar por:

```text
implementation
→ validation
→ PR
→ CI
→ merge
→ cleanup
→ archive
```

---

## 15. Pipeline completo

```text
TASK CREATED
     ↓
Identity assigned
     ↓
Agent
Role
Model
Session
Task ID
     ↓
BRANCH CREATED
     ↓
IMPLEMENTATION
     ↓
COMMITS
     ↓
SELF VALIDATION
     ↓
PR
     ↓
CENTRAL CI
     ↓
GITHUB RULESET
     ↓

PASS?
├── NO
│   ↓
│ FAILED/BLOCKED
│   ↓
│ registrar erro
│   ↓
│ corrigir
│   ↓
│ validar novamente
│
└── YES
    ↓
   READY
    ↓
   MERGE
    ↓
 verify merge
    ↓
 CLEANUP
    ↓
 delete branch
    ↓
 archive task record
    ↓
 COMPLETED
```

---

## 16. O que deve ser apagado

Depois do merge:

Apagar:

```text
temporary branch
temporary worktree
temporary execution environment
temporary files
temporary agent state
```

Não apagar:

```text
Task history
Execution Record
Error history
Validation evidence
Commit SHA
PR reference
Agent identity
Session ID
Model used
```

Branch é descartável.

Histórico não é.

---

## 17. Resultado final da Task

Exemplo:

```text
TASK: T-042

STATUS:
COMPLETED

AGENT:
Jules

ROLE:
Backend Engineer

MODEL:
Gemini 3.1 Pro

SESSION:
A82F

RESULT:
GCP Secret Manager configured and validated.

VALIDATION:
lint       PASS
typecheck  PASS
tests      PASS
build      PASS
security   PASS

PR:
#184

MERGE:
SUCCESS

FINAL_COMMIT:
abc123

CLEANUP:
branch     DELETED
worktree   DELETED

SAFE_TO_CONTINUE:
YES

NEXT_ACTION:
Proceed to dependent deployment task.
```

---

## 18. GitHub como autoridade

Não vamos confiar somente nos prompts dos agents.

Teremos:

```text
Claude
Codex
Jules
Gemini
Human
   │
   ↓
GitHub Governance
   │
   ├── Rulesets
   ├── GitHub Actions
   ├── PR validation
   └── cleanup
```

O GitHub será a fonte objetiva de verdade para integração de código.

---

## 19. Proteção da branch principal

A default branch deve ter:

```text
Direct push             BLOCKED
Force push              BLOCKED
Delete                   BLOCKED
Pull Request             REQUIRED
Status checks            REQUIRED
CI                       REQUIRED
Conversation resolution  REQUIRED
```

Quando aplicável:

```text
Branch up-to-date        REQUIRED
```

---

## 20. GitHub Rulesets

Rulesets serão usados para enforcement.

Exemplo:

```text
LUMENVA-MAIN-PROTECTION-V1
```

Protege:

```text
main
```

Regras:

```text
Require pull request
Require status checks
Require conversation resolution
Block force pushes
Block deletion
```

---

## 21. GitHub Actions

GitHub Actions serão usados para validação automática.

Exemplo:

```text
agent-governance.yml
```

Ele verifica:

```text
Branch naming
Agent identity
Role
Model
Session ID
Task ID
Execution Record
PR structure
Lint
Typecheck
Tests
Build
Security
```

---

## 22. Separação das responsabilidades

### Agent

Executa:

```text
implementation
fixes
tests locais
documentation
```

### GitHub Action

Verifica:

```text
estrutura
compliance
tests
build
security
metadata
```

### Ruleset

Decide:

```text
pode merge?
sim/não
```

### Governance Control Plane

Garante:

```text
todos os repos usam as mesmas regras
```

---

## 23. Auto-delete da branch

Ativar em todos os projetos:

```text
delete_branch_on_merge = true
```

Resultado:

```text
PR merged
   ↓
branch deleted automatically
```

Assim não acumulamos centenas de branches antigas.

---

## 24. Problema: não temos GitHub Organization

Não vamos depender de Organization Rulesets.

Como os projetos estão sob conta pessoal, criaremos nosso próprio Control Plane.

---

## 25. Repositório central

Criar:

```text
trydavidqix/github-governance
```

Esse será o repositório de controle global.

Estrutura:

```text
github-governance/
│
├── README.md
│
├── policies/
│   ├── main-protection.json
│   ├── agent-branches.json
│   ├── task-lifecycle.json
│   └── security-policy.json
│
├── workflows/
│   ├── governance-sync.yml
│   ├── agent-governance.yml
│   └── security-validation.yml
│
├── scripts/
│   ├── discover-repos
│   ├── sync-rulesets
│   ├── sync-repository-settings
│   └── audit-governance
│
├── schemas/
│   ├── execution-record.schema.json
│   └── task.schema.json
│
└── config/
    └── governance.yml
```

---

## 26. Fonte única da verdade

A partir desse momento:

```text
github-governance
```

é a fonte canônica das regras.

Não configuraremos manualmente:

```text
Lumenva
CRM
Teacher
RouteLex
Helixforge
...
```

Cada um separadamente.

Alteramos:

```text
github-governance
```

e sincronizamos.

---

## 27. Descoberta automática de repositórios

O sincronizador deve consultar automaticamente os repositórios pertencentes à conta.

Conceito:

```text
discover repos
      ↓
trydavidqix/*
      ↓
filter eligible repositories
      ↓
apply governance
```

Assim não precisamos atualizar manualmente uma lista cada vez que nasce um projeto.

---

## 28. Sincronização

Fluxo:

```text
Governance changed
       ↓
GitHub Action triggered
       ↓
Discover repositories
       ↓
For each repository:
       │
       ├── ruleset exists?
       │      ├── YES → update
       │      └── NO  → create
       │
       ├── configure repository settings
       ├── enable branch cleanup
       ├── configure validation
       └── verify configuration
```

---

## 29. Projeto novo

Exemplo:

```text
trydavidqix/NewProject
```

O sistema detecta:

```text
new repository detected
```

E aplica:

```text
main protection
agent naming policy
PR rules
CI policy
auto branch cleanup
security baseline
```

automaticamente.

---

## 30. Sincronização programada

Executar de duas formas.

### Evento

Quando `github-governance` muda:

```text
push
↓
sync
```

### Auditoria periódica

Exemplo:

```text
1x/dia
↓
discover repos
↓
detect drift
↓
repair configuration
```

Isso evita que um repositório fique diferente do padrão central.

---

## 31. Drift Detection

O sistema compara:

```text
DESIRED STATE
vs
CURRENT STATE
```

Exemplo:

```text
Desired:
delete_branch_on_merge = true

Current:
false

Result:
DRIFT DETECTED

Action:
restore true
```

---

## 32. Governance Version

Toda política precisa ter versão.

Exemplo:

```text
LUMENVA-GOVERNANCE-V1
```

Depois:

```text
V2
V3
```

Cada Execution Record pode informar:

```text
GOVERNANCE_VERSION:
v1
```

Assim sabemos quais regras estavam ativas quando a Task foi executada.

---

## 33. Naming enforcement

Não vamos depender apenas de instrução.

O sistema deve validar automaticamente que a branch segue:

```text
agent/<agent>/<role>/<model>/session-<id>/task-<id>-<objective>
```

Se estiver fora do padrão:

```text
INVALID BRANCH
```

e o PR não passa no Governance Check.

---

## 34. Exemplo válido

```text
agent/jules/backend-engineer/gemini-3-1-pro/session-a82f/task-t042-configure-gcp-secrets
```

---

## 35. Exemplo inválido

```text
chore/f8-gcp-ci-workflow-3472599334636875907
```

Retorno:

```text
Governance Validation: FAILED

Reason:
branch naming policy violation
```

---

## 36. PR Template

Cada PR deve carregar contexto suficiente para outro agent assumir.

Estrutura:

```text
TASK_ID:

AGENT:

ROLE:

MODEL:

SESSION_ID:

EXTERNAL_EXECUTION_ID:

OBJECTIVE:

IMPLEMENTED:

ERRORS:

RECOVERY:

VALIDATION:

BLOCKERS:

NEXT_ACTION:
```

---

## 37. Independência entre agents

O sistema precisa funcionar igualmente para:

```text
Claude
Codex
Jules
Gemini
Future Agents
Humans
```

Nenhum executor ganha regras especiais.

---

## 38. Agent não decide sozinho que terminou

A frase:

```text
Task completed
```

do agent não possui autoridade por si só.

Estado real depende de:

```text
GitHub validation
```

---

## 39. Self-validation vs Independent Validation

O agent deve validar o próprio trabalho.

Mas isso é somente:

```text
Self Validation
```

Depois:

```text
GitHub CI
```

executa:

```text
Independent Validation
```

Somente depois:

```text
READY
```

---

## 40. Política de erro

Quando uma tentativa falha:

Não criar uma nova task automaticamente.

Continuar:

```text
same Task
same Branch
same Execution Record
```

Registrando:

```text
Attempt 1
Attempt 2
Attempt 3
```

Uma nova Task só deve nascer quando existir realmente um novo objetivo.

---

## 41. Política de sessão

Session ID identifica aquela execução do agent.

Exemplo:

```text
session-a82f
```

Se outro agent assumir:

```text
HANDOFF
```

registramos uma nova sessão dentro da mesma Task.

Exemplo:

```text
Task T-042

Session 1:
Jules / A82F

Session 2:
Codex / C991
```

Assim preservamos o histórico completo.

---

## 42. Política de Handoff

Todo handoff precisa informar:

```text
CURRENT_STATUS

WHAT_WAS_DONE

WHAT_FAILED

WHAT_REMAINS

BLOCKERS

NEXT_ACTION

SAFE_TO_CONTINUE
```

Nenhum agent deve receber apenas:

```text
continue F8
```

---

## 43. Task como objeto permanente

A Task é a entidade principal.

```text
Task
├── objective
├── sessions
├── agents
├── commits
├── errors
├── validation
├── PR
├── merge
└── final result
```

Branches são implementações temporárias dela.

---

## 44. Cleanup Policy

Depois do sucesso:

```text
MERGED
↓
cleanup triggered
↓
delete remote branch
↓
delete local worktree
↓
clear temporary state
↓
archive execution record
↓
COMPLETED
```

---

## 45. Falha no cleanup

Se o merge passou mas a limpeza falhou:

```text
STATUS:
CLEANING
```

Não:

```text
COMPLETED
```

O cleanup precisa ser concluído ou explicitamente registrado como exceção.

---

## 46. PC local

Podemos adicionar Git hooks globais no PC como defesa adicional.

Exemplo:

```text
global hooks
├── branch naming warning
├── secret scan
└── commit validation
```

Mas o PC NÃO será fonte de verdade.

Porque existem:

```text
Jules Cloud
Codex Cloud
GitHub Actions
VPS
outros hosts
```

que podem não passar pelo computador local.

---

## 47. Hierarquia de autoridade

```text
1. GitHub Governance
2. GitHub Rulesets / Actions
3. Task Lifecycle
4. Agent Instructions
5. Local hooks
```

Prompt é orientação.

Governance é enforcement.

---

## 48. Política central proposta

Nome:

```text
LUMENVA ENGINEERING GOVERNANCE
```

Versão inicial:

```text
v1
```

Componentes:

```text
Lumenva Engineering Governance
│
├── Git Naming Standard
├── Agent Identity Standard
├── Task Lifecycle
├── Execution Record
├── Error Recording
├── Validation Gates
├── PR Policy
├── Main Protection
├── Security Gate
├── Merge Policy
├── Cleanup Policy
├── Handoff Policy
└── Governance Sync
```

---

## 49. Arquitetura final

```text
                    github-governance
                           │
                  SOURCE OF TRUTH
                           │
             ┌─────────────┴─────────────┐
             │                           │
        POLICY ENGINE               SYNC ENGINE
             │                           │
             │                    discover repos
             │                           │
             └──────────────┬────────────┘
                            ↓
                    PERSONAL GITHUB
                            │
         ┌──────────────────┼──────────────────┐
         ↓                  ↓                  ↓
      Lumenva              CRM              Teacher
         ↓                  ↓                  ↓
     RouteLex          Helixforge        Future Repos
         │
         └──────────────────┬──────────────────┘
                            ↓
                       RULESETS
                            ↓
                     ACTIONS / CI
                            ↓
                        PR GATE
                            ↓
                         MERGE
                            ↓
                        CLEANUP
```

---

## 50. Agent Pipeline

```text
                    TASK
                     │
                     ↓
               Identity assigned
                     │
       ┌─────────────┼──────────────┐
       │             │              │
     Agent          Role          Model
       │             │              │
       └─────────────┼──────────────┘
                     ↓
                   Session
                     ↓
                   Branch
                     ↓
                Implementation
                     ↓
                   Commit
                     ↓
               Self Validation
                     ↓
                     PR
                     ↓
           Governance Validation
                     ↓
          ┌──────────┴──────────┐
          │                     │
        FAILED                PASSED
          │                     │
        Fix                    READY
          │                     │
        Retry                  MERGE
                                │
                              CLEANUP
                                │
                              ARCHIVE
                                │
                           COMPLETED 100%
```

---

## 51. Resultado desejado

Quando qualquer agent olhar uma Task futura, ele deverá conseguir responder imediatamente:

```text
Qual Task?
Quem executou?
Qual role?
Qual modelo?
Qual sessão?
Qual branch?
Qual era o objetivo?
O que foi alterado?
Que erros aconteceram?
Por que aconteceram?
Como foram corrigidos?
Quais testes passaram?
Qual PR?
Qual commit final?
Foi merged?
A branch foi apagada?
Existe algum bloqueio?
Qual é a próxima ação?
```

Sem reler conversas antigas.

Sem procurar IDs obscuros.

Sem depender da memória de outro agent.

---

## 52. Ordem de implementação

### Fase 1 — Governance Repository

Criar:

```text
trydavidqix/github-governance
```

### Fase 2 — Policy Schema

Criar definição canônica de:

```text
branch naming
agent identity
session identity
task lifecycle
execution record
PR
validation
cleanup
```

### Fase 3 — Repository Discovery

Implementar descoberta automática dos repositórios da conta.

### Fase 4 — Ruleset Sync

Criar sincronizador que:

```text
creates missing rulesets
updates existing rulesets
detects drift
```

### Fase 5 — Repository Settings Sync

Aplicar:

```text
delete_branch_on_merge = true
```

e demais configurações padronizadas.

### Fase 6 — Agent Governance Workflow

Criar:

```text
agent-governance.yml
```

para verificar metadata, naming e lifecycle.

### Fase 7 — CI Adapter

Cada projeto mantém apenas os testes específicos de sua stack.

Exemplo:

```text
Lumenva → Node/Next/etc.
RouteLex → Python/FastAPI/etc.
Teacher → stack própria
```

Governance permanece central.

### Fase 8 — PR Template

Criar padrão único de Execution Record.

### Fase 9 — Cleanup Automation

Garantir:

```text
merge
→ delete branch
→ clean temporary resources
→ archive record
```

### Fase 10 — Scheduled Audit

Rodar auditoria automática periódica.

### Fase 11 — Drift Repair

Se alguém mudar uma regra manualmente:

```text
detect
→ report
→ restore canonical configuration
```

### Fase 12 — Agent Integration

Adicionar aos agents somente uma instrução curta:

```text
Follow Lumenva Engineering Governance.
GitHub governance is authoritative.
```

Não duplicar centenas de regras dentro de cada agent.

### Fase 13 — Migration

Converter progressivamente branches/tasks novas para o novo padrão.

Não precisamos necessariamente renomear todo histórico antigo.

### Fase 14 — Governance v1 Lock

Depois da validação:

```text
LUMENVA ENGINEERING GOVERNANCE V1
```

vira o padrão oficial.

---

## 53. Princípios finais

1. `One Task / One traceable history`
2. `Agent identity is explicit.`
3. `Branches are temporary. Tasks are permanent records.`
4. `No agent self-certifies completion.`
5. `CI is evidence.`
6. `Merge is not the final step. Cleanup is part of completion.`
7. `No chore. No meaningless branches. No gigantic IDs in human-facing names.`
8. `One governance source. Many repositories.`
9. `GitHub is the enforcement layer.`
10. `github-governance is the Control Plane.`

---

# Final Tree

```text
LUMENVA ENGINEERING GOVERNANCE
│
├── CONTROL PLANE
│   └── github-governance
│
├── GOVERNANCE
│   ├── policies
│   ├── schemas
│   ├── rulesets
│   ├── workflows
│   └── sync
│
├── AGENT IDENTITY
│   ├── agent
│   ├── role
│   ├── model
│   ├── session
│   └── external execution id
│
├── TASK
│   ├── task id
│   ├── objective
│   ├── execution
│   ├── attempts
│   ├── errors
│   ├── recovery
│   ├── validation
│   ├── blockers
│   └── handoff
│
├── GIT
│   ├── branch naming
│   ├── commits
│   ├── PR
│   └── merge
│
├── VALIDATION
│   ├── lint
│   ├── typecheck
│   ├── tests
│   ├── build
│   ├── security
│   └── governance
│
├── GITHUB ENFORCEMENT
│   ├── Rulesets
│   ├── Actions
│   ├── required checks
│   └── protected default branch
│
├── CLEANUP
│   ├── delete branch
│   ├── delete worktree
│   ├── clear temporary state
│   └── archive task record
│
├── GLOBAL SYNC
│   ├── discover repositories
│   ├── apply policy
│   ├── detect drift
│   ├── repair drift
│   └── configure new repos
│
└── COMPLETION
    ├── merged
    ├── validated
    ├── cleaned
    ├── archived
    └── COMPLETED 100%
```

