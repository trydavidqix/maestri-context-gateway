# Release Checks and Gates

This document separates automated workflow execution from merge enforcement and from human review. A green run proves that the run completed successfully; it does not prove zero findings or that GitHub blocks merging when a check fails.

## Automated workflows — execution verified

For commit `42385fa0f1c88f2a26387cd8373ec473f56d0fe9` on `main`, these runs completed successfully:

- MCG CI: [run `36139338314`](https://github.com/trydavidqix/nexus-brain/actions/runs/36139338314).
- Security scanning (Gitleaks, OSV, ZAP jobs): [run `36139338399`](https://github.com/trydavidqix/nexus-brain/actions/runs/36139338399).
- CodeQL: [run `36139337096`](https://github.com/trydavidqix/nexus-brain/actions/runs/36139337096).

**Status:** workflow execution is verified for the listed runs only. These runs are not, by themselves, proof that the checks are required branch-protection gates or that their scanners found nothing.

## Merge enforcement — verified absent

- Historical manual checks queried `GET repos/trydavidqix/nexus-brain/rulesets` (then named `maestri-context-gateway`) and found an empty list; `GET .../branches/main/protection` returned `HTTP 404 Branch not protected`.
- Therefore, there is **no observed enforcement** on the `main` branch. The successful workflow checks listed above are explicitly **not** mandatory gates (including Gitleaks, which is not a mandatory CI blocker). Protection against direct or force pushes is absent.

## Findings review — recent manual verification

Artifact contents for the assessed SHA revealed:
- **Gitleaks:** Reportou 0 detecções.
- **OSV-Scanner:** Reportou 0 dependências vulneráveis.
- **ZAP:** Fez uma verificação básica apenas na dashboard local e apontou cabeçalhos de segurança ausentes, além de um alerta de possível XSS no parâmetro `view` que não foi confirmado.

*These findings do not prove general overall security and do not cover production.*

Other findings:
- Code-scanning findings (107 total currently grouped by CLI `rule.severity` as 96 error, 10 warning, 1 note) remain open. These are rule severities, not generic GitHub Security Severities.
- 0 open Dependabot alerts against active project dependencies.

## Remaining Release / Rollback Checks

Before any final release or rollback approval, the following explicit checks must be completed:
1. **Review open code-scanning alerts:** Formally evaluate the 107 open code-scanning alerts for false positives or remediation requirements.
2. **Verify merge enforcement:** Ensure branch-protection rules are actually established and configured if these workflow checks are expected to formally block unverified code.

### Rollback Process

If a critical issue is discovered post-release that necessitates a rollback, follow these concrete steps:
1. Identifique o último SHA estável (ex: `git log` para encontrar a tag ou commit anterior ao lançamento defeituoso).
2. Execute `git revert <commit_defeituoso>` para criar um novo commit revertendo as alterações, ou recrie a tag de publicação sobre um commit anterior limpo.
3. Se a infraestrutura externa ou registro de pacotes (NPM) já tiverem absorvido o pacote, publique uma versão "patch" de correção que simplesmente espelhe o código anterior ou utilize a funcionalidade de "deprecate" no registro.
4. Documente no `docs/STATUS.md` a reversão e garanta que todos os testes passem (via `pnpm test`) no novo commit.

## Available local script — not an enforced gate

`npm run scan:sensitive` is an available local script. Its result is not asserted here, and no evidence shows that it is required by CI or branch protection. Treat it as a manual check unless enforcement is separately verified.

## Provider evaluation — unvalidated

Provider metrics (`task_success`, `context_recall`, `evidence_grounding`, `hallucination_rate`, and `context_tokens`) and token savings have no verified provider-backed baseline in this assessment. Do not claim release readiness based on unavailable metrics. A broader evaluation protocol needs to be established beyond the existing 30-case paired corpus, which must include accurate measurement without metric fabrication.
