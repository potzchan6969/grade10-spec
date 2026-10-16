# Rounds

One row per round: what it read, who read it, what stood and what it asked.
Written by the landing, in the landing's own commit.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | qa, simpler, reader, verifier | Corrected the grant visibility exception, cancellation no-letter confirmation, whole-bid removal wording and Not placed actions. Removed the duplicate operator procedure from The Close. Independent QA, reader and simpler reread the corrected pages with no remaining findings. Verifier confirmed manual validation with 0 failures and strict change validation. | - | pnpm run check:manual (0 failures, 351 warnings); openspec validate add-auction-internal-bid --strict (passed) |
