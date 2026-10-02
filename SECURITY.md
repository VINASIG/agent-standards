# Security

Version 0.1.0 is a public preview. Maintainers accept reports for the current `main` revision; no stable-release support matrix or response-time guarantee is claimed.

Use [GitHub private vulnerability reporting](https://github.com/VINASIG/agent-standards/security/advisories/new) for a suspected vulnerability. It is enabled for this repository. Include the affected revision, a minimal authorized reproduction and expected impact. Do not put secrets, private traces or exploit details into a public issue. Do not invent an email address or send private findings to an unrelated account.

## Threat model

The installer consumes an explicitly reviewed bundle and approved digest. It rejects unsafe paths, symlinks/junctions, local conflicts and incorrect payload bytes. Its backups are trusted local recovery material; protect them from tampering. Integrity hashes do not authenticate a publisher. No remote code is downloaded by the compiled runtime.

The installer is not a sandbox against other processes with write access to the same target. Its lock prevents cooperating installer operations, not hostile file races. Interrupted writes or power loss can need manual restoration from the recorded backup. Test recovery in a fixture before using a release in a critical repository.

Policy/skill source must be reviewed because agents may act on it. User/platform authorization remains authoritative. No standard switch disables authentication, CAPTCHA, consent, sandbox permissions or a quality gate.

## Safe checks

Use local fixtures and authorized test environments. `npm audit` and pinned dependency review can identify known advisory exposure; zero reported advisories is not proof of security. Active security scanning, load tests and real payment/destructive actions require a separately authorized scope. Avoid sending source, cookies, traces and personal data to third-party services without permission.

CI runs with read-only repository permissions and no privileged secrets for pull requests. The [publication audit](docs/audits/PUBLICATION.md) links observed remote results. Local browser fixtures do not prove secret-scanner coverage or production authorization. Consumers must add tests for their actual server-side permissions and business risks.
