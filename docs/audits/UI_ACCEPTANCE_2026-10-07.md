# Interface acceptance methodology review

Reviewed 7 October 2026 following the owner's report of twelve recurring defects in the published password generator.

## Root cause and change rationale

The existing rules already required opened images, control inventories and runtime behavior. The consumer nevertheless treated broad initial-mode geometry and test success as sufficient approval. The vocabulary layout, wrong-context word-count error, hovering Resume, fixed result height and depleted track against a different background were not represented by specific acceptance outcomes. More general MUST language alone would not close this gap.

WEB-010 adds one shared defect/state acceptance route, not an alternative design system. It requires a matrix before coding and each reported defect to have its own regression and opened-image observation. The generated web entrypoint, both web profiles and workflow/responsive/motion skills point to that same contract. Core consumers remain free of web rules/helpers. Original logo/icon/shared-style provenance remains mandatory under WEB-001/WEB-009.

Selection cards preserve native radio behavior with one visible selected presentation. A transparent input must be paired with semantic, selection, focus and forced-colors regressions. This is not a blanket exception to WEB-008. The structural helper diagnoses card count/gaps, missing semantics, duplicate markers, icon alignment, unlinked/distant errors, detached actions, content clipping, inline alignment and invisible progress tracks. Negative fixtures must prove these findings. Diagnostics return selectors and geometry descriptions without field values.

## Verification scope

`npm run check`, `npm test` and `npm run build` passed on the reviewed source. The 20 installer/unit tests include web-only routing, payload integrity and preserving core consumers. `npm run test:web` passed all 177 cases across Chromium, Firefox and WebKit. The new acceptance suite contributes 36 of those cases: one positive fixture and eleven deliberately broken or incomplete contracts per engine. It detects every declared defect without returning synthetic field contents in diagnostics.

The three `ui-contract-reviewed-fixture.png` images from run `7d7886ee-d62e-4f21-a02e-1c6b0a5b4bde` were opened individually. Observed: separated selection cards with one selected surface, field-local error, compact output with adjacent actions, vertically aligned target row, and visible depleted progress track. These intentionally minimal fixtures establish the helper's behavior; they are not a product design approval. Native keyboard selection and forced-colors behavior have separate assertions. Product timers, output short/maximum sizing, meaningful localized copy and affected deployed behavior still require consumer-specific evidence. Consumer adoption and deployed acceptance are recorded in the password generator's versioned UI review.

This change adds no runtime package to consumers, performs no account or sibling-repository action, and does not claim that a checklist can guarantee a website will never have a bug. It prevents completion claims from relying on modes or states that were never examined. Reviewed snapshots remain immutable and are adopted with the offline installer and rollback records.
