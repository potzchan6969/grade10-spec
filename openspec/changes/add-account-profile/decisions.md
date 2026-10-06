## Goals

- A collector who has never saved opens a profile to adjust, never a form to create
- The profile, the till and the wallet pass name a member the same way
- A collector sets an avatar of their own and removes it again
- The page shows the address the collector signed in with and the date they first saved
- Grade10 and ZZZ, which render the same account page, both gain it

## Non-Goals

- **A public collector profile** — a profile stays visible to its owner only;
  a public address, a seller's identity on a listing or a lot, and follower
  counts are a change of their own
- **Avatar moderation** — the only person who sees an avatar is the one who
  uploaded it, so nothing reviews or takes down an image; a public profile
  cannot ship without it
- **Changing the email address** — an auth capability, with its own
  verification and account recovery
- **Unique display names** — a display name is a label on a private page, not
  a handle
- **Collector identity beyond the basics** — location, social links,
  collection showcases, badges

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who sees the profile, and how is the avatar served? | ❓ product - recommended: the owner alone sees the profile; the avatar answers at an unguessable address with no session check, cached at the edge and cleared from it when the avatar is replaced or removed; whoever holds the address can open the image until it changes, and a browser that cached it keeps its copy until that copy expires. Either answer adds a requirement naming who can open the image; this one also excepts the image from the owner-only rule | Streaming the avatar through a signed-in request on every view, which no cache can absorb and which a public profile would have to undo |
| Q2 | How is a name the collector never chose told apart from one they did? | The store holds no name until the collector saves one; the placeholder earlier rows carry is cleared once the store that reads an empty name is live - decided by the round | A second field saying whether the name was set, which would be a second source for one fact |
| Q3 | Which name do the profile, the till and the wallet pass show? | One name everywhere: the name chosen for the shop, else the account name, else the address before the `@`; the till shows 會員 and a pass stays as it was when the account service cannot give one - decided by product, and built in grade10 `ea91833d32` (`packages/grade10-store/backend/src/services/memberName.ts:7-23`), whose record names the choice | A till and a pass that show no name when the shop holds none |
| Q4 | What date does member-since show? | The date of the collector's first save; nothing before it - decided by the round | The date the store first wrote a record for the account, which can come from a webhook the collector never triggered |
| Q5 | Is the avatar, its controls and the email row built from frames, or from the requirements alone? | ❓ design - recommended: built from the requirements with no frames, on the design system's existing avatar | Waiting on frames nobody has scheduled |
| Q6 | Does ZZZ's account page gain what Grade10's does? | Yes: ZZZ renders the same account page, so it gains the avatar, the email row and the defaults with it - decided by the round | Keeping ZZZ out, which the shared page and the shared store make impossible without a second page |
| Q7 | Does the email show while the collector edits? | Yes, read-only, in the read view and in the form alike - decided by the round | Showing it in the read view alone, which hides it the moment the collector edits |
| Q8 | Does Grade10 have an account page at all? | Yes: it waits behind its own gate and opens once this change ships, as [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md) records; the account menu still offers no Profile item - decided by the round | No account page, which would leave the KYC card and the profile with no home |
| Q9 | Which change brings the mobile number to the profile: this one, as a sixth field with its rules, or the change that verifies numbers? | ❓ product - recommended: the change that verifies numbers; this change leaves the number as the store holds it today | This change, which would specify number entry without the verification the till's phone lookup waits on |
| Q10 | Which avatar file does a collector meet a limit on: (a) a JPEG, PNG or WebP up to 5 MB, judged on the file they pick, or (b) any image the browser can read, stored square at 512 px, with the type and 5 MB limit held on the upload alone? | ❓ product - recommended: (b) any image the browser can read, stored square at 512 px | (a), which refuses phone photos over 5 MB and photos in a format the browser reads but the list leaves out |
| Q11 | What member-since does a collector who saved before the date was recorded see: (a) none until their next save, or (b) the date their record was created? | ❓ product - recommended: (a) none until their next save, since a wrong date is worse than none | (b), which dates some collectors by a record they never made |
| Q12 | Does saving the profile without touching the prefilled name make it the collector's chosen name: (a) yes, any save keeps it, or (b) no, the name is kept only when it differs from the one shown by default? | ❓ product - recommended: (b) the name is kept only when the collector changed it, so an account-name change still reaches the till and the pass | (a), which freezes the default the first time a collector saves only a bio |
| Q13 | How does a collector reach the account page: (a) a Profile item in the account menu once this page ships, (b) links from membership, KYC prompts and order pages, or (c) the typed address alone? | ❓ product - recommended: (a) the account menu offers Profile once this page ships | (b) or (c), which leave a page with no way in from the site's own chrome |
| Q14 | Is a 500-character bio edited in one line? | ❓ design - recommended: one line in this change; a multi-line field is a design-system addition of its own | Adding a multi-line field here, which is a new primitive the design owns |
| Q15 | Does the account menu's avatar follow the profile's? | ❓ design - recommended: yes, in a site-chrome change of its own | The menu keeping the email's initial while the profile shows the collector's image |
| Q16 | Does the picture an account already has, such as a Google sign-up's, stand in before the display name's first letter? | ❓ product - recommended: no; with no avatar chosen for the shop the letter stands in | Showing the account's own picture, which a collector never chose for the shop |
| Q17 | How is the avatar's fallback drawn from a display name? | One character: the display name's first letter or digit in any script, upper-cased, as the account menu draws it, so `陳大文` shows `陳`; the design system's `avatarInitial` reads only Latin letters and digits today (`packages/design-system/src/components/display/avatar.tsx:63`) and is widened with this change - decided by the round | Two initials, which the account menu does not draw; or the Latin-only reading, which shows `?` for `陳大文` and `N` for `Ångström` |
| Q18 | How is a length counted against the 80 and 500 limits? | As the field and the store count it, in UTF-16 code units: a Chinese character counts one, and an emoji can count two (grade10 `packages/grade10-store/backend/src/trpc/routers/profile.ts:26`, `:29`) - decided by the round | Counting what the collector sees as one, which the field's own limit cannot do, so the form and the store would disagree |
| Q19 | Is the avatar's 5 MB 5,000,000 bytes or 5,242,880? | 5,242,880, the reading the grading photo limit uses (grade10 `packages/grading/contracts/src/cardPhotos.ts:42`) - decided by the round | 5,000,000, a second reading of a megabyte in one product |
| Q20 | When an edit's image is refused or fails, are its name and bio saved? | No: the image is sent first, and a refused or failed image sends no text; the form keeps the typed text and the chosen image, so one retry sends both - decided by the round | Saving the text anyway, which leaves half a save the form has to explain |
| Q21 | When the account service cannot answer, does a member with a saved name keep it at the till and on the pass? | Yes: the till names them by the saved name, and the pass refreshes with it; a lap names its members one by one, so only a pass the service cannot name waits, until the service answers - decided by the round | 會員 and a held pass for every member, which a saved name does not need; or a lap that fails whole on one member it cannot name, which through a long outage holds every pass with a saved name too |
| Q22 | How do the pass and the till's modal show a display name of up to 80 characters? | Whole: the store sends the name uncut, and the wallet app and the till's own components lay it out (grade10 `packages/wallet-pass/src/google.ts:158`, `packages/wallet-pass/src/apple/pkpass.ts:110`) - decided by the round | Cutting it in the store, which shows a name the member never chose |
| Q23 | What stands in for the avatar when the display name holds no letter or digit, such as `🃏🃏`? | `?`, as the account menu draws it (`packages/design-system/src/components/display/avatar.tsx:63-72`) - decided by the round | A second fallback the account menu does not draw |
| Q24 | Does an avatar saved on its own, by a collector who has never saved, start member-since? | Yes: member-since is the first save of any field, and the avatar is saved on its own - decided by the round | Dating only a name or bio save, which leaves a collector with an avatar and no member-since |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/account-profile | Accept review: no requirement says who can open the avatar image, and the tech design serves it with no session, against the owner-only rule. | Q1 |
| grade10-site/store/account-profile | Accept review: the Mobile number line on the profile page has no change that delivers it. | Q9 |
| grade10-site/store/account-profile | Accept review: the browser makes the image square before it uploads, so the type and 5 MB limit reach no collector on the page. | Q10 |
| grade10-site/store/account-profile | Accept review: a collector who saved before member-since was recorded shows no date until they save again. | Q11 |
| grade10-site/store/account-profile | Accept review: saving only a bio stores the prefilled default as the chosen name. | Q12 |
| grade10-site/store/account-profile | Accept review: once the page opens, nothing in the site leads to it. | Q13 |
| shared/ui/store-profile | Accept review: no frame draws the avatar, its controls, its preview or the email row. | Q5 |
| shared/ui/store-profile | Accept review: the bio is edited in one line because the design system has no multi-line field. | Q14 |
| grade10-site/store/account-profile | Accept review: the account menu shows the email's initial while the profile shows the collector's avatar. | Q15 |
| grade10-site/store/account-profile | Accept review: the account already holds a picture for some sign-ups, and the page shows the display name's first letter instead. | Q16 |
| grade10-site/store/account-profile | QA1 blind pass: how are initials made from a display name — how many letters, and from a one-word name, an address part such as `mika.tan`, or a name in Chinese characters? | Q17 |
| grade10-site/store/account-profile | QA1 blind pass: does a character in the 80 and 500 limits count as the collector sees it, an emoji or a Chinese character as one? | Q18 |
| grade10-site/store/account-profile | QA1 blind pass: is the avatar's 5 MB 5,000,000 bytes or 5,242,880? A file between the two is accepted under one reading and refused under the other. | Q19 |
| grade10-site/store/account-profile | QA1 blind pass: when a save carries a new avatar and the upload fails, is the name and bio still saved, and does the form keep the chosen image to try again? The page states only the reverse, an accepted image surviving a refused name. | Q20 |
| grade10-site/store/membership | QA1 blind pass: when the member has saved a name for the shop and the account service cannot answer, does the till show the saved name or 會員, and does the pass refresh with the saved name or stay as it was? The rule names the outage without saying whether a saved name needs the account service. | Q21 |
| grade10-site/store/wallet-member-card | QA1 blind pass: how do the pass and the till's modal show a display name of up to 80 characters — in full, or cut short, and where? | Q22 |
| grade10-site/store/account-profile | QA1 blind pass: what stands in for the avatar when the display name holds no letter or digit, such as `🃏🃏` or `---`? The rule names the first letter or digit and says nothing of a name with neither. | Q23 |
| grade10-site/store/account-profile | QA1 blind pass: does an avatar saved on its own, by a collector who has never saved, start member-since? The avatar is saved apart from the name and bio, and member-since is the date of the first save. | Q24 |
| grade10-site/store/wallet-member-card | QA1 blind pass: through a long account-service outage, how long may a pass with a saved name wait while its lap also holds a member the service cannot name: one lap, or until the service answers? | Q21 |
