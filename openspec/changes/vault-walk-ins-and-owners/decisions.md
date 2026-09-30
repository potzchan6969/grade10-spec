## Goals

- Staff open a vault case for a customer at the counter, under the customer's own account, with their own photos and nothing emailed
- The customer confirms that case on their own phone with the collection-statement tick before it is valued or anyone is written to
- Staff read whose case it is by name on the queue and the held items, and narrow both to one owner
- Staff open one page per collector that holds the account's name and email and every vault case they hold

## Non-Goals

- Serving a customer whose address someone has already signed into without their own phone
- Searching for a person by name, anywhere in the console
- Names for a treasurer, or on the arrears rows, which keep the reference and the contact
- An act that moves a case to another account
- The items and grading sections of the collector page
- A link to the collector page from the Users panel
- The designer's own collector page; this change ships a first version on the console's blocks
- The wording of the collection statement, which is Legal's

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How do the held items and the queue say whose case it is? | By name - the owner's answer | The case reference and the contact alone, which is what `complete-vault-collector-flow` Q111 gave the arrears row |
| Q2 | Who reads the owner's name? | Staff and admins, behind the identity grant; a treasurer keeps the reference and the contact and sees no name - taken as recommended | The name on the vault read grant, which hands a treasurer the name Q111 kept off it |
| Q3 | Does this reverse `complete-vault-collector-flow` Q111? | It supersedes Q111 for the queue and the held items only; the arrears row keeps the reference and the contact - taken as recommended | Superseding Q111 everywhere, which puts names in front of the treasurer on the arrears view |
| Q4 | Where does the name come from? | The account's name, read from the account service at each read for the cases on the page, copied nowhere; a name the service cannot answer reads as the short id and "name unavailable", and the list still loads - decided by the round | A name copied into the vault, which is one more place an erasure has to reach; the Users directory's read, which opens the whole directory to staff; the email's local part, which is never needed because every account carries a name |
| Q5 | How do staff find an owner? | By an exact email, an exact phone number, the case reference, or a click on their name; no search by name - taken as recommended | A search by name, which lets staff walk the customer list a piece at a time and needs the directory's grant |
| Q6 | How is the queue narrowed to one owner? | From the owner's name on a row or the collector page; the owner is carried in the address, never typed - decided by the round | A typed owner field, which is a name search by another route |
| Q7 | Is there a page for one collector? | Yes; the designer draws it, and a first version is built before it - the owner's answer | Leaving a collector's cases spread over the queue, the held items and the identity panel |
| Q8 | What does the first version hold? | A header with the account's name and email under the identity grant, and the vault cases section; each section reads on its own grant and fails on its own - decided by the round | Waiting for the items and grading sections, which puts the owner's first ask behind two changes |
| Q9 | Who opens the collector page? | Whoever holds the vault read grant; a treasurer reads the contact the cases hold and no name - taken as recommended | The identity grant for the whole page, which shuts the treasurer out of cases they already read on the queue |
| Q10 | Do staff open a case for a customer who walks in? | Yes - the owner's answer | The standing rule that every case is opened from the customer's own phone, which leaves a customer with no phone to hand unserved |
| Q11 | May staff open a case for an address someone has already signed into? | No, in the first version: it is refused by name, and that customer sends the request from their own phone with staff beside them - taken as recommended | Binding the case to that account, which a typed address does not prove is the customer's; a code mailed to the address and read back at the counter, which is a new entry point in both auth workers |
| Q12 | What makes a walk-in case the customer's? | The customer signs in on their own phone with the emailed link and confirms the case, ticking the collection statement; the tick records the statement's version and the time, and the valuation and every email wait for it - taken as recommended | Staff ticking for the customer, which evidences nothing; emailing the case when it opens, which writes to a stranger on a typo; waiting until signing, by when the offer letter has already gone |
| Q13 | Does the name staff type rename an existing account? | No: it is set only on an account the walk-in creates; an unsigned account keeps the name it has - decided by the round | Setting it on every call, which lets any caller rename an account |
| Q14 | What happens to a mistyped address? | Staff cancel the case and open another; the cancellation sends nothing - taken as recommended | An act moving the case to another account, a second way to attach a case to a person |
| Q15 | What does the case page draw for the confirmation? | A new block in `shared/ui/vault-case`, beside the accept confirmation: the request read back, the tick and Confirm, with its pending and refused states; its look waits for the designer - decided by the round | A `FactCard` with the tick in its actions slot, which puts a consent tick in a slot drawn for buttons |
| Q16 | What ends a walk-in nobody confirms? | ❓ pm - recommended: the **30-day** submitted clock ends it as expired, and no email goes | A shorter clock of its own, one more timer for a case that holds nothing yet |
| Q17 | When does the customer read the collection statement, given staff type their address first? | ❓ legal - recommended: the counter shows the statement before staff type, and the tick on the customer's phone is the record | Relying on the phone tick alone, which comes after the address was collected |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
