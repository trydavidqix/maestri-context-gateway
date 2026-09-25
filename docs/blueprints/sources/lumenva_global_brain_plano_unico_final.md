# Lumenva Global Brain — Plano Único de Implementação

## 1. Objetivo final

Construir um único cérebro permanente e global, compartilhado por:

- Claude Code
- Codex
- Gemini CLI
- Antigravity

O Brain deve funcionar em qualquer projeto, conhecer todo o ecossistema, reutilizar capacidades existentes e permanecer independente do PC.

Exemplo esperado:

> “Quero criar uma plataforma de reservas.”

O Brain responde com base em evidências reais:

```text
CRM
✓ clientes
✓ WhatsApp
✓ autenticação
✓ notificações

Scheduler
✓ calendário
✓ agendamento

Commerce
✓ pagamentos

7/9 capacidades já existem.
Precisamos criar apenas:
- domínio de reservas
- booking UI
```

A porcentagem de reaproveitamento deve vir de capacidades verificadas, nunca de estimativa inventada.

---

## 2. Princípios definitivos

```text
1 Brain global
1 memória canônica
1 integração local
1 banco principal
1 sistema de backup
```

Responsabilidades:

```text
GitHub = verdade do código
Google Cloud = verdade da memória/estado
Everything = sensor do Windows
Git = evidência das alterações
Lumenva Edge = ponte local
Claude/Codex/Gemini/Antigravity = clientes do Brain
```

O PC deve poder quebrar sem levar o Brain junto.

---

## 3. Arquitetura simplificada

```text
                       WINDOWS PC
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     Claude              Codex       Gemini/Antigravity
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                      Local MCP
                           │
                    LUMENVA EDGE
                           │
               ┌───────────┴───────────┐
               │                       │
          Everything 1.5              Git
               │                       │
          Index Journal               diff
          file search                 branch
                                      commit
               │                       │
               └───────────┬───────────┘
                           │ HTTPS
                           ▼
                    GOOGLE CLOUD
                           │
                  LUMENVA BRAIN API
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Memory          Projects        Capabilities
          │                │                │
          └────────────────┼────────────────┘
                           │
                    Retrieval Engine
                           │
                 PostgreSQL + pgvector
                           │
                Google Backup Vault


GitHub ───────────────► Project Indexer
```

---

## 4. O PC fica mínimo

Instalado:

```text
Claude Code
Codex
Gemini CLI
Antigravity
Git
Everything 1.5
Lumenva Edge
```

Não teremos localmente:

```text
❌ PostgreSQL
❌ pgvector
❌ banco de memória
❌ Memory Compiler
❌ embeddings
❌ Project Graph
❌ crawler próprio
❌ filesystem watcher próprio
❌ LLM próprio
```

Everything substitui scanner + watcher.

---

## 5. Lumenva Edge

Nosso único componente local importante:

```text
lumenva-edge/

├── everything
├── git
├── snapshots
├── brain-client
└── mcp
```

Responsabilidades:

```text
detectar projeto atual
detectar branch
consultar Everything
ler Index Journal
consultar Git
agrupar mudanças
proteger trabalho não commitado
conectar agentes ao Brain
```

Nada de inteligência pesada.

---

## 6. Everything 1.5

Usar:

```text
es.exe
+
Index Journal
```

Fluxo:

```text
arquivo alterado
      ↓
Everything Journal
      ↓
Lumenva Edge
      ↓
Git
      ↓
ChangeSet
```

Se `es.exe` virar gargalo no futuro, migrar o adapter para IPC.

---

## 7. Eventos não viram memória automaticamente

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

Exemplo:

```text
184 File Events
       ↓
12 ChangeSets
       ↓
6 eventos relevantes
       ↓
2 Memory Candidates
       ↓
1 nova memória
```

---

## 8. GitHub como índice principal dos projetos

Tudo commitado é aprendido diretamente da cloud:

```text
GitHub
   ↓
Push/Webhook
   ↓
Lumenva Indexer
   ↓
changed files
manifests
architecture
dependencies
   ↓
Capabilities
   ↓
Brain
```

Adicionar sincronização periódica para recuperar webhooks perdidos.

---

## 9. Banco V1 simplificado

Somente:

```text
projects
documents
capabilities
capability_evidence
memory_events
memories
memory_sources
```

### `memory_events`

Append-only.

### `memories`

Campos principais:

```text
type
subject
content
scope
status
valid_from
invalid_at
supersedes
confidence
authority
created_at
```

### `memory_sources`

```text
repo
branch
commit
file
session
agent
```

---

## 10. Tipos de memória V1

```text
decision
fact
procedure
incident
preference
architecture
```

