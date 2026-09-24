# Maestri Context Gateway — plano mestre de implementação

**Consolidação atualizada:** 2026-09-24  
**Projeto canônico:** `maestri-context-gateway`  
**Escopo:** produto MCG independente: gateway local, telemetria/contexto, Token Firewall e dashboard.  
**Fonte única do andamento:** este documento. Planos anteriores foram preservados como histórico e não devem ser usados como checklists ativos.

## Objetivo

Concluir o Maestri Context Gateway no projeto independente, aproveitando a implementação verificada portada do Lumenva, sem duplicar engines, stores, contratos ou dashboards. O produto deve mostrar relatórios claros nas 13 áreas, métricas honestas, tema claro/escuro e redução comprovável de overhead do Codex sem perder evidência nem qualidade.

## Regras de escopo

- Todo o código e a documentação de produto MCG vivem neste repositório independente.
- Lumenva pode consumir o MCG por integração/versionamento; sua arquitetura, CRM e dados não são migrados para cá.
- `voz` e qualquer implementação de CRM ficam fora deste plano.
- Preferências globais de Claude/Codex/Gemini, skills de comunicação e a camada “Carioca Human State” pertencem aos perfis globais, não ao produto MCG. Preservar os registros existentes; não reinstalar nem duplicar aqui.
- O Maestri V3 completo é um produto/roadmap maior. Este plano cobre somente os contratos e pontos de integração necessários ao MCG.
- Não criar segunda sessão/agente, memória, task store, telemetry store ou executor para economizar tokens. Preservar a identidade da sessão CEO/CTO e trabalhar uma task por vez, sem subagents ou sessões Jules paralelas.
- Dashboard continua read-only, loopback-only, com porta configurável. Não inventar dados: toda medida é `exact`, `estimated` ou `unavailable`; ausência nunca vira zero.
- Não alterar configuração global do Codex, implantar, reiniciar daemon ou mexer em outro repo como parte destas fases sem autorização específica.

## Blueprints reconciliados nesta consolidação

- **Extração do MCG / integração Lumenva:** Fase 0, concluída. O produto vive neste repo; o consumidor Lumenva mantém apenas integração tipada/versionada.
- **Blueprint do Command Center, observabilidade e relatórios:** somente partes pertencentes ao MCG foram mapeadas para as Fases 1, 2 e 4. As 13 seções ficam explicitamente listadas na Fase 4.
- **Referências visuais, light/dark e paletas:** Fase 5, ainda pendente; os valores exatos estão reproduzidos abaixo para este ser o documento completo.
- **Token Firewall / redução de tokens Codex:** Fases 3 e 6. Melhorias já portadas não são confundidas com economia provider-confirmada; benchmark continua necessário.
- **Repository Governor:** não é componente de runtime do MCG. Não criar uma segunda camada de governança dentro do produto; regras de CI próprias permanecem no repositório, e rulesets/permissões do GitHub são administração externa separada.
- **Maestri Agent OS/Maestri V3 amplo, setup Windows de Claude/Codex/Gemini e comportamento global/carioca do Claude:** pertencem à arquitetura/perfis gerais, não à implementação deste produto. O que já existe permanece fora daqui; não copiar configurações pessoais, criar skills duplicadas ou declarar proposta de personalidade como instalada.
- **CRM e `voz`:** explicitamente excluídos; não migrar, limpar nem alterar.

## Estado atual e cálculo

O plano antigo de dashboard tinha 2/6 tasks aceitas (33%). Este plano consolida também a extração do produto e a fundação já entregue, por isso usa **7 fases de mesmo peso**. O percentual atual é **3/7 fases aceitas = 43%**. O Token Firewall tem partes portadas, mas não passa seu gate integral; portanto não recebe crédito como fase concluída. Essa mudança de denominador é consolidação, não trabalho novo concluído.

