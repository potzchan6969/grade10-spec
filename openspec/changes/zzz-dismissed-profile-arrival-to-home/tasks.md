## 1. Manual (grade10-spec)

- [ ] 1.1 Mark Navigation with what the profile does for a collector with no session: the address stays put while it asks, and leaving goes home (zzz-site-site-navigation-SC-21, zzz-site-site-navigation-SC-23)
- [ ] 1.2 Verify: `pnpm check:manual`

## 2. Leaving the ask at the profile's address (grade10)

- [ ] 2.1 Take a collector who dismisses the ask at the profile's address to home, replacing the entry the profile holds (zzz-site-site-navigation-SC-23)
- [ ] 2.2 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs zzz-web-spa`
