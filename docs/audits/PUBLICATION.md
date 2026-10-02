# Public preview publication

Date: 2026-10-02. Version: 0.1.0. Repository: [VINASIG/agent-standards](https://github.com/VINASIG/agent-standards).

The owner authorized standardization and public GitHub publication. This audit records that follow-up to [initial local validation](INITIAL_VALIDATION.md). Initial local limitations remain historical observations rather than newly claimed results.

## Publication scope

- Publish this repository's source on `main` with public visibility.
- Standardize canonical GitHub metadata, clone instructions, public contribution routes and preview status.
- Enable GitHub private vulnerability reporting and link its actual private submission route.
- Keep generated bundles, browser binaries, dependencies, compiled output, local logs and account-dependent Codex transcripts under ignored local artifact paths.
- Preserve the original source synthesis, strict gates, 31 rule IDs, three profiles, seven skills and installer contract.
- Retain `UNLICENSED` package metadata until a specific owner license decision. Public source publication does not approve a tagged release, npm package or organization-wide consumer rollout.

## Verification record

The following checks ran again after public-preview documentation, metadata and schema changes on Windows with Node 24.19.0 and npm 11.17.0:

| Check                           | Actual result                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `npm run check`                 | PASS: strict typecheck, zero-warning lint, schemas/links/metadata and formatting |
| `npm test`                      | PASS: 13 tests, no skips                                                         |
| `npm run verify:quality`        | PASS: ten positive and negative controls                                         |
| `npm run build`                 | PASS: compiled CLI                                                               |
| `npm run demo`                  | PASS: all three profiles, complete import lifecycle and web consumer enforcement |
| Repository visibility           | PUBLIC, verified through GitHub repository metadata                              |
| Private vulnerability reporting | Enabled, verified through GitHub API                                             |

Local quality artifact: `output/quality/e9538446-6421-48a8-a94b-c8ca3f061455/`. Demo artifact: `output/demo/7087e143-92ed-4ec1-9ae8-1e2f22aab95a/`; manifest SHA-256: `ad5dcbe4601a9a3668d3433330a582e6d780b8f2527e1dcc8cfbb93f8f264870`. These paths remain ignored local evidence.

Remote CI verification is pending the first source push. Workflow definitions alone are not passing evidence. The current local browser and Codex limitations are detailed in the initial audit. Publishing changes do not claim new visual review, production measurements, real-device checks or account-dependent agent execution.
