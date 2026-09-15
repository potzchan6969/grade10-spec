## 1. Every reader knows both titles (grade10)

- [ ] 1.1 One import-free store contracts subpath holds the order id attribute, the title writers use, and the title check; both copies of each go
- [ ] 1.2 Settlement finds the points share by the check, and a paid order carrying "Points" still captures its points
- [ ] 1.3 The till's slot read goes through the check, so a cart titled "Points" or "Deduction from Points", ignoring letter case, is ours to hold, strip and recheck
- [ ] 1.4 The till panel row takes its own copy instead of the wire title
- [ ] 1.5 Tests name the title through the contract, and the tablet recordings stay as recorded

## 2. Release 1 (grade10)

- [ ] 2.1 Deploy the store to staging and publish the till version for a person to release
- [ ] 2.2 Walk the staging tablet: a spend, a strip and a paid sale settle as before; a fixed order discount keyed as "Deduction from Points" keeps its whole title on the cart the extension reads and on the paid order
- [ ] 2.3 Release 1 in production: the store deployed and the till version activated at every location

## 3. Writers switch (grade10)

- [ ] 3.1 The online draft and the till write "Deduction from Points"
- [ ] 3.2 Staging: a spend online and at the till shows the new title on the cart row, the receipt and the paid order
- [ ] 3.3 Production: once every location's manager confirms release 1 is active and the audit rows show no older till version for 7 days, deploy the store and publish the till version

## 4. Say what changed (grade10, grade10-spec)

- [ ] 4.1 The verification doc records the new title's tablet walk and a new recording of the three sales
- [ ] 4.2 The store contracts handbook card names the new subpath and why
- [ ] 4.3 Archive once release 2 is live in production; rename the page lines and take the 🚧 off in the same commit
