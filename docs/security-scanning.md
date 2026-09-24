# Varredura de segurança

## O que roda

- **CodeQL default setup**: análise de JavaScript/TypeScript gerenciada pelo GitHub em pull requests e semanalmente.
- **Semgrep Community Edition**: análise estática; resultados SARIF aparecem em Security → Code scanning.
- **Gitleaks**: procura credenciais no histórico Git; o workflow é informativo e não comenta no PR.
- **OSV-Scanner**: confere dependências/lockfiles com a base OSV; o workflow é informativo.
- **Dependabot**: verifica dependências npm e GitHub Actions semanalmente e abre PRs agrupados.
- **`scripts/scan-sensitive.mjs`**: continua no CI principal como verificação de dados sensíveis e caminhos.

Os novos scanners começam em modo **report-only**: achados geram relatórios, mas não bloqueiam o CI enquanto a linha de base e falsos positivos não forem revisados. Não ignore nem exponha tokens encontrados; revogue e rotacione credenciais reais.

## DAST com ZAP

O workflow executa o **ZAP Baseline/passive scan** contra o dashboard do próprio MCG, iniciado em `127.0.0.1:7435` no runner hospedado pelo GitHub e com `MCG_ROOT` temporário. O alvo só aceita `GET`; o container não recebe tokens ou secrets. A imagem ZAP e as Actions usadas são fixadas por digest/SHA, os relatórios HTML/JSON são artefatos temporários por 14 dias e os achados são informativos (`report-only`). Isso não instala Docker no Windows: a execução usa o Docker já disponível no runner hospedado.

O baseline usa spider/passive checks e não executa active scan. Não rode active scan contra produção ou um host externo sem autorização específica. Uma futura varredura autenticada/de produção exige um staging autorizado e um environment protegido no GitHub.

## Fuzzing

O GitHub Actions executa **Jazzer.js** no `src/redaction.mjs`, com 30 segundos por PR e 120 segundos na execução semanal, e só envia artefatos de crash se houver falha. O pacote fica travado no lockfile e o workflow usa permissões mínimas; não instala Docker no Windows.

O alvo atual valida redaction estruturada/textual de credenciais, não substitui fuzzing de todos os módulos. ClusterFuzzLite exige integração de build libFuzzer/container e a lista oficial atual de linguagens não inclui JavaScript; o OSS-Fuzz aceita JavaScript via Jazzer.js, mas requer uma integração e aprovação no serviço upstream. Não declarar esses serviços como ativos até essa submissão ser aceita.

## Operação

Use Actions → Security scanning para consultar as execuções e Security → Code scanning para findings CodeQL/Semgrep. Faça triagem dos achados; só depois de estabelecer uma linha de base estável transforme checks específicos em gates obrigatórios. Secret Scanning e Push Protection do GitHub permanecem habilitados.
