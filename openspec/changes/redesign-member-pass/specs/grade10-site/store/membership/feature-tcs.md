# grade10-site/store/membership Test Cases

**Status:** pending-review · 0/0

## Reconciliation

**Run:** no blind pass — the change amends one clause of
`grade10-site-store-membership-SC-09`: a replayed code is still refused,
naming where and when it was first used, but the member's own card no
longer mirrors that answer. The pass keeps rotating instead — a code the
till takes is answered by the next minted pair.

- **Durable cases touched** — `grade10-site-store-membership-US2-TC7-1`
  (replayed code refused) expects "Step 3's card shows the same"; under
  the amended scenario the card shows a fresh code instead, so that
  expected result is dropped and the case otherwise stands — the till's
  refusal naming shop and time is unchanged. `/tcs-review` moves the line
  when the change folds.
- **Proven in the suite** — the pass-side rotation on a fresh pair is
  exercised by the `MemberPass` block stories (`CodeRotates`,
  `PassNeverMintsItsCode`); there is no used rendering to walk, so no
  case is written here.
- **Uncovered** — none beyond the carried durable cases.
