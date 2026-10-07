export const meta = {
  name: "accept-batch",
  description:
    "Take several active OpenSpec changes to Ready to accept together: scout, stock-take, or apply in stack order",
  whenToUse:
    "The accept-batch skill's scout, stock-take and apply steps; args.step picks one",
  phases: [
    {
      title: "Scout",
      detail: "one read-only reader per change: gates and ids",
    },
    {
      title: "Stock-take",
      detail: "one cheap reader per change: every open item, classified",
    },
    {
      title: "Apply",
      detail:
        "per stack: restack, apply the plan, gates, commit; QA where needed",
    },
    {
      title: "Review",
      detail: "one fresh accept-review per change, at most one fix",
    },
    { title: "Design", detail: "design-phase changes for the designer asks" },
    { title: "Overlap", detail: "one read across the stack tips" },
  ],
};

const STEPS = ["scout", "stocktake", "apply"];
if (!STEPS.includes(args?.step)) {
  throw new Error(`args.step must be one of ${STEPS.join(", ")}`);
}
const A = args;
const BASE = A.base || "origin/main";
const branchOf = (c) => `docs/accept-${c}`;
const wtOf = (c) => `${A.root}/${c}`;
const gates = (c) =>
  `\`pnpm accept:preflight ${c}\`, \`pnpm run validate:changes ${c}\`, \`pnpm check:manual\`, \`pnpm run tcs:validate\`, \`pnpm run trace -- validate\``;

