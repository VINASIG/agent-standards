# Decision 0001: portable local snapshot

Status: implemented in 0.1.0, now published as a public preview. Date: 2026-10-02.

## Context

VINASIG needs one shared policy source that fits static web, typed web and nonweb repositories. Codex instructions have a limited discovery budget. Consumers must remain usable offline and retain local work.

## Decision

Separate core, profiles, focused skills and executable enforcement. Distribute approved content snapshots with per-file checksums and an explicit approved manifest digest. Generate a short marked root instruction block; install only the selected namespaced skills in the documented repository-scoped location. Preserve existing lint/package/MCP configuration and require reviewed adoption of enforcement.

Native Node APIs implement the compiled installer without runtime packages. JSON schemas and typed tests verify its contract during maintenance. The local source reference is a content hash until an approved release commit exists. Neither hash nor pin is a license or signature.

## Alternatives and consequences

A URL-only guide does not supply dependable Codex discovery or offline content. A submodule still needs instruction routing and Git availability. Symlinks create avoidable Windows deployment differences. A floating remote install increases source drift and permissions. A single large AGENTS document would load irrelevant web policies into nonweb work.

Snapshots duplicate approved bytes inside consumers, so updates require an explicit operation and a migration review. Owned local edits cause conflicts rather than automatic merging. The installer owns no consumer dependency upgrade or organization-wide rollout. The operation lock and compensating restore address ordinary errors; full transactional recovery after a killed process remains a documented limitation.
