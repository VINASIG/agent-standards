# Complete control surface enforcement

Reviewed on 4 October 2026 for the owner's organization-wide control task.

## Defect and review rationale

The previous WEB-008 enforcement rejected visible native select, date and color popups and unstyled ranges. It measured ordinary dropdown indicators. It did not inspect popup scrollbars, checkbox/radio marks, search clearing, progress/meter values or disclosure indicators. A custom QR listbox could therefore pass while retaining platform scrollbar buttons. This is a gap in the guard and its state coverage, not permission to relax the visual requirement.

The owner reinforced the requirement for complete styled controls. WEB-008, its responsive skill, generated consumer routing and integration guidance now require an inventory of all reachable control types, including conditional fields, an expected-control count, opened and scrolled screenshots, keyboard/touch/form behavior and a deployed check. Native file-selection, permission, print and download dialogs remain platform interactions. Forced-colors mode may use system controls to preserve accessible contrast.

## Structural guard

`inspectControlSurfaces` supplements the existing interface and indicator guards. It checks appearance, authored slider/progress subparts, scrollable surfaces, disclosure indicators and expanded popup geometry/surfaces. Stylesheet rules are filtered by media and feature support. WebKit scrollbar parts only count in an engine that supports them. A universal scrollbar pseudo selector is matched against every element. Removing a scrollbar is not accepted as evidence of styling.

Checked checkbox/radio inputs must retain a visible authored selection mark or background image. A separate negative fixture removes the mark while retaining the native input and checked state. This closes the gap where appearance none could produce an empty square even after selection.

Catalog specimens below the fold are checked for viewport fit after their anchors enter the viewport. Fixed overlays always require viewport fit. A regression proves that an offscreen popup still fails once its trigger is in view. Negative fixtures retain their intended defects and cover unstyled controls, scrollbars, absent subparts, platform disclosure markers and offscreen/transparent popups.

## Research used

- [MDN advanced form styling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Advanced_form_styling) distinguishes native semantics from the styling limits of platform controls.
- [MDN scrollbar-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-color) documents inherited standard colors, forced-colors behavior and the precedence over WebKit scrollbar parts when the standard value is non-auto.
- [MDN WebKit scrollbar parts](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::-webkit-scrollbar) documents track, thumb and button selectors. The reviewed design-system stylesheet uses standard colors/width in Firefox and authored parts in Chromium/WebKit without platform arrow buttons.
- [WAI select-only combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/) and [date picker dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) supply the keyboard and semantics reference. A source or DOM check cannot establish screen-reader or real-device coverage.

## Evidence

Local baseline inventory covered 30 rendered English/Vietnamese routes across seven websites. It found unstyled document and popup scrollbars, visible checkbox/radio surfaces and the upload converter's native progress skin. Existing reviewed date/time/color pickers and range behavior were retained. Screenshots, browser logs, reviewed bundles and installation plans are stored in ignored `output/` in their respective checkouts. Consumer audits record the actual route/state and publication coverage.

The central check, unit, build and Chromium/Firefox/WebKit fixture suites must pass before distributing the bundle. Consumer source checks and actual browser/deployment checks are separate requirements. The structural helper alone is not a visual certification.