const rules = `Ground rules:
- Never run \`pnpm spec:accept\`, never pass --no-verify, never touch the tools/openspec-viewer pointer.${A.land ? "" : " Never push."}${A.app ? ` Read the application repo at ${A.app}; never edit it.` : ""}
- The PRD pages under docs/prds are the source of truth.${A.app ? " Where a page line contradicts what the application builds, correct the page to the build and cite file and line." : ""}
- A change branch never edits scripts/, tools/, packages/ or apps/. Report a tool bug as TOOL: <bug>; never patch it.
- A carried MODIFIED scenario keeps its durable trace id. A new scenario, case or story id sits above every id the changes below in the stack issue for that capability.
- Follow the store's skills: planning-dev, accept-review, writing-style before any prose, prd-authoring for page lines. Decided facts are flat and present-tense. ASCII hyphens only.
- Commit with the /commit skill, one concern per commit, \`pnpm run lint\` first${A.session ? `, each message ending with the line \`${A.session}\`` : ""}.`;

const DEF = `Definitions:
- **human**: a product preference between reasonable options, or an irreversible product choice.
- **designer**: a look, state, artwork, frame, hover, focus or layout the designer owns.
- **ours**: anything the page, the build, the governance or plain consistency settles, including gate refusals, id collisions and wording.
- **business: true** only for an important business decision: money, prices, margins, points or coupon value, what a member is charged or given, refunds and expiry windows, legal, privacy or compliance, a brand or vendor agreement, launching or withdrawing a customer-facing capability, or the metric the business is judged by. Copy, ordering, edge cases with a sensible default, accessibility, looks, ownership between capabilities and process are not business.`;

const STEP = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    sha: { type: "string" },
    report: { type: "string" },
  },
  required: ["ok", "sha", "report"],
};
const SCOUT = {
  type: "object",
  properties: {
    gates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          command: { type: "string" },
          ok: { type: "boolean" },
          refusals: { type: "array", items: { type: "string" } },
        },
        required: ["command", "ok", "refusals"],
      },
    },
    capabilities: {
      type: "array",
      items: { type: "string" },
      description: "durable capability paths the change has a delta for",
    },
    pages: {
      type: "array",
      items: { type: "string" },
      description:
        "PRD pages the proposal links or whose spec: names a capability above",
    },
    ids: {
      type: "array",
      items: { type: "string" },
      description:
        "per capability and kind, the highest scenario, case, story and trace id the change issues, e.g. 'grade10-site/store/cart SC-41'",
    },
    depends_on: { type: "array", items: { type: "string" } },
  },
  required: ["gates", "capabilities", "pages", "ids", "depends_on"],
};
const ITEM = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "the row id as the change writes it, e.g. Q21 or R3",
    },
    question: {
      type: "string",
      description:
        "one plain sentence a product owner understands without the files",
    },
    options: {
      type: "array",
      items: { type: "string" },
      description: "2 to 4 short options; empty for ours",
    },
    rec: {
      type: "string",
      description:
        "the recommended option, verbatim from options, with a short why",
    },
    kind: { enum: ["human", "designer", "ours"] },
    business: { type: "boolean" },
    business_why: { type: "string" },
    surface: {
      type: "string",
      description: "for designer items: the screen or block it draws",
    },
    where: {
      type: "string",
      description: "decisions.md row and the page line it marks, path:line",
    },
    stale: {
      type: "boolean",
      description:
        "already answered, superseded, or its premise no longer holds",
    },
  },
  required: [
    "id",
    "question",
    "options",
    "rec",
    "kind",
    "business",
    "business_why",
    "surface",
    "where",
    "stale",
  ],
};
const STOCK = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "the change in a plain 3 to 7 word title",
    },
    what: {
      type: "string",
      description:
        "what it delivers to a member or operator, two plain sentences",
    },
    items: { type: "array", items: ITEM },
  },
  required: ["title", "what", "items"],
};
const APPLIED = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    sha: { type: "string" },
    applied: {
      type: "array",
      items: { type: "string" },
      description: "one line per item: id - what changed",
    },
    rejected: { type: "array", items: { type: "string" } },
    anchors_moved: { type: "boolean" },
    cases_or_scenarios_touched: { type: "boolean" },
    gates: { type: "string" },
    tool_bugs: { type: "array", items: { type: "string" } },
  },
  required: [
    "ok",
    "sha",
    "applied",
    "rejected",
    "anchors_moved",
    "cases_or_scenarios_touched",
    "gates",
    "tool_bugs",
  ],
};
const FINDING = {
  type: "object",
  properties: {
    id: { type: "string" },
    where: { type: "string" },
    finding: { type: "string" },
    kind: { enum: ["ours", "human", "designer"] },
    fix: { type: "string" },
  },
  required: ["id", "where", "finding", "kind", "fix"],
};
const REVIEW = {
  type: "object",
  properties: {
    verdict: { type: "string" },
    blockers: { type: "array", items: FINDING },
    gates: { type: "string" },
  },
  required: ["verdict", "blockers", "gates"],
};
const OVERLAP = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          changes: { type: "array", items: { type: "string" } },
          where: { type: "string" },
          finding: { type: "string" },
          yields: {
            type: "string",
            description: "the change that should change",
          },
          fix: { type: "string" },
        },
        required: ["changes", "where", "finding", "yields", "fix"],
      },
    },
  },
  required: ["findings"],
};

const answered = (out) => {
  const found = out.filter(Boolean);
  const missing = A.changes.filter((c) => !found.some((r) => r.change === c));
  if (missing.length) log(`no answer for ${missing.join(", ")}`);
  return found;
};

const scout = async () => {
  phase("Scout");
  const out = await parallel(
    A.changes.map(
      (c) => () =>
        agent(
          `Read-only scout of change \`${c}\` in ${A.repo}, a clean checkout of the store's main. Edit nothing and judge nothing.
Run ${gates(c)}; record each refusal verbatim. Then list the durable capabilities the change has a delta for, the PRD pages it touches, its depends_on, and per capability the highest scenario, case, story and trace id it issues.`,
          {
            label: `scout:${c}`,
            phase: "Scout",
            schema: SCOUT,
            model: "sonnet",
          },
        ).then((r) => r && { change: c, ...r }),
    ),
  );
  const found = answered(out);
  const share = (key) => {
    const by = {};
    for (const r of found) {
      for (const k of r[key]) by[k] = [...(by[k] || []), r.change];
    }
    return Object.fromEntries(
      Object.entries(by).filter(([, cs]) => cs.length > 1),
    );
  };
  return {
    changes: found,
    capabilities: share("capabilities"),
    pages: share("pages"),
  };
};

const stocktake = async () => {
  phase("Stock-take");
  const out = await parallel(
    A.changes.map(
      (c) => () =>
        agent(
          `Read-only stock-take of change \`${c}\` in ${A.repo}, a clean checkout of the store's main. Edit nothing.
List every item still holding the change from acceptance:
1. Each refusal of ${gates(c)}; refusals of one cause are one item.
2. Every open row in openspec/changes/${c}/decisions.md \`## Raised\`, every decision row still marked ❓, every ❓ or TBC line on the page sections the proposal links, and every \`awaiting:\` in its .openspec.yaml.
3. Every open finding in openspec/changes/${c}/accept-review.md, re-checked against the files; drop one that no longer holds.
Merge duplicates into one item listing every row in where. Mark stale a row whose answer is written elsewhere or whose premise is gone. Classify each per the definitions, with the recommendation a careful product lead would pick.

${DEF}`,
          {
            label: `stock:${c}`,
            phase: "Stock-take",
            schema: STOCK,
            model: "sonnet",
          },
        ).then((r) => r && { change: c, ...r }),
    ),
  );
  return answered(out);
};

