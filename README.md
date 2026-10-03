# VINASIG Agent Standards

A reusable operating standard for VINASIG SI agents, with a repository-scoped Codex adapter and a tested offline snapshot installer.

Version 0.1.0 is a public preview maintained at [VINASIG/agent-standards](https://github.com/VINASIG/agent-standards). Consumers review and pin a snapshot before adoption. `SI` is VINASIG terminology for Super Intelligence. It does not assert a technical capability or an official industry renaming.

[Source and installer CI](https://github.com/VINASIG/agent-standards/actions/workflows/check.yml) and [web fixture CI](https://github.com/VINASIG/agent-standards/actions/workflows/web.yml) provide results for specific commits. See the [publication audit](docs/audits/PUBLICATION.md) for the scope and remaining verification limits.

## What it provides

| Layer       | Purpose                                                     | Location                                                                                                |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Core        | Language, authority, truth, Git, evidence and safe delivery | [policies](policies/core.md)                                                                            |
| Profiles    | Apply only the requirements appropriate to the project      | [core](profiles/core.md), [static web](profiles/web-static.md), [typed web](profiles/web-typescript.md) |
| Skills      | Load a focused procedure when the task needs it             | [skills](skills)                                                                                        |
| Enforcement | Strict source checks, installer tests and browser fixtures  | [configs](configs), [tests](tests), [CI](.github/workflows)                                             |

[standards.json](standards.json) records stable rule IDs, scope, strength, verification, evidence and exception conditions. A policy is not automatically enforceable merely because it is written as MUST. Human visual review and field measurements remain explicit requirements where applicable.

## Quick start

Use Node 24.21.0 and npm 11.19.0, or review a compatible version update first. Browser binaries are needed only for this repository's web verification, not for a core consumer.

```sh
git clone https://github.com/VINASIG/agent-standards.git
cd agent-standards
npm ci --ignore-scripts
npm run check
npm test
npm run verify:quality
npm run build
npm run demo
```

The demo creates disposable consumers under ignored `output/`, imports each profile, checks integrity, reinstalls, updates the profile, rolls back and uninstalls. In each web consumer it also adopts the local checker preset, proves an intentional source defect is rejected, restores the valid source and checks again. It does not modify sibling projects.

To test the browser fixtures:

```sh
npm exec -- playwright install chromium firefox webkit
npm run test:web
npm run test:performance
```

Read [the initial local validation](docs/audits/INITIAL_VALIDATION.md) and [publication audit](docs/audits/PUBLICATION.md) for checks that actually ran. CI artifacts contain generated screenshots; visual review is recorded separately. A workflow definition is not evidence of a successful run.

## Import into a project

1. Review the policies and select `core`, `web-static` or `web-typescript`.
2. Build a bundle from a reviewed source checkout. Record the printed SHA-256 through a trusted review process.
3. Review an `init --dry-run` plan for the explicit target, then apply that same source and profile.
4. Start a fresh Codex session in the consumer repository. Check actual instruction and skill discovery.
5. Adopt the appropriate quality configuration in a separate reviewed change. The installer does not edit `package.json`, existing lint configurations or MCP settings.

```sh
node dist/bundle.js output/bundles/reviewed-0.1.0
node dist/cli.js help
```

The CLI accepts `init`, `update`, `doctor`, `diff`, `rollback` and `uninstall`, with `--dry-run`, `--json`, a required target and a required approved bundle digest for import. [Integration instructions](docs/integration.md) contain runnable PowerShell examples and the conflict/rollback contract.

An import manages a marked region in `AGENTS.md`, `.vinasig/manifest.json`, local policy/config snapshots and selected `.agents/skills/vinasig-*` files. It preserves owner text, detects local edits, rejects symlink boundaries and keeps a backup for every mutation. No runtime package is required to run the compiled CLI. Checksums prove integrity, not authorship or permission.

## Recommended tool stack

- Use Playwright Test with axe for repeatable viewport and task tests. Open screenshots and inspect real interactions as well as automated results.
- Use Lighthouse locally for load-page lab measurements and Chrome DevTools MCP when trace diagnosis is needed.
- Use strict TypeScript or checked JavaScript, typed ESLint, Stylelint, HTML-validate and one formatter.
- Use CSS for simple motion. Add Motion only for a demonstrated need. AI Kit and MotionScore remain optional account-dependent tools.
- Use semantic HTML and accessible task outcomes as the foundation of agent readiness. External scores supplement task evidence.
- Build SEO/AEO/GEO on accurate content and technical search fundamentals. Account dashboards and paid products are optional measurement layers.

[The registry](docs/tool-registry.md) explains versions, costs, accounts, privacy, experimental features and alternatives. [tools.lock.json](tools.lock.json) records versions verified on 2026-10-02. TypeScript 6.0.3 is deliberately retained while the verified newest 7.0.2 is outside the typed ESLint peer range. No consumer is silently upgraded.

## Design and brand sources

- [VINASIG web design system](https://github.com/VINASIG/web-design-system) owns the design specification and requires organization access. Its proposed general direction remains a draft unless a product owner adopts it.
- [VINASIG brand assets](https://github.com/VINASIG/vinasig-brand-assets) owns asset provenance and permissions and requires organization access. This repository redistributes no logos or artwork.
- Space Grotesk is the chosen UI font, Lucide supplies UI icons and Simple Icons supplies suitable third-party marks. Preserve individual font, icon and trademark rights.

[Source synthesis](docs/sources.md) records pinned repository references, conflicts and decisions. [The language policy](policies/language.md) distinguishes Vietnamese user conversation, English technical documentation, product copy and personal websites.

## Contribute and maintain

See [CONTRIBUTING](CONTRIBUTING.md), [SECURITY](SECURITY.md), [community conduct](CODE_OF_CONDUCT.md), [CHANGELOG](CHANGELOG.md), [versioning](docs/versioning.md) and [the license proposal](docs/license-proposal.md).

Maintainer instructions in root `AGENTS.md` govern this repository. They are different from the generated consumer entrypoint. The standard cannot override platform instructions, user authorization, a sandbox or a project's legal obligations.

## License and distribution

The source is publicly readable. Package metadata remains `UNLICENSED` pending an explicit owner license decision; public visibility does not add a general redistribution grant. [The license proposal](docs/license-proposal.md) records the proposed Apache-2.0 grant and separate third-party rights. The package is private in npm metadata and installation uses a reviewed source checkout.

## Repository layout

```text
agent-standards/
  AGENTS.md                 Maintainer instructions
  README.md                 Quick start and scope
  standards.json            31 stable rules
  tools.lock.json           Verified tool versions and boundaries
  policies/                 Core and specialized policies
  profiles/                 Core, static web and typed web
  skills/                   Seven VINASIG SKILL.md packages
  adapters/codex/            Documented Codex integration
  src/                      Offline bundle, installer and CLI
  configs/                  Reviewed enforcement presets
  schemas/                  Rules, manifests, CLI output, reports and evals
  scripts/                  Metadata, quality, demo, performance and Codex checks
  templates/                Evidence/exception and browser helpers
  tests/                    Unit, CLI, browser and eval inputs
    fixtures/               Static JS, typed web, nonweb and negative cases
  docs/                     Sources, registry, decisions, migration and audit
  .github/                  CI, update proposals and contribution templates
  output/                   Ignored local evidence and bundles
  dist/                     Ignored compiled CLI
```
