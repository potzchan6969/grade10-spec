## 1. Manual (grade10-spec)

- [ ] 1.1 Take the 🚧 off the Cart section of the page-shell page once the gate is deployed, and say what the control does for a collector with no session
- [ ] 1.2 Hand the fold over only after `auction-first-site-header` archives, so the widened session sentence it carries is in the durable spec before this change's requirement joins it
- [ ] 1.3 Verify: `pnpm check:manual`

## 2. Header cart gate (grade10)

- [ ] 2.1 Open sign-in from the header's Cart control while no session is signed in, leaving the drawer closed (grade10-site-site-page-shell-SC-21)
- [ ] 2.2 Open the drawer the collector pressed for when sign-in succeeds on that surface, and leave nothing armed when the dialog is dismissed (grade10-site-site-page-shell-SC-22, grade10-site-site-page-shell-SC-23)
- [ ] 2.3 Open the drawer directly for a signed-in collector, with no dialog (grade10-site-site-page-shell-SC-24)
- [ ] 2.4 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs web-spa`
