# Lumenva Global Brain — Arquitetura Cloud-First

## Objetivo

Deixar o **mínimo absoluto no PC** e mover o máximo possível do Lumenva Brain para **GitHub + Google Cloud**, com backup automático, versionado e sem sobrescrita.

Princípio principal:

> **Se o PC quebrar hoje, nenhum código, memória, decisão, histórico ou backup importante morre com ele.**

O PC vira apenas:

- terminal;
- IDE;
- Claude Code;
- Codex;
- Gemini CLI;
- Antigravity;
- Git;
- configuração MCP;
- um pequeno agente local para observar estado não commitado.

---

# 1. Arquitetura final

```text
                    CLAUDE / CODEX / GEMINI / ANTIGRAVITY
                                   │
                                   │ Remote MCP
                                   ▼
                        ┌──────────────────────┐
                        │   LUMENVA BRAIN MCP │
                        │      CLOUD RUN      │
                        └──────────┬───────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
          GITHUB              GOOGLE CLOUD         GOOGLE BACKUP
              │                    │                    │
         source code         Cloud SQL             Cloud Storage
         IaC/config          PostgreSQL             immutable archive
         docs/prompts        pgvector               snapshots
         workflows           Vertex AI              repo archives
         branches            Gemini                 DB exports
         commits             Scheduler              audit archive
                              Run Jobs
```

---

# 2. Divisão de responsabilidades

## GitHub

GitHub será a **fonte canônica de código e configuração**.

Guardar:

```text
GitHub private repos

├── projetos
├── lumenva-brain
├── MCP
├── integrations/
│   ├── claude
│   ├── codex
│   ├── gemini
│   └── antigravity
│
├── infrastructure/
├── terraform/
├── schemas/
├── migrations/
├── prompts/
├── skills/
├── hooks/
├── architecture/
├── docs/
└── GitHub Actions
```

Proteger branches importantes:

```text
main
production
release/*
```

Regras:

```text
force push: OFF
branch deletion: OFF
PR checks: ON
```

---

## Google Cloud

Google será a **fonte canônica de estado, memória, índice e backup**.

```text
Google Cloud
│
├── Cloud Run
│    ├── Lumenva Brain MCP
│    ├── Memory Compiler
│    ├── Retrieval Engine
│    └── Capability Engine
│
├── Firebase SQL Connect
│
├── Cloud SQL PostgreSQL
│    ├── memories
│    ├── memory_events
│    ├── projects
│    ├── capabilities
│    ├── graph
│    └── pgvector
│
├── Vertex AI
│    └── embeddings
│
├── Cloud Storage
│    └── immutable backups
│
├── Cloud Scheduler
│
├── Cloud Run Jobs
│
└── Cloud Logging / Monitoring
```

---

# 3. O que fica no PC

Manter somente:

```text
PC
│
├── Claude Code
├── Codex
├── Gemini CLI
├── Antigravity
├── Git
├── MCP config
│      └── https://brain.../mcp
└── Tiny Lumenva Edge
       ├── detect cwd
       ├── repo
       ├── branch
       ├── git diff
       └── send events
```

Não manter no PC:

```text
❌ banco principal
❌ pgvector principal
❌ servidor MCP principal
❌ memória canônica
❌ backups principais
❌ scanner pesado permanente
❌ daemon com toda a inteligência
```

Pode existir apenas cache descartável:

```text
~/.lumenva/cache
```

Se apagar, não há perda importante.

---

# 4. Lumenva Brain no Cloud Run

O Brain deixa de rodar no PC.

```text
Cloud Run
   │
   ├── Remote MCP
   ├── REST API
   ├── Retrieval Engine
   ├── Capability Engine
   ├── Memory Compiler
   └── Sync API
```

Todos os clientes apontam para o mesmo endpoint:

```text
Claude Code ───────┐
Codex ─────────────┤
Gemini CLI ────────┤
Antigravity ───────┘
         │
         ▼
https://brain.<domain>/mcp
```

---

# 5. Indexação dos projetos direto do GitHub

O Brain deve conhecer os projetos **direto do GitHub**, não depender do conteúdo local.

```text
GitHub repositories
      │
      ▼
Webhook / GitHub Actions
      │
      ▼
Cloud Run Indexer
      │
      ├── repository
      ├── branch
      ├── commit
      ├── manifests
      ├── code
      ├── symbols
      └── architecture
      │
      ▼
Lumenva Brain
```

Isso permite reconstruir o Brain mesmo sem o PC original.

---

# 6. Código ainda não commitado

Esse é o único estado importante que nasce localmente antes de chegar ao GitHub.

Usar o `Lumenva Edge` para observar:

```text
git diff
new files
branch
commit SHA
workspace ID
```

E enviar snapshots incrementais:

```text
PC
 │
 ├── committed code
 │      ↓
 │    GitHub
 │
 └── uncommitted changes
        ↓
   Lumenva Edge
        ↓
   Google Cloud Storage
```

Não fazer auto-commit automático no repositório.

Snapshots locais devem ir para área separada.

---

# 7. Backup sem sobrescrever

Nunca usar:

```text
backup/latest.zip
```

Usar objetos únicos:

```text
backups/
  2026/
    09/
      25/
        11-30-14/
          brain-db_<hash>.dump
          repos_<hash>.tar.zst
          memory-events_<hash>.jsonl
          manifest_<hash>.json
```

Cada backup deve ter:

```text
timestamp
UUID
content hash
source commit
backup run ID
```

Regra:

> Um backup novo sempre cria um novo objeto.

Nunca substitui o anterior.

---

# 8. Proteção contra sobrescrita

Ao enviar objetos para Cloud Storage, usar criação condicional:

