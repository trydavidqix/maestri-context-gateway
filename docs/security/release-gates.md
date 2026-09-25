# Release Checks and Gates

This document separates automated workflow execution from merge enforcement and from human review. A green run proves that the run completed successfully; it does not prove zero findings or that GitHub blocks merging when a check fails.

## Automated workflows — execution verified

For commit `249cb391cd51c235f2489ffbb6f858c82774c336` on `main`, these runs completed successfully:

- MCG CI: [run `36053933244`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053933244).
- Security scanning (Gitleaks, OSV, ZAP jobs): [run `36053933334`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053933334).
- Security fuzzing: [run `36053933382`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053933382).
- CodeQL: [run `36053931376`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36053931376).
- Dependabot update workflow: [run `36054081917`](https://github.com/trydavidqix/maestri-context-gateway/actions/runs/36054081917).

**Status:** workflow execution is verified for the listed runs only. These runs are not, by themselves, proof that the checks are required branch-protection gates or that their scanners found nothing.

## Merge enforcement — unverified

- The repository rulesets API returned an empty list at assessment time.
- The connected integration received HTTP 403 when reading `main` branch protection.
- Therefore, required-check enforcement, required pull requests, and protection against direct or force pushes are **unverified**. Do not label the checks above “enforced” until an authorized read of the effective ruleset/branch-protection configuration confirms it.

## Findings review — outstanding manual verification

- Review the ZAP report and Gitleaks SARIF artifact contents; archives were retrieved but their findings were not analyzed in this assessment.
- Review OSV and CodeQL findings from their actual reports/alert views.
- Check current Dependabot and secret-scanning alert counts. A successful Dependabot update workflow does not show whether alerts remain open.
- Record sanitized results only. Never put matched secrets or credential values in reports.

## Available local script — not an enforced gate

`npm run scan:sensitive` is an available local script. Its result is not asserted here, and no evidence shows that it is required by CI or branch protection. Treat it as a manual check unless enforcement is separately verified.

## Provider evaluation — unvalidated

Provider metrics (`task_success`, `context_recall`, `evidence_grounding`, `hallucination_rate`, and `context_tokens`) and token savings have no verified provider-backed baseline in this assessment. Do not claim release readiness based on unavailable metrics.