| Fase | Estado | Evidência / motivo |
|---|---|---|
| 0. Produto independente e reconciliação | ✅ Concluída | Repositório próprio, CI, integração do consumidor e planos antigos preservados em `docs/archive/`; MCG removido das branches Lumenva indicadas sem levar CRM/voz. |
| 1. Runtime local, daemon e descoberta MCP | ✅ Concluída | Lifecycle Windows, health, autostart limitado, discovery/probe read-only, porta configurável; testes e scan registrados em `docs/STATUS.md`. |
| 2. Telemetria e uso Codex auditáveis | ✅ Concluída | Proveniência/medição, parsing Codex sem dupla contagem de reasoning, recuperação local, métricas de contexto, `traceparent` e corpus de 30 casos portados. |
| 3. Token Firewall comprovado | 🟡 Parcial | Deduplicação determinística, hashes/deltas e métricas existem. Envelope completo, resumo conectado ao caminho do modelo, batching seguro e benchmark não foram aceitos; drafts Jules continuam fora da branch validada. |
| 4. Relatórios úteis para as 13 áreas | ⬜ Pendente | Navegação/API existem; várias telas ainda mostram JSON bruto, sem relatório orientado a usuário e cobertura explicada. |
| 5. Design de referência, temas e acessibilidade | ⬜ Pendente | Overview atual existe, mas não está fiel às referências; paletas exatas, alternância/persistência Light/Dark/System e validação visual ainda não foram aprovadas. |
| 6. Evals, benchmark e gate de release | ⬜ Pendente | Avaliação pareada em 20 tarefas, aceitação de qualidade, auditoria de acessibilidade e gate final integrado ainda faltam. |

## Plano de execução

### Fase 0 — Produto independente e reconciliação ✅

- [x] Estabelecer `maestri-context-gateway` como casa canônica do produto.
- [x] Portar mudanças MCG verificadas do Lumenva e integrar via exports/dependência versionada, sem trazer CRM ou `voz`.
- [x] Preservar os planos/specs históricos em `docs/archive/` e manter CI própria.
- [x] Registrar branch PR #25 como integração externa limitada a dois caminhos do `operating-core`; falha conhecida de resolução de `@lumenva/core` é pré-existente e não é escopo deste produto.

### Fase 1 — Runtime local, daemon e descoberta MCP ✅

- [x] Health/read-only dashboard, lifecycle seguro no Windows, autostart limitado e CLI com porta configurável.
- [x] Discovery de catálogos globais/de projeto e MCP probe sem `tools/call` ou exportação de secrets.
- [x] Testes de ciclo de vida, restart, recovery, porta e scan sensível; manter OAuth gerido pelo cliente como não verificável pelo MCG.

### Fase 2 — Telemetria e uso Codex auditáveis ✅

- [x] Preservar `exact`/`estimated`/`unavailable`, provenance e null para dado ausente.
- [x] Contar input/cache/output/reasoning sem somar breakdown duas vezes; agregados sem ID de turno permanecem estimados.
- [x] Persistir `traceparent`; recuperar métricas locais de uso/contexto sem alegar que cache local equivale a prompt-cache do provedor.
- [x] Adicionar dataset `validation-v2` de 30 casos sem disparar execução de provider automaticamente.

### Fase 3 — Token Firewall comprovado 🟡

**Base já existente:** compiler com hashes/prioridades/limites; deduplicação determinística; métricas de reutilização estimadas; watcher de processo; feed read-only de execuções; evidências locais. Isso não comprova economia de tokens do provedor.

- [ ] Definir envelope de operação consistente: ID, task/sessão, ferramenta, início/fim, bytes de entrada/saída, status, resumo, referência de evidência e proveniência; redigir segredos antes de persistir ou retornar.
- [ ] Conectar resumo compacto ao caminho real que entrega resultados ao executor/modelo. Incluir falhas, caminhos/linhas, exit status e ponte para saída integral; testar que expansão por referência funciona. Se não resolver, enviar o conteúdo necessário.
- [ ] Agrupar apenas inspeções independentes/read-only. Preservar ordem quando há dependência e nunca agrupar ação destrutiva ou sujeita a aprovação; reportar falha em vez de filtrar comando silenciosamente.
- [ ] Reutilizar watcher existente para esperar fora do modelo e emitir um resultado terminal; polling não deve reinvocar modelo.
- [ ] Usar hash/checkpoint para evitar reenvio de contexto imutável, mantendo escape hatch de leitura integral; cobrir mudança, rename e remoção.
- [ ] Rodar benchmark isolado do candidato `tool_output_token_limit = 3000`, se CLI/schema instalado suportar. Não editar `%USERPROFILE%\\.codex\\config.toml` nem promover setting global.
- [ ] Testar falhas, outputs grandes/hostis, truncamento, redaction, evidência recuperável, escopo da sessão e identidade persistente.

