# Rounds

One row per round: what it read, who read it, what stood and what it asked.
Written by the landing, in the landing's own commit.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | qa, simpler, verifier | the 🚧 address line under the Queue's walk-in refusals, landed with the acceptance (grade10-spec#807) | - | - |
| 2 | 2 | missing-pieces, code-smell, conventions, qa, simpler, verifier | the address checked by the walk-in contract's own rule, refused on leaving and cleared on fixing through one addressRefused flag, Open case held on the rule alone; the walk's forced click proves nothing is sent; grade10#772 | - | grade10-admin-vault-operator-queue-SC-95: packages/vault/admin-frontend/src/features/custody/cases/presentation/views/WalkInDialog.test.tsx; grade10-admin-vault-operator-queue-SC-75: packages/vault/admin-frontend/src/features/custody/cases/presentation/views/WalkInDialog.test.tsx |
| 3 | test-cases | simpler, verifier | US10-TC9-2 and US10-TC15-1 decided by walk-in.spec.ts (grade10#772); none stays manual; both stay draft for human QA after deployment | - | - |
