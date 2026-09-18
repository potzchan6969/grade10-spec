## Context

| Value | Where it is read from | Now |
| --- | --- | --- |
| Link lifetime | `SIGN_IN_LINK_TTL_SECONDS`, `@grade10/auth-contracts` | 300 |
| Resend wait | `SIGN_IN_SEND_WINDOW_SECONDS`, same module | 60 |
| What the email promises | `login.body`, `packages/i18n/messages/shared/<locale>/email.json` | 15 minutes |

- **The enforced lifetime already reads 5 minutes.** `createAuth.ts` passes the
  constant to better-auth's `magicLink({ expiresIn })`. It read 60 until
  `sign-in-link-follow-feedback` raised it to 300 on grade10's `main`, so this
  change's first requirement landed inside another change's pull request.
- **The email still promises 15 minutes**, in each of the 4 locales the shared
  catalog speaks. A brand overrides `login.subject` and nothing else, so one key
  per locale decides what both Grade10 and ZZZ send.
- **Two worker tests already assert that body** — Grade10's Traditional Chinese
  and ZZZ's Korean — so the copy edit is proved by tests that exist.
- **The expiry lives on one server row.** `authKv.expiresAt` for
  `verification:<token>`. better-auth reads it, and nothing a follower sends is
  consulted.
- **The dev seam ends a link's life and cannot age it.**
  `POST /auth/dev/expire-sign-in-link` moves `expiresAt` to a second ago, which
  is every case except the ones that follow a link while it still works.
- **No test reads the recorded expiry**, so neither the number nor the boundary
  at the 5-minute mark is pinned anywhere.

## Goals / Non-Goals

**Goals:**

- The promised number and the enforced number come from one decision, and a
  test fails when they drift apart.
- Every lifetime row of the suite runs without spending its delay in wall clock.

**Non-Goals:**

- **The resend wait, the one-email-a-minute cap, one-time use and
  newest-mail-wins** — untouched.
- **A session lifetime** — `shared/auth/session` states none, and the ❓ stays
  on its page.
- **A lifetime settable per environment or brand** — one number, per Q6.

## Decisions

- **The lifetime stays one constant in `@grade10/auth-contracts`.** The
  requirement fixes the duration and the resend wait is a second constant
  already; the worker keeps reading both from contracts rather than from an
  environment binding, which Q6 rejected.
- **The copy writes the duration in digits.** Every locale already writes `15`
  as a digit, so `5 minutes`, `5 分鐘`, `5 分钟`, `5분`. Rejected: each
  language's own word for five, which the PRD still holds open and which would
  change 4 strings and no code.
- **Ageing replaces expiring on the dev seam.**
  `ageSignInLinks(db, email, seconds)` moves `expiresAt` back by `seconds`, so
  "followed 4 minutes after the send" is `seconds: 240` and the exact mark is
  `seconds: 300`. `expireSignInLinks` goes; the Playwright helper keeps its
  `expireSignInLink(request, email)` face and passes the lifetime plus a second,
  so the 4 specs that walk an expired link do not move.
  - Rejected: **an optional `seconds` on the existing route**, whose default
    would have to mean "past the end" — a number guessed at the call site.
  - Rejected: **waiting the delay out**, which costs 5 minutes a row and makes
    the boundary rows flaky rather than deterministic.
- **The recorded expiry is read, never recomputed.** The api-layer case reads
  `authKv.expiresAt` back and compares it to the send plus the lifetime, so the
  test fails on a stamp better-auth writes differently, not on arithmetic the
  test repeats.
- **No `ui-design.md`.** The change moves one catalog value. No component,
  token, template or layout moves, and the confirmation dialog says nothing
  about the lifetime (Q5).

## API Contracts

Dev-only, behind the same `devOnly` gate as the rest of `/dev/*`; every deployed
environment answers 403.

| Route | Body | Answer |
| --- | --- | --- |
| `POST /auth/dev/age-sign-in-link` | `{ email, seconds }` | `{ aged: <count> }`, or 404 when the address holds no unused link |

It replaces `POST /auth/dev/expire-sign-in-link`, which
`docs/architecture/e2e.md` names.

## Risks / Trade-offs

- **The number lives in the constant and in 4 strings** → the English body
  asserts the digit against `SIGN_IN_LINK_TTL_SECONDS`, so raising the constant
  fails a test rather than shipping a stale promise. The other 3 locales stay
  literal assertions: a sentence in Korean or Chinese cannot be matched against
  a number without pinning its whole shape.
- **An intercepted inbox holds an openable link for 5 minutes rather than 1** →
  accepted in Q1. One-time use and newest-mail-wins are unchanged, so a
  follower still gets one session and only from the newest email.
- **A seam that ages a link can be handed a negative number and lengthen one**
  → the route is dev-only and the helper is the only caller; the function
  refuses a `seconds` below zero.

## Migration Plan

1. The store's copy change merges, then grade10 bumps `external/grade10-spec`.
2. Deploy. No data migration: the expiry is stamped at send time, so links in
   flight keep the lifetime they were sent with.
3. Rollback is the copy revert and the submodule bump. The enforced lifetime is
   already live and stays.

## Open Questions

- **How each locale writes the number** — the ❓ on the Sign-In page, Product's
  to close. It does not block: the catalog's own form is digits and this change
  follows it, and an answer later moves 4 strings and no code.
