# QA2 site feature-suite reconciliation

**Change:** `usd-lot-currency-winner-settlement-choice`  
**Run:** Independent QA2, 2026-10-14  
**Scope:** `account-record`, `listing-page`, `bidder-suspension`, `notifications` feature test suites. This pass reviewed the full four suites for their changed routes and currency repairs, without reopening unrelated behavior contracts.

## Inputs and source hashes

The QA1 review was blind to Dev scenarios. QA2 read the frozen QA1 packet, QA1 report/output, Dev report, relevant PRDs and decisions, frozen journeys, feature roots, delta specs and scenarios, task list, durable specs and suites, and the repository TCS governance and conventions.

- Frozen QA1 packet digest: `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`
- QA1 report: `/private/tmp/qa1-1155-r5-output/qa1-report.md`
- Dev report: `/private/tmp/dev-1155-r5-report.md`
- QA1 feature-suite hashes:
  - account-record `7be248a91bf411ad9f163da6bc410751dc60bc7c50f9aa485269871ada961632`
  - listing-page `c6beb341a7298460b92c04e44b52439620f4e752aa1815dd3797c6d854d1671d`
  - bidder-suspension `ffe1019236ee7901e34fe1a4aa909a7991d0b51871f9183b163b12e36c22852a`
  - notifications `4c3f708d3174814b1e5c4be8c203c358f38688033dd1a5bf2377bcba848c018c`
- Delta spec hashes:
  - account-record `d053fce17dcd9728ae0bf5238e1b76fffb3cff3b1447ff6b9cdcba1c50a1a042`
  - listing-page `16f8ec38a3874dd91995672c0b1bc778e1192ccf2d594e26e2c2d24262b80068`
  - bidder-suspension `c837498440ef5ce93fb34bf12a06c643cae4622bb9cc6c67e3d41591eeeec143`
  - notifications `a768bccebc02793ce68fc38ae70f5648e40feb4ee0e7ca1f560b85df94b1d83`
- Delta journey hashes:
  - account-record `5446e4c377d0ec6a5c922e101ea58294cc6948692bf3474b2b1e73b3b13db3e5`
  - listing-page `8605df1f17285ba6ce634c359316382f8a5ac863962bc65e583dd9f82cdc5b3d`
  - bidder-suspension `a9ba5f1bfbda12ec7cc6ff0db5c1cbcde028bf185d02a99eb34eb9ff4c23994a`
  - notifications `095e33cd0cd106ae96c14846299d8e902742b8543e8c01382135cf36e3076f11`
- Durable feature-suite hashes:
  - account-record `53cfb8fa39cbfcc7dcd6ae841fa84bf9680c3e760557edc8e882db131f794d5e`
  - listing-page `cfd389aee62f26fc23889f09d0b35b99e2c2169bb7d9b5804104e98028906320`
  - bidder-suspension `51cf243a9d4be1da84a5f2da4ebd485923b4d7e3b0a0c8a2785f22054678e9c9`
  - notifications `83c51f4c2fb8b7bcc6194067f0b9231c1897951f2b0446af1f5f419f23a56d96`
- Durable spec hashes: account-record `17921deab15dacda08967b2d0b64d7ddfbbe0187a815c9ac4088592be3b405c4`; listing-page `f8458cecb59e3cacf3fd9598f521078a393bfc06ea8b0c0048cd6e3d688bfff2`; bidder-suspension `e3d999453edcf850ccde5f3c1e93c3fbcb12c3d7e5a3bd80fc03f3161d4257a3`; notifications `b399bb119e4014e938bf639b05a53f9707e6fb067ee365a36207e6c0069e7e88`.
- PRDs read: bidding `f8738ff4b7dd8bb105fa4c3ef602f831f9cb14a8e3c61bd339feda869508af2b`; display `56f3b27302c0ac57d845dd0a273182e034fe38ac1a99bdb697657ce3c4acefa9`; post-bidding `d558f5627cbdfae08cdce177ec062366bbe1141d393fea28ead6fbe41ffc6087`.
- Task list hash: `0a6ac668649344b9f3b95cda56812280b80c495d83fa297ca9dfa33aed6e8c2c`.

## Scenario dispositions

