# Release Checks and Gates

This document separates automated workflow execution from merge enforcement and from human review. A green run proves that the run completed successfully; it does not prove zero findings or that GitHub blocks merging when a check fails.

## Automated workflows — execution verified

For commit `42385fa0f1c88f2a26387cd8373ec473f56d0fe9` on `main`, these runs completed successfully:

- MCG CI: [run `36139338314`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36139338314).
- Security scanning (Gitleaks, OSV, ZAP jobs): [run `36139338399`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36139338399).
- CodeQL: [run `36139337096`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36139337096).

**Status:** workflow execution is verified for the listed runs only. These runs are not, by themselves, proof that the checks are required branch-protection gates or that their scanners found nothing.

## Merge enforcement — verified absent

- Recent manual checks via the API confirmed that `GET repos/trydavidqix/maestri-context-gateway/rulesets` returned an empty list, and `GET .../branches/main/protection` returned `HTTP 404 Branch not protected`.
- Therefore, there is **no observed enforcement** on the `main` branch. The successful workflow checks listed above are explicitly **not** mandatory gates. Protection against direct or force pushes is absent.

## Findings review — outstanding manual verification

- Review the `zap-baseline-report` and `gitleaks-results.sarif` artifact contents; these were generated during successful workflow executions but their findings remain unverified and unanalyzed in this assessment.
- Review Code-scanning findings (107 total currently grouped by CLI `rule.severity` as 96 error, 10 warning, 1 note) from actual reports/alert views. Do not map these rules to generic GitHub Security Severities (Critical/High) unless natively supported.
- Check current secret-scanning alert counts.
- Record sanitized results only. Never put matched secrets or credential values in reports.

## Remaining Release / Rollback Checks

Before any final release or rollback approval, the following explicit checks must be completed:
1. **Analyze scanning artifacts:** Extract, review, and manually verify the contents of `zap-baseline-report` and `gitleaks-results.sarif`.
2. **Review open code-scanning alerts:** Formally evaluate the 107 open code-scanning alerts for false positives or remediation requirements.
3. **Verify merge enforcement:** Ensure branch-protection rules are actually established and configured if these workflow checks are expected to formally block unverified code (currently they do not).
4. **Determine Dependabot baseline:** Verify the current API assertion of 0 open Dependabot alerts against active project dependencies.

## Available local script — not an enforced gate

`npm run scan:sensitive` is an available local script. Its result is not asserted here, and no evidence shows that it is required by CI or branch protection. Treat it as a manual check unless enforcement is separately verified.

## Provider evaluation — unvalidated

Provider metrics (`task_success`, `context_recall`, `evidence_grounding`, `hallucination_rate`, and `context_tokens`) and token savings have no verified provider-backed baseline in this assessment. Do not claim release readiness based on unavailable metrics. A broader evaluation protocol needs to be established beyond the existing 30-case paired corpus, which must include accurate measurement without metric fabrication.
