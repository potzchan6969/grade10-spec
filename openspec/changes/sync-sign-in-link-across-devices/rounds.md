# Rounds

One row per round: the artifact or task group it read, who read it, what stood, what it asked, and the tests that hold the scenarios the group cites.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | 5 | simpler | `sign-in-settled-elsewhere.spec.ts` walks `shared-auth-sign-in-US-10` end to end (`TC1-1`), and `sign-in-watch.spec.ts` covers the failed-attempt and scoping cases at the API layer (`TC4-1`'s expired and banned rows, `TC5-1`, `TC9-1`); every one of those tests lives in `apps/frontend/grade10` or `apps/backend/grade10` (the application repository), and `tcs:automated --decided-by` only resolves paths inside the grade10-spec store, so every case stays `manual` — the same structural gap `2026-09-22-load-grade10-site-gibson` found for grade10-site. `TC2-1`, `TC3-1`, `TC4-1`'s already-used-link row, `TC6-1`, `TC7-1` and `TC8-1` have no automated coverage at all and stay `manual` on their own terms | - | by hand (manual): apps/frontend/grade10/e2e/tests/auth/sign-in-settled-elsewhere.spec.ts — `shared-auth-sign-in-US10-TC1-1`; apps/backend/grade10/auth/test/db/sign-in-watch.spec.ts — `shared-auth-sign-in-US10-TC4-1` (expired, banned), `TC5-1`, `TC9-1`; `shared-auth-sign-in-SC-70`–`SC-79` |
