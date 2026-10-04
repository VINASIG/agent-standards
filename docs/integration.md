# Integration contract

The default distribution is a reviewed, immutable local snapshot. Network access is not needed after a bundle and the compiled CLI are available. Do not pull `main` automatically during an agent session.

## Build and inspect a bundle

From this repository, in PowerShell:

```powershell
npm run build
$taskBundle = node dist/bundle.js output/bundles/reviewed-0.1.0 | ConvertFrom-Json
$taskBundle | Format-List
```

The output contains `path` and `sha256`. The digest covers `bundle.json`, which in turn contains the SHA-256 of every payload file. `source.ref` is a content snapshot digest, explicitly identified by `source.kind`. A local uncommitted candidate is not presented as a Git release or commit. A public release must also record its reviewed source commit, tag and published digest through a trusted channel.

Compare the source, file list and digest against the reviewed source or release record before approval. Downloading both bytes and a digest from an untrusted location does not establish trust. Creating an existing bundle directory fails rather than replacing it.

## Preview and install

The target must already exist. Set it to the consumer's actual repository root. The sample below does not choose or create a production project for you.

```powershell
$taskTarget = (Resolve-Path ../my-project).Path
$approvedSha256 = $taskBundle.sha256 # Only after source and digest review
node dist/cli.js init --target $taskTarget --bundle $taskBundle.path --sha256 $approvedSha256 --profile web-static --dry-run --json
node dist/cli.js init --target $taskTarget --bundle $taskBundle.path --sha256 $approvedSha256 --profile web-static --json
node dist/cli.js doctor --target $taskTarget --json
```

Use `core` for a CLI, library, service or documentation repository. Use `web-typescript` for a typed web project. A profile selects policy and skill files; it does not convert the project, install packages or impose an untested framework configuration.

The generated `AGENTS.md` block gives core instructions and paths to read for the selected task. Markdown links are routing instructions, not a Codex import syntax. Skills are copied to `.agents/skills/` using their VINASIG namespace. Start a fresh session to discover newly installed skills.

Every profile also receives LICENSE, LICENSES.md, the CC BY-SA text, the licensing policy and review template. GPL covers executable snapshot code/configuration and CC BY-SA covers policy/skill prose. Preserve those grants and attribution when copying the snapshot. Importing it alone does not relicense the host project. Review actual integration of executable code under the applicable software terms.

The root instruction budget is conservatively limited to 8 KiB. The current documented Codex default is 32 KiB for the combined instruction chain, including other guidance. Inspect ancestors, directory-specific guides and global configuration if the actual chain is too large. The installer does not increase a global limit. A root `AGENTS.override.md` causes a conflict because it shadows the generated `AGENTS.md`; resolve that routing explicitly before installing.

## Owned and unowned content

Owned content:

- One `<!-- VINASIG STANDARDS BEGIN -->` through `<!-- VINASIG STANDARDS END -->` block.
- `.vinasig/manifest.json` and the files enumerated in it.
- Operation backups in `.vinasig/backups/`, which remain available after uninstall.

Unowned content includes the rest of `AGENTS.md`, package manifests, owner lint settings, `.codex/config.toml`, Git configuration and unrelated skills. No automatic merge or overwrite is attempted for a modified owned file. Copy a proposed local improvement into an owner policy or submit a standards change, then reconcile the owned snapshot explicitly. There is no force flag that bypasses conflicts.

The installer checks every path component for symlinks or junctions, prohibits traversal, checks payload digests and rechecks planned bytes before mutation. It uses an exclusive operation lock and a compensating restore if an ordinary write fails. It is not a security boundary against a malicious process with concurrent write access, and it is not guaranteed to recover automatically from power loss. Keep normal repository backups. Local backup files must be protected as trusted recovery material; do not import arbitrary backups.

Only owned files are removed. Empty managed directories and backup history may remain. No recursive deletion is performed. Outside `AGENTS.md` text is preserved exactly, including CRLF and files without a final newline. Avoid manually reformatting the marked block. For version-controlled snapshots, review LF behavior in `.gitattributes`; this CLI does not rewrite owner line-ending rules.

