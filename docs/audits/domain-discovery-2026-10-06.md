# Domain and discovery handoff clarification

## Owner request and policy decision

The owner requested a completion-stage proposal for Cloudflare DNS and Google Search Console setup when finishing a project. SEARCH-001 already covered technical indexing checks, but the generated project entrypoint and workflow did not require a concrete domain/discovery handoff. An agent could finish source work without proposing a missing domain or sitemap submission.

SEARCH-003 closes that routing gap for a new public VINASIG website, launch, canonical-host/hosting change or DNS/discovery repair. It requires a scoped review and useful proposal, not an automatic account mutation. Healthy existing setup is retained. An ordinary update on an unchanged working domain does not require repeated submissions. Non-web, private and deliberately non-indexable work has a stated NOT_APPLICABLE outcome.

The owner-provided Cloudflare zone and Search Console domain-property links are kept in the web checklist as navigation aids. They are not credentials, proof of account access or permission to execute a change. The checklist records concrete DNS fields, hosting dependencies, actual HTTPS/sitemap responses, pending access and separate submitted/fetched/indexed observations. Existing task authorization persists.

## Changed routing

- `policies/search.md` and `standards.json` define SEARCH-003 as an agent-reviewed public-web rule. There is no claim of automatic enforcement or guaranteed Google indexing.
- `templates/web/domain-discovery.md` contains the detailed procedure and provider references.
- Both web profiles, workflow/search skills and generated web AGENTS entrypoints route the completion task to the checklist.
- The publication checklist, README, integration guide, maintainer AGENTS and tool registry make the route discoverable.
- Core-only generated entrypoint and template selection retain their existing branches. The workflow shared with core applies the procedure conditionally through an adopted web profile.

No browser implementation, package dependency, hosting configuration, DNS record, sitemap submission or scheduled follow-up is added by this source change. The bundle and installer remain offline.

## Local evidence

| Check                                           | Observation                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                                 | PASS: type checking, typed ESLint, metadata/schema/relative links, formatting and licensing. The metadata validator reports 41 rules and seven skills.                                                                                                                                                        |
| `npm run build`                                 | PASS: compiled offline CLI and entrypoint generator.                                                                                                                                                                                                                                                          |
| Generated instruction artifacts                 | Reviewed generated core, static-web and typed-web entrypoints. Web variants contain SEARCH-003 and the checklist path; core contains neither. Sizes are 1,740, 3,507 and 3,515 bytes respectively, below the unchanged 8 KiB limit. These sizes describe generated blocks, not arbitrary consumer owner text. |
| Offline source bundle                           | Built for review under ignored output. The payload contains the new policy/checklist and updated routing. Bundle SHA-256 is `b56acb9626e7b1cb51ea15591f9779dd36f0f7216acb2830c2cce71e829d7c62`. This identifies local content, not a tag or published release.                                                |
| Skill-creator `quick_validate.py`               | NOT_RUN beyond dependency loading: both available Python runtimes lacked PyYAML. No global package installation or validator weakening was performed. The repository's native metadata gate validated all skill frontmatter and resolved reference paths successfully.                                        |
| Local test suites and new consumer installation | NOT_RUN for this policy/routing update; no tests were added. Existing source CI results belong to their eventual exact commit and are recorded separately.                                                                                                                                                    |
| DNS/Search Console execution                    | NOT_RUN: this task updates agent behavior. No account session, live configuration or indexing result is claimed.                                                                                                                                                                                              |
| Fresh Codex instruction discovery               | NOT_RUN. Generating a block and verifying packaged files does not prove what a fresh Codex session loaded.                                                                                                                                                                                                    |

Ignored local review artifacts are under `output/domain-discovery-2026-10-06/`. The generic root AGENTS instructions are maintainer guidance; consumer instructions come from the installer.

## Adoption and rollback

This is an owner-requested mandatory preview clarification. New web consumers must import a reviewed updated snapshot to receive it. Existing pinned consumers do not change automatically. Review an installer `diff` and `update --dry-run`, the payload digest and the complete root instruction budget before a scoped adoption. Preserve owner text and the prior installer backup. Do not edit managed snapshot bytes by hand or silently roll out the change to sibling repositories.

The bundle format and package version remain unchanged. A tag, npm publication or consumer rollout is a separate action under the existing authorization contract. Restore a consumer through its recorded installer rollback operation and retain its previous approved bundle. No permission for production DNS or Google submissions follows from importing the policy.

## Official references reviewed

- [Cloudflare record management](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/) for record fields and dashboard operations.
- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) for hosting-first setup, CNAME targets and branch versus Actions deployment behavior.
- [Google sitemap creation/submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) for canonical absolute URLs and the limits of submission.
- [Search Console sitemap reports](https://support.google.com/webmasters/answer/7451001?hl=en) for observed fetch status, resubmission and the distinction between discovered and indexed URLs.
