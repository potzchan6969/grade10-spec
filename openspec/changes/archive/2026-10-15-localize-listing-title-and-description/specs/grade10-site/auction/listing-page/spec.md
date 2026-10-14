# grade10-site/auction/listing-page — delta

## Purpose

What one lot's address serves: the lot's own page, in the response before any
script runs, what a shared link unfurls as, and the refusal when the auction
holds no such lot. While the lot is open, the page follows it live: its
countdown on the auction service's clock, each committed bid, extension and
close without a reload, and its result only once the close is recorded.

A lot address names one lot by the id the catalogue already addresses it by.
Every requirement of `grade10-site/site/crawlable-pages` binds it — it is a public
surface, so its title, description, share metadata and sitemap treatment are
that capability's, per lot rather than per page. What a bid must clear, when a
close extends and how a lot is settled stay `grade10-site/auction/auction`'s. The card, the lot page and the lot's share metadata read in the page's language, with English where no text was written.

## Feature set

- Lot in the reader's language
  - Page language: the card and the lot page show the title and description in the language the page is read in
  - English fallback: a language with no text shows the English text, and one Chinese is never shown in place of the other
  - Share metadata: the page title, meta description and Open Graph title and description follow the page's language
  - Reference stays English: support identifies a lot by its English title and its address

## ADDED Requirements

### Requirement: The card and the lot page read in the page's language

The card and the lot page SHALL show a lot's title, and the lot page its
description, in the language the page is read in: English at the default
address, Traditional Chinese under `/tc` and Simplified Chinese under `/sc`.
Each text falls back on its own to the English text the lot already carries,
where the operator wrote none in the page's language or wrote only spaces. One
Chinese SHALL never be shown in place of the other. A lot with no translation
reads exactly as it did before translations existed. The text is in the
response HTML before any script runs, and it stays on screen when scripts take
the page over and while the lot is followed live.

An edit reaches a collector the next time the page loads or re-reads the lot;
a page already open is not pushed the edit. A page language the brand has no
field for reads English.

<!-- trace:scenario id=g10.auction-listing-page.SC-j2a rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-60 - A Traditional Chinese lot page reads Traditional Chinese
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot with an English, a Traditional Chinese and a Simplified Chinese title and description
- **WHEN** its Traditional Chinese address is fetched and no script executes
- **THEN** the page's title and description elements and its head tags contain the Traditional Chinese title and description
- **AND** none of them contains the English or the Simplified Chinese text

<!-- trace:scenario id=g10.auction-listing-page.SC-w5f rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-61 - The card reads the page's language
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot with a Simplified Chinese title
- **WHEN** a collector reads the auction catalogue at the Simplified Chinese address
- **THEN** the lot's card shows the Simplified Chinese title
- **AND** at the default address the same card shows the English title

<!-- trace:scenario id=g10.auction-listing-page.SC-iqj rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-62 - A Simplified Chinese reader of a Traditional-only lot reads English
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot with a Traditional Chinese title and description and no Simplified Chinese text
- **WHEN** its Simplified Chinese address is fetched and no script executes
- **THEN** the response HTML contains the English title and description
- **AND** it contains no Traditional Chinese text of the lot

<!-- trace:scenario id=g10.auction-listing-page.SC-sbq rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-63 - A missing text falls back on its own
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot with a Traditional Chinese title and no Traditional Chinese description
- **WHEN** its Traditional Chinese address is fetched
- **THEN** the page shows the Traditional Chinese title
- **AND** the English description

<!-- trace:scenario id=g10.auction-listing-page.SC-x0m rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-64 - A blank translation reads as not written
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot whose Traditional Chinese title is only spaces
- **WHEN** a collector reads the lot at its Traditional Chinese address and in the catalogue
- **THEN** the page and the card show the English title
- **AND** no empty title is shown

<!-- trace:scenario id=g10.auction-listing-page.SC-23r rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-65 - A lot with no translation reads as before
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot written before translations existed
- **WHEN** it is read at the default, the Traditional Chinese and the Simplified Chinese addresses
- **THEN** each page and card shows the same English title and description

<!-- trace:scenario id=g10.auction-listing-page.SC-7kj rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-66 - The language survives the handover and the live lot
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a Traditional Chinese lot page served with a Traditional Chinese title and description
- **WHEN** scripts run and the lot room delivers a bid
- **THEN** the title and the description on screen are still the Traditional Chinese text
- **AND** no loading placeholder or English text appears in between

<!-- trace:scenario id=g10.auction-listing-page.SC-ex9 rev=2 -->
#### Scenario: grade10-site-auction-listing-page-SC-67 - An edit shows on the next load
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a collector reading a lot at its Traditional Chinese address
- **WHEN** an operator changes the lot's Traditional Chinese title and the open page receives live frames
- **THEN** the open page keeps the title it showed
- **AND** the next load of the address, or the page's next re-read of the lot, shows the new title

