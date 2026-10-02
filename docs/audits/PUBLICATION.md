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

`npm audit --json` also reported zero known advisories. This is advisory evidence for the checked lockfile rather than a general security certification.

## Remote CI and repair loop

Initial public source commit: `a46f663d6efcbf2f8c157e4b16c871df8aa59691`.

- [Source and installer run](https://github.com/VINASIG/agent-standards/actions/runs/37020610166): PASS on both Ubuntu and Windows, including fresh dependency installation, source checks, 13 tests, ten quality controls, build and all three consumer demos. Both evidence artifacts were uploaded.
- [Initial web run](https://github.com/VINASIG/agent-standards/actions/runs/37020610196): Windows browser job PASS; Ubuntu completed 52 cases and failed two, in Firefox and WebKit at 320x900 with 200% text. The document measured 329 px against a 320 px viewport. Performance was intentionally outside this push event's job scope.

The enlarged heading had no emergency word wrapping. Platform font metrics exposed the problem at narrow widths. The fixture now applies `overflow-wrap: anywhere` to `h1`, preserving text, size and normal desktop layout. A new long-heading regression reproduces the same constraint independently of a specific platform font. Enlarged-text screenshots now run before the overflow assertion so a future failure preserves that state.

The new regression failed on both local Chromium and WebKit before repair, measuring a 1060 px document at a 320 px viewport. Before evidence: `output/responsive/5598af80-abb1-46b1-a9c3-b93a24226e0b/`. Both full-page failure screenshots were opened, and one frame from the initial Linux WebKit trace was inspected.

After repair, all 38 local Chromium/WebKit tests passed without retries or skips in `output/responsive/963f7c37-66b1-4356-a984-31740ce88c83/`. Source checks and all ten quality controls passed again. Six after images were opened: long-heading and ordinary 200% text at 320 px, plus 1440 px default, in both local engines. This records actual agent visual review, not independent human approval.

## Revalidation of the repair

Repair source commit: `35fd91a286651a976022a7ae14554269ce83b557`.

- [Source and installer revalidation](https://github.com/VINASIG/agent-standards/actions/runs/37022285868): PASS on Ubuntu and Windows.
- [Browser revalidation](https://github.com/VINASIG/agent-standards/actions/runs/37022285926): PASS on both Ubuntu and Windows, with 57 expected cases per operating system and zero failures, skips or flaky results. Both browser evidence artifacts were uploaded. Performance remains outside this push event's job scope.

The matrix uses Chromium, Firefox and WebKit. Static fixtures cover 360x800, 390x844, 768x1024, 1024x768, 1440x900 and 320/519/520/521/600/900/1280 px intermediate or breakpoint widths. Typed fixtures cover the five mandatory viewports. Existing menu, validation, dialog, focus, reduced-motion, accessibility and negative-control checks remain enabled. The added long-heading case raises the three-engine total from 54 to 57 per operating system.

The completed Linux artifact was downloaded to `output/publication/ubuntu-browser-fixed/`; its report and images are under `9968730c-9696-49d2-86d2-7c2b908ed5d5/`. Seven Linux after images were opened: ordinary 200% text and the long-heading case at 320 px in all three engines, plus the 1440 px Firefox default. These selected images were reviewed separately from the automatic test result; all generated screenshots are not claimed as individually inspected.

The completed Windows artifact was downloaded to `output/publication/windows-browser-fixed/`; its report and images are under `840feff2-961d-4107-b306-15634de189f8/`. Three Windows CI Firefox images were opened: ordinary 200% text and the long-heading case at 320 px, plus the 1440 px default. The publication follow-up inspected 16 after images in total, alongside the two local before screenshots and one historical Linux trace frame.

Anonymous HTTPS access also confirmed public repository metadata and a successful HTTP 200 read of the canonical README. Private vulnerability reporting remained enabled. Generated evidence stays in ignored local output and GitHub CI artifacts rather than the source tree.

The local Firefox runtime blocker and deeper Codex-body execution blocker remain recorded in the initial audit. Successful remote Firefox tests do not repair the local runtime. No production measurements, real-device checks or account-dependent agent execution are inferred from publication.
