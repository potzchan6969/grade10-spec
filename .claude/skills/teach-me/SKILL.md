---
name: teach-me
description: Teach a product topic from the store - a short answer in the chat, then the whole lesson as a Lavish page the reader comments on - an overview, a flow chart of the journey and its data, the journeys, the external services, the Storybook stories and the manual pages - shaped by whether the ask is high level, one behaviour, or every case. Use when someone asks to learn, understand or be walked through any part of the product. Invoke as /teach-me <topic>.
---

# Teach Me

Teach one topic from what the store holds. Read it; never invent it. The
store is read-only here: this skill edits no page, spec or story.

## Steps

1. **Find the topic** - match the words to a manual page under
   `docs/prds/products/<product>/<domain>/<capability>.md` (a domain's
   `index.md` for a whole domain), the spec it names under
   `openspec/specs/`, the `user-journeys.md` beside that spec, and any
   active change on it under `openspec/changes/`. Two or more pages match
   equally: ask which one. No page matches: say so and stop
2. **Classify the ask** - pick one kind from [Kinds](#kinds), and one
   purpose from [Purposes](#purposes), from the words of the ask and the
   conversation. Say both in the first line of the answer
3. **Clarify when the ask does not say** - see [Clarify](#clarify). Ask
   before you read further, and build nothing until the reader answers
4. **Read the sources** - the page, its `Product decisions` block, the
   journeys, and the spec's requirements. An unmarked line and the spec
   disagree: the spec is correct. Keep every 🚧 and ❓ on each line you
   repeat from a marked line, and keep its doubt: a shorter line does not
   make an open question sure. Do not read again what another skill owns -
   see [Hand-offs](#hand-offs)
5. **Give the short answer** - see [Short answer](#short-answer), in the
   chat. Where one sentence answers the whole ask ("Is the vault in
   Grade10 Site?"), stop there
6. **Build the lesson in Lavish** - every other lesson is a page the
   reader reads and comments on, as [Lavish](#lavish) says. Build the
   kind's sections in the order of [Sections](#sections), with the depth
   the purpose puts on each. Lavish does not start: give the sections in
   the chat, as [Depth](#depth) says
7. **Hand back** - in the chat, the short answer, the Lavish link, and one
   line that asks the reader to read and comment there. Then run the
   follow-up loop

## Style

Write every lesson in ASD-STE100 Simplified Technical English, unless the
reader asks for a different style.

- **Sentences** - 20 words at most for a procedure, 25 for a description.
  One topic or one instruction in each sentence
- **Voice** - active voice and the simple tenses. Use "do not", not "never
  should"
- **Words** - one word for one meaning, and the same term each time. Use the
  page's names for screens, kinds and states. Do not use "-ing" words as
  nouns or adjectives where a simple verb or noun is possible
- **Articles** - keep "the", "a" and "an". Do not write in telegraphic style,
  except in table cells and titled bullets
- **Paragraphs** - six sentences at most, with one topic

## Kinds

| Kind | The ask sounds like | Sections it can give |
| --- | --- | --- |
| **High level** | "What is the vault?", "How does consignment work?", "Give me the big picture of auctions" | Overview, Product flow, External services, Storybook references (screens), Manual references (PRD pages) |
| **One behaviour** | "What happens when a bid is outbid?", "How does a collector request a retrieval?" | Overview, Product flow, User journeys, External services (the calls that behaviour makes), Storybook references (the components and states that behaviour shows) |
| **Every case** | "List every order status", "All the cases for a failed payment", "Which coupons can stack?" | Overview, Manual references (the spec's requirement sections) |

The ask fits no kind cleanly: ask, as [Clarify](#clarify) says.

## Purposes

| Purpose | The conversation shows | Put the depth on |
| --- | --- | --- |
| **New to it** | No earlier work on the topic; "what is", "explain" | The short answer, the Overview and the Product flow |
| **Designing** | A screen, a state, a Figma link, a story | The User journeys and the Storybook references |
| **Testing** | A test case, a bug, "edge case", "what if" | Each case, the ❓ items and the failure column of External services |
| **Building or changing** | A task, a change name, code, an API | External services, the active changes and the spec sections |
| **Reviewing** | A change, a PR, "is this right" | What the active changes move: 🚧 and ❓ lines, and the decisions |

No sign of a purpose: ask, as [Clarify](#clarify) says.

## Clarify

Ask before the lesson when the ask leaves the kind open. These signs leave
it open:

- **A topic only** - the ask is a name with no question: "discount code",
  "vault", "/teach-me consignment"
- **Two kinds fit** - "how do coupons work" can be the big picture or one
  behaviour
- **Two or more pages fit equally** - "codes" can be Discounts, Cart or
  Coupons

Ask one message, with at most two questions, in the repository's
Clarification Request format: numbered questions, lettered options, the
recommended option first and marked `Recommended`. Where the agent has a
question tool with buttons, use it.

1. **Kind** - the three kinds, each with an example ask for this topic
2. **Purpose** - ask only when the conversation does not show it. Give the
   purposes as options, with **New to it** first

Recommend from the evidence: the kind the ask's words come nearest to, and
the page that names the topic in its title. Do not ask when the ask states
the kind ("what is", "what happens when", "every", "all", "list") and the
conversation shows the purpose.

No reader in the conversation to answer: take **High level** and **New to
it**, and state both under **Decisions made by Agents** at the end of the
lesson.

## Short answer

Every lesson starts with two sentences at most, before any section. The
first sentence says what the topic is in general terms, with its common
name if it has one ("A discount code is a code that decreases the price of
one order"). The second sentence ties it to Grade10 ("In Grade10, each order
can carry one code, and Shopify calculates the price"). Do not print a
label such as "TL;DR" or "Key point".

## Depth

- **In Lavish** - give every section of the kind. The page is for reading,
  so the purpose orders the sections and sets their detail; it does not
  remove one. Every case gives every case
- **In the chat** - Lavish did not start. Give the short answer and the
  first three sections the purpose puts the depth on, and the file path of
  the full lesson page
- **No reader in the conversation** - a run with nobody to answer, or a
  lesson written for other people: give every section in the chat, and do
  not start Lavish

## Sections

### Overview

One short paragraph: the background, who it serves, and its scope - what it
does and what it does not. Then, optionally, its features in titled bullets,
two levels at most:

```markdown
## Overview

<Background and scope in one paragraph.>

- **<Feature>** - <what it does for the reader>
  - **<Sub-feature>** - <one line>
```

### Product flow

A flow chart in plain HTML and CSS, inside the lesson page: the screens
the reader moves through, and the data and services each step uses. Replace
the lanes in the `flow` section of
[`lesson-template.html`](lesson-template.html).

- **No script** - do not add a script, a CDN or a chart library. A file
  viewer, a preview pane and an attachment show no script, so a chart that
  a script draws shows as raw text there
- **Annotation targets** - give each step a stable `id` and a `title` that
  says what it is, so a comment names exactly one step
- **Lanes** - one `<article class="tile">` and one `<ol class="chain">` for
  each channel or actor (online, POS till, after payment). The main lane is
  `span-4`; a shorter lane is `span-2`. Steps alternate with
  `<li class="via">` labels: the reader's action
- **Steps** - screens and steps in the reader's words, as the page names
  them. `class="node end"` for a start or an outcome
- **Data** - chips under a step: `read`, `write`, or `ext` for a call to an
  external service, with the store or service name
- **Branches** - one `<p class="branch">` under the lane: the step, the
  condition, the outcome
- **Size** - 15 steps at most. A larger topic draws its main path and names
  the branches it left out in the `left-out` note
- **Existing charts** - a chart under `docs/prds/diagrams/` that covers the
  topic is the start; draw the same shape, do not invent a second one
- **Build it up** - the main lane comes first. Each next lane starts with
  one line that says what it adds to the lanes above it

#### A picture for a spatial idea

A lane chart shows the order of steps. It does not show where things are.
Generate a picture only when all of these conditions are true:

1. **The idea is spatial** - the answer turns on where a thing is on the
   screen or in the room, and words or a lane chart do not make it clear.
   Examples:
   - **Layers** - a promo sheet over the cart drawer over the page
   - **Position** - what stays fixed and what scrolls, where a sticky
     footer sits
   - **Before and after** - the same screen before and after a state
     change, side by side
   - **A physical place** - staff, terminal, member phone and QR at a POS
     counter
2. **No story shows it** - a Storybook story is the real screen. Where a
   story shows the idea, link the story and do not generate a picture
3. **The session has an image-generation tool** - otherwise, describe the
   layout in at most three sentences and link the nearest story

When all three are true:

- **Style** - a marker drawing on a whiteboard. Simple boxes and arrows,
  no real UI chrome, no brand colours
- **Labels** - at most six labels, at most four words each, in the page's
  names. Image models make long text wrong
- **Build it up** - the same rule as the lane charts: one picture for each
  added layer or state, each one the last picture plus one part
- **Save** - `${TMPDIR:-/tmp}/teach-me/<topic-slug>-sketch-<n>.png`
- **Mark it** - give each picture the caption "Sketch to explain the idea.
  It is not the design." Link the Figma frame or the story that is the
  design
- **Do not** - generate a picture for a flow, a list of cases, data or
  exact UI appearance. Do not put a generated picture in the store

### User journeys

A numbered list of the journeys, from `user-journeys.md`. Each one is the
path the reader takes through the product, not the clicks on one screen:

```markdown
## User journeys

1. **<Journey title>** - <screen> → <screen> → <outcome>
```

A capability that writes `**Walked by:** nobody` has no journeys of its
own: name the capability whose journeys walk it.

### External services

How the product talks to the systems it does not own - Shopify, Shopify POS,
a payment provider, a KYC vendor, a mail sender. Read them from the page's
engineer `:::detail` blocks and mechanism sections, the active change's
`tech-design.md`, and `docs/references/` (vendor working notes). A topic that
reaches no external service writes `None - <topic> runs inside Grade10` and
skips the table.

```markdown
## External services

<One or two sentences: which system owns what, and what Grade10 keeps.>

| Service | Grade10 sends | It returns | When it fails or says no | Source |
| --- | --- | --- | --- | --- |
| <service> | <the call, in product words> | <what comes back> | <what the reader meets> | [<page or doc>](<manual link>) |
```

- **Product words first** - "creates a draft order with the code", not an
  endpoint. Name an API call in backticks only after the product words
- **Who owns the truth** - say which side decides: where Grade10 accepts the
  service's answer (a price, a status), say so
- **Failure** - every row names what the reader meets when the service is
  slow, down or refuses. The store says nothing: write ❓ and who confirms
- **Credentials** - name who holds them only when the page or design says;
  never print a key, token or secret

### Storybook references

1. **Start the workbench** - a workbench already answering
   `http://localhost:6006/index.json` is reused; say which checkout it
   serves. Otherwise run `pnpm storybook` in the background. It takes port
   6006 when free; read the port it prints. A worktree with no installed
   dependencies fails with `storybook not found`: say so, and fall back as
   below
2. **Find the stories** - the Storybook MCP's `get-stories-by-component`
   where it answers, otherwise the story titles under
   `apps/preview/src/pages/<domain>/<feature>/` and
   `packages/ui/src/blocks/`. The title grammar is
   [`docs/governance/storybook.md`](../../../docs/governance/storybook.md#sidebar-grammar)
3. **Build each link** - `http://localhost:<port>/?path=/story/<id>`. The
   id is the title and export, lower case, with each run of other
   characters as `-` and `--` before the export:
   `Appointment/Booking/Screens/Book Visit` + `Default` →
   `appointment-booking-screens-book-visit--default`
4. **Pick the stories** - start from the `::story{id=...}` the page already
   cites, and check each id in `index.json`. For **High level**, the
   feature's `Screens`, and where the feature draws none of its own, the
   screens and blocks of the feature that shows it; for
   **One behaviour**, the `Blocks`, `Parts` and screen states that show it
5. **Table it** -

   | Story | Shows | Link |
   | --- | --- | --- |
   | `<Title> › <Export>` | <state or screen in one line> | [Open](http://localhost:6006/?path=/story/<id>) |

The workbench does not start: give the same ids on the published
`https://storybook.grade10-stg.com/?path=/story/<id>` and say they show
`main`, not this checkout.

### Manual references

The deployed manual is `https://spec.grade10-stg.com`, behind Cloudflare
Access. Build each link from the store path; check the file exists, not the
URL.

| Store path | Manual route |
| --- | --- |
| `docs/prds/products/<product>/<domain>/index.md` | `/p/<product>/<domain>` |
| `docs/prds/products/<product>/<domain>/<capability>.md` | `/p/<product>/<domain>/<capability>` |
| A requirement `### Requirement: <Name>` in that page's spec | the page route + `#req-<slug of Name>` |
| A journey `### <id>: <title>` | the page route + `#<id>` |
| `docs/prds/guides/<slug>.md` | `/guides/<slug>` |

A slug is the name in lower case, each run of other characters as `-`, at
most 80 characters, taken before the `req-` prefix. For **High level**,
link the PRD pages; for **Every case**, link each requirement section that
enumerates the cases.

For **Every case**, list the cases before the table. One case is one
sentence: the condition, then what the reader meets, then the link. A list
of names without the result is reference, not teaching:

```markdown
## Cases

1. If a site discount gives more than the code, the order completes at the
   Shopify price and the coupon goes back to the wallet -
   [Open](https://spec.grade10-stg.com/p/...#req-...)
```

The table after it stays as the reference.

- **A spec with no page** - no page names it in `spec:`, so it has no route
  of its own. Link the heading of the page that embeds its
  `::cases{id="<spec>"}` block, and say so in the row
- **An active change on a requirement** - mark the row 🚧 and name the
  change where it is accepted (`acceptance.json` exists); where it is not,
  name the change and say it is not yet accepted

| Page | Section | Covers | Link |
| --- | --- | --- | --- |
| <page title> | <requirement or heading> | <the cases or decisions it holds> | [Open](https://spec.grade10-stg.com/p/...) |

## Lavish

[Lavish](https://github.com/kunchenguid/lavish-axi) opens the lesson as a
page in a local browser. The reader comments on a line, a case, a row or a
step, and the agent answers each comment. Encourage the reader to read and
ask there: the page holds the whole lesson, and each comment points at one
claim.

Run it as `npx -y lavish-axi@0.1.93`, with `LAVISH_AXI_TELEMETRY=0` set: the
version is pinned so the skill and the CLI agree, and the variable turns off
Lavish's usage telemetry. A newer version is a change to this skill, made
after its `--help` is read again.

### Build the page

1. **Copy the template** - [`lesson-template.html`](lesson-template.html)
   to `${TMPDIR:-/tmp}/teach-me/<topic-slug>/lesson.html`. Lavish names a
   session by the file path, so one topic keeps one path. The look is a
   chosen one - V7's tile layout in Heron AI's style - and it is complete in
   the file: do not add a stylesheet, a font or a CDN
2. **Tiles** - each section is a two-line heading (the claim, then a grey
   `sub` line) and a grid of `tile`s. A tile has a `tag`, an `h3` and its
   text. Use `span-2` for a tile with more than three cases or a long lane,
   and `span-4` for the main lane. Number rules `R-01` on and cases `C-01`
   on, so a reader can name one in a comment
3. **Name the question** - the reader's words at the top, then the kind,
   the purpose and the pages read
4. **One claim, one target** - each feature, case, tile, step and open
   question is its own element with a stable `id`. A long reference list
   that does not fit tiles uses the `table` style, with each row header a
   `<th scope="row">`, so Lavish names the row in a comment
5. **Summary first** - the grey `sub` line says what the tiles show. Do not
   use colour as the only sign of a status: 🚧 and ❓ stay as text
6. **Known and not known** - a line from the store links its source. A line
   the agent inferred says so, or is a ❓
7. **End with what is left out** - the `left-out` section names what the
   lesson did not cover and where to look next. Do not restate the lesson
8. **More** - the More buttons queue the other kinds and the hand-offs as
   prompts. The rest of the page needs no script

### Run the session

1. **Open** - `npx -y lavish-axi@0.1.93 <lesson.html>`. Give the reader the
   link it prints
2. **Wait** - `npx -y lavish-axi@0.1.93 poll <lesson.html>`, in the
   foreground, with no timeout. Do not stop it, and do not move it to the
   background with `&`, `nohup` or a detached terminal. A harness task that
   wakes the agent when it ends is allowed - Claude Code's background Bash
   task is one. In Codex, keep it attached to the active turn. Stopped or timed out: run it again; the
   comments stay queued
3. **Answer each comment** - read the whole poll response first. Then, by
   what the comment asks:
   - **A question** - answer it from the store, with the same rules as a
     lesson. Add the answer under **Follow-ups**, in a block marked
     `data-lavish-revision="r<n>"`, and add round `r<n>` to the
     `data-lavish-revisions` registry. Add the registry only from the first
     answered round
   - **"This is wrong"** - check the store. Where the lesson is wrong,
     correct it in the page. Where the reader thinks the store is wrong,
     that is a product question: name the PRD page and who confirms it, and
     mark the line ❓. Do not edit the store
   - **A More button or a new topic** - a new kind of the same topic goes
     into the same page, in new sections. A new topic is a new page and a
     new session
   - **Code** - the [Hand-offs](#hand-offs) line for `/teach`
4. **Reply** - `poll <lesson.html> --agent-reply "<one or two sentences>"`
   to say what changed and where, then wait again. A longer reply uses
   `--agent-reply-file`, in short Markdown
5. **End** - the reader ends the session in the browser. The poll then
   returns `ended`: stop, give anything left in the chat, and do not
   reopen it unless the reader asks. `browser_disconnected`: ask the reader
   whether to reopen or end it. Do neither without an answer

### Do not

- **Do not run `share`** - it publishes the page on ht-ml.app, a
  third-party host, public by default. A lesson holds staging-manual
  content that sits behind Cloudflare Access. `export` writes a local file
  and is allowed
- **Do not chase layout issues** - fix one only when the reader queues it
- **Do not open the session in the agent's browser** - Lavish shows a
  session in one tab at a time, so the agent's tab takes it from the
  reader. To check the page, open the HTML file itself
- **Do not use the Mermaid whiteboard** - the lanes are the chart, so the
  page reads the same without Lavish
- **Fallback** - `npx` refused, no network, or no permission: write the
  same lesson page, give its file path, and say why Lavish did not start.
  The page reads the same without Lavish; only the More buttons stay
  hidden

## Hand-offs

This skill reads the product as the store states it. Give other questions
to the skill that owns them, in the closing line:

- **How the code does it** - `/teach` in the application repository. It
  reads the code and git history; this skill does not
- **Why a rule is so** - the page's `Product decisions` block and the
  change's `decisions.md` are the source. Quote the decision row; do not
  guess a reason the store does not give
- **Walk the test cases** - `/tcs-review walk <capability>`, not a second
  read of `feature-tcs.md`
- **Draw or change a story** - `/storybook-workbench`

## Stops

- **No page, no lesson** - a topic the manual does not have is a product
  question; say so, and name the nearest page
- **Never cite a scenario id** - link the requirement section instead
