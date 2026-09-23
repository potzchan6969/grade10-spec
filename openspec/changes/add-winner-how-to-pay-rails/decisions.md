## Goals

- Let a winner find bank rails without opening the proof form, and submit
  proof without scrolling past three payment methods.
- Keep one primary CTA on Order summary (**Submit Payment Proof**) with View
  Bank Details as a secondary control beneath it.
- Expand the durable view-bank-details field set for FPS QR, HK branch code, SWIFT
  beneficiary address, bank name, bank address and OUR charges note, with FPS as the default tab.

## Non-Goals

- Live bank account values or a production FPS QR asset — Finance TBC.
- Publishing a new `@grade10/ui` export for either dialog.
- Changing proof file limits, HEIC conversion, or the one-upload rule.
- Cross-linking View Bank Details into Submit Payment Proof (or the reverse).
- Putting all three rails on the Winner Order page shell.
- Bank transfer in currencies other than HKD.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | One dialog or two? | Two dialogs with two Order summary entry points | Two steps in one modal; stacking rails + form in one scroll |
| Q2 | What opens from the primary bank CTA? | Submit Payment Proof (proof-only dialog) | The rails dialog; a combined details+proof dialog |
| Q3 | Where do rails live? | View Bank Details secondary control under Submit Payment Proof | On the page shell; inside the proof dialog |
| Q4 | Proof dialog title? | **Submit Payment Proof** | A different dialog title from the Order summary CTA |
| Q5 | Default rail tab? | FPS | HK Local or SWIFT first |
| Q6 | SWIFT fee instruction? | Mandatory note to choose **OUR** so Grade10 receives the full order total | Omitting the note; naming SHA/BEN |
| Q7 | Does View Bank Details hand off into proof? | No — entry points stay independent | Continue CTA that opens Submit Payment Proof |
| Q8 | Amount + reference on proof? | No — proof dialog is fields and upload only; amount and reference stay on View Bank Details | Compact amount + reference with Copy on the proof form |
| Q9 | Secondary control / rails dialog name? | **View Bank Details** (Title Case) | How to Pay / How to pay |
| Q10 | Amount Copy on View Bank Details? | No — amount is display-only | Copy control beside amount due |
| Q11 | Payment reference control? | Detail row at the bottom of each rail tab with the memo warning; no Copy | Read-only input; highlighted box above the tabs |
| Q13 | Copy on rail fields (FPS ID, account, SWIFT…)? | No — all fields are detail rows only | Icon Copy on ID-like fields |
| Q12 | Rail tab style? | Default (pill) Tabs variant | `list` Tabs variant |
| Q14 | Primary bank CTA label? | **Submit Payment Proof** (matches the dialog) | Pay by Bank Transfer |
| Q15 | Where does the OUR note sit on SWIFT? | After the payment-reference band (fields stay continuous) | Between account fields and payment reference |
| Q16 | What is the SWIFT address field called? (2026-09-22) | **Beneficiary address** — the beneficiary's address | Business address |
| Q17 | What bank destination fields does SWIFT show beyond name and account? (2026-09-22) | Bank name and bank address (main branch address, city, country), with beneficiary name and beneficiary address | Beneficiary and business address alone, without the receiving bank's name and address |
| Q18 | How is the account number shown? (2026-09-22) | The full account number including bank and branch code on HK Local and SWIFT (bank code and branch code still shown separately on HK Local) | Account digits alone, without bank and branch code in the number |
| Q19 | What values does the preview use while Finance confirms live accounts? (2026-09-22) | Grade10 Finance Limited as beneficiary; HSBC Hong Kong as the sample bank (name, main-branch address, codes, SWIFT). Live account values stay Finance TBC | Leaving every rail value as `{tbc}` in the preview |
| Q20 | How wide is the rail tab list? (2026-09-23) | From `sm` up, full-width shared pill track. Below `sm`, the track hugs each label and scrolls horizontally so FPS / HK Local / International stay readable | Always full-width (labels crush on a narrow dialog); always hug (empty track on a wide dialog) |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/winner-order` | Do three ways stay on the page or move into View Bank Details? | Q3 |
| `grade10-site/auction/winner-order` | Does Submit Payment Proof still own copy for amount and reference? | Q8 |
| `grade10-site/auction/winner-order` | What should the secondary control be called? | Q9 |
| `grade10-site/auction/winner-order` | What should the primary bank CTA be called? | Q14 |
| `grade10-site/auction/winner-order` | Where does the OUR note sit relative to payment reference? | Q15 |
