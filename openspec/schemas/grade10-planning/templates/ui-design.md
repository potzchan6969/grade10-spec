## Screens

<!-- One subsection per user-facing surface. Link the Figma frame - never describe a screen in prose -->

## Components

<!-- Design-system primitives and packages/ui exports each screen composes,
     named exactly. Flag what does not exist yet as work in this repo: a
     component, a variant, a token, or a word packages/i18n has to answer in
     every language of its layer. -->

## States

<!-- Loading, empty, error, and edge states per screen, ONE STATE PER BULLET,
     each tied to the anchor it dresses: a journey id from user-journeys.md, or
     a ## Feature set root group. NEVER a scenario id - this file is written
     before the scenarios exist, and `pnpm check:manual` refuses an id the store
     issues nowhere.

     The requirements' second pass walks this list and closes every bullet, on
     the bullet itself: the scenario id it became, in backticks, or
     **Out of suite:** naming where the state is stated instead. Nothing else
     closes one, and `pnpm check:manual` names a bullet that does neither. One
     bullet holding three states can be closed by one scenario and look
     complete, which is why the list is one state per line. -->

<!-- - Empty catalogue - `grade10-site-store-product-listing-US-02`
     - Offline retry - `grade10-site-store-product-listing-US-02` -->

<!-- Copy a journey id from the heading that issues it, and write it in
     backticks: `grade10-site-store-product-listing-US-02`. A prefix is never
     inferable from the path - a few capabilities issue a shorter one and keep
     it - and outside backticks nothing reads the citation. -->