const ctx = (
  c,
  parent,
  stack,
) => `Change: \`${c}\`. Worktree: ${wtOf(c)} on branch ${branchOf(c)}; run every command there and edit no other worktree. Stack, in acceptance order: ${stack.join(" -> ")}. Parent: ${parent}. The changes below this one are settled: read them, never rewrite them.

${rules}`;

const applyPrompt = (c, parent, stack) => `${ctx(c, parent, stack)}

Bring this change to Ready to accept in one pass.
1. **Restack** - \`git -C ${A.repo} fetch origin\`. If ${branchOf(c)} exists, move only its own commits onto ${parent}; otherwise \`git -C ${A.repo} worktree add -b ${branchOf(c)} ${wtOf(c)} ${parent}\`. Drop every commit or hunk under scripts/, tools/, packages/ or apps/. On a conflict keep the parent's side for what it moved and this change's side for its own content.
2. **Apply the plan** below. Re-check each item against the files first and reject one that no longer holds, with the reason. Then follow its directive:
   - **OURS** - fix it source first (page and decisions.md, then delta, ui and tech design, cases, tasks), and hunt its siblings
   - **DECIDED** - record the answer as a settled decision row, close the Raised row, take the ❓ off the page line, and carry the answer through the delta, cases and tasks
   - **DESIGNER** - ship the recommendation as this change's interim, or take the item out of scope where the recommendation says it belongs elsewhere; close the Raised row as handed to the design-phase change it names, in plain text
   - **HOLD** - as its directive says; its refusals stay
   - **STALE** - remove it, citing where it is answered
3. **Gates** - ${gates(c)}. Fix what is ours until they pass, except HOLD refusals.
4. **Commit** - Do not run QA1, Dev or QA2. Report whether a frozen anchor (the journey set or a feature-set root group) moved, and whether cases or scenarios changed.

Plan:
${JSON.stringify(A.plans?.[c] || [], null, 1)}`;

const qa1 = (c, p, s) => `${ctx(c, p, s)}

QA1 of planning-dev, fresh context: run spec-to-tcs against only the frozen anchors and the domain suite above; never read requirements, scenarios, tech design, tasks or QA2 material. Blind draft cases. Commit.`;
const dev = (c, p, s) => `${ctx(c, p, s)}

Dev of planning-dev, fresh context, without reading feature-tcs.md: bring tech-design.md, the scenarios (each with **Serves:**) and tasks.md in line with the moved anchors, from the PRD, journeys and ui-design.md. Run \`pnpm plan:review-preflight ${c}\` until it passes. Commit.`;
const qa2 = (c, p, s) => `${ctx(c, p, s)}

QA2 of planning-dev, fresh context: reconcile each case and scenario against the anchors in every feature-tcs.md \`## Reconciliation\`; fix ids and trace markers the gates refuse. A question no page line, decision row or build answers goes to \`## Raised\`. Cases stay draft. Run \`pnpm run tcs:validate\` and \`pnpm run trace -- validate\`. Commit.`;
const reviewPrompt = (c, p, s) => `${ctx(c, p, s)}

A fresh accept-review, as if every change below this one were accepted first. Count only blockers: a finding that would make the engineer build the wrong thing, a gate refusal, or two artifacts stating one fact two ways. A HOLD item of the plan is expected: list it as human. Every other blocker is ours, with its fix. Write and commit the ledger as accept-review says; edit nothing else.

Plan:
${JSON.stringify(A.plans?.[c] || [], null, 1)}`;
const fixPrompt = (c, p, s, blockers) => `${ctx(c, p, s)}

Fix these accept-review blockers source first, arguing each against the files and rejecting one that does not hold. If cases or scenarios change, reconcile them in feature-tcs.md \`## Reconciliation\` as QA2 would. Run ${gates(c)} until they pass, except HOLD refusals, mark each fixed in accept-review.md, and commit.

${JSON.stringify(blockers, null, 1)}`;
const landPrompt = (c) => `${rules}

In ${wtOf(c)}, land change \`${c}\` with the spec-push skill: \`pnpm push:main\`. Settle a conflict by reading the change; stop on one the change cannot decide. Return ok, the sha on main, and what happened.`;

