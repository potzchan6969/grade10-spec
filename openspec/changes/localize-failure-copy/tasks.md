## 1. One classification (grade10)

- [x] 1.1 `failureKindOf` in `packages/utils/src/apiCalls/failure.ts`: the closed set `offline`, `outage`, `refused`, `unreadable`, `unclassified`, read down the error chain, a status first; `ApiError` variants carry no copy and `apiErrorMessage` is gone - `shared-localization-SC-33`
- [x] 1.2 The admin consoles' `readFailureOf` takes its cause from `failureKindOf`, so its English follows the same kinds - `shared-localization-SC-34`

## 2. The words (grade10-spec)

- [x] 2.1 A `failure` namespace in the shared layer, answered in `en`, `zh-Hant`, `zh-Hans` and `ko` - `shared-localization-SC-35`, `shared-localization-SC-37`

## 3. Collector surfaces (grade10)

- [x] 3.1 `useFailureWords` in `@grade10/frontend-intl`, typed so a kind the catalog does not answer fails the build; tests cover a Korean lost connection, a refusal with the backend's text and call name kept off screen, and an outage and a refusal reading differently in Traditional Chinese - `shared-localization-SC-35`, `shared-localization-SC-36`, `shared-localization-SC-37`
- [x] 3.2 The surfaces that rendered `error.message` or held English failure words render catalog words: the auction catalogue, the lot page and its card setup, the winner order page, the store profile, the Stripe card field - `shared-localization-SC-33`, `shared-localization-SC-36`
- [x] 3.3 The one admin confirm that showed a rejection's `message` words it through the console's `failureWords` - `shared-localization-SC-34`
- [x] 3.4 Verify: typecheck, lint, and the affected unit suites

## 4. The manual (grade10-spec)

- [x] 4.1 The localization page states that a failure notice is read in the page's language; the durable spec carries this change's requirements
- [x] 4.2 Verify: `pnpm check:manual`
