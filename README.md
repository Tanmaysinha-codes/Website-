# Sample Frontend Website

This repository contains a static frontend website built with HTML, CSS, and JavaScript.

## Security notes

A repository security audit was performed with the following hardening updates:

- Added a restrictive Content Security Policy (CSP) on all pages via `<meta http-equiv="Content-Security-Policy">`.
- Added a strict referrer policy (`strict-origin-when-cross-origin`).
- Confirmed third-party Font Awesome CSS is loaded with SRI (`integrity`) and CORS attributes.
- Scanned repository files and recent git history for committed secrets; no confirmed credentials were found.
- Added `.gitignore` rules to reduce accidental commits of secrets and local artifacts.

## Residual risks requiring hosting-level configuration

Because this site is static (e.g., GitHub Pages), some protections are best enforced at the hosting/proxy layer rather than in-page metadata:

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options` or CSP `frame-ancestors` enforced as an HTTP header
- `Permissions-Policy`

If a future audit finds credentials in git history, rotate/revoke them immediately. History rewriting should be planned carefully and not auto-applied.