| Capability | Changed scenario | Disposition | Full-route case evidence |
| --- | --- | --- | --- |
| account-record | SC-dsc rev1 to rev2 | Covered | `TC-w62` rev3 covers the refused 30300 USD minor-unit raise, unchanged 30000 current price, and both Outbid and Leading row states. |
| account-record | SC-fao rev1 to rev2 | Covered | `TC-y6p` rev3 covers the Active row's 120000 USD minor-unit current price, above customer B's 100000 bid. |
| account-record | SC-b5w rev1 to rev2 | Out of suite | Historical `TC-j99` is deprecated and was left unchanged. Exact regression task: `tasks.md` 7.7 includes account-record SC-66 and plans site tests for My Auctions price and refusal floor. This is planned verification, not proven coverage. |
| listing-page | SC-7c2 rev1 to rev2 | Covered | `TC-5ps` rev3 covers current 120000, accepted high maximum 130000, and next bid 132500 USD minor units. |
| bidder-suspension | SC-o11 rev1 to rev2 | Covered | `TC-0fv` rev3 covers payment, refusal of a 50500 raise against existing 50000 USD minor-unit maximum, retained maximum, refusal of a new maximum on another lot, and continued account suspension. |
| bidder-suspension | SC-tsa rev1 to rev2 | Covered | `TC-stk` rev3 covers the USD bid race at 30000/40000/50000 minor units, resolving to 40500 after the 500 minor-unit increment. |
| bidder-suspension | SC-yn5 rev1 to rev2 | Covered | `TC-stk` rev3 also covers the no-bid case retaining its 30000 USD minor-unit lead. |
| bidder-suspension | SC-1wb rev1 unchanged | Covered | `TC-yp6` rev2 retains the account-level suspension outcome for the existing bid path. |
| notifications | SC-xy1 rev1 to rev2 | Covered | `TC-2lb` rev3 covers the house winning at 30500 USD minor units over the customer A 30000 bid and checks the winner/own-bid close letters and recipient exclusions. |
| notifications | SC-14x rev1 to rev2 | Covered | `TC-7f9` rev3 covers the watcher sold letter at 30500 USD minor units and absence of an ended letter. |

All changed cases remain draft. Case-to-scenario links were added after the blind QA1 pass. No case was derived from a scenario. The deprecated bidder-suspension `TC-80a` was not edited or reactivated.

Listing-page metadata repair: fourteen cases remain draft and now have manual automation status because no execution proof or deciding-test link was available. Testability is `automation, manual`; assertions and opaque trace IDs are unchanged. The cases are `US1-TC1`, `US1-TC2` (`TC-82e`), `US2-TC1` (`TC-89i`), `US3-TC1` (`TC-3xv`), `US3-TC2` (`TC-6r8`), `US4-TC1` (`TC-wka`), `US4-TC2` (`TC-e6y`), `US5-TC1` (`TC-fe3`), `US6-TC1` (`TC-4op`), `US7-TC1` (`TC-pjv`), `US7-TC2` (`TC-i5l`), `US8-TC1` (`TC-jhd`), `US8-TC2` (`TC-amc`), and `US9-TC1` (`TC-84a`). No execution proof is claimed.

## Cross-source reconciliation

The account-record, listing, suspension, and notification routes keep their frozen journeys and feature-root ownership. Their USD values now use minor units consistently. USD bidding uses 500 minor-unit increments in the concrete examples. The account floor is 30500 after a 30000 current price; an attempted 30300 raise is refused. The live listing accepts 130000 and shows a 132500 next bid. The suspension race resolves to 40500, not the old inconsistent 340. SC12's maximum is 50000 minor units, or USD 500. The house close example reports 30500 over 30000.

The relevant PRDs retain USD bidding and the 20% buyer premium rule. None of the changed scenarios in these four feature suites asserts a premium value, so no premium expectation was added here. No contradiction with the PRDs, decisions, frozen journeys, feature roots, or durable baseline was found in this bounded scope.

## Validation and limits

- `git diff --check` passed for the four owned feature-suite files.
- Scoped `node scripts/openspec/validate-test-cases.mjs` passed for account-record, bidder-suspension, and notifications. It reported non-blocking warnings for untouched cases without post-hoc scenario links.
- The listing-page scoped validator now exits 0 with 66 warnings and no errors. The 14 cases above remain manual because no execution proof is linked; warnings are post-hoc-link warnings on untouched cases.
- The repository-wide `pnpm run tcs:validate` exited 1 on multi-level tracing warnings in unrelated store-shelf-scanning and admin auction suites. This was not introduced or repaired in this site-only pass.
- No application tests were run. No implementation execution or human approval is claimed.
- No task-observer entry was written because the parent task explicitly prohibited global observer writes.

## Updated file hashes

- account-record `a4627a037645223dd57d6726ecff8fca9d7144ed4729d82b4358186328d28a23`
- listing-page `2644081bd4cdd46e57af4a81fcf301cf788847ffe467a9cea7731514e2dce471`
- bidder-suspension `89cf61b2eab5b1c62b3f4249ae181590b6c51030b71a178fedd7e2d115a7acb5`
- notifications `671d52ccdec3ac2fdd06f3c77e91b7112e7a824938332a454c87a3e776f3c318`
