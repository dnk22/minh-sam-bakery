# CMS security audit boundary

Checked against `minh-sam-openapi.json` and the local BFF routes. The OpenAPI documents authenticated Bearer access and 401/403 responses, but it does not map operations to concrete permission codes or document last-admin/self-downgrade rules. The repository has no authorized nonproduction credentials, so Backend RBAC enforcement remains unverified.

| Area | Operations forwarded to Backend | BFF controls confirmed locally | Backend authorization still to verify |
| --- | --- | --- | --- |
| Categories | list, detail, create, update, delete | authenticated server session; same-origin and JSON checks on writes | permission codes; referential delete policy |
| Products | list, detail, create, update, delete | authenticated server session; strict DTO validation; same-origin and JSON checks on writes | permission codes; collection PATCH semantics |
| Orders | list, detail, update status | authenticated server session; strict query/DTO/status validation; same-origin and JSON checks on PUT | permission codes; allowed status transitions; nullable Swagger field shapes |
| Roles | list, detail, create, update, delete, replace permissions | authenticated server session; same-origin and JSON checks on writes | permission codes; last-admin/system-role protections |
| Users | list, detail, create, update, delete, assign role, lock/unlock | authenticated server session; same-origin and JSON checks on writes; UI prevents self-lock/delete | permission codes; self-role downgrade, self-action and last-admin enforcement |
| Images | upload and authenticated relative-asset proxy | authenticated server session; same-origin multipart upload; allowlisted folders; MIME/count/combined-size checks | upload permission code and storage authorization |

`GET /api/v1/auth/me` returns permission-code strings, and `GET /api/v1/permissions` returns the catalog. The BFF intentionally does not guess identifiers from the single OpenAPI example (`users.view`); the Backend remains the final authorization boundary until an authoritative permission-to-operation matrix and test credentials are provided.

Required Backend confirmation before release claims:

- Unauthorized-role tests for every operation above, including direct BFF requests.
- Self-lock, self-delete, self-role downgrade and last-admin outcomes.
- Whether Product `images` and `variants` PATCH arrays replace, merge/upsert, append, clear on `[]`, or are ignored, including DB ID behavior.
- Persistence of `""` for optional Product string fields and `null` for `salePrice` after refetch.
- Actual string/null shapes for optional Order fields and the permitted Order status-transition matrix.
