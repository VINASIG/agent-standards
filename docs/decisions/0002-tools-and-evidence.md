# Decision 0002: a small local verification stack

Status: implemented in 0.1.0, now published as a public preview. Date: 2026-10-02.

## Decision

Use strict TypeScript/checked JavaScript, typed ESLint, Stylelint, HTML-validate and Prettier for source. Use Playwright Test plus axe for browser tasks and responsive regression. Use Lighthouse for repeated lab load measurements. Keep DevTools MCP as an optional diagnosis route, Motion as a conditional implementation choice and commercial/experimental services outside mandatory gates.

This stack is reproducible without a paid scanner or analytics account. It cannot prove every WCAG criterion, aesthetic quality, real-device compatibility, real-user INP, search ranking or arbitrary agent task success. Those need separate evidence and must appear in reports with an honest status.

## Compatibility decision

Official npm registry results on 2026-10-02 showed TypeScript 7.0.2 as the latest stable release and typescript-eslint 8.71.0 declaring TypeScript below 6.1.0. Select TypeScript 6.0.3, the newest verified compatible line, until a separately reviewed linter update and migration allow 7.x. Select Node 24 LTS rather than a larger unsupported default and align Node types to that runtime. Pin dependencies and workflow action commits; one update bot proposes changes without auto-merge.

## Cost and evidence

Fast source/installer checks run on each PR. Related implementation changes trigger browser tests on Windows and Linux. Broad performance/browser audits are available by workflow dispatch or before release. Workflows do not upload results to a public scanner or privileged account. No scheduled automation is enabled outside the repository.

Test results from this machine and proposed remote CI are distinct. A blocked Firefox runtime remains a blocker; passing two other engines does not turn that check into NOT_APPLICABLE.
