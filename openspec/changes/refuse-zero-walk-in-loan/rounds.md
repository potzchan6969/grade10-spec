# Rounds

One row per round: what it read, who read it, what stood and what it asked.
Written by the landing, in the landing's own commit.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | qa, simpler, verifier | the more-than-zero wizard line on Collector Pages and the 🚧 loan line under the Queue's walk-in refusals, landed with the acceptance (grade10-spec#812) | - | - |
| 2 | 2 | missing-pieces, code-smell, conventions, qa, simpler, verifier | the loan checked by the walk-in contract's own amount rule, refused on leaving and cleared by an amount more than zero, an emptied field or a chosen lane, Open case held on the rule alone; MoneyField and UnitField pass onBlur through; the intake already refused a loan of zero, so only its router test is new; grade10#776 | - | grade10-admin-vault-operator-queue-SC-96: packages/vault/admin-frontend/src/features/custody/cases/presentation/views/WalkInDialog.test.tsx; grade10-site-vault-case-intake-SC-42: packages/vault/backend/test/trpc/collectorRouter.test.ts |
