# UI

One surface is new — the page a collector opens from their invitation, on their
own phone, signed in to nothing. One gains a panel: the case screen an operator
reads before the visit.

## Screens

Neither frame exists in Figma; both are `TBC` with Design and block nothing,
because every state below composes primitives the design system already
ships. Nothing below describes a layout — that is the frame's job.

| Surface | App | What changes |
| --- | --- | --- |
| Verification | `@grade10/web-spa` | New, at `/vault/verify`. Secret-gated, not session-gated; the collector may have no account at all. Sibling of `/vault/sign`, and takes the same `session` surface kind. |
| Case detail | `@grade10/admin` (grade10) | Gains the identity panel — where the case's check stands, who performed a bound one, and the override beside a decline. |

The case **list** is unchanged. An operator arranging a visit opens the case;
a column of identity states across every row would put a person's verification
status on a screen nobody opened for it.

## Components

| Export | Package | Carries |
| --- | --- | --- |
| `VerifyFlow` | `@grade10/e-kyc-frontend/verify` | The collector's page: the state of their check, the consent, and the one thing to do next; every word a prop |
| `Button`, `CheckboxButton`, `Center`, `VStack` | `@grade10/design-system` | What the page composes — no variant, token or block had to be added |
| `IdentityPanel` | `@grade10/vault-admin-frontend` | The case panel: the state, who performed a bound check, the findings and decline reason behind `kyc:read`, and the override reason beside a decline; composed from the console vocabulary in `@grade10/frontend-console` |

No `@grade10/ui` block was needed: the collector's page is one column of
words and one control, and the panel is console view code over the vocabulary
every console shares.

## States

Each state below exists because a scenario defines it.

| Surface | State | Scenario behind it |
| --- | --- | --- |
| Verification | Invited — start the check | *An invitation opens the check it names* |
| Verification | Started — carry on where they left off | *A collector returning mid-check is shown where they are* |
| Verification | Submitted or Stalled — wait, nothing is needed | *A check the provider never settles stops being live* |
| Verification | Approved — nothing further | *A completed invitation does not open again* |
| Verification | Declined — bring the document to the store, and no reason shown | *A declined collector is told what to do next* |
| Verification | Expired or Withdrawn — ask to be invited again | *An expired invitation is refused* |
| Case detail | A check is out; the case is not shown as unverified and nothing waits | *A case with a check out is not shown as unverified, and nothing waits on it* |
| Case detail | Verified — who performed it, when, and what the provider found | *A verified case names who performed the check* |
| Case detail | The same panel under `vault:read` alone — state and performer, no person | *A case's identity state is readable, its details are not* |
| Case detail | Refused, with the override beside it | *An override of a refused check carries a reason* |

The collector's page carries no identity field and no reason a check was
refused — a link-holder is not who the check is about, only whoever holds the
link. The panel shows a name, a birth date, a mask or a finding only to
`kyc:read`.

## Words

The collector's page and its invitation are customer-facing, so both go through
`@grade10/i18n`. The catalogue lands in `en` in this change; `zh-Hant` and
`zh-Hans` are a stated non-goal and their own change, which is what the
proposal's Impact means by an English-only catalogue on a site that serves
three locales.
