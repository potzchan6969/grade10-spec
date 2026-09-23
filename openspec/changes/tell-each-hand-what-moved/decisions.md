## Goals

- A hand told that something before their artifact moved reads the move
  itself, before and after, in the message.
- Every hand a move reaches is told, once per move.
- A major move holds what is drawn from it until its hand reads it again; a
  small one never holds a landing.
- No draft case reaches the durable suite, and a walk runs on the cases QA
  signed.

## Non-Goals

- Tracking finer than a decision row, a line range, a requirement or a case.
- Judging what a reworded line means; the rule reads where a move sits, and
  a hand raises the rest.
- A new message kind or a new surface beyond the message, My turn, Told now
  and the digest.
- Changing what is before what: the schema's order stands.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does a hand learn when something before their artifact moves? | What moved, quoted before and after: a decision row, or the lines of a proposal, a journey or a page section, as the store already reads them - the owner's word | The file's name alone, which sends the re-read to find the move for itself |
| Q2 | Who is told? | The hand of each artifact the move reaches, once per move - the owner's word | The earliest behind artifact's hand alone, so the rest learn at their next landing |
| Q3 | Does every move hold the next landing? | A major move holds every landing drawn from it until its hand reads it again; a small one is told and holds nothing - the owner's word | Every move holds, a reworded line as long as a changed decision; no move holds |
| Q4 | What makes a move major? | ❓ pm - recommended: the store computes it - a decision row's Decision cell changed, a row added or removed, a goal or non-goal moved, a requirement or scenario changed, or a case's expected results changed; the landing may raise a small move to major with its reason, never lower one | The landing hand classing every move, a judgement on every landing; a size threshold, since one word can turn a decision |
| Q5 | What ends a small move's notice? | ❓ pm - recommended: the hand's `read` in the change's thread, or their artifact's next landing; it stays on My turn until then, and the Monday digest lists one unread past seven days | Cleared once told, a notice nobody has to read; held like a major move |
| Q6 | Does an answer to a held row put the drafts drawn on it behind? | An answer that takes the recommendation moves nothing, since the drafts were drawn on it; one that overturns it is a major move - the owner's word, the rule above applied | Every answer marking the drafts read, which no hand did; every answer holding them |
| Q7 | Does a change archive while its suite holds a draft case? | No: the archive refuses it, and a case whose expected results the review changes after the walk ran puts the walk group behind as a major move - the owner's word | The application repository's tick alone; a gate on every landing |
| Q8 | Who says an artifact was read again? | Its hand: `--reviewed` lands on the hand's word, as any landing does - decided by the round | The agent marking it read |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
