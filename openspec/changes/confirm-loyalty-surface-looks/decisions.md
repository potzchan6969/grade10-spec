## Goals

- The save action on `/membership` draws each wallet's own artwork before
  either wallet is offered to members.
- The Apple requirement offers the pass only where the worker can sign it,
  answer it and push to it.

## Non-Goals

- A save action in the welcome message.
- A pass for ZZZ.
- The pass's own artwork - launch-wallet-passes' Google step 4 and Apple
  step 4.
- Any wallet setting beyond the ones the worker already reads.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who carries the save action's artwork? | This change, through the shared `WalletPassLinks` export - launch-wallet-passes Q12, tasks 5.9 and 6.10 | That change - it moves its frozen anchors, and QA1 and Dev run again |
| Q2 | When is the Apple pass offered? | Where the pass type identifier, the certificate, the push credential and `WALLET_PASS_AUTH_KEY` are all set - the page's Wallets section and Apple step 8, `packages/grade10-store/backend/src/services/wallet/deps.ts:140-157` and `:261-262`, and `applePush.ts:204-208` in grade10. launch-wallet-passes Q25 hands the widening here | The durable text's identifier and certificate alone - a pass the worker can neither answer nor push to |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/wallet-member-card | R1. From launch-wallet-passes R1: when a member is offered a wallet on `/membership`, do they see Apple's "Add to Apple Wallet" badge and Google's "Add to Google Wallet" button as each vendor publishes them, or a version the Designer redraws around them? The page's save action line and launch-wallet-passes Q12 settle that each wallet's own artwork is drawn. Recommended: each vendor's artwork as published, since both guidelines expect it unaltered. Owner: Designer | |
