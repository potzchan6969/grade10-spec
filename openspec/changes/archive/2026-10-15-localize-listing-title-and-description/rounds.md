# Rounds

One row per round: the artifact or task group it read, who read it, what stood, what it asked, and the tests that hold the scenarios the group cites.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | 8 | simpler | Group 8 walked the admin write/read/search path (`US-75`, `US-76`, `US-77`), the collector lot page in each language (`US-16`), Relist carrying every language (`US-09`), and inventory write/read/search (`US-75`, `US-76`) through the localized-texts Playwright walks. Create-with-English-alone (`US-03`), inventory upload and English-in-list/history/holds (`US-06`, `US-77` remainder), and the deeper collector paths on `US-01`/`US-02` (share metadata, bid stay, watchlist English) stay covered by the unit and backend suites already landed in groups 2–6 and are named manual here until `/tcs-review` after deployment. Cases stay `draft`, so none was flipped with `tcs:automated`; the flip follows that review | - | apps/frontend/grade10/e2e/tests/admin/auction/localized-texts.spec.ts; apps/frontend/grade10/e2e/tests/inventory/localized-texts.spec.ts — walks by hand (manual disposition): grade10-admin-auction-listing-US-75, US-76, US-77, US-09; grade10-site-auction-listing-page-US-16; grade10-admin-inventory-catalog-US-75, US-76 |
