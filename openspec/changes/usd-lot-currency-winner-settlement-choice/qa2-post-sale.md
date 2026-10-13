# QA2 report - post-sale R5

## Scope and method

I read the current post-sale requirements and all scenario bodies in the active change, the restored journeys (`post-sale-US-05`, `post-sale-US-07`, `post-sale-US-20`), all 13 R5 blind cases, the relevant full durable post-sale cases, and `tasks.md`. I compared route, starting state and full observable result. A historical `covers=` list alone did not count as evidence. I did not read this as a request to regenerate cases from scenarios.

The current feature suite has 13 case markers. Its original status count said 0/12; I corrected it to 0/13. All existing case IDs and groups remain. The R5 case revisions are retained.

## R5 case dispositions

| Draft case | Disposition and exact matching scenarios |
| --- | --- |
| `g10adm.auction-post-sale.TC-u4w` - tax typed in USD | Retain, rev 3. Exact route and expected tax conversion align with `post-sale-SC-155`. |
| `g10adm.auction-post-sale.TC-70n` - quote amounts typed in USD | Retain. The USD row and major-unit entry outcome align with `SC-165`. It does not assert the scenario's exact order total in `SC-243`. |
| `g10adm.auction-post-sale.TC-w5z` - edit settlement currency before send | Retain, rev 2. Matches `SC-247`: HKD to USD, same HK Local method, Preparing Invoice remains, log names the change. |
| `g10adm.auction-post-sale.TC-r3c` - reissue in another currency | Retain, rev 2. Matches `SC-245`: USD replacement, old HKD invoice retained, currency change named. |
| `g10adm.auction-post-sale.TC-d4e` - quote names method and rail | Retain, rev 2. Its rows fully assert `SC-117` (FPS named, USD bank fee requested) and `SC-244` (SWIFT named, no other rail, USD fee). |
| `g10adm.auction-post-sale.TC-9yj` - round converted line up to a whole HKD | Retain, rev 2. Exact input and line result match `SC-252` (USD10.01 stored, HKD79.00 sent, USD fact retained). |
| `g10adm.auction-post-sale.TC-jru` - settlement-currency invoice total and locked order | Retain. The first row matches `SC-48`'s HKD1,053 total, send time, seven-day deadline and locked data. The no-insurance row matches `SC-63`. The internal row matches `SC-253` exactly: USD101 bid, USD20.20 premium, USD10.01 shipping, USD0 transfer fee, HKD1,031 total, FPS at close and no earlier invoice/setup step. |
| `g10adm.auction-post-sale.TC-qz7` - large bank transfer fee | Retain. Its USD500 -> HKD3,925 conversion and HKD4,978 total match `SC-119`. |
| `g10adm.auction-post-sale.TC-9i1` - refuse a currency edit that leaves an unoffered rail | Retain, rev 2. Exact USD/SWIFT to HKD with no other method, atomic refusal and no log entry match `SC-248`. |
| `g10adm.auction-post-sale.TC-5vj` - refuse an unoffered rail on reissue | Retain, rev 2. Exact HKD/FPS to USD while keeping FPS, unchanged invoice and no log entry match `SC-246`. |
| `g10adm.auction-post-sale.TC-pjh` - method and rail edit before send | Retain, rev 2. Its accepted address/method edit matches `SC-135`; USD card to FPS refusal matches `SC-138`; USD card to SWIFT acceptance matches `SC-249`. |
| `g10adm.auction-post-sale.TC-ddn` - telephone setup with currency and choice | Retain, rev 2, traced to restored `post-sale-US-20`. Its successful row matches `SC-84`; its missing-currency row matches `SC-250`. The missing choice and billing address rows make valid negative partitions without generating new cases from scenarios. |
| `g10adm.auction-post-sale.TC-rail` - rail-only reissue | Retain, rev 2. The HKD FPS-to-HK Local row matches `SC-254`; USD HK Local-to-SWIFT matches `SC-255`, including new and replaced rail snapshots. |

The case markers now carry the exact post-hoc `covers=` links above. I did not assign `SC-251` to the internal-bid row: its rail and order origin differ, and the totals are not the same scenario. I did not claim that a domain case with different input values verifies `SC-253`.

## Out-of-suite and durable verifiers

These scenarios have no full match in the 13 R5 cases. The named durable cases assert the same complete route and result; the remaining exact behavior has an explicit test-first task. Planned tasks are not test results.

