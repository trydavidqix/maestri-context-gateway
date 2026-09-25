# Plano de Implantação — Everything → Lumenva Global Brain

Este plano substitui a parte local do desenho anterior. O **Everything 1.5 vira o sensor oficial do Windows**, e o Lumenva Edge fica mínimo.

## 1. Objetivo

Usar o Everything para detectar rapidamente tudo que muda nos projetos locais sem criar nosso próprio:

```text
filesystem scanner
filesystem watcher
recursive crawler
polling engine
```

Fluxo:

```text
Everything 1.5
    │
    │ Index Journal
    ▼
Lumenva Edge
    │
    ├── Everything Adapter
    ├── Git Adapter
    ├── Snapshot Adapter
    └── Brain Client
    │
    ▼
Lumenva Brain Cloud
    │
    ├── Memory
    ├── Project Intelligence
    ├── Capability Graph
    └── Retrieval
```

## 2. Papel exato do Everything

Everything será responsável por:

- localizar arquivos;
- detectar criação;
- detectar modificação;
- detectar exclusão;
- detectar movimento;
- detectar renomeação;
- registrar quando mudou.

Não interpreta código.

Exemplo:

```text
Everything:

C:\Projetos\CRM\src\auth.ts
MODIFIED
12:47:21
```

Depois:

```text
Git Adapter:

repo: CRM
branch: feature/auth
HEAD: a18d...
diff: ...
```

Depois:

```text
Brain:

capability affected:
authentication

possible architecture change:
yes
```

## 3. Componente local final

```text
lumenva-edge/
│
├── core/
│   ├── service
│   ├── config
│   └── state
│
├── adapters/
│   ├── everything
│   ├── git
│   └── snapshot
│
├── filters/
│   ├── workspace
│   ├── ignore
│   └── relevance
│
├── client/
│   └── brain
│
└── cache/
```

Nada de Postgres, vector DB, LLM, embeddings, Memory Compiler ou Project Graph localmente.

Tudo isso fica na cloud.

## 4. Everything Adapter

Responsabilidades:

```text
Everything Adapter
│
├── verificar IPC
├── consultar Journal
├── manter cursor
├── normalizar eventos
├── filtrar PROJECTS_ROOT
├── agrupar bursts
└── entregar eventos ao Edge
```

Formato interno:

```text
FileEvent {
    event_id
    path
    old_path
    event_type
    timestamp
    size
    extension
    journal_cursor
}
```

Tipos:

```text
CREATE
MODIFY
DELETE
MOVE
RENAME
```

## 5. Cursor permanente do Journal

O Edge guarda somente:

```text
last_journal_cursor
```

Exemplo:

```text
Everything Journal

#992817
#992818
#992819
#992820
```

Se já processou `#992819`, na próxima execução começa em `#992820`.

Estado local:

```text
~/.lumenva-edge/state.json
```

Exemplo:

```text
journal_cursor
last_sync
device_id
```

Esse arquivo pode ter backup na cloud, mas não contém o Brain.

## 6. PROJECTS_ROOT

Definir explicitamente onde ficam os projetos:

```text
PROJECTS_ROOT=C:\Users\...\Projetos
```

Everything vê o Windows inteiro; o Edge filtra apenas a árvore relevante.

Assim eventos como Chrome cache, Windows Temp, Downloads e `node_modules` não entram no pipeline principal.

## 7. Ignore Engine

Ignorar inicialmente:

```text
node_modules/
.git/objects/
.next/
dist/
build/
coverage/
.cache/
tmp/

*.log
*.tmp
```

A lista fica versionada no GitHub:

```text
lumenva-edge-ignore.yaml
```

## 8. Burst Aggregator

Não enviar cada alteração individual.

Um formatter pode alterar dezenas de arquivos em segundos.

O Edge agrupa:

```text
CHANGESET #8491

project: CRM
window: 4 segundos
files: 30
```

O Brain recebe um único changeset.

## 9. Git Adapter

Depois que Everything detecta mudança:

```text
Everything
    ↓
path changed
    ↓
Git Adapter
```

Descobrir:

