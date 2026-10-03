# Transparent header artwork

## Authorization and source

The VINASIG owner requested an organization-wide header review after the interface writing and custom-control correction. The owner approved transparent original lockups without white or rounded background cards. This approval applies to that header requirement, not every draft design-system recommendation.

The current brand archive supplies Primary Color, Color Black, Reversed, Monochrome Black and Monochrome White horizontal exports. The preserved SVG viewBox is 540 by 140. Primary Color and Reversed were visually reviewed in their existing transparent raster counterparts and copied without modifying artwork. The original internal white geometry remains intentional artwork.

## Cause and correction

Five application headers used a white padded card, which made the cream light canvas inconsistent and required a mismatched dark presentation. The design-system sidebar reconstructed the wordmark as live text. Favicon Forge already used a transparent light variant, but its link height needed a separate usable target.

WEB-001 now requires the original transparent asset, selection by the actual surface, preserved proportions and an accessible target independent of image size. A light-only site and an always-dark sidebar intentionally choose different variants under the same operating-system preference. WEB-008 also specifies styled initial HTML and disabled controls until handlers attach. The rendered-copy inspector now rejects authored round bullet characters as well as default CSS list markers.

The installer entrypoint and responsive skill route consumers to these requirements. `inspectHeaderBrand` checks original-image presence, alternative text, transparent presentation, absence of artwork effects, target geometry, aspect ratio and variant selection. Consumers separately verify asset digests. This presentation helper does not establish artwork rights or certify accessibility.

## Verification record

Strict source, metadata and formatting checks pass. All 15 installer/unit tests, 10 deliberately broken quality fixtures and 81 browser cases pass. The complete browser suite runs Chromium, Firefox and WebKit without retries. Execution logs are retained under ignored `output/ui-language-2026-10-03/`.

Synthetic positive and deliberately broken header fixtures exercise the gate without drawing replacement VINASIG artwork. The light-surface and dark-surface Chromium screenshots were opened and reviewed. Consumer audits record the real routes, actual screenshots and source-asset digests separately.

The rollout uses the reviewed offline installer, a fresh bundle directory and explicit digest. Existing consumer asset digests and owner text outside the managed entrypoint are preserved. Repository visibility and a successful build do not establish browser correctness, a tagged release or artwork licensing. Physical-device, assistive-technology and fresh Codex runtime-discovery checks remain separate from these browser checks.
