# VINASIG header destination review - 4 October 2026

## Authority and baseline

The owner requested a complete website header review, original transparent light/dark logo variants, and a logo link to `https://vinasig.io.vn/`.

The organization currently has ten public repositories and seven published websites. A fresh Chromium capture of both locales and both system themes at 360 by 800 and 1440 by 900 produced 56 immutable before states. The current published headers already use transparent Primary Color/Reversed exports. Fourteen consumer SVG comparisons match the original Brand Assets exports byte for byte. This does not establish what revision appeared in the owner's earlier screenshots.

The five tool sites still sent their logo links to the GitHub organization. The documentation site linked to its own locale home. The main site's Vietnamese header linked to its locale route. WEB-001 and the inspector covered presentation and surface-based variants but did not enforce the requested organization-home destination.

## Bounded enforcement change

- Extend WEB-001 with the explicit canonical organization-home destination and localized accessible link name. Preserve distinct project navigation and GitHub source links.
- Extend `inspectHeaderBrand` with `header-logo-home`. Retain every existing artwork, surface, card, target and geometry assertion.
- Add a positive native click/keyboard fixture and negative organization, project, locale, fragment and missing-destination cases.
- Route the requirement through the installer entrypoint and responsive skill. Consumer snapshots must be updated through a reviewed immutable bundle, not by editing managed bytes.

## Source verification

- `npm run check` passed TypeScript, ESLint, metadata, formatting and licensing gates.
- `npm test` passed all 18 unit tests.
- `npm run build` passed.
- `npm run test:web` passed all 108 tests across Chromium, Firefox and WebKit without skips or retries.
- Runtime and package manager remain Node 24.21.0 and npm 11.19.0. No dependency or original artwork changed.

Local artifacts are in ignored `output/responsive/header-home-2026-10-04/`. Consumer rollout, consumer checks, exact-commit CI and live verification are separate downstream evidence. Physical devices, screen readers and independent SI-agent trials were not run.