```text
repository
branch
HEAD SHA
working tree status
staged/untracked
diff
```

Resultado:

```text
ProjectChange {
    project
    repo
    branch
    base_commit
    changed_files[]
    git_diff
    committed
    timestamp
}
```

## 10. Separar committed de uncommitted

### Já commitado

```text
PC
 ↓
Git push
 ↓
GitHub
 ↓
Cloud Indexer
 ↓
Brain
```

GitHub continua sendo a autoridade.

### Ainda não commitado

```text
Everything
 ↓
Lumenva Edge
 ↓
Git diff
 ↓
encrypted snapshot
 ↓
Google Cloud Storage
```

Assim o trabalho ainda não commitado também sobrevive se o PC quebrar.

## 11. Snapshot Engine

Não enviar workspace completo a cada mudança.

Primeiro:

```text
BASE SNAPSHOT
```

Depois:

```text
incremental snapshots
```

Exemplo:

```text
snapshot/
  device_id/
    workspace_id/
      20260925/
        event_<uuid>.patch.zst
```

Metadados:

```text
timestamp
device_id
repo
branch
base_commit
hash
changed files
```

## 12. Sem sobrescrita

Nunca:

```text
current.patch
```

Sempre:

```text
<timestamp>_<uuid>_<hash>.patch
```

Upload create-only.

Se já existir, falha em vez de sobrescrever.

## 13. Brain Event API

O Edge envia eventos pequenos para:

```text
POST /events/workspace
```

Exemplo:

```text
device
project
repo
branch
commit
changeset
files
snapshot_ref
timestamp
```

O Edge não decide o que vira memória.

## 14. Pipeline cloud

```text
Workspace Event
      ↓
Project Resolver
      ↓
Change Analyzer
      ↓
Fast Decision Plane
      ↓
 ┌────┴─────────────┐
 │                  │
irrelevant       relevant
 │                  │
archive          analyze
                    ↓
              Capability Engine
                    ↓
               Memory Compiler
```

## 15. Decision Plane antes do LLM

Pipeline:

```text
rules
 ↓
BM25/vector/context
 ↓
pretrained classifier
 ↓
Laya
 ↓
uncertain?
 ↓
Gemini/Claude/Codex
```

Exemplo:

- `package-lock` mudou → normalmente não precisa de modelo grande.
- README mudou → pode merecer análise.
- `auth.ts` + testes de auth mudaram → provável alteração relevante.

## 16. Everything não vira memória

Eventos do filesystem são material bruto.

```text
RAW FILE EVENTS
       ↓
CHANGESETS
       ↓
PROJECT EVENTS
       ↓
MEMORY CANDIDATES
       ↓
CANONICAL MEMORY
```

## 17. Busca local ultrarrápida

O Adapter oferece:

```text
local_file_search
```

Por baixo:

```text
Brain/Agent
   ↓
Tiny Edge
   ↓
Everything IPC
```

Retorna caminhos rapidamente, sem embeddings.

## 18. Quando usar Everything vs Brain

```text
"onde está auth.ts?"
→ Everything

"quais arquivos Firebase existem?"
→ Everything

"onde já construí autenticação?"
→ Brain

"qual implementação devo reutilizar?"
→ Brain

"o que mudou hoje?"
→ Everything + Git

"por que mudamos autenticação?"
→ Brain Memory
```

## 19. Serviço Windows

```text
Windows starts
      ↓
Everything Service
      ↓
Everything process
      ↓
Lumenva Edge
      ↓
IPC check
      ↓
Journal resume
      ↓
Brain connection
```

Se Brain estiver indisponível:

```text
queue locally
```

Depois sincroniza quando voltar.

A fila local é temporária e descartável após confirmação.

## 20. Health check local

Criar:

```text
lumenva-edge status
```

Exemplo:

```text
Everything: ONLINE
Version: 1.5.0.1423b

IPC: OK
Journal: OK

Last cursor: 19382911
Last event: 2s ago

Git: OK

Brain: ONLINE
Pending events: 0
Pending snapshots: 0
```

## 21. Fallback

Everything 1.5 ainda é Beta.

Fallback:

