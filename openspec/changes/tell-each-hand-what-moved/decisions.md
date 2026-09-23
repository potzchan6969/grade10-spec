## Goals

- A hand told that something before their artifact moved reads what moved,
  before and after, in the message.
- Every hand a landing reaches is told, in one message per person.
- A major move holds what is drawn from it until its hand reads it again; a
  small one never holds a landing.
- An artifact is fresh because its hand landed or read it, never because a
  later commit touched the file.

## Non-Goals

- Tracking finer than a decision row, a requirement, a case or a line range.
- Judging what a reworded line means; the rule reads where a move sits, and
  a hand raising one is a follow-on.
- A new message kind or a new surface beyond the message, My turn, Told now,
  the chip and the digest.
- Changing what is before what: the schema's order stands.
- The suite signed before it folds, which is its own change.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does a hand learn when something before their artifact moves? | What moved, quoted before and after: a decision row, a requirement or a case, or the lines of any other artifact or page section before theirs - the owner's word | The file's name alone, which sends the re-read to find the move for itself |
| Q2 | Who is told, and how often? | Every hand whose artifact the landing reaches is told - the owner's word; in one message per person per landing, listing each artifact of theirs it reached and which it holds - decided by the round | The earliest behind artifact's hand alone; one message per artifact, several to one person for one landing |
| Q3 | Does every move hold the next landing? | A major move holds every landing drawn from it until its hand reads it again; a small one is told and holds nothing - the owner's word | Every move holds, a reworded line as long as a changed decision; no move holds |
| Q4 | What makes a move major? | Everything that moves before an artifact is major but a named small set - the proposal's Why, a decision row's Asked and Instead of cells, the ❓ wrapper around a recommendation, and punctuation - the owner's word | Small by default with a named major set, which lets a moved design, journey or scope through unheld; a judgement on every landing |
| Q5 | What ends a small move's notice? | The hand's read or their artifact's next landing, both written as `reviewed:`; until then it is shown, told once, on My turn and in the digest after seven days, and it holds the fold - decided by the round, as the Behind rows already say | A new `read` verb and a second state beside behind; cleared once told |
| Q6 | Does an answer to a held row put the drafts drawn on it behind? | An answer that takes the recommendation is no move, since the class reads the Decision cell without its ❓ wrapper; one that overturns it is major - the owner's word, the rule above applied | Every answer marking the drafts read, which no hand did; every answer holding them |
| Q7 | What makes an artifact fresh? | A hand's landing or read, written as `reviewed:` on every artifact landing and never on a tick; the dated fallback retires and the in-flight records are backfilled once - decided by the round | The last commit's date, which a tick moves and which clears a move nobody read |
| Q8 | Who says an artifact was read again? | Its hand: `--reviewed` lands on the hand's word, as any landing does - decided by the round | The agent marking it read |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
