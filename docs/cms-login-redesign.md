# CMS Login Redesign

The login uses a fixed bakery theme, scoped CSS Modules and a standalone local WebP crop from the supplied reference. The image contains the tabletop photography only (no embedded login form or brand headline). The 480 × 307 asset is a lightweight first-pass crop; replace it at the same path with a higher-resolution original bakery photograph for sharper large-desktop rendering if available.

## Responsive acceptance checks

| Viewport | Expected |
| --- | --- |
| 320 × 568 | Single card, readable labels, no horizontal overflow |
| 375 × 667 / 390 × 844 / 430 × 932 | Single card, form scrolls when keyboard opens or errors appear |
| 768 × 1024 / 820 × 1180 | Compact branding banner above centered card |
| 1024 × 768 / 1280 × 720 | Two-column layout with short-height adaptation |
| 1440 × 900 / 1920 × 1080 / 2560 × 1440 | 55:45 composition, bounded form width, decorative photo |
| 844 × 390 (landscape phone) | Scrollable form; no clipped submit button |

Test correct/incorrect email and password, validation focus, password visibility, remember-email checked and unchecked, blocked localStorage, session expired/locked/forbidden/logout messages, safe redirect and CMS dark/system preference. Session refresh and session state retain their previous UI.

Run `pnpm test:auth`, `pnpm test:login-ui`, and all CI Quality Gate steps. Source assertions verify wiring and responsive CSS, not browser geometry; visually inspect Preview before merge. No Backend or authentication schema changes.