### Requirement: A lot's address and reference stay the same in every language

A lot SHALL answer at the same slug under every language prefix, and support
SHALL identify a lot by its English title and its address. Featured, My
Auctions, the watchlist, the account record and the winner order pages keep the
English title on a Chinese page.

<!-- trace:scenario id=g10.auction-listing-page.SC-xpl rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-68 - One slug in every language
**Serves:** Lot in the reader's language - reference stays English

- **GIVEN** a published lot with Traditional Chinese and Simplified Chinese titles
- **WHEN** its address is read at the default, `/tc` and `/sc`
- **THEN** each answers with the lot, and the slug in all three is the same

<!-- trace:scenario id=g10.auction-listing-page.SC-9yd rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-69 - Other surfaces keep the English title
**Serves:** Lot in the reader's language - reference stays English

- **GIVEN** a lot with a Traditional Chinese title that a collector watches and won
- **WHEN** they read Featured, My Auctions, the watchlist, their account record and the winner order page on Traditional Chinese pages
- **THEN** each names the lot by its English title

<!-- trace:scenario id=g10.auction-listing-page.SC-i12 rev=2 -->
#### Scenario: grade10-site-auction-listing-page-SC-72 - Image alt text keeps the English title
**Serves:** Lot in the reader's language - reference stays English

- **GIVEN** a published lot with a Traditional Chinese title and an image with no alt text of its own
- **WHEN** its Traditional Chinese address is fetched and its card is read in the catalogue
- **THEN** the lot page's gallery images and the card's image and video label carry the English title

<!-- trace:scenario id=g10.auction-listing-page.SC-p4n rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-73 - A title with markup characters renders as text
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot whose Traditional Chinese title is `<b>噴火龍</b> & "首版"`
- **WHEN** its Traditional Chinese address is fetched and no script executes
- **THEN** the page and the head tags carry that title as text, escaped
- **AND** the page holds no element made from it

<!-- trace:scenario id=g10.auction-listing-page.SC-5uz rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-74 - Switching the page language switches the lot's texts
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a collector reading a lot at its Traditional Chinese address
- **WHEN** they switch the page to Simplified Chinese and then to English
- **THEN** the title and description show that language's text, or the English fallback, each time
- **AND** the text of the language left is never shown again

<!-- trace:scenario id=g10.auction-listing-page.SC-qi8 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-75 - A page language with no field reads English
**Serves:** grade10-site-auction-listing-page-US-16 - Collector reads a lot's title and description in their own language

- **GIVEN** a published lot with Traditional Chinese and Simplified Chinese texts
- **WHEN** it is read in a page language the brand has no field for
- **THEN** the page shows the English title and description

## MODIFIED Requirements

### Requirement: A shared lot link unfurls as the lot

A lot address SHALL carry Open Graph title, description and URL naming that
lot and its own canonical address, readable without executing scripts. A
shared lot link SHALL NOT unfurl as the auction catalogue. The page title, the
meta description and the Open Graph title and description SHALL follow the
language of the address, with the fallback of the page: a Traditional Chinese
address unfurls in Traditional Chinese, and a Simplified Chinese address of a
lot with only Traditional Chinese text unfurls in English.

<!-- trace:scenario id=g10.auction-listing-page.SC-mda rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-03 - A preview fetcher reads a lot
**Serves:** grade10-site-auction-listing-page-US-02 - Collector shares a lot link

- **WHEN** a lot address is fetched and no script executes
- **THEN** the response carries `og:title`, `og:description` and `og:url`
  naming that lot and its own address
- **AND** none of them names the auction catalogue in its place

<!-- trace:scenario id=g10.auction-listing-page.SC-yu8 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-70 - A Traditional Chinese link unfurls in Traditional Chinese
**Serves:** grade10-site-auction-listing-page-US-02 - Collector shares a lot link

- **GIVEN** a published lot with a Traditional Chinese title and description
- **WHEN** its Traditional Chinese address is fetched and no script executes
- **THEN** the page title and `og:title` carry the Traditional Chinese title
- **AND** the meta description and `og:description` are made from the Traditional Chinese description
- **AND** `og:url` is that address

<!-- trace:scenario id=g10.auction-listing-page.SC-7b2 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-71 - A link in a language with no text unfurls in English
**Serves:** grade10-site-auction-listing-page-US-02 - Collector shares a lot link

- **GIVEN** a published lot with a Traditional Chinese title and description and no Simplified Chinese text
- **WHEN** its Simplified Chinese address is fetched and no script executes
- **THEN** the page title, `og:title`, meta description and `og:description` carry the English title and description
