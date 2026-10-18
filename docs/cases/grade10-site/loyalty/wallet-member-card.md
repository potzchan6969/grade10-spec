---
page: grade10-site/loyalty/wallet-member-card
reviewed: TBC
---

The page's own examples and flows are cases too, cited by their ids; it has
none yet. The rows below prove what the page states. Cite one as
`grade10-site/loyalty/wallet-member-card#<id>`.

## Wallets

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| google-no-signal | a member with a Google pass and no network on the phone | staff scan the pass | a session opens on the card's terms | smoke |
| google-code-once | a Google code just scanned | the same code is scanned again inside its period | refused | |
| google-code-late | a photographed Google code | it is scanned two periods after its own | it identifies nobody | |
| apple-every-visit | a member with an Apple pass and no network on the phone | the same pass is scanned on two visits | a session opens both times | smoke |
| apple-moves-nothing | a session opened from an Apple pass | staff try to spend points or collect a reward | the panel is read; the spend and the reward are refused, not hidden | smoke |
| counted-apart | members identified from a pass and from the site's card | the identifications are counted | the two are counted apart, and each pass identification names its wallet | |
| one-wallet-offered | a deployment carrying Google and not Apple | a member opens `/membership` | only Google is offered | |
| apple-half-configured | a deployment with the Apple pass type identifier and certificate, but no push credential or no `WALLET_PASS_AUTH_KEY` | a member opens `/membership` | no Apple offer is drawn | building |
| missing-secret-named | a deployment missing one wallet secret | a member tries to add that wallet's pass | the refusal names the missing secret | |
| launch-check-google | a brand and environment with the Google issuer recorded, `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY` and `WALLET_PASS_KEY` unset | `pnpm run secrets --check` runs | it fails, naming both | building |
| launch-check-no-issuer | a brand and environment recording no wallet issuer, no wallet secret set | `pnpm run secrets --check` runs | no wallet secret is reported missing | building |
| launch-check-apns-key | the Apple issuer recorded with an APNs key id, no `WALLET_APPLE_APNS` certificate bound, every Apple secret but `WALLET_APPLE_APNS_KEY` set | `pnpm run secrets --check` runs | it fails, naming `WALLET_APPLE_APNS_KEY` | building |
| launch-check-apns-cert | the Apple issuer recorded with no APNs key id, a `WALLET_APPLE_APNS` certificate bound, every Apple secret but `WALLET_APPLE_APNS_KEY` set | `pnpm run secrets --check` runs | nothing is reported missing | building |

## On the Pass

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| pass-shows | a member with a name chosen for the shop | they add a pass | it shows that name, their tier and the points they can spend | smoke |
| name-fallback | a member with no name chosen for the shop and no account name | their pass refreshes | it shows the address before the `@` | |
| name-placeholder | a member whose record holds the placeholder name older records carry | their pass refreshes | they are named as one with no name chosen for the shop | building |
| name-whole | a name chosen for the shop of 80 characters | the pass refreshes | the pass is sent all 80 characters | |
| name-outage | the account service unreachable, one member with a name chosen for the shop and one without | a lap refreshes both | the first pass shows the chosen name; the second stays as it was until a later lap | building |
| pass-language | a phone set to a language the site does not speak | the member adds a pass | the pass's words are in the brand's default, English for Grade10 | |
| pass-as-of | a member with a live pass | they open it | it says when what it shows was current | |

## Adding and Ending

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| second-pass-replaces | a member with a live Google pass | they add another Google pass | the earlier pass is ended first; one live Google pass remains | |
| wallets-independent | a member with a live pass in each wallet | they end the Google pass | the Apple pass still identifies them | smoke |
| ended-identifies-nobody | a member who ended a pass still on the phone | a code from it is scanned | it identifies nobody, and a new pass added after does | smoke |
| removed-not-ended | a member who deletes the pass from the wallet app | they open their card | membership, points and tier are unchanged | |
| returning-member | a member who added a pass on an earlier visit | they open `/membership` | it names the wallet they carry a pass in, with its ending | |
| failure-per-wallet | a member with a pass in each wallet | ending one fails and an act on the other succeeds | the failure still shows, naming its wallet | |
| standing-unread | a member with a pass, whose passes cannot be read | they open `/membership` | the page says it could not check and keeps the ending | |
| operator-ends | an operator holding `store:write`, a member with a live Apple pass | the operator ends it and confirms | the pass identifies nobody, no message reaches the member, the audit trail records it | building |
| operator-declines | an operator holding `store:write` | they choose a wallet's ending and decline | the pass still identifies the member | building |
| operator-no-grant | an operator without `store:write` | they send an ending | refused as forbidden; the pass stays live | building |
| operator-nothing-held | a member with no live pass in a wallet | an operator ends that wallet's pass | nothing ends, the record says no pass was held, the audit trail records the attempt | building |
| operator-wallets-unread | a member whose wallets cannot be read | an operator opens the record | it says so, offers no ending, and never says the member holds none | building |
| erased-identifies-nobody | a member who asks to be erased | a code from their pass is scanned, and a device fetches the pass | it identifies nobody; the fetch names no member, tier or points | smoke |

## Staying Current

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| spend-next-lap | a member with a live pass | staff spend their points | the pass shows the points left by the end of the next lap | smoke |
| unrecorded-change | a member whose points reach their expiry | that instant passes | the pass is due then, not on the daily floor | |
| dormant-daily | a member with no activity | a day passes | the pass is read once and nothing is sent | |
| burst-one-update | several changes to a member's points inside one lap | the lap runs | the pass is sent once, with what stands after the last | |
| profile-name | a member who saves a new name on the profile | the next lap runs | the pass shows the new name | |
| account-name | a member with no name chosen for the shop | their account name changes | the pass shows it within 24 hours | |
| behind-reports | more passes due than one lap reads | the lap runs | it reports the backlog and the age of its oldest pass | |