```text
Everything available?
       │
    yes│no
       │
       ▼
   Journal      Git status/diff
```

Não criar outro filesystem watcher completo.

Se Everything falhar temporariamente, Git + GitHub continuam garantindo o estado principal.

## 22. Everything DB não é backup crítico

`Everything.db` não é estado canônico.

Pode ser reconstruído.

Guardar apenas, se desejado:

```text
Everything.ini
Edge config
```

para reconstrução rápida.

## 23. Segurança

Everything nunca será exposto diretamente à internet.

```text
Everything
     │
 local IPC
     │
Lumenva Edge
     │
 HTTPS
     │
Brain Cloud
```

Não usar HTTP/ETP público nem port forwarding.

## 24. Secrets

O Edge só conhece:

```text
Brain URL
device identity
short-lived auth
```

Não recebe senha do Cloud SQL, GCP admin key ou GitHub admin token.

## 25. Device identity

Registrar cada máquina:

```text
device_id
device_name
platform
owner
created_at
last_seen
```

## 26. Autoridades

```text
Everything
≠ source of truth
```

Autoridades:

```text
CODE
→ GitHub

MEMORY
→ Cloud SQL

BACKUP
→ Google Vault
```

Everything é o sensor local.

## 27. Ordem de implantação

| Etapa | Entrega |
|---|---|
| E1 | criar `lumenva-edge` |
| E2 | Everything IPC adapter |
| E3 | Journal reader |
| E4 | cursor persistente |
| E5 | PROJECTS_ROOT filter |
| E6 | ignore engine |
| E7 | burst aggregator |
| E8 | Git adapter |
| E9 | changeset model |
| E10 | Brain Event API |
| E11 | Snapshot uploader |
| E12 | offline queue |
| E13 | local file search |
| E14 | Windows autostart |
| E15 | health/status command |
| E16 | cloud integration |
| E17 | Decision Plane integration |
| E18 | Capability/Memory pipeline |
| E19 | E2E |
| E20 | disaster test |

## 28. Testes obrigatórios

```text
criar arquivo
→ Everything detecta
→ Edge recebe

editar arquivo
→ detected

renomear
→ detected

mover
→ detected

deletar
→ detected

100 alterações rápidas
→ agrupadas

branch muda
→ Git Adapter atualiza

commit
→ GitHub indexa

uncommitted change
→ snapshot cloud

Edge reinicia
→ continua do cursor

PC offline
→ eventos aguardam

internet volta
→ sincroniza

Everything reinicia
→ Edge recupera

PC morre
→ committed code no GitHub
→ uncommitted snapshot no Google
→ Brain intacto
```

## 29. Resultado local final

Antes:

```text
PC
├── Brain daemon
├── DB
├── vectors
├── scanner
├── watcher
├── project crawler
├── memory engine
└── agents
```

Depois:

```text
PC
├── Claude Code
├── Codex
├── Gemini
├── Antigravity
├── Git
├── Everything
└── Lumenva Edge
```

O Edge fica praticamente:

```text
Everything
+
Git
+
Cloud uploader
+
Brain client
```

## 30. Arquitetura consolidada

```text
                      WINDOWS PC
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
   Claude Code          Codex        Gemini/Antigravity
        │                 │                  │
        └─────────────────┼──────────────────┘
                          │
                    Remote MCP
                          │
                    Lumenva Edge
                          │
            ┌─────────────┴──────────────┐
            │                            │
       Everything 1.5                  Git
            │                            │
       Index Journal                   Diff
       IPC/Search                     Branch
       File events                    Commit
            │                            │
            └─────────────┬──────────────┘
                          │
                     ChangeSet
                          │
                  encrypted snapshots
                          │
                          ▼
                     GOOGLE CLOUD
                          │
                    LUMENVA BRAIN
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
 Decision Plane        Memory           Project
                       Core          Intelligence
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                  Capability Graph
                          │
                Cloud SQL / pgvector
                          │
                 Google Backup Vault

GitHub ─────────► Cloud Project Indexer
```

## Regra final

> **Everything vê. Git prova. Brain entende. Google preserva.**
