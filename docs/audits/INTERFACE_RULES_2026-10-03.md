# Interface writing and control rules

## Approved scope

On 3 October 2026 the owner requested an audit of every VINASIG repository, updated shared rules and correction of affected interfaces. The request explicitly covers punctuation, natural language, sentence case, list markers and custom dropdown, color, slider and calendar controls.

The [reference author's instructions](https://github.com/NhanAZ/nhanaz.io.vn/blob/main/AGENTS.md) were retrieved through GitHub's contents API. They confirm the semicolon, colon, slash, uppercase and list-marker conventions. Their personal voice, blog structure and repository operating instructions are source context, not organization policy. The owner's current request also specifies ordinary hyphens and limited parenthetical explanations.

## Cause

The previous language policy described most punctuation rules as editorial preferences. The dropdown specification permitted platform popups when a design did not explicitly call for customization. There was no rendered-copy regression gate. A styled closed select therefore passed existing responsive checks while its open menu still used the operating system.

LANG-004, LANG-005 and WEB-008 close those gaps. The root entrypoint calls them out. The browser inspector evaluates actual visible text and platform popup controls. It is deliberately complemented by review of ordinary language and required notation.

## Adoption

Use the offline installer to update reviewed snapshots. Do not edit installer-owned files by hand. Consumers integrate the inspector into their existing browser tests and exercise initial, expanded, error and result states in every locale. URLs, times, regulatory identifiers, code and user-entered values retain their required syntax.

The complete organization audit records consumer revisions, commands, screenshots, deployment and remaining verification limits separately. A successful inspector result does not establish screen-reader support or complete visual correctness.

## Fixture validation follow-up

The typed fixture now owns its validation messages, enables its submit control after the module binds the handler and keeps the control disabled when that module is blocked. A negative browser case covers malformed input and a blocked-script reload. The form disables state restoration so a previous enabled state cannot defeat that startup guard. Firefox's persistence of dynamic disabled state is documented in [Mozilla's disabled-attribute reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled).

Two earlier Ubuntu CI attempts returned an empty typed-fixture status at 390 px in Firefox. Those attempts remain recorded as failures. The follow-up retains all existing successful-flow, geometry and accessibility assertions and adds the negative case. It does not increase retries or timeouts or accept a failure baseline.
