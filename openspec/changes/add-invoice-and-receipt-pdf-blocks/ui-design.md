## Winner Setup

| State | What the winner sees | Evidence |
| --- | --- | --- |
| Zone suggested | A Time zone field beside the other setup choices, filled with the browser's IANA zone and visible before Confirm | `winner-order-SC-300` |
| Zone changed | The selected zone replaces the suggestion; the winner confirms it with the address, payment method and billing address | `winner-order-SC-300` |
| Zone missing or invalid | Confirm is refused and the field names the problem; no setup fact is committed | `winner-order-SC-301` |
| Order after travel | The payment deadline keeps the named zone of the current invoice | `winner-order-SC-302` |

## Operator Setup And Quote

| State | What the operator sees | Evidence |
| --- | --- | --- |
| Phone record | A required Winner time zone field beside the delivery and billing addresses; the operator enters the winner's stated IANA zone | `post-sale-SC-300` |
| Invalid phone zone | The phone record stays open with the zone error; no address is recorded | `post-sale-SC-301` |
| Quote | The confirmed winner zone appears with the deadline; Send is refused and names a missing zone | `post-sale-SC-302` |
| Older order without zone | An operator with payment-processing can record the winner's stated zone with a required reason before send or reissue | `post-sale-SC-306` |

The form fields use the existing form controls. The zone identifier and its
reader-facing name are shown together so the choice is distinguishable from
the operator's or browser's current location. No PDF renderer control asks
the reader to choose a zone when opening a document.
