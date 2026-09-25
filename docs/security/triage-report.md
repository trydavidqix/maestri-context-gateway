# Security Triage Report

## Scope and source

- Repository: `trydavidqix/maestri-context-gateway`
- Assessed revision: `249cb391cd51c235f2489ffbb6f858c82774c336` (`main`)
- Assessment date: 2026-09-25
- This report records workflow execution evidence. A successful workflow is not evidence of zero findings.

## Workflow execution

The following GitHub Actions runs were verified as completed successfully for the assessed revision:

| Check | Run | Result | Evidence |
|---|---:|---|---|
| MCG gates / CI | `36053933244` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053933244) |
| Security scanning | `36053933334` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053933334) |
| Security fuzzing | `36053933382` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053933382) |
| CodeQL | `36053931376` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053931376) |
| Dependabot update workflow | `36054081917` | completed / success | [run](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36054081917) |

The execution results establish that those workflow runs completed successfully on the assessed SHA. They do not establish that the checks are required for merging, that scanners reported zero findings, or that the repository has zero open security alerts.

## Artifacts and findings

The Security Scanning run lists these artifacts:

- `zap-baseline-report`, artifact `10832325064`.
- `gitleaks-results.sarif`, artifact `10832130272`.

The archives were retrieved during triage, but their finding contents were not parsed or independently reviewed for this report. ZAP findings, Gitleaks match counts, OSV findings, CodeQL alert counts, and Dependabot alert counts therefore remain **unverified**. No clean-scan or zero-alert claim is made. Do not copy raw secret matches into this report; if Gitleaks findings are reviewed, record only sanitized counts and identifiers.

## Evaluation and provider metrics

Provider-backed metrics (`task_success`, `context_recall`, `evidence_grounding`, `hallucination_rate`, and `context_tokens`) and token savings are **unavailable / unvalidated** in the evidence inspected for this report. No provider-backed evaluation was run as part of this triage.

## Limits

- The latest successful runs listed above are historical evidence for the exact SHA, not evidence about later commits.
- GitHub's repository-rulesets endpoint returned an empty list. The branch-protection endpoint for `main` returned HTTP 403 to the connected integration. Required-check enforcement on `main` could not be verified.
- No active DAST scan was run.
