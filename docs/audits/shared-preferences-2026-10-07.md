# Shared ecosystem preferences, 7 October 2026

The owner authorized system-default appearance and language plus shared deliberate appearance changes across the VINASIG ecosystem. The chosen behavior also shares deliberate language choices. A follow-up left the handling of open tabs to the project: change appearance without navigation; change language on untouched pages, but preserve pages with trusted form, paste or drop interaction until explicit navigation or reload.

Same-named localStorage keys remain origin-local. Two independent cookies scoped to `vinasig.io.vn` avoid field overwrite races while storing only `light`/`dark` and `vi`/`en`. Secure, SameSite=Lax, Path=/ and a one-year maximum age apply. Cookie values are not secrets, identifiers or tracking state. Defaults do not write preferences. Blocked cookies use an allowlisted origin fallback; fully blocked storage uses page memory.

The reviewed runtime is maintained in `VINASIG/web-design-system/src/scripts/shared-preferences.js` under that project's software license. Consumers copy the same normalized-LF bytes, record SHA-256 and include them locally with existing build infrastructure. No central service, iframe, runtime CDN, new dependency or cross-origin messaging is needed.

The conformance helper uses actual built HTML/assets served through controlled HTTPS root and subdomain URLs. It checks OS changes, explicit overrides, open and new tabs, language preservation, bounded persistence and blocked fallback in supported engines. Consumer and ecosystem tests supply actual delivery evidence; installing policies does not prove product adoption or live deployment.

## Sources

- [MDN document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
- [MDN Navigator.languages](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages)
- [MDN Window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
- [Google localized sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

## Local validation

Source/schema/link/format/license checks, 20 installer tests, 10 quality self-checks and the existing 177 three-engine web acceptance cases passed. The new conformance helper also passed against the actual built VINASIG homepage in Chromium, Firefox and Windows WebKit, including legacy migration, conflicting/invalid cookies, blocked storage, browser-language precedence and preservation of active input. These are automated local observations, not deployed evidence or independent review.

The pinned Windows WebKit cookie protocol reports `None` even for an independently specified `SameSite=Lax` reference cookie, both when created by `document.cookie` and `addCookies`. The helper calibrates that known platform representation, still asserts domain/path/Secure/finite values/expiry and intercepts actual native cookie writes to require the exact Lax declaration. Other supported environments must report Lax. This fixture is a measurement of the pinned Windows port, not a Safari claim.
