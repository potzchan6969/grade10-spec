# grade10-site/auction/bidding-history Specification

## Feature set

- Maximum-only actions
  - **Submission meaning:** treats every accepted bidder submission as an automatic maximum configuration or raise
  - **Refusal meaning:** a refused attempt is not a bid; it leaves no event, no
    index entry and no standing
- Ordered public records
  - **Automatic response:** places the existing leader's automatic response after the challenger's accepted action
  - **Tie outcome:** accepts an equal maximum, records the challenger before the earlier leader's automatic response at the same resolved amount, and keeps the earlier leader
  - **Outbid outcome:** records only the bidder who submits the higher maximum when no automatic response is placed for the displaced bidder
  - **Whole decisions per page:** a history page ends on a whole auction
    decision, never splitting one
- Boundary cases
  - **Resolved amounts:** fixes the eight outcomes around the current bid, increment, and leader maximum
- Lot personal bidding
  - **Maximum history:** accepted configure and raise caps the owner re-reads on the lot
  - **Bid sequence:** automatic bids Grade10 placed for the owner on that lot
  - **Account labels:** maximum set and raised wording matches the lot
- Privacy boundary
  - **Owner only:** lot lists never expose a rival maximum or identity
  - **Public recent bids:** unchanged public price movements and listing pseudonyms
  - **Public avatar letter:** one email-derived character on public bid rows; never the full email or a name

## MODIFIED Requirements

### Requirement: Private bidding history follows the storefront identity boundary

Only an authenticated storefront backend acting through its storefront-pinned
Auction entrypoint SHALL read an account's bidding index or combined listing
history. The history SHALL match both the pinned storefront and the signed-in
account id. A matching account id from another storefront SHALL NOT grant
access.

Anonymous Auction reads SHALL continue to expose only accepted public price
movements, listing pseudonyms, and one avatar character per public bid row
derived from that bidder's email local part. They SHALL NOT expose automatic
maximums, private event kinds, payment facts, the full email, a display name,
or any other identity behind a pseudonym beyond that single avatar character.
Reading history SHALL NOT place a bid or change any auction fact.

<!-- trace:scenario id=g10.auction-bidding-history.SC-onh rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-15 - A storefront account reads its own history
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **GIVEN** a Grade10 storefront session for account A
- **WHEN** its backend requests A's bidding history through the Grade10-pinned
  Auction entrypoint
- **THEN** Auction returns only A's Grade10 activity and the public movements
  that belong in its combined histories

<!-- trace:scenario id=g10.auction-bidding-history.SC-2pg rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-16 - The same account id on another storefront is unrelated
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **GIVEN** Grade10 and ZZZ each have an account with the same account id
- **WHEN** the ZZZ account reads its bidding history
- **THEN** it receives only activity created through the ZZZ-pinned entrypoint
- **AND** no Grade10 private event or maximum is returned

<!-- trace:scenario id=g10.auction-bidding-history.SC-uu5 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-17 - An anonymous reader cannot read private history
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **WHEN** a request without a storefront session attempts to read an account
  index or combined history
- **THEN** Grade10 refuses the request
- **AND** the anonymous public auction response gains no private field

<!-- trace:scenario id=g10.auction-bidding-history.SC-izn rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-18 - Reading history is inert
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **GIVEN** any retained bidding history
- **WHEN** an authorized collector reads or pages it
- **THEN** no bid, maximum, listing standing, or auction close changes

<!-- trace:scenario id=g10.auction-bidding-history.SC-avl rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-52 - An anonymous public ledger carries avatar letters without emails
**Serves:** grade10-site-auction-bidding-history-US-09 - Collector sees public bid avatars without learning emails

- **GIVEN** a published lot whose public ledger includes a bid from a bidder whose email local part begins with `a`
- **WHEN** an anonymous client reads that lot's public listing or live ledger
- **THEN** that bid's row carries listing pseudonym `Bidder N` and avatar character `A`
- **AND** the response includes neither the email nor a display name

## ADDED Requirements

### Requirement: Public bid rows expose one email-derived avatar character

Every public bid row on an anonymous Auction listing or live ledger SHALL
carry one avatar character derived from that bidder's stored email snapshot,
separate from the listing pseudonym.

- **Derivation** - the character SHALL be the first `A-Z` or `0-9` in the
  email's local part (before `@`), uppercased.
- **Fallback** - when the email is missing, blank, erased, or has no such
  character, the avatar character SHALL be `B`.
- **Separation** - the listing pseudonym SHALL remain `Bidder N` (from the
  listing-local sequence). The avatar character SHALL NOT be encoded into
  that pseudonym string.
- **Privacy** - the public payload SHALL NOT include the full email or a
  display name for that purpose.

<!-- trace:scenario id=g10.auction-bidding-history.SC-av2 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-53 - Digits and missing email fall back correctly
**Serves:** Privacy boundary - Public avatar letter

- **GIVEN** a public bid from a bidder whose email local part begins with `7`, and a public bid whose bidder email was erased
- **WHEN** an anonymous client reads the lot's public ledger
- **THEN** the first bid's avatar character is `7`
- **AND** the erased bidder's avatar character is `B`
- **AND** both rows still show listing pseudonyms of the form `Bidder N`
