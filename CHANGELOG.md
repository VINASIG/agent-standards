# Changelog

## Licensing policy and distribution - 2026-10-04

- Implement the owner's organization-wide licensing direction. Default software selection is AGPL-3.0-or-later, with purpose-based GPL/LGPL choices, CC BY-SA knowledge, upstream OFL fonts and suitable database licensing.
- Add LIC-001 through LIC-004 for ownership/dependency review, authorization, material scopes, metadata and verified delivery.
- License this offline software under GPL-3.0-or-later and authored policies/skills under CC-BY-SA-4.0. Supersede the earlier unapproved Apache proposal.
- Add a reusable review template and licensing route in every installed AGENTS entrypoint.
- Include full license texts and the scope map in offline bundles and all profiles. Verify exact preservation without relicensing the host or changing its package configuration.
- Record the separate VINASIG Brand Usage Policy and the organization review. Original font/artwork bytes and third-party rights are preserved.
- Preserve publisher license text verbatim, including its final blank line. Limit the Git whitespace exception to legal text paths and verify exact SHA-256 instead. Source formatting and behavior gates remain intact.

## Transparent header clarification - 2026-10-04

- Record the owner's approval for original transparent header lockups matched to the actual surface under WEB-001.
- Reject padded or rounded logo cards, altered artwork and live-text reconstructions. Keep original bytes and a usable link target.
- Add positive and negative rendered-header regressions for variant selection, geometry and presentation.
- Compare declared and rendered header geometry with the reviewed SVG viewBox. Percentage-sized SVG fallback dimensions are rounded differently across engines. Keep distortion checks without changing artwork or adding workflow network requests.
- Detect authored round bullet characters as well as default list markers under LANG-004.
- Clarify WEB-008 for styled initial HTML and script-unavailable states after real QR and design-system regressions exposed native popup fallbacks.
- Surface the approved header rule in the installer entrypoint and responsive skill. Unrelated design recommendations remain proposals.

## Interface rules clarification - 2026-10-03

- Make visible punctuation, sentence case and custom list markers mandatory under LANG-004.
- Add LANG-005 for ordinary-reader language, meaningful units and natural optional-field labels.
- Add WEB-008 for styled open and closed dropdown, calendar, color and slider controls across supported engines.
- Preserve required notation and user input through narrow semantic annotations rather than page-wide exceptions.
- Add a reusable rendered-interface inspector and positive/negative browser regressions.
- Surface the rules in the installed root entrypoint and implementation/responsive skills.
- The owner requested adoption across VINASIG repositories. This clarification does not approve unrelated draft design proposals.

## 0.1.0 public preview - 2026-10-02

- Add scoped core/web policies, stable rule metadata and seven namespaced skills.
- Add an offline, pinned snapshot installer with dry-run, integrity checks, conflicts, operation backups, update, rollback and uninstall.
- Add checked-JavaScript, TypeScript and nonweb fixtures, strict source gates and browser regression helpers.
- Add dated source synthesis, tool choices, Codex routing, versioning, safe reporting and review templates.
- Reconcile HTML-validate formatting with Prettier using its official compatibility preset while preserving semantic errors.
- Fix the static fixture's input minimum width at 200% text sizing and make its skip link an explicit keyboard stop for WebKit.
- Keep dialog focus restoration consistent across engines and preserve the focus assertion.
- Publish the source under `VINASIG/agent-standards`, add canonical repository metadata and document source-based adoption.
- Add public contribution routes and private vulnerability reporting.
- Preserve the initial local audit and record publication verification separately.
- Fix heading reflow at 320 px and 200% text sizing across platform fonts; add a long-heading regression and capture enlarged-text evidence before assertions.

This is a public source preview without a tagged release or npm package. [The publication audit](docs/audits/PUBLICATION.md) records historical checks and remaining verification limits. [LICENSES.md](LICENSES.md) records the owner's later licensing decision.
