# QA2 auto-bidding reconciliation

**Result** - Reconciled the auto-bidding feature suite against the current delta and frozen planning inputs. The suite retains 33 case headings and its historical walk and group headings. Thirty active cases remain draft. Three pre-existing deprecated provider-hold cases are unchanged at QA1 revisions. Opaque IDs are retained. No case was added.

**Inputs and SHA-256**

- Frozen QA1 packet: `/private/tmp/qa1-1155-r5-input`, digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`.
- QA1 report: `e1d168262df8afd0f8f3a03d9145f33c94e5d74350c0176a2b551d89638c0f66`; QA1 output feature suite: `b4df5ad5c345e7d6a8ba8f9a30cab9b5b8f73c09e0df3a6d683b3d4be79d6baa`.
- Dev report: `a0de075220bca1096762e466c6caa7d6a4ad3724fdf930443c9533b6ba9f6b83`; Dev preflight reported ready with no blockers at `/private/tmp/accept-review-1155-r5-dev-preflight.json`.
- Current auto-bidding delta spec as reconciled after QA2: `d3aaa8412ad5fe7d625fc9413a4fd218bcfbd506f5e20d489e17245b0bf5b4e8`; SC-15 is now rev3; current journey anchors: `0f80e8826b895ea3f03c4d5d611f1f25ee9be395853a81aae99fcaa35ed4b807`.
- Current bid-increments delta spec: `c429c499ffcf1eeba2cf1102540def63e3470ef3754cabb56df959b374127028`; decisions: `5ba3078ceff5ec0e495ab373677b8fecd667c90ccf942ebc1230592e8a951428`; proposal: `57ff9b4a769d83cd6fbd7df2a08a60aae3ab90d803b121f260549c475caa21c9`; tasks: `3ebd1b4342299712f57ecdeffc941e4a05e34fc9923b60d8b8658dec0472a80c` (updated to add task 7.14 and SC-15 refs to tasks 7.7/7.8).
- Durable auto-bidding spec: `4c9ea8c149da5987c7958e928a40150cc8bd8690479918d14364310f1e74bfce`.
- Frozen PRDs read: site bidding `f8738ff4b7dd8bb105fa4c3ef602f831f9cb14a8e3c61bd339feda869508af2b`, site auction index `2fdfa26010b5eac479327450b3bde99452b5bec8716046063294371376bfe6f1`, post-bidding `d558f5627cbdfae08cdce177ec062366bbe1141d393fea28ead6fbe41ffc6087`.
- Frozen planning rules read: specs-to-test-cases `d0be740ea9150360f08c6f73b5494e827a5ddce235369112367bfba18ccae0be`; TCS conventions `4badf297be3411c9c9d143a95522ea81ad80a4172e5f7ce0a286c683084b4767`.
- Final feature suite: `5bf7b3e539c1fda9f4cd4a8281c428e002b59db1ada39c32c89d42981f241a12`.

**Case dispositions** - `TC-7gl@2`, `TC-9qy@2`, `TC-vq3@2`, `TC-j8v@3`, `TC-65a@3`, `TC-y4r@3`, `TC-ic0@3`, `TC-mjs@3`, `TC-13a@3`, `TC-7io@3`, `TC-nmi@3`, `TC-1qu@3`, `TC-hpg@3`, `TC-29q@3`, `TC-s1n@3`, `TC-wr4@2`, `TC-7oh@3`, `TC-m47@2`, `TC-6gi@3`, `TC-19o@3`, `TC-9jg@3`, `TC-de4@3`, `TC-63a@3`, `TC-vzk@2`, `TC-rmo@2`, `TC-zjt@2`, `TC-s4f@4`, `TC-y3w@2`, and `TC-wqa@2` remain active drafts. `TC-dhr@2`, `TC-5xp@2`, and `TC-hqr@2` retain inherited deprecated status and revision; QA2 did not alter them. `US1-TC1` has no opaque case marker in the QA1 output and remains unmarked. QA2 made no status change to an active case.

**Scenario dispositions** - The 34 current auto-bidding scenarios are accounted for. Full feature-case coverage links: SC-05 `TC-mjs`; SC-06 `TC-13a`; SC-07 `TC-7io`; SC-08 `TC-de4`; SC-45 `TC-63a`; SC-09/11/12/16 `TC-1qu`; SC-10 `TC-hpg`; SC-13 `TC-29q`; SC-14 `TC-s1n`; SC-17 `TC-7oh`; SC-18 `TC-nmi`; SC-30 `TC-65a`; SC-30a `TC-ic0`; SC-31 `TC-y4r`; SC-25 `TC-s4f`; SC-34 `TC-6gi`; SC-47 `TC-19o`; SC-36/37 `TC-9jg`.

- SC-15 initially conflicted with the formula: with A=800000, B=810000 and the USD increment of 5000, `min(810000, 800000 + 5000) = 805000`. The source was corrected in rev3 to 805000. It remains unlinked because no feature case fully asserts its route and result; tasks 7.7 and 7.8 now include this exact planned schedule outcome.
- SC-33 and SC-41/42/43 have exact planned implementation-test references at tasks 7.7 and 7.8. These are planned verification tasks, not full case coverage or execution evidence.
- SC-32, SC-35, SC-38/39/40/44/46 have no full feature case or exact planned test task reference identified. These are uncovered scenarios. No vague backend check or unrelated existing case is offered as a verifier.

**Repairs and limits** - Added focused planned regression task 7.14 for the remaining house and rules-only behaviors. Corrected zero-start fixtures so every USD listing opens at USD1 regardless of maximum; corrected the second-maximum refusal boundary to USD1 refused/USD2 accepted. Corrected `TC-1qu`'s USD501 row to USD510 under the one USD schedule. Removed the false SC-30 link from the lower-maximum case and linked it to the zero-start lone-maximum case. Removed the false SC-32 link from the no-card case. Bumped revisions for affected markers and assertions. The SC-15 source discrepancy is fixed; the remaining out-of-suite scenarios have exact planned test refs; QA2 raised no human question because no additional product decision was needed to finish this review. No implementation tests were run. No test execution, product acceptance, or human approval is claimed.

**Observer** - No observation was logged because the parent task set a no-write boundary for the shared observer store.
