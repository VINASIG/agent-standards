# Shared website chrome - 5 October 2026

## Request and cause

The owner requested a review of headers and footers across VINASIG websites and explicitly required agent-standards to protect newly created projects. The live inventory contained nine websites. Layouts had independently chosen logo widths, source-link placement and footer structure. The design-system site had a sidebar identity but no common site footer. Mobile product CSS also overrode shared outer spacing.

## Policy and routing

WEB-009 records the approved shared header/footer contract. The design-system owns presentation and source components. Both web profiles, workflow/responsive skills and the generated consumer AGENTS entrypoint route a new project to templates/web/site-chrome.md before layout implementation. Core consumers retain no web procedure or browser dependency.

The inspector checks one identity header/footer, logo width, preference order/targets/alignment, and ordered localized source/issue/license links. It complements artwork validation and screenshot review. Fixtures are synthetic geometry, not substituted VINASIG artwork. Deliberately broken fixtures prove omissions, wrapping/collision, sizes and destinations are rejected.

## Verification

- Source/type/lint/format/metadata/license checks passed with Node 24.21.0 and npm 11.19.0.
- Nineteen unit/CLI/installer tests passed. New tests verify both web profile entrypoints, exact checklist/helper distribution and unchanged core routing.
- Build passed.
- All 141 browser fixture tests passed on Chromium, Firefox and WebKit on Windows, including six shared-chrome tests. Screenshots were captured for both locales and light/dark fixture states.
- All twelve shared-chrome fixture screenshots were opened and reviewed. They verify geometry only and deliberately contain no brand artwork.
- The ten quality-preset checks passed, including rejection of intentionally broken source. The three-profile installer demo passed.
- An actual prior-source bundle from commit 00fd107bfc651d4eb9cf7f34cf5e0a9f2ee93ee9 was installed with its prior installer into two disposable consumers. The current installer passed dry-run, update, doctor, exact rollback and preservation of owner CRLF instructions/package bytes for both web-static and web-typescript. Evidence is output/site-chrome-migration.json.

## Adoption and rollback

The nine websites adopt project-owned layout source and local guidance. Their existing managed snapshot bytes are preserved. A later standards snapshot rollout must use a reviewed immutable bundle and installer update, with instruction-budget preflight. This source change does not silently update pinned consumers, install UI dependencies or approve unrelated draft design-system proposals.

Keep previous bundles/backups. Rollback a standards installation with its recorded installer backup. Rollback website chrome through the reviewed source revision and rebuild/redeploy within task authorization.

## Limits

CI and published-site verification belong to their exact pushed revisions and are reported separately. Automated fixture checks do not certify actual website visuals, screen readers or physical phones. Consumer audits carry their own browser and screenshot evidence.
