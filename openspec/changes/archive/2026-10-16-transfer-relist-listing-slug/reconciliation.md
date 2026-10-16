# Cluster reconciliation

Cluster: `transfer-relist-listing-slug` and `release-called-off-listing-slugs` both
touch `grade10-admin/auction/listing` slug behaviour.

## Ownership

| Shared requirement | Owner | Others say |
| --- | --- | --- |
| `Slug is the listing's public lookup key` | `release-called-off-listing-slugs` | Call-off frees the original slug; canceled listings do not answer at that address. `transfer-relist-listing-slug` does not modify this requirement. |
| `Relist opens a new draft from an Unsold listing` | `transfer-relist-listing-slug` | Relist Save transfers the Unsold source slug onto the successor, keeps a distinct listing code, records activity, and leaves no redirect. `release-called-off-listing-slugs` does not modify Relist. |
| `A saved draft receives an editable generated slug` | `transfer-relist-listing-slug` for the Relist source exception and helper text about that exception; field-exit retained-address rules for called-off stay with `release-called-off-listing-slugs` where that change already owns them | — |

## Decisions

No open conflict. Call-off reuse and Relist transfer are different release paths:
call-off frees an address for any later listing; Relist moves one Unsold address
onto its successor on Save.

## Order

1. Either change may accept first once each owns only the requirements above.
2. Archive the second change against the durable contract after the first has folded.