Capabilities ficam em estrutura própria.

---

## 11. Escopos V1

Somente:

```text
GLOBAL
PROJECT
```

Exemplo global:

```text
"Preferimos soluções cloud-first."
```

Exemplo de projeto:

```text
"CRM usa PostgreSQL."
```

---

## 12. Capability Engine

Código:

```text
CRM/src/auth/firebase.ts
```

vira:

```text
CRM
IMPLEMENTS
authentication
```

A capability mantém evidências:

```text
project
repo
branch
commit
files
tests
```

Exemplos:

```text
authentication
payments
whatsapp
scheduler
calendar
notifications
voice
memory
video-rendering
social-publishing
```

No V1 não criar Knowledge Graph genérico.

Modelo suficiente:

```text
Project
    ↓
Capability
    ↓
Evidence
```

---

## 13. Retrieval

V1:

```text
PostgreSQL Full Text Search
        +
pgvector
        +
project/capability filters
```

Pipeline:

```text
QUERY
 │
 ├── lexical
 ├── vector
 └── structured filters
 │
 ▼
fusion
 │
 ▼
context
```

Sem Neo4j, Graphiti ou vários bancos vetoriais.

---

## 14. Memory Compiler

Um único compiler inicialmente:

```text
Gemini
```

Fluxo:

```text
event
 ↓
rules
 ↓
relevant?
 ↓
Gemini Compiler
 ↓
extract memory
 ↓
provenance
 ↓
deduplicate
 ↓
store
```

Claude e Codex continuam como clientes, não como compilers alternativos no V1.

---

## 15. Decision Plane simplificado

```text
EVENT
  │
  ▼
RULES
  │
  ▼
SIMILARITY
  │
  ▼
Laya
  │
 uncertain
  ▼
Gemini
```

### Código resolve respostas exatas

```text
file exists
hash
Git status
test passed
branch
timestamp
```

### Similaridade

Usar embeddings/protótipos para casos óbvios.

### Laya

Usar modelo pré-treinado para:

```text
yes/no
choice
score
classification
```

### Gemini

Só em casos que exigem raciocínio.

---

## 16. Zero treinamento no V1

Não fazer:

```text
treinar LLM
fine-tune
criar dataset gigante
treinar router
```

Começar com:

```text
pretrained models
+
rules
+
embeddings
+
Laya
```

Se funcionar, não treinar nada.

Fine-tuning só no futuro se existir problema recorrente que não possa ser resolvido com threshold, regras e exemplos.

---

## 17. Agent Router não bloqueia o Brain

No V1, o usuário já escolhe:

```text
claude
codex
gemini
Antigravity
```

Portanto o Brain não precisa decidir qual agente executar.

Quando Maestri entrar, o mesmo Decision Plane poderá fazer esse routing.

---

## 18. Ferramentas MCP

Somente seis:

```text
brain_context
brain_search
brain_reuse
brain_remember
local_search
brain_status
```

### `brain_context`

Retorna o necessário para trabalhar no projeto/tarefa atual.

### `brain_search`

Busca global.

### `brain_reuse`

Procura o que já existe e pode ser reaproveitado.

### `brain_remember`

Cria uma memory candidate explicitamente.

### `local_search`

Consulta Everything.

### `brain_status`

Estado geral do sistema.

---

## 19. Trabalho não commitado

Commitado:

```text
PC
 ↓
GitHub
```

Não commitado:

```text
Everything
 ↓
Edge
 ↓
Git diff
 ↓
encrypted snapshot
 ↓
Google Cloud Storage
```

Sem auto-commit.

---

## 20. Backup definitivo

### Código

```text
GitHub
+
Git mirror no Google
```

### Banco

```text
Cloud SQL
+
automated backup
+
PITR
```

### Vault

```text
Google Cloud Storage

database dumps
Git bundles
memory events
configs
manifests
```

Cada backup:

```text
timestamp
UUID
hash
```

Nunca usar `latest.zip`.

Nunca sobrescrever backup anterior.

---

## 21. Política de backup

```text
CONTÍNUO
Git commits
memory events

ENQUANTO EXISTIR WORKING TREE SUJO
snapshot periódico

DIÁRIO
Cloud SQL backup/export
GitHub repository mirror

SEMANAL
integrity verification

MENSAL
full restore test
```

No Vault:

```text
retention
soft delete
create-only
```

Bucket Lock só depois de restore e retenção estarem validados.

---

## 22. Google Cloud V1

Usar:

```text
Cloud Run
Cloud SQL PostgreSQL
Cloud Storage
Vertex AI
Gemini
Cloud Scheduler
Cloud Run Jobs
Secret Manager
Logging/Monitoring
```