```text
ifGenerationMatch=0
```

Se o objeto já existir:

```text
upload FAILS
```

em vez de sobrescrever.

---

# 9. Três níveis de recuperação

## Nível 1 — histórico normal

```text
GitHub Git history
+
Cloud SQL transactional history
+
memory_events append-only
```

---

## Nível 2 — recuperação rápida

Cloud SQL:

```text
automated backups
+
Point-in-Time Recovery
```

Exemplo:

```text
11:14 banco correto
11:17 operação errada
```

Restaurar para antes de 11:17.

---

## Nível 3 — backup imutável

Criar bucket separado:

```text
lumenva-vault
```

Guardar:

```text
Cloud SQL dumps
GitHub repo archives
memory event streams
configs
schemas
migrations
brain manifests
critical metadata
```

Depois de validar o sistema de restore, aplicar política de retenção e Bucket Lock.

---

# 10. Soft Delete

Também ativar Soft Delete nos buckets operacionais.

Fluxo de recuperação:

```text
erro humano
   ↓
Soft Delete

erro banco
   ↓
PITR

desastre maior
   ↓
Immutable Vault
```

---

# 11. Backup automático independente do PC

```text
Cloud Scheduler
       │
       ▼
Cloud Run Backup Job
       │
       ├── DB snapshot/export
       ├── repo snapshots
       ├── config snapshots
       ├── manifests
       └── memory event archive
              │
              ▼
        Cloud Storage Vault
```

Sugestão inicial:

```text
CONTÍNUO
memory_events
Git pushes

A CADA 15 MIN
working state checkpoint

A CADA 1 HORA
incremental Brain backup

TODO DIA
full DB backup
repo inventory
config snapshot

TODO DOMINGO
full disaster-recovery package
restore verification
```

Todos os jobs devem ser idempotentes.

---

# 12. Backup do próprio GitHub no Google

GitHub não deve ser considerado o backup dele mesmo.

Fluxo:

```text
GitHub
   ↓
scheduled Action
   ↓
archive repositories
   ↓
Google Cloud Storage
   ↓
immutable vault
```

Guardar:

```text
all branches
tags
refs
repository bundle/archive
critical metadata
```

---

# 13. Credenciais GitHub → Google

Não usar chave JSON permanente quando não for necessário.

Preferir:

```text
GitHub Actions
   ↓
OIDC
   ↓
Google Workload Identity Federation
   ↓
temporary credentials
```

Evitar:

```text
GCP_SERVICE_ACCOUNT_KEY.json
```

como segredo persistente.

---

# 14. Tabela final de divisão

| Local | GitHub | Google |
|---|---|---|
| Claude Code | Código | Lumenva Brain |
| Codex | Git history | Remote MCP |
| Gemini | Branches | PostgreSQL |
| Antigravity | PRs | pgvector |
| Git | IaC | Gemini compiler |
| Tiny Edge | Schemas | Vertex embeddings |
| Cache temporário | Migrations | Project index |
| MCP config | Prompts/skills/hooks | Capability graph |
| Working copy | Docs | Event archive |
| | GitHub Actions | Backups |
| | | PITR |
| | | Immutable vault |

---

# 15. Disaster Recovery

Teste obrigatório:

```text
PC ANTIGO DESTRUÍDO
```

Em um PC novo:

```text
1. instalar Git
2. instalar Claude Code
3. instalar Codex
4. instalar Gemini
5. instalar Antigravity
6. autenticar
7. clonar repositórios do GitHub
8. configurar Remote MCP
```

Todos apontam para:

```text
https://brain.<domain>/mcp
```

E imediatamente recuperam:

```text
projects
memories
decisions
capabilities
history
graph
previous sessions
sources
```

Objetivo:

```text
PC antigo:
DESTROYED

Impacto:
≈ zero perda de conhecimento
```

No máximo perde-se a pequena janela ainda não sincronizada do estado local.

---

# 16. Arquitetura final consolidada

```text
                       YOUR PC
                         │
       Claude / Codex / Gemini / Antigravity
                         │
                    Tiny Edge
                         │
                   Remote MCP
                         ▼
              ┌────────────────────┐
              │ GOOGLE CLOUD       │
              │                    │
              │ Cloud Run Brain    │
              │ Memory Compiler    │
              │ Retrieval Engine   │
              │ Project Indexer    │
              └─────────┬──────────┘
                        │
             ┌──────────┴───────────┐
             │                      │
             ▼                      ▼
          GITHUB                 GOOGLE
             │                      │
          SOURCE                 STATE
             │                      │
       code / git          Cloud SQL Postgres
       configs             pgvector
       IaC                 memory
       docs                capabilities
       hooks               graph
       skills              sessions
             │                      │
             └──────────┬───────────┘
                        ▼
                 GOOGLE BACKUP VAULT
                        │
                append-only objects
                        │
                   retention
                        │
                 soft-delete / PITR
                        │
                 disaster recovery
```

---

# 17. Decisão arquitetural

A arquitetura final deve seguir esta regra:

```text
PC
→ descartável

GitHub
→ source of truth de código/configuração

Google Cloud
→ source of truth de memória/estado

Google Cloud Storage
→ backup independente, versionado e imutável
```

O backup nunca deve sobrescrever o anterior.

Cada execução cria um novo conjunto de objetos com:

```text
timestamp
UUID
hash
source commit
run ID
```

---

# 18. Princípio final

> **O PC pode quebrar. O Brain não.**

Claude Code, Codex, Gemini e Antigravity são apenas clientes.

O conhecimento da Lumenva deve continuar existindo independentemente de:

- máquina;
- sessão;
- modelo;
- IDE;
- agente;
- branch;
- falha local.