const runChange = async (c, parent, stack) => {
  const at = (step, phaseName) => ({ label: `${step}:${c}`, phase: phaseName });
  const applied = await agent(applyPrompt(c, parent, stack), {
    ...at("apply", "Apply"),
    schema: APPLIED,
  });
  if (!applied?.ok) return { change: c, applied };
  if (applied.anchors_moved) {
    await agent(qa1(c, parent, stack), at("qa1", "Apply"));
    await agent(dev(c, parent, stack), at("dev", "Apply"));
  }
  if (applied.anchors_moved || applied.cases_or_scenarios_touched) {
    await agent(qa2(c, parent, stack), at("qa2", "Apply"));
  }
  const review = await agent(reviewPrompt(c, parent, stack), {
    ...at("review", "Review"),
    schema: REVIEW,
  });
  const ours = (review?.blockers || []).filter((b) => b.kind === "ours");
  const fixed = ours.length
    ? await agent(fixPrompt(c, parent, stack, ours), {
        ...at("fix", "Review"),
        schema: STEP,
      })
    : null;
  const landed = A.land
    ? await agent(landPrompt(c), { ...at("land", "Review"), schema: STEP })
    : null;
  const ok =
    Boolean(review) && (!ours.length || fixed?.ok) && (!A.land || landed?.ok);
  return { change: c, ok, applied, review, fixed, landed };
};

const runStack = async (stack) => {
  const out = [];
  let parent = BASE;
  for (const c of stack) {
    const r = await runChange(c, parent, stack);
    out.push(r);
    if (!r.ok) {
      log(
        `stack ${stack[0]} stopped at ${c}; ${stack.slice(stack.indexOf(c) + 1).join(", ") || "nothing"} not run`,
      );
      break;
    }
    parent = A.land ? BASE : branchOf(c);
  }
  return out;
};

const designPrompt = () => `${rules}

Write one design-phase OpenSpec change per group below, so the designer finds each on the Pending page. Work in ${wtOf("_design")}: \`git -C ${A.repo} fetch origin && git -C ${A.repo} worktree add -b docs/accept-design ${wtOf("_design")} ${BASE}\`.
Every ask has an interim the feature change ships; the designer confirms it as the agreed look or redraws it. Model each change on an active change whose .openspec.yaml awaits ui-design, and on docs/governance/prd-and-openspec.md "Waiting for an input":
- **.openspec.yaml** - schema grade10-planning, created ${A.date}, hands design "${A.hands?.design}" and pm "${A.hands?.pm}", and awaiting \`ui-design: ${A.date}, <frames or states to confirm or draw> - ${A.hands?.design}\` and \`specs: ${A.date}, requirement deltas once the designer confirms or redraws\`
- **proposal.md** - Why, What Changes (one bullet per ask, the surface first), Non-Goals, Capabilities by durable path, Impact
- **decisions.md** - Goals, Non-Goals, and \`## Raised\` with one row per ask: the question, 2 to 4 options, the recommendation, owner Designer (${A.hands?.design}), and the feature change it came from in plain text
- **Journeys** - as the schema and validate:changes require of a change waiting on specs
Group the asks by screen. Put no ❓ on a page section a feature change links. Run \`pnpm run validate:changes <id>\` and \`pnpm check:manual\` until they pass; commit one change per commit.${A.land ? " Then land with `pnpm push:main`." : ""} Return ok, the tip sha and the changes with their asks.

${JSON.stringify(A.design, null, 1)}`;

const apply = async () => {
  phase("Apply");
  const stacks = parallel(A.stacks.map((s) => () => runStack(s)));
  const design =
    A.design && Object.keys(A.design).length
      ? agent(designPrompt(), {
          label: "design",
          phase: "Design",
          schema: STEP,
        })
      : null;
  const [results, designed] = await Promise.all([stacks, design]);
  const tips = A.land
    ? `main after the landing`
    : A.stacks.map((s) => s.map(branchOf).join(" <- ")).join("; ");
  const overlap = await agent(
    `${rules}

Read-only, in ${A.repo}. Read the stacks (${tips})${designed ? " and docs/accept-design" : ""} as if every change accepted in stack order, the stacks in any order. Report: an id or trace marker issued twice for different things within one capability; a Feature set line, requirement or page line two changes state differently; any change branch still editing scripts/, tools/, packages/ or apps/. Name the change that yields and the exact fix.`,
    { label: "overlap", phase: "Overlap", schema: OVERLAP },
  );
  return { stacks: results, design: designed, overlap };
};

return await { scout, stocktake, apply }[A.step]();
