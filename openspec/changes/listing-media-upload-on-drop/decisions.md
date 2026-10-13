## Goals

- An operator stores several gallery photographs with one drop, and sees each
  one land without a confirm step.
- An operator orders the gallery by dragging items, and the order holds when
  the item is dropped.

## Non-Goals

- Changing the accepted types, the size bound, the eight-item cap, alt-text
  rules, the named image sizes or the hover zoom.
- An undo for a stored upload beyond removing the item.
- Cropping, rotating or editing an image in the admin panel.
- Changing how inventory assets are chosen, copied on Save, or ordered while
  staged.
- A new permission or a new service call.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does an operator confirm a chosen file before it is stored? | No. A dropped or chosen file stores at once; a wrong file is removed like any other item. | A preview to confirm or discard per file, the current rule: one more press per photograph, when removing a wrong upload costs the same as discarding it. |
| Q2 | Can one drop hold several files? | Yes. They store one after another; a file past the eighth, or of a refused type or size, is named with its reason and nothing is stored for it - decided by the round. | One file per slot, which is where the extra presses come from. |
| Q3 | Where does a new file land? | After the last item in the gallery; a gap a removal left fills only once the end is full - decided by the round. | The lowest free slot, which drops a new photograph into the middle of the gallery after a removal. |
| Q4 | Does a replacement file store at once too? | Yes, the same way an added file stores (recommended). | A preview and confirm for replace only, because it overwrites a stored file: two rules for one gesture, and the old file is as easy to upload again as a wrong new one is to replace. |
| Q5 | Does a new order hold as soon as an item is dropped? | Yes (recommended). While inventory assets are staged, the order still waits for the listing's Save. | A separate reorder mode with Done: safer against a stray drag, but a stray drag is undone with one more drag, and the mode hides every other control while it is open. |
| Q6 | Does removing an item still ask first? | Yes (recommended). | Removing on one press: a mis-press would delete a stored file with no way back, unlike an upload, which can be removed again. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
