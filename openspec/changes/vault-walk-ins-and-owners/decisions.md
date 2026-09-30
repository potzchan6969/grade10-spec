## Goals

- Staff open a vault draft for a customer at the counter, under the customer's own account, with their own photos and nothing emailed
- The customer sends that draft from their own phone with the wizard's third step, ticking the collection statement, before it is valued or any email is sent
- Staff read whose case it is by name on the queue and the held items, and narrow both to one collector
- Staff open one page per collector that holds the account's name and email and every vault case they hold

## Non-Goals

- Serving a customer whose address belongs to an account someone has signed in to, without their own phone
- A customer with no email address or no phone to send the draft from
- Searching for a person by name in the vault or on the collector page; the Users page's own search is unchanged
- Names for a treasurer, or on the arrears rows, which keep the reference and the contact
- An act that moves a case to another account
- The collector page's items section, which is `add-item-registry`'s, and its grading submissions
- A link to the collector page from the Users panel
- The designer's own collector page; this change ships a first version on the console's blocks
- The wording of the collection statement, which is Legal's

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How do the held items and the queue say whose case it is? | By name - the owner's answer | The case reference and the contact alone, which is what `complete-vault-collector-flow` Q111 gave the arrears row |
| Q2 | Who reads the collector's name? | Staff and admins, behind the identity grant; a treasurer reads the rows as today, with no collector column - taken as recommended | The name on the vault read grant, which hands a treasurer the name Q111 kept off it |
| Q3 | Does this reverse `complete-vault-collector-flow` Q111? | It supersedes Q111 for the queue and the held items only; the arrears row keeps the reference and the contact - taken as recommended | Superseding Q111 everywhere, which puts names in front of the treasurer on the arrears view |
| Q4 | Where does the name come from? | The account's name, read from the account service at each read for the cases on the page, copied nowhere; a name the service cannot answer reads as the short id and "name unavailable", and the list still loads - decided by the round | A name copied into the vault, which is one more place an erasure has to reach; the Users directory's read, which opens the whole directory to staff; the email's local part, which is never needed because every account carries a name |
| Q5 | How do staff find a collector? | By an exact email, an exact phone number, the case reference, or a click on their name; no search by name - taken as recommended | A search by name, which lets staff walk the customer list a piece at a time and needs the directory's grant |
| Q6 | How is the queue narrowed to one collector? | From the collector's name on a row or the collector page; the collector is carried in the URL, never typed - decided by the round | A typed collector field, which is a name search by another route |
| Q7 | Is there a page for one collector? | Yes; the designer draws it, and a first version is built before it - the owner's answer | Leaving a collector's cases spread over the queue, the held items and the identity panel |
| Q8 | What does the first version hold? | A header with the account's name and email under the identity grant, and the vault cases section; each section reads on its own grant and fails on its own; each opening is on the audit chain, as a search is - decided by the round | Waiting for the items and grading sections, which puts the owner's first ask behind two changes |
| Q9 | Who opens the collector page? | Whoever holds the vault read grant; a treasurer reads the cases and no name - taken as recommended | The identity grant for the whole page, which shuts the treasurer out of cases they already read on the queue |
| Q10 | Do staff open a case for a customer who walks in? | Yes - the owner's answer | The standing rule that every case is opened from the customer's own phone, which leaves a customer who arrives with no request drafted to type it on their phone at the counter |
| Q11 | May staff open a case for an address someone has already signed in to? | No: it is refused when the address belongs to an account someone has signed in to, and that customer sends the request from their own phone with staff beside them; the refusal tells staff only that the address has signed in before - taken as recommended | Binding the case to that account, which a typed address does not prove is the customer's; a code mailed to the address and read back at the counter, which is a new entry point in both auth workers |
| Q12 | What makes a walk-in case the customer's? | Nothing about the case is emailed; the customer asks for their own sign-in link on their phone at `grade10.com/vault`, finds the draft on their list and sends it with the wizard's third step; the tick keeps the statement's version, as a customer's own send does - decided by the round | Staff ticking for the customer, which evidences nothing; emailing the case when it opens, which reaches a stranger on a typo; waiting until signing, by when the offer letter has already gone; a submitted case held by a confirmation flag, which every valuation, visit and letter must check |
| Q13 | Does the name staff type rename an existing account? | No: since Q22 staff type no name, so a walk-in sets no name on any account, and an account nobody has signed in to keeps the name it has - decided by the round | Setting it on every call, which lets any caller rename an account |
| Q14 | What happens to a mistyped address? | Staff cancel the unsent draft and open another; the cancellation sends nothing - taken as recommended | An act moving the case to another account, a second way to attach a case to a person |
| Q15 | What does the customer send the draft with? | The wizard's third step, unchanged - decided by the round | A new `VaultConfirmCaseCard`, which redraws a read-back and tick the wizard already has |
| Q16 | What ends a draft staff opened that nobody sends? | the existing **7-day** draft clock, with no email - decided by the round | The **30-day** submitted clock with its own guard |
| Q17 | When does the customer read the collection statement, given staff type their address first? | Deferred to Legal, in the proposal's open questions - recommended: the counter shows the statement before staff type, and the tick on the customer's phone is the record | Relying on the phone tick alone, which comes after the address was collected |
| Q18 | Does a walk-in count against the collector's unsent drafts? | Yes: it counts against the **3**-draft cap and is refused with that cap's refusal - decided by the round | A cap of its own, a second rule for one kind of draft |
| Q19 | May the customer change what staff typed and photographed? | Yes: they may change staff's facts and photos before sending, as on any draft - decided by the round | Locking staff's entries, a draft the wizard edits unlike every other |
| Q20 | What does a draft staff opened send when it expires or is cancelled? | Nothing: no untouched or cancelled email - decided by the round | The draft's own emails, which reach the account at a mistyped address |
| Q21 | Does a collector's name narrow the queue and held items, or only open the collector page? | keep the filter; held rows carry shop, days held, outstanding and pickup, which the collector page's case rows do not, so dropping it loses part of the third goal - decided by the round | Dropping it: one route to one collector's cases, at the cost of a click into each case |
| Q22 | Do staff type the customer's name? | drop the name field; the account reads by its email handle, as checkout-made accounts already do, until the customer names themselves, so no unchecked name lands on an account and neither auth worker changes - decided by the round | Keeping Q13's typed name, set only on created accounts, and showing staff the held name when it differs |
| Q23 | What does the account at a mistyped address keep once staff cancel the unsent draft? | nothing; the draft and staff's photos are removed from that account rather than listed as cancelled, and the account stays as any account nobody has signed in to - decided by the round | Listing it as cancelled, today's rule, which shows a stranger the item; or also erasing the account |
| Q24 | Does the walk-in form wait on Legal's answer to Q17? | yes; its task group starts after Legal answers, and the names and the collector page do not wait - decided by the round | Shipping with the phone tick alone |
| Q25 | Does a counter QR let the customer claim a draft staff opened under no account, instead of staff typing an address? | no; a claim link is a new entry point, a draft under no account has no name on the queue or the collector page, and the first goal puts it under the customer's account - decided by the round | The claim link, which removes the typed address and Q17, Q22 and Q23 |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