If the owner later configured a linter/typechecker to extend a snapshot preset, migrate that owner configuration before uninstalling its referenced preset. Those files are outside installer ownership and are deliberately preserved. The CLI does not silently rewrite such references.

## Reinstall, update, diff and rollback

Reinstalling the same approved bundle/profile is a no-op. A different version or profile requires `update`. First build a new, separately reviewed bundle in a new directory.

```powershell
node dist/cli.js diff --target $taskTarget --bundle $nextBundle.path --sha256 $nextApprovedSha256 --profile web-typescript --json
node dist/cli.js update --target $taskTarget --bundle $nextBundle.path --sha256 $nextApprovedSha256 --profile web-typescript --dry-run --json
node dist/cli.js update --target $taskTarget --bundle $nextBundle.path --sha256 $nextApprovedSha256 --profile web-typescript --json
```

`diff` requires an existing installation and never mutates it. Use `init --dry-run` for an initial preview. Output includes the managed file text before/after, instruction block before/after, paths and, after mutation, a backup UUID. Review the migration guide and impact on consumer checks separately from snapshot installation.

```powershell
node dist/cli.js rollback --target $taskTarget --backup $operationBackupId --dry-run --json
node dist/cli.js rollback --target $taskTarget --backup $operationBackupId --json
node dist/cli.js uninstall --target $taskTarget --dry-run --json
node dist/cli.js uninstall --target $taskTarget --json
```

Rollback reverses exactly one recorded operation, checks that its expected current state still matches and preserves newer owner text outside the marked block. Undo operations in reverse order. Uninstall is idempotent; rollback of an uninstall restores the recorded installation. A locally edited managed file or mismatched manifest causes a conflict, including on uninstall.

## Output and exit codes

| Exit | Meaning                                                                    |
| ---- | -------------------------------------------------------------------------- |
| 0    | Operation succeeded, was a valid no-op, or integrity checks had no failure |
| 1    | `doctor` found a failed check                                              |
| 2    | Invalid input, unsupported format, unsafe path or conflict                 |

`--json` writes JSON on stdout; operational errors are JSON on stderr. `doctor` always reports runtime discovery as `NOT_RUN`: structural integrity cannot prove what a new Codex session loaded. Read both exit status and per-check state. Help is human-readable even with `--json`.

The manifests have published [schemas](../schemas). Runtime validation is implemented with native Node APIs so the compiled installer has no package runtime dependency. Repository tests also validate its emitted data against these schemas.

## Adopt enforcement deliberately

The snapshot includes reference presets and reusable browser helpers. A consumer must select file globs, framework parser, generated output, real routes, expected states and approved budgets. Do not lint JSX or Vue templates as raw HTML. Do not replace existing working test infrastructure or hide legacy failures.

For a static checked-JavaScript consumer, extend the local `configs/tsconfig-js.json` and include the actual scripts. For a typed consumer, extend `configs/tsconfig-strict.json`, then add the framework's required options and run its native checker. Use `configs/eslint.mjs` only where the project provides type information. The strict fixture verification demonstrates these paths; it does not certify all frameworks.

For ordinary custom selects, mark selected-value spans with `data-control-value` and decorative SVGs with `data-control-indicator` in initial and enhanced HTML. Call `inspectControlIndicators` alongside the existing interface inspector on real routes. Add a nonzero expected-control count so removing a control or its markers cannot silently bypass the consumer regression. WEB-008 defines the inset, gap and size acceptance criteria. Check long/enlarged labels and script-unavailable states, and inspect screenshots. This helper does not certify keyboard interaction or accessibility.

The import does not auto-register CI, install a browser, create secrets, add analytics, connect account dashboards or send data to an external scanner. These steps need a relevant task and appropriate authorization.

WEB-008 also requires `inspectControlSurfaces` on initial and opened real controls. Import it from the same local interface template. Inventory controls before testing, including hidden states, and assert their expected count. The helper rejects unstyled native checkbox/radio/search/progress surfaces, missing range/progress subparts, platform scrollbars, disclosure markers and offscreen or transparent expanded popups. Use the design-system control-surfaces stylesheet, preserve keyboard/form/scroll behavior, review screenshots and recheck the published website. No helper alone approves a visual result.