Firebase não fica no caminho crítico do Brain no V1.

Pode entrar depois para dashboard/app.

---

## 23. GitHub

Guardar:

```text
Lumenva Brain source
Lumenva Edge source
schemas
migrations
config
prompts
skills
hooks
IaC
docs
```

GitHub Actions:

```text
test
build
deploy
```

Autenticação:

```text
GitHub OIDC
    ↓
Google Workload Identity
```

Sem chave GCP permanente no GitHub.

---

## 24. Fluxo completo

Você abre:

```text
C:\Projetos\NovoProjeto
```

e inicia Codex:

```text
Codex
 ↓
Lumenva Edge
 ↓
brain_context
```

Brain sabe:

```text
repo
branch
projeto
decisões relacionadas
capabilities relacionadas
```

Você pede:

> Quero criar autenticação + WhatsApp + calendário.

Edge chama:

```text
brain_reuse
```

Brain encontra:

```text
CRM/auth
CRM/whatsapp
Scheduler/calendar
```

Enquanto trabalha:

```text
file changes
 ↓
Everything
 ↓
Edge
 ↓
Git
 ↓
ChangeSet
 ↓
Cloud
```

Quando commitado:

```text
GitHub
 ↓
Indexer
 ↓
Brain
```

---

## 25. Estrutura final dos dois projetos

### Cloud

```text
lumenva-brain/

├── api/
├── memory/
├── projects/
├── capabilities/
├── retrieval/
├── compiler/
├── decision/
├── indexer/
├── backup/
└── db/
```

### Windows

```text
lumenva-edge/

├── mcp/
├── everything/
├── git/
├── snapshots/
└── brain-client/
```

---

## 26. Ordem de implementação

| Fase | Resultado |
|---|---|
| 1 | Cloud SQL + Brain API |
| 2 | Memory + Remote API |
| 3 | Lumenva Edge + MCP |
| 4 | Everything + Git |
| 5 | GitHub Indexer |
| 6 | Project + Capability Index |
| 7 | Retrieval + `brain_context/search/reuse` |
| 8 | Memory Compiler |
| 9 | Claude/Codex/Gemini/Antigravity |
| 10 | Uncommitted snapshots |
| 11 | Backup + PITR + Vault |
| 12 | Decision Plane/Laya |
| 13 | E2E + disaster recovery |

Laya não bloqueia o Brain; pode entrar depois que o core estiver funcional.

---

## 27. V1 pronto quando

```text
Claude encontra memória criada por Codex.

Gemini encontra conhecimento criado por Claude.

Antigravity acessa o mesmo Brain.

Qualquer projeto encontra capabilities de outro.

brain_reuse encontra código reaproveitável.

Everything detecta mudança local.

Git identifica exatamente o diff.

Código não commitado vai para Google.

Código commitado vai para GitHub.

Brain sobrevive ao fechamento dos agentes.

Brain sobrevive à troca de PC.

Cloud SQL consegue ser restaurado.

GitHub consegue ser restaurado do Google Vault.

Nenhum backup importante é sobrescrito.
```

---

## 28. O que foi cortado dos planos antigos

Sai do V1:

```text
❌ fork completo do mcp-memory-service
❌ Neo4j
❌ Graphiti
❌ Mem0
❌ Letta
❌ Cognee
❌ Knowledge Graph genérico
❌ filesystem watcher próprio
❌ scanner local próprio
❌ banco local
❌ vários MCP servers
❌ três Memory Compilers
❌ router complexo
❌ treinamento próprio
❌ SetFit próprio
❌ ModernBERT próprio
❌ agent routing obrigatório
❌ dashboard antes do core
❌ dezenas de tabelas
```

Podemos estudar esses projetos e reaproveitar padrões úteis sem incorporar suas arquiteturas inteiras.

---

## 29. Resultado final

```text
                    LUMENVA GLOBAL BRAIN

                         GOOGLE
                           │
              ┌────────────┼────────────┐
              │            │            │
           Memory       Projects    Capabilities
              │            │            │
              └────────────┼────────────┘
                           │
                     Retrieval
                           │
                PostgreSQL + pgvector
                           │
                     Backup Vault


                           ▲
                           │
                     LUMENVA EDGE
                           │
                  Everything + Git
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Claude            Codex      Gemini/Antigravity
```

## Regra final

> **Everything vê o PC. Git prova o que mudou. GitHub preserva o código. O Brain entende e relaciona o conhecimento. Google mantém a memória e os backups. Claude, Codex, Gemini e Antigravity compartilham o mesmo cérebro.**

> **Os agentes são substituíveis. O PC é substituível. A memória não.**
