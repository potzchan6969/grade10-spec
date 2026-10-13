## Goals

- Collectors keep a usable custom maximum within the auction's currency ceiling
- Collectors see no maximum-bid message for an oversized entry or defensive above-ceiling answer

## Non-Goals

- Changing USD, HKD or JPY service ceilings, increments, minimum bids or identity checks
- Changing backend refusal codes, refusal logs, accepted bids, history or standing
- Clearing all errors on any edit, changing other refusal messages, or automatically retrying a corrected bid
- Changing quick-bid amount calculations, introducing a new component export, or changing layout, tokens or primitive variants
- Rewriting the archived predecessor's decisions or acceptance snapshot

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What is the field's maximum? | Existing listing-currency ceiling: USD 10,000,000, HKD 80,000,000, JPY 5,000,000,000 whole major units - owner's [maximum-allowed decision](https://github.com/9gag/grade10/issues/1008#issuecomment-6076137634), interpreted across the existing supported currencies. Carried by Listing Page Blocks Custom Maximum and the shared custom-maximum requirement | Universal 9,999,999,999 cap from the archived predecessor; it admits values the auction rejects |
| Q2 | How do typing and paste behave above the ceiling? | Appending typed digits retains the prior valid draft; an oversized replacement or paste becomes the currency ceiling - coordinator's explicit interpretation of the owner's stop-typing and fallback instruction. Carried by Listing Page Blocks Custom Maximum and the shared custom-maximum requirement | Restore-only on paste, empty-on-paste, clear-on-edit, keeping oversized digits, or truncating to an arbitrary smaller prefix; these do not provide the allowed maximum |
| Q3 | Does the site show a maximum-bid message? | No, including a defensive AMOUNT_TOO_HIGH response; the custom field limits input before submission, and the response requires no new field-reset contract or retry - owner's no-message decision and coordinator's narrow defensive scope, carried by Bidding Rules Refusals and A refused bid places nothing | Keep Maximum bid is copy, reset the field from a server response, or automatically retry a corrected amount; these add unrequested behavior |
| Q4 | Does the backend change? | No - retain ceilings, refusal answer and logs; other refusal messages and bid effects stay unchanged. Carried by A refused bid places nothing and the unchanged bid-increments ceiling contract | Alter service validation or suppress operational records to remove a frontend message |
| Q5 | When is the ceiling checked? | After whole-major cleaning; exactly the ceiling is accepted, fractions are discarded without rounding, and set and raise share the rule - existing whole-unit contract retained, carried by the shared custom-maximum requirement | Treat decimal suffix alone as over-ceiling or change accepted units |
| Q6 | How does the custom-field placeholder read? | Restore the existing Storybook treatment: {amount} min. in English, with localized minimum wording and the existing numeric formatter in other locales - [owner's copy correction](https://github.com/9gag/grade10/issues/1008#issuecomment-6076174107). Carried by the existing story copy and scoped catalog-alignment task; this is a settled design correction, not a new ceiling requirement | Custom amount (min. {amount}) in the catalog; it disagrees with the approved story and owner's explicit correction |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
