# Destructive action semantics

The owner requested an ecosystem review on 8 October 2026 after data-discarding buttons appeared in the ordinary blue action style. Existing `clear-button` classes were also used by uploads, sharing, report downloads and paging. Keyword-based recoloring would therefore change unrelated actions.

WEB-010 now requires effect-based classification, explicit semantic markers and the reviewed red variants. Both web profiles, the generated entrypoint and workflow/responsive skills route to the same acceptance contract. The installer copies a reusable inspector only to web consumers. A reviewed offline update preserves owner text, integrity checks and rollback records.

The browser inspector checks declared inventories, missing and unlisted markers, button/menuitem semantics, accessible names, reviewed red roles, enabled text/icon/boundary/focus contrast and faded enabled controls. It returns selectors and diagnostics without input or result content. It cannot infer a product's consequences or replace actual behavior and image review. Forced colors retain system colors and meaningful labels.

WebKit forced-colors testing exposed a system ButtonText border with insufficient contrast against a dark surrounding surface even though the system ButtonFace fill provided a clear boundary. The inspector now evaluates that visible fill boundary as well as the border in forced colors, using the same unrounded 3:1 requirement. It retains strict reviewed red text/border checks in normal outlined variants. This change measures the actual system affordance rather than requiring a red outline that forced colors replaces.

Positive/negative browser fixtures cover light/dark, hover, focus, disabled, forced colors, ordinary-blue drift, low contrast, opacity and missing/unlisted actions. Product consumers additionally exercise actual synthetic clear/discard flows in both languages. A shared CSS fixture retains the reviewed design-system source rather than weakening a consumer rule. Existing confirmation/authorization requirements remain separate. This change adds no unnecessary confirmation dialog to a local clear.

Color reference probes use resolved custom properties from the action's own scope in an invisible, absolutely positioned element outside the action. This keeps the measurement independent of host transitions, important child styles and flex layout. A regression verifies that inspecting a hovered flex button preserves its size, pointer state and scoped semantic palette in all supported engines.

