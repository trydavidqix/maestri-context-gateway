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

OSS-Fuzz/ClusterFuzzLite não foram adicionados: os projetos dependem de Docker e não há alvo de fuzzing nativo definido neste repositório. Não instale Docker para habilitá-los.

## Operação

Use Actions → Security scanning para consultar as execuções e Security → Code scanning para findings CodeQL/Semgrep. Faça triagem dos achados; só depois de estabelecer uma linha de base estável transforme checks específicos em gates obrigatórios. Secret Scanning e Push Protection do GitHub permanecem habilitados.
