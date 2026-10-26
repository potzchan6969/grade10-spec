# grade10-site/site/page-shell Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-26, tcs-rules r7

## Background

* `<site>` is the Grade10 site: staging answers Store and carries the account page; UAT and production, the auction launch, carry neither Store, the account page nor the membership page. A wide viewport is 1280 CSS pixels; a narrow one 375.

## g10.site-page-shell.US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with my avatar - my profile image where I
chose one, else the initial of my email - above My
Auctions and Sign Out on auction launch, with Profile first wherever the
account page is carried and My Orders ahead of My Auctions once Store
answers, and no item whose page the site withholds,
**so that** one place in the header takes me where I can go for this launch.


<!-- trace:case id=g10.site-page-shell.TC-1su rev=2 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-79q,g10.site-page-shell.SC-o1v -->
### g10.site-page-shell.US3-TC6: The account menu shows the email and avatar, offering only what this build carries

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector with no profile image is signed in on `<build>`.

**Test data:**

| `<build>` | `<items>` |
| --- | --- |
| UAT | My Auctions, Sign Out |
| production | My Auctions, Sign Out |
| staging | Profile, My Orders, My Auctions, Sign Out |

**Steps:**

1. Click the account control, and read the menu.
2. Open the store, then an auction listing, then Profile where offered, and read the account control on each.

**Expected Results:**

* A small avatar showing the initial of the sign-in email sits above the sign-in email, both above `<items>`, in that order and nothing else: no KYC, no Membership; the last reads Sign Out, in Title Case.
* Step 2 names the same collector on every page, Profile with their name and email, and no other person.

<!-- trace:case id=g10.site-page-shell.TC-av7 rev=1 covers=g10.site-page-shell.SC-saj -->
### g10.site-page-shell.US3-TC7: The account menu avatar shows the profile image, not the initial

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on staging.
* The collector has a profile image `<image_1>` on file.

**Test data:**

| Field | Value |
| --- | --- |
| `image_1` | A profile image the collector has saved, in the account page's accepted formats |
| `email_1` | The collector's sign-in email |

**Steps:**

1. Open `<site>`.
2. Select the account control, and read the menu.
3. Open Profile, remove `<image_1>`, then open the account menu again.

**Expected Results:**

* The avatar above `<email_1>` shows `<image_1>`, both above the items, with no initial drawn over it.
* The avatar shows the initial of `<email_1>` once `<image_1>` is removed.

## Settled

* The account menu's avatar shows the collector's profile image where the site carries the account page, and the initial of the sign-in email where they have none.
* On a build that withholds the account page, UAT and production, the avatar is the initial of the sign-in email: no profile image is read there.
* An image that fails to load leaves the initial in the avatar and no broken image.
* The initial is drawn as the header's avatar draws it today; this change does not set its casing or a rule for a first character outside Latin script.
* A changed or removed profile image shows in the menu the next time it opens in the same session, with no reload; the header and the account page share one profile read.

## Reconciliation

**Run:** 2026-10-26, QA2; read the blind suite, `tech-design.md`, `ui-design.md`, the page-shell `spec.md` delta, `decisions.md` and the Site Header and Footer and Page Shell PRD lines; QA1 was denied the requirements, scenarios and technical design, Dev was denied QA1 until its draft was complete.

- **US3-TC6** (revised, `rev` 2) - kept. QA1 narrowed its pre-condition to a collector with no profile image and its first result to the initial of the sign-in email, so it walks the initial on every build and the three rows stay. Its links are unchanged; the case still asserts the whole of `SC-3y1` (the initial avatar, then the email, above the items). The delta's `SC-saj` is not linked here: TC6 never shows an image.
- **US3-TC7** (new, `rev` 1) - kept `draft` and `manual`. QA2 added "both above the items" to its first result so the whole of `SC-saj` is asserted: the image, then the email, above the items, and the initial once the image is removed. Linked to `SC-saj`.
- **New, not an extension** - g10.site-page-shell.US3-TC7 - US3's live cases (TC1, TC4, TC6) all start from a collector with no image and none can show one: folding the image into TC6 would put a staging-only state, a saved image, into a case that runs on UAT and production rows, and mixing the two purposes gives a result no row of TC6 can hold. TC7 is the one route that sets and removes an image.
- **Site-chrome contract** - the `SiteHeader` contract (the `accountAvatarSrc` clause, the image that fails to load, the label alone when no email is supplied) is not in this change; a follow-up change written after `restrict-auctions-by-region` lands specifies it. This suite covers only what the site shows: the image in TC7 and the initial in TC6.
- **Over-claimed cases** - none. TC6 and TC7 assert only what their results say.
- **Contradictions between the readings** - none. QA1 and Dev agree on the avatar's position, on the image replacing the initial, on the initial returning once the image is removed, and that the account menu offers the same items as before.
- **Durable `SC-61`** - the durable avatar statement in the page-shell requirement and its `SC-61` (`SC-3y1`) are narrowed in this delta to a collector with no profile image, and `SC-79` (`SC-saj`) holds the image. The durable site-chrome `SC-34` and Signed in paragraph are the follow-up's to narrow.
- **Raised, answered** - four rows from the two readings, in `decisions.md` `## Raised` as R5 to R8 and answered as Q6 to Q9; the two that belong to the site-chrome contract (Q6, Q8) are carried to the follow-up (`decided by the round`), each in `## Settled`. The held test does not hold them: none moves scope, none is costly to undo, none needs a fact only a person has, and each follows an existing line (the requirement's "wherever the site carries the account page", the avatar primitive's fallback, the Page Shell row that points at the bidding panel's avatar, the shared profile read).
- **Domain, product and platform suites** - no hit: the change's journeys are US-03 of `grade10-site/site/page-shell` and no `grade10-site/site` domain suite, product suite or platform suite traces it.
