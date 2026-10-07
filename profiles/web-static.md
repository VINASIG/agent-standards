# Static web profile

WEB-010 and `templates/web/ui-contract.md` are the common visible-change completion gate. Declare the product state matrix, map each reported defect to its regression and opened image, and repeat affected deployed states. A build and a default-mode screenshot cannot approve untested modes or interactions.

Extends [core](core.md). Use for HTML/CSS/JS and static generators such as Astro. Keep the existing stack and package manager. Avoid adding runtime JavaScript or a framework for presentational changes.

Read web policy for UI, plus motion, search, performance or agent-readiness policy when the task concerns that subject. Adopt local font/assets through the project's own base-path-aware build and record source versions. Use strict JS/JSDoc, Stylelint and generated HTML checks where compatible. A generator's official checker still applies.

Browser gates run against the production preview or an explicitly approved local server. Use the Playwright templates as helpers within existing infrastructure, and add project-specific routes/states/business assertions. The baseline alone is incomplete. Run keyboard and screenshot review as well as automated checks.

Configs under the snapshot are opt-in presets. They do not replace a consumer's existing ESLint/tsconfig/package files automatically. Install only the chosen development tools with the existing package manager and lockfile. See integration for the tested wrapper pattern.

New VINASIG websites apply WEB-009 before creating layouts. Read `templates/web/site-chrome.md`, reuse the reviewed shared source and add header/footer regressions within the existing browser infrastructure.

Before a new public website handoff, launch, host change or DNS/discovery repair, apply SEARCH-003 and read `templates/web/domain-discovery.md`. Review domain/DNS, live HTTPS and sitemap, then propose missing Cloudflare DNS or Search Console setup within task authorization. Keep already-correct setup and distinguish submission from indexing.