**Gate:** suite focal e completa passa; resumo está conectado; evidências continuam acessíveis; benchmark reporta dados medidos e não atribui economia estimada como tokens reais; nenhuma configuração global ou agente/sessão extra foi alterada.

### Fase 4 — Relatórios claros para as 13 áreas ⬜

- [ ] Criar um shell de relatório comum com conclusão curta, período/filtros aplicáveis, resumo, breakdown, fonte/proveniência, tipo de medida, atualização, cobertura/limitação e próxima ação. Omitir campos inaplicáveis, não exibir placeholders vazios.
- [ ] Visão Geral: saúde observada de Daemon/Wire/Workspace/SSE, KPIs, tarefas, alertas e cobertura da validação.
- [ ] Histórico e Traces: timeline/filtros/retention; cadeia trace-job-task-execution, duração, lacunas e drill-down de evidência.
- [ ] Tarefas e Agentes: estado, objetivo, executor, tempo, medidas disponíveis, capacidade/health, último evento e razão de bloqueio.
- [ ] Ferramentas, Plugins/Skills e MCPs: catálogo, origem, capacidades/health/probe e uso só quando atribuído; nunca inventar latency, taxa de erro ou autoria.
- [ ] Contexto/Graph, Cache e Memória: cobertura e relações legíveis; hits/misses/reuso estimado; eventos por origem/scope, sem despejar conteúdo privado.
- [ ] Validação MCG e Alertas: lanes/evidência/recall/grounding/sucesso e economia que preserva qualidade; alertas ativos/resolvidos/deduplicados e empty state explícito.
- [ ] Manter JSON técnico apenas em disclosure recolhido, com escaping; adicionar loading, sem dados, zero medido, parcial, stale, indisponível, erro e retry com explicação e ação.
- [ ] Fixture-testar as 13 rotas com medidas exatas/estimadas/indisponíveis, null, arrays vazios e parcial; testar deep links/back-forward e escaping.

**Gate:** cada navegação abre relatório útil em PT-BR; cada número tem fonte/qualificação; JSON é opcional; nenhuma tela transforma indisponibilidade em zero.

### Fase 5 — Referência visual, temas e acessibilidade ⬜

- [ ] Usar `ui-ux-pro-max` antes da revisão visual; preservar sidebar, cabeçalho operacional, KPIs, gráficos, executores/plugins, tarefas/alertas e validação. Valores nas imagens são ilustrativos, não dados do produto.
- [ ] Centralizar cores em tokens semânticos e implementar exatamente estas paletas, sem misturar valores entre temas:
  - **Claro:** fundo principal `rgb(242, 242, 247)`; secundário `rgb(229, 229, 234)`; cards `rgb(248, 248, 250)`; cards elevados `rgb(255, 255, 255)`; cinzas `rgb(209, 209, 214)`, `rgb(199, 199, 204)`, `rgb(174, 174, 178)`, `rgb(142, 142, 147)`; texto secundário `rgb(72, 72, 74)`; texto principal `rgb(28, 28, 30)`; verde `rgb(0, 200, 83)` / glow `rgb(48, 209, 88)`; vermelho `rgb(255, 56, 60)` / alerta `rgb(233, 21, 45)`; glass `rgba(255, 255, 255, 0.65)`; borda glass `rgba(255, 255, 255, 0.80)`; sombra `rgba(0, 0, 0, 0.12)`.
  - **Escuro:** preto absoluto `rgb(0, 0, 0)`; preto suave `rgb(16, 16, 17)`; preto principal `rgb(20, 20, 20)`; cards `rgb(25, 25, 25)`; cinza-preto `rgb(31, 31, 31)`; cinza escuro `rgb(43, 43, 43)`; borda `rgb(48, 48, 48)`; cinza médio `rgb(64, 64, 64)`; cinza secundário `rgb(119, 119, 119)`; texto secundário `rgb(153, 153, 153)`; texto principal `rgb(245, 245, 245)`; verde `rgb(0, 230, 118)` / glow `rgb(0, 255, 106)`; vermelho `rgb(239, 68, 68)` / alerta `rgb(255, 18, 48)`; glass `rgba(25, 25, 25, 0.72)`; borda sutil `rgba(255, 255, 255, 0.10)`; highlight `rgba(255, 255, 255, 0.06)`; sombra `rgba(0, 0, 0, 0.45)`; glow verde `rgba(0, 255, 106, 0.30)`; glow vermelho `rgba(255, 18, 48, 0.30)`.
