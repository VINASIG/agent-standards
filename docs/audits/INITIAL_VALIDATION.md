# Initial local validation

This is the historical audit completed before public GitHub publication. Repository state and remaining checks below describe that initial local run. See [the publication audit](PUBLICATION.md) for subsequent verification.

Date: 2026-10-02. Candidate: 0.1.0, bundle/manifest format 1. Environment: Windows, Node 24.19.0, npm 11.17.0. No independent human reviewer is claimed. This audit covers the standards repository and synthetic consumers; it does not certify sibling VINASIG products.

## Source and environment preparation

The supplied task prompt and all three priority AGENTS sources were read, with pinned references and access routes in [sources](../sources.md). Specialized design, asset and font implementations were inspected. Official current documentation and package registry versions were checked. The package installation used exact pinned development dependencies and `npm install --ignore-scripts`; npm reported zero known vulnerabilities at that installation. This is not a general security certification.

The repository was initialized locally on `main`. It has no remote and no commits. No sibling repository, global Codex configuration, MCP registration, production environment or brand asset archive was modified by this task. The candidate is UNLICENSED pending an owner decision; see [the proposal](../license-proposal.md).

## Executed checks

| Check                                    | Actual result                | Evidence / scope                                                                                                                                                                     |
| ---------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript strict typecheck              | PASS                         | `npm run typecheck`, NodeNext TS with strict indexed/optional checking and checked JS                                                                                                |
| Typed ESLint                             | PASS                         | `npm run lint`, zero warnings, strictTypeChecked                                                                                                                                     |
| Installer, CLI and native metadata tests | PASS                         | 13 Node tests; all three profiles, init/reinstall/update/diff/dry-run/uninstall/rollback, ownership, conflicts, hashes, traversal, junctions, operation lock, schemas and exit codes |
| Quality gate controls                    | PASS                         | Ten positive/negative checks; both JS and TS typed lint pass, and intentional invalid TS/JS, floating Promise, HTML semantics and CSS errors are rejected                            |
| Build                                    | PASS                         | `npm run build`, compiled native-Node installer                                                                                                                                      |
| Three-profile demo                       | PASS                         | Full fixture import lifecycle; package/owner text preserved, no consumer dependency installation                                                                                     |
| Browser regression, Chromium + WebKit    | PASS                         | 36 tests, zero skips/retries/flaky cases; exact matrix below                                                                                                                         |
| Browser regression, Firefox              | NOT_RUN after launch failure | Actual Windows side-by-side runtime failure, including a separate `firefox.exe --version` attempt; no visual test completed                                                          |
| Lighthouse fixture load measurements     | PASS                         | Six local runs, three per mobile/desktop preset, retained settings/reports/assets and median budgets                                                                                 |
| Codex catalog/entrypoint discovery       | PASS for observed catalog    | Fresh CLI session 0.159.0-alpha.12.1 reported the installed profile/version from bootstrapped AGENTS and all seven installed skill names                                             |
| Codex policy/skill body reads            | NOT_RUN                      | CLI execution policy rejected local reads; two valid read routes attempted, no permission bypass                                                                                     |
| Codex behavior classifications           | PASS with limited scope      | Seven simulations classified correctly. Expected answers withheld from prompt. Actual product tasks not executed                                                                     |
| Linux CI                                 | NOT_RUN                      | Windows/Linux workflows are defined and statically checked; no remote repository/run exists                                                                                          |
| Real phones / screen reader / field INP  | NOT_RUN                      | No real-device or assistive-technology session and no authorized telemetry                                                                                                           |

`npm run check` also passed metadata, schema validation, local Markdown links, YAML parsing, namespaced skill metadata, unique rule IDs, pinned workflow actions and formatting. A build pass is not visual proof. Test artifacts are retained in ignored `output/`; deliberate broken sources are retained in `tests/fixtures/broken/`.

## Browser matrix and observed repair loop

Fixture routes:

- `/static/` and `/static/index.html`: real static HTML, CSS and checked JavaScript.
- `/typed/` and `/typed/index.html`: TypeScript source compiled for a local form.
- `/broken/`: intentional negative control, not an accepted product baseline.

Static tests covered 360x800, 390x844, 768x1024, 1024x768, 1440x900, plus 320x900, 519x900, 520x900, 521x900, 600x900, 900x900 and 1280x900. The actual fixture breakpoint is 520 px. Typed tests covered the five mandatory viewports. The same 18-case set completed in Chromium and WebKit, yielding 36 passing tests.

States include default, menu open/closed, invalid email, valid local validation without network submission, dialog open/close, Escape/focus restoration, rapid repeated dialog use, long text, 200% text, reduced motion and below-fold footer. Default/dialog states received axe checks. Bounds and page width were measured; intentional overflow and unnamed-control defects were detected in negative controls. No `force` clicks or private business API were used.

1. The first full run had 21 passes and 33 failures. Three Chromium failures detected overflow at 200% text. DOM bounds showed the native email input's automatic minimum width expanded the form to 473 px at a 360 px viewport. The before image was opened. `min-width: 0` and `width: 100%` on the input fixed the source cause.
2. WebKit's native Tab behavior skipped an implicit link. The skip link became an explicit `tabindex="0"` stop, verified by real key input without forcing test focus.
3. A second run exposed dialog return-focus differences because a pointer click did not focus its opener in WebKit. The fixture now focuses the opener in its actual click handler before `showModal()`. The original focus assertion was preserved.
4. The third run completed all 36 Chromium/WebKit tests. Full-page images retain all below-fold content. Source validation remained strict.

