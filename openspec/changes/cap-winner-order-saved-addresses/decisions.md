## Goals

- An account keeps at most five named shipping addresses
- A winner whose book is full can still confirm a new delivery address for
  the current order without saving a sixth
- Saving to the address book is refused at the cap until the winner frees a
  slot

## Non-Goals

- Forcing the winner to archive an address before confirming a new one for
  the order
- Replace-in-place save (pick which saved address a new one overwrites)
- Hiding Add new address when the book is full
- Building the Account address-book surface in this change
- Changing order address snapshots, amend-without-save, default selection, or
  the unpaid-order archive refuse
- Auto-pruning accounts that already hold more than five addresses

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | At five saved addresses, can the winner still ship somewhere new? | Yes — one-time use for this order still works; only saving is blocked | Must free a slot before any new address can be used — that would risk the address deadline |
| Q2 | How do Add new address and Save for future behave at the cap? | Keep Add new address; refuse Save this address for future orders (disabled or untaken, with a short reason) until one saved address is removed | Hide Add new until archive, or allow save only by replacing a chosen saved address in the same step |
| Q3 | Is the five-address cap Winner Order only or account-wide? | Account-wide on the platform shipping address book `(recommended)` | A Winner Order–only cap while other storefronts stay unlimited — the book is already shared across storefronts |
| Q4 | What happens if an account already holds more than five? | Keep the existing addresses; refuse new saves until the count is below five `(recommended)` | Force-prune down to five, or allow further saves until the book somehow shrinks |
| Q5 | Does editing a saved address consume a slot? | No — edit keeps one entry; the cap counts named addresses held `(recommended)` | Treat a save-on-edit as a new address that needs a free slot |