Sources reviewed on 8 October 2026 include [W3C use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) and [GOV.UK warning buttons](https://design-system.service.gov.uk/components/button/#warning-buttons). They support redundant labels and selective destructive styling. VINASIG's additional session-clear red requirement comes directly from this owner's request, not a claimed universal WCAG red-color mandate.

The ecosystem rollout record in web-design-system documents the exact consumer scope, source pins, checks and live observations. Physical devices, screen readers and independent human evaluation are separate from automated and agent visual evidence.

## Ecosystem delivery receipt

The owner authorized the review, implementation, consumer adoption and publication. The scope covers fourteen web repositories. Nine product controls across eight tools were standardized. Six tools had ordinary blue controls, QR Scanner had a neutral control, and Metadata Cleaner already used red. The design documentation declares one destructive component and eight element actions.

The classification follows actual handlers. Session clearing, deleting loaded data and discarding edits use red. Search and filter clearing, cancellation, demonstration restoration, archive, mute and tools creating a new copy retain their ordinary semantics. The rollout introduced no confirmation dialog for a local session clear.

### Reviewed source and provenance

- Canonical runtime snapshot: `567d839f6fdb983582e1f0ed4c33678799cc6fe8`.
- Approved offline bundle SHA-256: `d3f74b935d2c2f4c562d477783210b65c86c8a98c151529da9cc2bc3b89fba7a`.
- Strengthened system-palette fixtures: `cb3161cb04b3cdab15f007d0c9e201a71a40833d`. Fixture-only changes do not alter the installed runtime.
- Reviewed destructive stylesheet source: `VINASIG/web-design-system@4ebf0ab8ec3791a79844edaa544040278f898dfd`, `src/styles/destructive-actions.css`.
- Stylesheet SHA-256: `f874f2f32f17dd95ae6bd85d3c1696911dfc24f1605c6aa7e27aa6a0ada79788`. All eight consumer copies are byte-identical and their browser regression checks that pin. Later design documentation changes preserve these stylesheet bytes.

The installer updated all fourteen managed snapshots. Owner instruction bytes outside the managed AGENTS block were preserved. The final doctor check validated installed files and manifest provenance in all fourteen repositories. Their branches are main, upstream revisions agree, and working trees are clean at the delivery inspection. These structural checks do not establish runtime discovery by a new Codex session.

### Exact consumer revisions

| Repository           | Reviewed revision                                                                                                                           | CI and deployment evidence                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| web-design-system    | [ef53073656ac8b67ec7b9aa4493f815c64962851](https://github.com/VINASIG/web-design-system/commit/ef53073656ac8b67ec7b9aa4493f815c64962851)    | [PASS: Verify and deploy design system](https://github.com/VINASIG/web-design-system/actions/runs/37789512379)    |
| vinasig-brand-assets | [3acabbf1f17a21f8f5f40a8dd1c7212bad804850](https://github.com/VINASIG/vinasig-brand-assets/commit/3acabbf1f17a21f8f5f40a8dd1c7212bad804850) | [PASS: Archive checks](https://github.com/VINASIG/vinasig-brand-assets/actions/runs/37766505585)                  |
| vinasig              | [806a777f0ee453bc9ac3f8c17442e7c95bea1f7d](https://github.com/VINASIG/vinasig/commit/806a777f0ee453bc9ac3f8c17442e7c95bea1f7d)              | [PASS: Verify and deploy VINASIG](https://github.com/VINASIG/vinasig/actions/runs/37766514885)                    |
| password-generator   | [c0a0902e8b22a4fbac8395514ce9b228b3f24788](https://github.com/VINASIG/password-generator/commit/c0a0902e8b22a4fbac8395514ce9b228b3f24788)   | [PASS: Verify](https://github.com/VINASIG/password-generator/actions/runs/37766672850)                            |
| totp-generator       | [2992db0b7f450eeae97d3c4b8edd7583d04b9eeb](https://github.com/VINASIG/totp-generator/commit/2992db0b7f450eeae97d3c4b8edd7583d04b9eeb)       | [PASS: Verify and deploy TOTP Generator](https://github.com/VINASIG/totp-generator/actions/runs/37779695010)      |
| bmi-calculator       | [263bbf428d9642965486af43142a7ddddc74bd93](https://github.com/VINASIG/bmi-calculator/commit/263bbf428d9642965486af43142a7ddddc74bd93)       | [PASS: Verify and deploy BMI Calculator](https://github.com/VINASIG/bmi-calculator/actions/runs/37779700420)      |
| nvqs-bmi-calculator  | [0345084d7d286e9799e2ce174127e191e4457376](https://github.com/VINASIG/nvqs-bmi-calculator/commit/0345084d7d286e9799e2ce174127e191e4457376)  | [PASS: Verify and deploy Military BMI](https://github.com/VINASIG/nvqs-bmi-calculator/actions/runs/37779706075)   |
| metadata-cleaner     | [5b9752448c0d9ed106b663079939dd55621aafb9](https://github.com/VINASIG/metadata-cleaner/commit/5b9752448c0d9ed106b663079939dd55621aafb9)     | [PASS: Verify and deploy metadata-cleaner](https://github.com/VINASIG/metadata-cleaner/actions/runs/37779711818)  |
| metadata-editor      | [4b0b05fdf855e344578a9e11592783c93decea7c](https://github.com/VINASIG/metadata-editor/commit/4b0b05fdf855e344578a9e11592783c93decea7c)      | [PASS: Verify and deploy metadata-editor](https://github.com/VINASIG/metadata-editor/actions/runs/37779722833)    |
| metadata-reader      | [95e1be9dadce8e7ba07074c68822a4730fce8be0](https://github.com/VINASIG/metadata-reader/commit/95e1be9dadce8e7ba07074c68822a4730fce8be0)      | [PASS: Verify and deploy metadata-reader](https://github.com/VINASIG/metadata-reader/actions/runs/37779731213)    |
| qr-generator         | [07458ba878106d86263211503a05c74601c9ceb5](https://github.com/VINASIG/qr-generator/commit/07458ba878106d86263211503a05c74601c9ceb5)         | [PASS: Verify and deploy QR Generator](https://github.com/VINASIG/qr-generator/actions/runs/37779741122)          |
| qr-scanner           | [a57cb73fb25f4a5e147d911e86cb0d06e8f23db2](https://github.com/VINASIG/qr-scanner/commit/a57cb73fb25f4a5e147d911e86cb0d06e8f23db2)           | [PASS: Verify and deploy QR Scanner](https://github.com/VINASIG/qr-scanner/actions/runs/37779746078)              |
| favicon-forge        | [4d299e65d519b79158d3a3422ae32a124ba4964d](https://github.com/VINASIG/favicon-forge/commit/4d299e65d519b79158d3a3422ae32a124ba4964d)        | [PASS: Check and deploy VINASIG Favicon Forge](https://github.com/VINASIG/favicon-forge/actions/runs/37766802387) |
| unphar               | [9bccead29feffe71ee69d965b65517e3fafce409](https://github.com/VINASIG/unphar/commit/9bccead29feffe71ee69d965b65517e3fafce409)               | [PASS: Verify and deploy Unphar](https://github.com/VINASIG/unphar/actions/runs/37766808581)                      |

Password Generator received the common agent procedure only. Its runtime remains the already published v0.2.12 and needs no Cloudflare upload for this rollout. The five sites without a data-discarding control received the procedure and integrity checks without inventing a delete action.

### Verification

- PASS: [canonical source and installer checks](https://github.com/VINASIG/agent-standards/actions/runs/37774508205) on Linux and Windows, including 20 unit tests. The [strengthened browser fixtures](https://github.com/VINASIG/agent-standards/actions/runs/37774508200) passed 204 cases on each operating system across Chromium, Firefox and WebKit.
- PASS: existing product source, unit, build, browser and performance gates at each consumer revision listed above. The focused destructive regression contributes 15 cases per product on each operating system, or 120 product cases per operating system. No retry or skipped destructive case is used.
- PASS: 96 live product combinations, consisting of eight tools, two languages, two themes and three browser engines. These use real synthetic inputs to enable the controls, exercise hover, active, native keyboard focus and system forced colors, then verify actual clearing or restoration of original edits.
- PASS: 12 additional live QR Scanner flows decode a valid synthetic QR image in each language/theme/engine combination before clearing the image, decoded output and export control.
- PASS: design destructive actions locally and on the deployed https://design.vinasig.io.vn site in 24 language/theme/width/engine combinations each. Actual native dialogs, overflow/context menus and the delete sheet are opened. Deliberately blue actions are rejected. Live screenshots of the destructive component, opened empty-trash alert, context menu and delete sheet were inspected.
- PASS: all 108 rendered palette cases, including 320 px at 200% text. The full gate exposed constrained Foundations color, type and spacing examples; their layouts now wrap or stack at the available container size. Geometry and opened specimen images confirm the repair.
- PASS: the native mobile editor panel close flow in normal motion at 320, 360 and 390 px, with all 506 responsive checks. A settled native tap is used once; the close must change both state flags and make the panel inert and aria-hidden.
- PASS: [final design source CI and GitHub Pages deployment](https://github.com/VINASIG/web-design-system/actions/runs/37789512379) at `ef53073656ac8b67ec7b9aa4493f815c64962851`. All six Linux/Windows and Chromium/Firefox/WebKit jobs passed the complete suite in both the normal and touch/normal-motion configurations. The live specimen regression passed all 24 combinations after this deployment.
- NOT_RUN: physical devices, screen readers, independent human evaluation and new-session Codex runtime discovery.

Text contrast is at least 4.5:1; meaningful icons, boundaries and keyboard focus reach at least 3:1, using unrounded measurements. Normal themes use the reviewed semantic red. Forced colors respect CanvasText/Canvas, explicit names, icons and focus. The tests preserve native controls and browser navigation; no focus class or tabindex override is injected.

Opened before/after product images, the live button comparison, focused opened design specimens, enlarged Foundations examples and the failing CI artifacts are retained under ignored output directories. CI artifacts are linked from the runs above and have their existing retention periods. The durable result is this receipt; temporary artifacts are not a permanent public screenshot archive. Test keys and image fixtures are synthetic. Diagnostics omit user inputs, generated secrets and actual files.

Initial failures were retained and investigated. Cross-engine system palettes required a readable system color pair. A formatting difference invalidated the source digest and was corrected in the scoped formatter override. Native keyboard tests account for modal focus navigation. Normal-motion mobile close uses the existing settled tap helper rather than a mouse click while scrolling. Contrast, overflow, keyboard and actual discard requirements remain active.
