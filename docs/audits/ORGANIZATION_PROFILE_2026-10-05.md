# Organization profile synchronization

## Policy review

The owner requested this change on 5 October 2026 after publishing VINASIG's GitHub organization profile. The request is to update AGENTS and shared working rules so additions or changes to tools and related public information are reflected in that profile.

CORE-009 covers the affected project README, repository description/homepage, VINASIG website inventory and the existing English and Vietnamese organization profile. It applies only to VINASIG-owned public project information and relevant changes. It does not require an unrelated dependency upgrade, a rewrite of accurate descriptions or publication of private work.

The workflow skill, generated consumer entrypoint, stable rule registry and portable checklist provide the same route in core, static web and typed web profiles. The checklist records the organization-specific `.github/profile/README.md` convention. Its translation is an ordinary linked file. Existing publication authorization persists, and missing access or authorization is reported explicitly rather than silently bypassed.

This is an agent-reviewed response to the owner's requirement, not an independent human review or an automatic synchronization service. The offline installer performs no GitHub, website, account or metadata API mutation. External changes remain within the current user's authority.

## Migration and rollback

The public preview remains version 0.1.0 with bundle format 1. This mandatory policy addition requires explicit adoption of a reviewed new snapshot. Existing snapshots are updated with the installer, their existing profile and an approved bundle SHA-256. Owner text is preserved, conflicts remain blocking and backups support rollback. No managed files are edited manually.

The current task authorizes this update across the existing VINASIG consumers. The publication checklist does not impose VINASIG organization metadata on independent third-party consumers. No dependency, application feature, font, original artwork or license grant is changed by this policy update.

## Evidence

Source validation, the bundle digest, reviewed consumer plans, structural integrity and publication revisions are recorded with the task's scoped adoption evidence. Structural integrity does not establish instruction discovery in a fresh Codex session. Remote source publication, website deployment and actual rendered profile behavior remain distinct findings.

The local source typecheck, zero-warning lint, metadata/schema/link checks, formatting, license integrity and TypeScript build passed. The registry contains 40 distinct rules. No new dependency or test is introduced. Local unit and browser test suites were not run for this instruction update.

The approved payload bundle SHA-256 is `a07cd4c250aa2ba476e2978d0fdc30b144f80fac0dc0b7939e09b73d87b4a067`. Its content hash identifies the payload, while the published source revision identifies the reviewed installer implementation. Each consumer manifest separately records its generated AGENTS block digest.

All 12 existing consumers adopted the snapshot with their existing profile and passed structural integrity. The three core consumers are `.github`, `vinasig-brand-assets` and `vinasig-org-directory`. The nine web consumers are `bmi-calculator`, `favicon-forge`, `nvqs-bmi-calculator`, `qr-generator`, `qr-scanner`, `totp-generator`, `unphar`, `vinasig` and `web-design-system`. Previously adopted web snapshots also receive the already owner-approved WEB-009 header/footer guidance from the current source. No application layout is changed by this instruction update.

Favicon Forge and Military BMI had insufficient space for the new entrypoint under the existing 8 KiB limit. Their project-owned guidance was moved byte for byte to `docs/AGENTS_PROJECT.md`, with a mandatory reading instruction in root AGENTS. The original managed block was preserved before the installer update. Every resulting entrypoint is below the unchanged budget. The original guidance SHA-256 values are `3a7d31013ddc44e6793a18bc226ea76b6c1d2d67e7a1c74b64df1de8a309e444` and `0d02ece5e514fcca8b258f3d1bf6a3ee21655d3e88ac58ef47bf37fe0a639c11`, respectively. Full project rollback uses the pre-adoption Git revision, while standards-only rollback uses the installer backup.