- [ ] Adicionar Light / Dark / System, persistência local, respeito a `prefers-color-scheme` e inicialização sem flash de tema incorreto.
- [ ] Aplicar glass/glow com moderação; contraste legível, legenda/resumo para gráficos e status não dependente apenas de cor.
- [ ] Durante implementação usar `antislop-ui` e `antislop-layoutmobile`; aplicar `accessibility` em interações e estados; após implementação revisar com `web-design-guidelines`.
- [ ] Validar desktop e viewport estreito contra as duas referências, navegação por teclado/toque, foco, nomes acessíveis, contraste, zoom/reflow e movimento reduzido. Não controlar o Chrome pessoal do usuário; usar ferramenta de teste isolada.

**Gate:** layout reconhecível e fiel sem copiar números fictícios, ambas as paletas exatas, preferência persistente, 13 telas acessíveis/usáveis em desktop e mobile.

### Fase 6 — Evals, benchmark e release gate ⬜

- [ ] Rodar acessibilidade e `web-design-guidelines`; usar `web-perf` somente com trace real. Sem trace, registrar performance como não medida.
- [ ] Rodar `npm test`, `npm run check:syntax`, `npm run scan:sensitive`, `npm run smoke:dashboard` e `npm run eval:validation`; executar `eval:validation-v2` separadamente, ciente de quota/provider.
- [ ] Comparar baseline/candidate nas mesmas 20 tasks, mesmo snapshot, provider/model, reasoning e critérios: uso reportado por campo, turns, tools/bytes, latência, retries, overflow, sucesso, recall, grounding e evidência. Declarar cobertura/limitações.
- [ ] Aceitar otimização só se payload/round-trips redundantes caírem sem piorar sucesso, recall, grounding ou evidência obrigatória. Não prometer percentuais dos relatos de terceiros.
- [ ] Revisar binding loopback, porta alternativa, modo offline, estados de erro, install/upgrade e rollback sem parar daemon/worktree alheio.
- [ ] Atualizar arquitetura e status com resultados reais, remover contradições dos planos históricos por marcação de superseded (sem apagar os registros), e aprovar release do produto independente.

**Gate final:** testes e scans passam; 13 relatórios e temas atendem aos critérios; benchmark sustenta qualquer alegação de economia; riscos e medições indisponíveis estão explícitos; integração do consumidor não inclui CRM/voz.

## Critérios globais de conclusão — 100%

- [ ] As sete fases deste plano estão aceitas por evidência; sem crédito por sessão Jules concluída, proposta não integrada ou teste interrompido.
- [ ] Nenhum dado ausente é apresentado como zero/exato; todo resumo leva à evidência original.
- [ ] Token Firewall reduz payload redundante medido sem perda de qualidade/contexto necessário.
- [ ] Treze áreas têm relatórios claros, JSON técnico opcional, estado vazio/erro/indisponível honesto e navegação acessível.
- [ ] Referências visuais, duas paletas e preferência Light/Dark/System validadas em desktop/mobile.
- [ ] Suite, scan, evals e benchmark final registrados; nenhuma configuração global foi alterada sem autorização específica.

## Skills já disponíveis; uso condicionado à fase

Não reinstalar skills nem duplicar cópias. Usar `ui-ux-pro-max` na Fase 5 antes da implementação visual; `antislop-ui`/`antislop-layoutmobile` durante o refinamento; `accessibility` na construção/validação; `web-design-guidelines` depois; `web-perf` somente diante de trace de navegador genuíno. Skills de comunicação pessoal não alteram UI, código ou conteúdo técnico.

## Histórico e referências locais

- Estado operacional: [`STATUS.md`](STATUS.md).
- Arquitetura e contratos: [`ARCHITECTURE.md`](ARCHITECTURE.md).
- Plano de implementação anterior: [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md), baseline histórico.
- Plano detalhado anterior de dashboard/Token Firewall: [`superpowers/plans/2026-09-23-dashboard-reports-token-firewall.md`](superpowers/plans/2026-09-23-dashboard-reports-token-firewall.md), superseded por este plano; manter como evidência/histórico.
- Design e checklist original do Lumenva: [`archive/`](archive/), snapshots preservados.


