# ADR 0002: autoridade de memória persistente do Brain

- Status: Aceita para a migração local em `codex/nexus-canonical-architecture`
- Data: 2026-09-25

## Contexto

O MCG mantém memória persistente append-only em JSONL sob o root configurado, com namespaces, níveis, status, proveniência, validação e recuperação. O Operating Core oferece `MemoryKernelStore` e tipos de namespace, mas não possui implementação persistente no código auditado. O `MemoryRetriever` do Cloud Fabric recebe registros em memória e seleciona por tags/orçamento; não é um store.

## Decisão

`packages/brain/src/memory.mjs` é a implementação canônica da persistência de memória existente durante esta migração. `packages/brain/src/compiler.mjs` permanece seu compilador de contexto. Os caminhos MCG antigos ficam como reexports temporários e cobertos por testes. Os arquivos de estado já existentes não são movidos nem regravados por esta mudança estrutural.

O kernel tipado do Operating Core continua sendo contrato até que a fase de banco persistente implemente um adapter compatível e passe testes de contrato e migração/recuperação. O retriever do Cloud Fabric continua sendo seletor de registros, não uma autoridade concorrente.

## Consequências

- Uma única implementação local persistente tem ownership em `packages/brain`.
- O formato de armazenamento e dados JSONL não mudam nesta etapa.
- A migração futura para banco exige adapter, teste de migração/restore e compatibilidade antes de trocar o backend.
- O cache de contexto continua pendente porque grava métricas no History Store do MCG e requer decidir a fronteira Evidence/History.
