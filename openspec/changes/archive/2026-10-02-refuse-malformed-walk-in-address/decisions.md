## Goals

- Staff read why a malformed address is refused, beside the address, before anything is sent
- The walk-in scenarios say what the form does at ten photographs

## Non-Goals

- Checking that an address can receive mail: the form checks its shape only, as the worker does
- Translating the console: its words stay English, as every console string is
- Changing the worker's address rule or its refusal
- A batch of photographs that runs past ten: the console's media gallery owns that refusal

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does a malformed address read? | Beside the address field, before anything is sent, as a fact the intake refuses already reads beside its field - decided by the owner, owner-questions 14, 2026-10-02 | The footer with the worker's own text, which names no field and reads in no rule's words |
| Q2 | Which rule decides that an address is malformed? | The worker's own address rule, read by the form, so the two never disagree (recommended) | A second pattern in the console, which drifts from the worker's and lets an address through to a raw refusal |
| Q3 | When does the refusal show? | When staff leave the address field holding a malformed address, never while they type; Open case stays unavailable while the address is malformed (recommended) | On every keystroke, which refuses each address before it is finished |
| Q4 | Where do the refusal's words live? | In the console, beside its other walk-in words (recommended) | A key in the shared catalogs: the console is English by decision, and translating it is one console namespace, never a key added one at a time |
| Q5 | What does the form do at ten photographs? | It offers no way to add another, and still holds ten - decided by the owner, owner-questions 14, 2026-10-02 | Refusing an eleventh by name, which the form never offers |
| Q6 | Is an empty address refused as not an email address? | No: Open case stays unavailable until an address is typed, as it is today, and nothing is refused beside the field (recommended) | Refusing an empty field the moment staff tab past it, before they have asked the customer |
| Q7 | When does the refusal clear? | As soon as the address meets the rule or is emptied, while staff retype it; it shows again only when they next leave the field (recommended) | Only when they leave the field again, which keeps a corrected address refused |
| Q8 | What does Enter do in the address field before staff leave it? | Nothing beyond what it does for any field the form holds: Open case stays unavailable, and the refusal shows when the field is left (recommended) | Changing the console's shared text field so a refusal waits for leaving the field, which moves every console form for one field's sake |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/vault/operator-queue` | Is an empty email field refused as not an email address, or does Open case stay unavailable until an address is typed? | Q6 |
| `grade10-admin/vault/operator-queue` | Once the refusal shows, does it clear while staff retype the address, or only when they leave the field again? | Q7 |
| `grade10-admin/vault/operator-queue` | While the address is refused, does Open case stay unavailable, as for an over-long title, or stay clickable and open nothing? | Q3 |
