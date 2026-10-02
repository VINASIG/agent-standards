# Versioning and migration

Version 0.1.0 is a public preview with bundle/manifest format 1. Public source is available on `main`; there is no tagged release or npm package. Pin a reviewed Git commit for source-based adoption. There is no prior public consumer migration. The first migration is opt-in import into a fixture, review of the generated instructions and separate adoption of appropriate enforcement.

Before a tagged release, run required checks, review actual browser evidence, resolve or explicitly document blockers, obtain owner approval for licensing and release distribution, and create an authorized source tag. Publish the approved digest and exact source commit. Do not label a content hash as a Git commit. GitHub source visibility does not authorize npm publication or automatic adoption in consumers.

Patch versions correct compatible prose or implementation bugs. Minor versions add opt-in skills/profiles/checks without silently strengthening existing MUST behavior. Major versions change mandatory behavior or an incompatible integration contract. Before 1.0, treat any mandatory policy strengthening as a migration requiring explicit review; do not use the 0.x label to bypass it.

Every change to rules or installer behavior includes affected IDs, consumer impact, before/after evidence and a migration/rollback note. Test an update from the prior approved snapshot, not just a clean installation. Preserve old artifacts for rollback. A new format needs a supported migration path or a clear unsupported-format failure before any write.

Consumers pin approved content. An update bot in this repository proposes dependencies and actions weekly; it does not merge changes, update consumer snapshots, approve policy exceptions or create a standards rollout. Review official source drift and compatible peer/runtime ranges on each such proposal.

This candidate's TypeScript exception is 6.0.3 versus verified latest 7.0.2 because typed ESLint requires below 6.1.0. Review when that peer range changes. An upgrade is a separate task with its own migration and test results.