Final browser artifact: `output/responsive/93f01723-a6bd-4ef4-a46b-b70459575f10/`. Pre-repair evidence: `output/responsive/diagnosis/static-360x800-chromium-text200-before.png` and its WebKit counterpart. Early report files written under `tests/output/` are preserved as ignored historical artifacts; the reporter now uses an absolute root output path.

Screenshots generated automatically are distinct from images opened for review. `visual-review.json` in the final browser artifact lists 27 final screenshots actually opened via the primary agent's image tool, plus the Chromium diagnosis before image. Final review covers static default and typed success at all five mandatory viewports in both successful engines, four WebKit mobile states and Chromium 320/519/521 px. The before/after input width, keyboard stop and dialog layout were inspected. No unreviewed screenshot is represented as individually approved, and no independent human review is claimed.

## Performance

Artifact: `output/performance/5da0b5e1-034f-4904-85ab-48c788a35e2d/`. Lighthouse 13.5.0 connected to an owned Playwright-managed HeadlessChrome 153.0.8010.12 on loopback. Each CLI run had a fresh browser profile. The default simulated mobile/desktop settings are saved per run. No public URL or private session was sent to a scan service.

| Profile | LCP values in ms          | Median LCP | CLS / TBT    |
| ------- | ------------------------- | ---------- | ------------ |
| Mobile  | 960.046, 901.836, 901.364 | 901.836 ms | All 0 / 0 ms |
| Desktop | 240.934, 241.450, 240.986 | 240.986 ms | All 0 / 0 ms |

The first launch through the full Chromium executable failed with spawn UNKNOWN. A legitimate local alternative reused the working managed headless browser through the documented debugging port; no runtime/security setting was changed. The harness now uses that route. Results apply only to a small synthetic static fixture. Repeat visits, real interaction latency, animation-frame/FPS diagnosis, real-user INP and production monitoring remain NOT_RUN. No Apple smoothness or 100-point guarantee is inferred.

## Codex smoke and eval

Artifact: `output/codex/d4c22804-e76b-4859-a18c-c5763f0425aa/`. Saved prompt, invocation, structured response, stderr and event stream are local. `scripts/score-codex.ts` can score existing output without another model call. The overall integration result is NOT_RUN because mandatory local-body reading was blocked, despite successful catalog/routing observations.

The CLI ran ephemeral, read-only and with user configuration ignored. No global configuration was changed. Ancestor/global instructions may still apply; this probe is not an independent blind website-agent trial. The prompt withheld expected case answers and requested no simulated task execution. Cases tested routing, scope, owner changes, unknown versions, missing browser, refusal to weaken an assertion and honest unverified reports. All seven selected the expected primary skill and decision; all reported NOT_RUN for their simulated product checks.

The model explicitly reported that it could not verify the manifest or read policy/skill bodies after the execution policy rejected PowerShell and command-shell reads. It was not asked to bypass that policy. The catalog is visible, but deeper body execution cannot be called fully verified. A permitted fresh Codex session is needed to finish that layer.

## Remaining review and execution limits

- License, copyright attribution and public repository/release authorization remain owner decisions.
- Firefox needs a functioning permitted native runtime before visual checks can complete. No whole-machine runtime installation was attempted.
- Remote Windows/Linux CI, a blind website-agent trial, screen-reader/real-device checks and field metrics are not executed results.
- Motion+, paid SEO dashboards, external readiness scanners and account-only data were not connected. WebPageTest docs remain unverified.
- Installer locking and compensating restore are not hostile-process isolation or guaranteed recovery after power loss.

These limits are reported rather than converted to passing baselines or weakened quality gates.

## Final acceptance artifacts

- Combined `npm run check`, native tests, build and ten quality controls passed. The ten-control artifact is `output/quality/17a0363b-a177-4a53-967f-bcab584d8216/`.
- The source checker was adopted in copied JS and TS consumers in `output/demo/743e04a7-6f86-4338-ab8e-48bb542fd45e/`. Each valid consumer passed, rejected a deliberately inserted named type defect, and passed again after its source was repaired. The nonweb fixture required no browser/code tooling. These controlled demonstration edits did not alter an existing user project or weaken any gate.
- The compiled `dist/cli.js` independently completed seven operations in `output/compiled-cli/9fd7314f-b8c3-48ca-a4c5-a9f93ab0825c/`: initial dry-run, install, identical reinstall, doctor, profile update, rollback and uninstall. Owner bytes and package content remained unchanged.
- The final browser rerun again passed 36/36 tests in `output/responsive/c5150c3a-8c25-4627-a310-36ff4f7b3c7b/`. All 27 selected PNGs have exactly the same SHA-256 as the previously opened images. `review-comparison.json` records this correspondence; it does not approve a changed baseline. The last JS change only expanded a void callback into braces to satisfy the strict lint rule.
- `npm audit --json` reported zero known advisories. Browser logs include an inherited environment color warning (`NO_COLOR` with `FORCE_COLOR`), unrelated to source lint or failed assertions.
- The compiled local candidate bundle is `output/bundles/local-candidate-0.1.0/`, with manifest SHA-256 `fd7d58dabe78e32bb56c1f75b69fbd9884cbd781a152af11d268ca380f10a11c`. This is a reviewed local content snapshot, not an owner-approved public release or Git commit. The CLI/policy source still requires normal release review.

Local artifact paths are relative to the standards repository. No remote CI run, public package, organization-wide consumer rollout or independent reviewer is inferred from these results.
