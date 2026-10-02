# Codex adapter

This adapter uses the officially documented instruction and skill discovery mechanisms, verified on 2026-10-02.

## Instruction discovery

Codex reads the first nonempty global instruction file, preferring `AGENTS.override.md` to `AGENTS.md`. Within a project it walks from the repository root to the working directory, selects at most one instruction file per directory, prefers the override, then `AGENTS.md`, then configured fallback names. Later, more specific guidance is appended. The default combined document limit is 32 KiB. See [the official guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

The installer writes a short marked consumer entrypoint into the root `AGENTS.md`. It directs the agent to local policy/profile files appropriate to the current task. It does not claim that URLs, a submodule or arbitrary Markdown are loaded automatically. An override or more specific local guide must be inspected when resolving conflicting instructions.

Use this repository's root `AGENTS.md` only when maintaining the standard itself. Never copy that maintainer guide wholesale into consumers.

## Skill discovery and routing

The current official mechanism scans repository `.agents/skills/` directories from the working directory to the repository root. Skills have a `SKILL.md` containing `name` and `description` frontmatter; bodies are loaded when selected. Duplicate names do not merge safely. See [the official skills documentation](https://learn.chatgpt.com/docs/build-skills).

The installer copies namespaced skills as real files, without depending on symlink support. Core imports only `$vinasig-workflow` and `$vinasig-dependencies`; web profiles add responsive, motion, search, performance and agent-readiness skills. Their descriptions explain when to use them. An explicit invocation provides a reliable way to request a procedure, but a name is not evidence that it was discovered. Start a fresh session after import and verify the available names and selected policy paths.

Plugin packaging is a possible later distribution adapter. The first release uses a directly testable repository-scoped layout and does not invent a plugin manifest.

## Optional browser driver and MCP

Choose one available browser-control route for interactive investigation: an existing integrated browser, Playwright CLI/skills, Playwright MCP or an appropriate existing driver. Playwright Test remains the repeatable regression runner. Do not register several browser drivers for the same task just because they exist.

Chrome DevTools MCP can diagnose traces and runtime/network issues when available. Review its package, data exposure and pinned version before opt-in setup. The server's usage statistics are enabled by default. The verified flags `--no-usage-statistics`, `--no-performance-crux` and `--isolated` reduce unnecessary sharing and session exposure; they do not make visited sites harmless. Read [the upstream README](https://github.com/ChromeDevTools/chrome-devtools-mcp).

Project `.codex/config.toml` is a documented configuration location but is loaded only for trusted projects. Setup must be explicit; do not write global `~/.codex` files or import credentials. [Official MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) governs the current schema. Pin a reviewed server package locally or to an exact version, rather than running a floating `@latest` command during every session. No MCP configuration is silently installed by this adapter.

## Verify actual discovery

Use a temporary consumer, a new Codex session and an innocuous task. Ask it to report the installed policy version, profile and available VINASIG skill names, then explicitly invoke a scoped skill. Save the prompt, CLI version, instruction path evidence, result and exit code. If a session cannot be started or has inherited extra context, report the limitation. `doctor` is a static file-integrity check, not this smoke test.

The initial local run and its limits are recorded in [the audit](../../docs/audits/INITIAL_VALIDATION.md). Tests in the parent agent are not an independent blind website-agent evaluation.

From this repository, with a verified existing CLI on PATH, the optional PowerShell runner is:

```powershell
$env:VINASIG_CODEX_EXE = (Get-Command codex.exe -ErrorAction Stop).Source
npm run eval:codex
```

If it is not on PATH, supply the confirmed executable path through that task-specific environment variable. This runner uses the existing authenticated account, can consume model usage and runs read-only/ephemeral; it is intentionally excluded from account-free CI. Policy rejection is reported, not bypassed. The classifications are constrained simulations rather than an unconstrained honesty or task-execution benchmark.
