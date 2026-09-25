# Security Triage Report

## Scope and source

- Repository: `trydavidqix/maestri-context-gateway`
- Assessed revision: `42385fa0f1c88f2a26387cd8373ec473f56d0fe9` (`main`)
- Assessment date: 2026-09-25
- This report records workflow execution evidence. A successful workflow is not evidence of zero findings.

## Workflow execution

The following GitHub Actions runs were verified as completed successfully for the assessed revision:

| Check | Run | Result | Evidence |
|---|---:|---|---|
| MCG gates / CI | `36139338314` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36139338314) |
| Security scanning | `36139338399` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36139338399) |
| CodeQL | `36139337096` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36139337096) |

The execution results establish that those workflow runs completed successfully on the assessed SHA. They do not establish that the checks are required for merging, that scanners reported zero findings, or that the repository has zero open security alerts.

## Artifacts and findings

The contents of the scanning artifacts generated during run `36139338399` were examined for the current `main` SHA, revealing the following results:
- **Gitleaks:** Reportou 0 detecções. *Note that Gitleaks is not a mandatory CI blocker.*
- **OSV-Scanner:** Reportou 0 dependências vulneráveis.
- **ZAP:** Fez uma verificação básica apenas na dashboard local e apontou cabeçalhos de segurança ausentes, além de um alerta de possível XSS no parâmetro `view` que não foi confirmado.

### Known Evidence Leads
- Dependabot API returned exactly **0 open alerts**.
- Code-scanning API pagination showed open alerts; the first 100-page query returned **107 total open code-scanning alerts**. Based on CLI `rule.severity` buckets, these are broken down as:
  - Error: 96
  - Warning: 10
  - Note: 1
  *(Note: These are `rule.severity` labels from the scanning tool, not GitHub Security severity levels, as the field does not natively support those mappings. They must not be relabeled as Critical/High.)*

## Evaluation and provider metrics

Provider-backed metrics (`task_success`, `context_recall`, `evidence_grounding`, `hallucination_rate`, and `context_tokens`) and token savings are **unavailable / unvalidated** in the evidence inspected for this report.
A broader evaluation protocol beyond the existing 30-case paired corpus needs to be implemented to properly measure these indicators. No provider-backed evaluation was run as part of this triage, and no live provider calls were executed or metrics fabricated.

## Limits

- The latest successful runs listed above are historical evidence for the exact SHA, not evidence about later commits.
- A human-verified check via `gh` on Windows API confirmed that `GET repos/trydavidqix/maestri-context-gateway/rulesets` returned no rulesets, and `GET .../branches/main/protection` returned HTTP 404 `Branch not protected`. **Therefore, there is no observed enforcement; the successful checks are not mandatory gates.**
- No active DAST scan was run against live services. No automated findings were closed or mutated.
- **Important Disclaimer:** The specific artifact findings mentioned above (such as 0 detections from Gitleaks and OSV) do not prove overall security and do not cover production environments.