| Scenario | Exact verifier | Reason |
| --- | --- | --- |
| `grade10-admin-auction-post-sale-SC-37` | `g10adm.auction-post-sale.TC-rp1` (`post-sale-US2-TC8-1`) | Single Payment Overdue detail explains the status and offers Reissue. |
| `grade10-admin-auction-post-sale-SC-38` | `g10adm.auction-post-sale.TC-fph` (`post-sale-US8-TC4-1`) | Buyer reissue history spans three orders, and the current order count is shown. |
| `grade10-admin-auction-post-sale-SC-162` | `g10adm.auction-post-sale.TC-pce` (`post-sale-US2-TC5-1`) | Order detail opens from its own location and reload/shared navigation resolves to the same order. |
| `grade10-admin-auction-post-sale-SC-163` | `g10adm.auction-post-sale.TC-xbe` (`post-sale-US2-TC6-1`) | Comment, sent/paid entries and actor/time are on one ordered timeline; empty comment is refused. |
| `grade10-admin-auction-post-sale-SC-164` | `g10adm.auction-post-sale.TC-jip` (`post-sale-US2-TC7-1`) | Failed send keeps the dialog and typed value; corrected retry sends. |
| `grade10-admin-auction-post-sale-SC-49` | `g10adm.auction-post-sale.TC-84x` (`post-sale-US18-TC12-1`) | Missing confirmed address blocks sending. |
| `grade10-admin-auction-post-sale-SC-50` | `tasks.md` 9.9 | No exact durable send-permission case; task names visible-disabled control and server refusal. |
| `grade10-admin-auction-post-sale-SC-69` | `g10adm.auction-post-sale.TC-j3w` (`post-sale-US5-TC18-1`) | Card fee is read from the currency's card rule before send. |
| `grade10-admin-auction-post-sale-SC-70` | `g10adm.auction-post-sale.TC-j3x` (`post-sale-US5-TC19-1`) | HKD card send without the HKD card rule is refused. |
| `grade10-admin-auction-post-sale-SC-68` | `tasks.md` 9.11 | No durable Insurance=0 case; the durable Tax=0 case verifies another field. |
| `grade10-admin-auction-post-sale-SC-118` | `g10adm.auction-post-sale.TC-jn5` (`post-sale-US7-TC25-2`) | The negative bank-transfer fee row refuses send with no invoice; blank, zero and over-subtotal are also distinguished. |
| `post-sale-SC-156` | `g10adm.auction-post-sale.TC-dre` (`post-sale-US5-TC10-1`) | Tax left empty sends an invoice without Tax. |
| `post-sale-SC-157` | `g10adm.auction-post-sale.TC-tuk` (`post-sale-US5-TC11-1`) | Tax entered as zero is refused. |
| `grade10-admin-auction-post-sale-SC-243` | `tasks.md` 9.10 | No R5 case asserts the exact USD order total 312000 with those three lines and USD0 fee. The generic USD row does not establish this total. |
| `grade10-admin-auction-post-sale-SC-107` | `tasks.md` 9.10 | The task now requires the USD bank-transfer reissue to show 312000 before and 316000 after address, Shipping & Handling and Insurance changes, send the replacement for 316000, and retain the 2026-09-19 deadline. This is planned regression work, not proof. |
| `grade10-admin-auction-post-sale-SC-251` | `tasks.md` 9.10 | No R5 case asserts exact HKD103100 for the ordinary HKD/HK Local order with USD101 bid, USD20.20 premium, USD10.01 shipping and zero fee. The numerically similar internal row is a different starting route. |
| `grade10-admin-auction-post-sale-SC-167` | `g10adm.auction-post-sale.TC-ir2` (`post-sale-US5-TC14-1`) | USD card send without a USD rule is refused. |
| `grade10-admin-auction-post-sale-SC-168`, `SC-169` | `g10adm.auction-post-sale.TC-rh9` (`post-sale-US5-TC13-1`) | Fee is computed from the HKD rule and tracks subtotal changes until send. |
| `grade10-admin-auction-post-sale-SC-170` | `g10adm.auction-post-sale.TC-42i` (`post-sale-US5-TC15-1`) | Stale total blocks send and shows read versus current total. |
| `grade10-admin-auction-post-sale-SC-171`, `SC-172` | `g10adm.auction-post-sale.TC-w3j` (`post-sale-US7-TC32-1`) | Method switch empties the bank fee; when bank transfer stays selected, typed fee remains editable and the prior fee is not carried to card. |
| `grade10-admin-auction-post-sale-SC-193`, `SC-194` | `g10adm.auction-post-sale.TC-dxc` (`post-sale-US5-TC16-1`) | Sent card fee stays fixed after rule changes; send dialog shows the deadline it will set. |
| `post-sale-SC-210` | `g10adm.auction-post-sale.TC-yjb` (`post-sale-US7-TC46-1`) | Reissue removes Tax and changes the subtotal. |
| `grade10-admin-auction-post-sale-SC-245` | `g10adm.auction-post-sale.TC-r3c` | The R5 case covers the changed currency and replaced invoice. |
| `grade10-admin-auction-post-sale-SC-246` | `g10adm.auction-post-sale.TC-5vj` | The R5 case refuses an unoffered held rail on reissue. |
| `grade10-admin-auction-post-sale-SC-247` | `g10adm.auction-post-sale.TC-w5z` | The R5 case edits settlement currency before send and records the old/new values. |
| `grade10-admin-auction-post-sale-SC-248` | `g10adm.auction-post-sale.TC-9i1` | The R5 case refuses a currency change with an unoffered existing rail. |
| `grade10-admin-auction-post-sale-SC-249` | `g10adm.auction-post-sale.TC-pjh` | The R5 case accepts USD card to SWIFT and records the edit. |
| `grade10-admin-auction-post-sale-SC-75` | `g10adm.auction-post-sale.TC-unr` (`post-sale-US18-TC1-1`) | Reopen from Setup Overdue gives 48 hours from the reopen time. |
| `grade10-admin-auction-post-sale-SC-76` | `g10adm.auction-post-sale.TC-6p3` (`post-sale-US18-TC2-1`) | Empty reason blocks reopen and leaves deadline passed. |
| `grade10-admin-auction-post-sale-SC-77` | `g10adm.auction-post-sale.TC-l8m` (`post-sale-US18-TC3-1`) | Missing payment-processing blocks reopen. |
| `grade10-admin-auction-post-sale-SC-78` | `tasks.md` 9.11 | Durable `TC-htq` tests a second reopen; no full case tests the third reopen. |
| `grade10-admin-auction-post-sale-SC-79` | `g10adm.auction-post-sale.TC-5rs` (`post-sale-US18-TC7-1`) | Reopen audit entry records reason and new deadline. |
| `grade10-admin-auction-post-sale-SC-80` | `tasks.md` 9.11 | No full durable case attempts reopen before the deadline and confirms the original deadline remains. |
| `grade10-admin-auction-post-sale-SC-81` | `g10adm.auction-post-sale.TC-t9r` (`post-sale-US18-TC6-1`) | Sent invoice prevents reopen. |
| `grade10-admin-auction-post-sale-SC-82` | `g10adm.auction-post-sale.TC-itu` (`post-sale-US18-TC27-1`) | Confirmed address prevents reopen. |
| `grade10-admin-auction-post-sale-SC-83` | `g10adm.auction-post-sale.TC-6yz` (`post-sale-US2-TC9-1`) | Cancelled order refuses reopen and lot remains available. |
| `grade10-admin-auction-post-sale-SC-84` | `g10adm.auction-post-sale.TC-ddn` | R5 telephone setup case accepts full addresses/currency/payment choice after deadline. |
| `grade10-admin-auction-post-sale-SC-90` | `g10adm.auction-post-sale.TC-kp5` (`post-sale-US18-TC25-1`) | Concurrent address write, reopen, phone record and send serialize. |
| `grade10-admin-auction-post-sale-SC-91` | `g10adm.auction-post-sale.TC-20s` (`post-sale-US18-TC26-1`) | Phone-recorded address audit entry names actor and reason. |
| `grade10-admin-auction-post-sale-SC-211` to `SC-214` | `g10adm.auction-post-sale.TC-62p` (`post-sale-US2-TC10-1`) | The four refusal partitions match missing reason, already confirmed, invoice sent and cancelled. |
| `grade10-admin-auction-post-sale-SC-215`, `SC-216` | `g10adm.auction-post-sale.TC-0jl` (`post-sale-US2-TC11-1`) | Unoffered setup methods refuse; reopen remains allowed with no offered method. |
| `grade10-admin-auction-post-sale-SC-250` | `g10adm.auction-post-sale.TC-ddn` | R5 telephone setup case refuses a missing settlement currency. |

`SC-78` does not inherit the durable second-reopen case's result. `SC-68` does not inherit the Tax-zero case. `SC-251` does not inherit the internal route's similar-number row. `SC-107` is covered by planned task 9.10 only; it has no implemented test proof yet. These distinctions prevent false coverage claims.

## Planned verification state

Dev added exact test-first tasks while this pass ran:

- `tasks.md` 9.9 covers `SC-50`: staff sees Send disabled, direct server send is refused, and state is unchanged.
- `tasks.md` 9.10 covers exact quote totals for `SC-243`, `SC-251`, and `SC-253`, plus the exact USD reissue values and retained deadline for `SC-107`; it must keep ordinary HKD/HK Local and internal HKD/FPS setups distinct.
- `tasks.md` 9.11 covers `SC-68`, `SC-78`, and `SC-80` with field- and attempt-specific results.

The tasks are planned tests. No implementation or execution evidence is claimed here.

## Verification and limits

The post-sale suite diff passes `git diff --check`. The suite is still draft and pending human review. I did not run broad acceptance or implementation gates. This report does not classify unrelated scenarios for unchanged requirements outside the quote/send, reissue amount/currency/rail, and telephone setup scope.
