## Goals

- The custody agreement, the loan agreement and the release receipt name the
  case by the reference every letter and the counter already use
- Staff find the case a signed paper belongs to by typing what the paper
  prints into the console's search
- The reference's list of where it is read names the paper

## Non-Goals

- **Sealed paper** - no packet sealed before the change is re-rendered or
  re-sealed
- **The certificate page** - the page the seal appends names no case, and
  stays as it is
- **File names** - a downloaded or mailed document keeps its file name; a
  follow-on
- **The console's search** - it already takes a reference, and a case-id
  prefix for paper that prints the id
- **Grading's counter paper** - `grade10-site/grading/counter-documents`, in
  `add-card-grading`, names its own handles
- **The rest of the paper** - every other fact, term, label and the layout
  stay as they are

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which handle does the paper print for the case? | The six-character reference alone, in the `Case` fact and in the footer, on all three documents (recommended) - decided by the round (product owner delegated this run) | The reference beside the id: the id means nothing to a collector or to the counter, and adds noise to a legal page; the id alone, which prints today: nobody speaks, types or searches it. The reference is unique for the brand whose entity the paper names, never reused and never changed, so it finds the paper on its own; the document's digest, not a printed handle, proves the paper |
| Q2 | What happens to paper already sealed with the id? | It stays as sealed: sealed bytes are never re-rendered, and only packets prepared after the change print the reference (recommended) - decided by the round (product owner delegated this run) | Re-rendering sealed packets, which breaks every digest the seal anchored and every copy the collector already holds |
| Q3 | Does the reference's own list of where it is read name the paper? | Yes: `case-intake`'s "Where it is read" names the paper and points at `documents-and-signing`, which owns what the paper prints, the way it points at the letters and the search (recommended) - decided by the round (product owner delegated this run) | Leaving the list without the paper, which is how the paper was missed when the reference arrived; stating the paper's rule in `case-intake`, a second home for one rule |
| Q4 | A packet prepared before the change and signed after it: what does it print? | The id it was rendered with: signing seals the bytes taken at preparation, a packet lives a day or until a day past its visit, and staff re-prepare it for the reference (recommended) - decided by the round (product owner delegated this run) | Withdrawing every open packet when the change ships, a release step for a window of a day |
| Q5 | How does the counter find paper that prints the id? | By the console's search, which already takes a case-id prefix of seven characters or more; nothing changes there (recommended) - decided by the round (product owner delegated this run) | A lookup of its own for old paper, which the search already is |
| Q6 | Do the labels change with the value? | No: the fact stays `Case` and the footer keeps `case`, so the paper reads `Case QC7PEQ` as every letter's case line does (recommended) - decided by the round (product owner delegated this run) | `Case reference` as the label, which reads differently from every letter and moves wording on legal paper that nothing asks to move |
| Q7 | Does a downloaded document's file name follow? | Not in this change: the paper is what prints the case, and the single download keeps the document's id as its file name; a follow-on (recommended) - decided by the round (product owner delegated this run) | Folding the file names in, which moves the download and the mail rather than the paper; the bulk download already files each document under its reference |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
