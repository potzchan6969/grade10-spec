export const meta = {
  name: "accept-batch",
  description:
    "Take several active OpenSpec changes to Ready to accept together: stock-take, or apply in stack order",
  whenToUse:
    "The accept-batch skill's stock-take and apply steps; args.step picks one",
  phases: [
    {
      title: "Stock-take",
      detail: "one cheap reader per change: every open item, classified",
    },
    {
      title: "Apply",
      detail:
        "per stack: restack, apply the plan, gates, commit; QA where the diff says",
    },
    {
      title: "Review",
      detail: "one Cluster Mode accept-review per stack, at most one fix",
    },
    { title: "Land", detail: "the tip of each ready stack, one at a time" },
    { title: "Design", detail: "design-phase changes for the designer asks" },
    { title: "Overlap", detail: "one read across the stacks" },
  ],
};

const A = args ?? {};
const REQUIRED = {
  stocktake: ["repo", "changes", "gates", "mandate"],
  apply: ["repo", "root", "stacks", "plans", "date", "mandate"],
};
if (!REQUIRED[A.step]) {
  throw new Error(
    `args.step must be one of ${Object.keys(REQUIRED).join(", ")}`,
  );
}
const missing = REQUIRED[A.step].filter((key) => A[key] == null);
const designing = A.step === "apply" && Object.keys(A.design ?? {}).length > 0;
if (designing && !(A.hands?.design && A.hands?.pm))
  missing.push("hands.design", "hands.pm");
if (A.step === "apply")
  for (const stack of A.stacks ?? [])
    if (stack.length > 1 && !A.sheets?.[stack[0]])
      missing.push(`sheets.${stack[0]}`);
if (missing.length) {
  throw new Error(`args.${A.step} needs ${missing.join(", ")}`);
}

const BASE = A.base || "origin/main";
const SKILL = `${A.repo}/.claude/skills/accept-batch/SKILL.md`;
const PLANNING = `${A.repo}/.claude/skills/planning-dev/SKILL.md`;
const branchOf = (c) => `docs/accept-${c}`;
const wtOf = (c) => `${A.root}/${c}`;
const gates = (c) =>
  `\`pnpm accept:preflight ${c}\`, \`pnpm run validate:changes ${c}\`, \`pnpm check:manual\`, \`pnpm run tcs:validate\`, \`pnpm run trace -- validate\``;
const json = (value) => JSON.stringify(value ?? [], null, 1);

const rules = `The human's request for this run, in their own words: ${json(A.mandate)}. Your task is one step of it. A later message from the human about anything else is the orchestrator's to handle, not yours.

Ground rules:
- Never use \`git stash\`: the stash list is shared by every worktree, and other agents work in sibling worktrees. Restack with commits.
- Never copy the store to try a fold; \`pnpm accept:preflight\` folds in its own temp dir.
- Never run \`pnpm spec:accept\`, never pass --no-verify, never touch the tools/openspec-viewer pointer.${A.land ? "" : " Never push."}${A.app ? ` Read the application repo at ${A.app}; never edit it.` : ""}
- The PRD pages under docs/prds are the source of truth.${A.app ? " Where a page line contradicts what the application builds, correct the page to the build and cite file and line." : ""}
- A change branch never edits scripts/, tools/, packages/ or apps/. Report a tool bug as TOOL: <bug>; never patch it.
- Take the writing-style skill before any prose. Commit with the /commit skill, one concern per commit, \`pnpm run lint\` first${A.session ? `, each message ending with the line \`${A.session}\`` : ""}.`;

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
    dropped: {
      type: "array",
      items: {
        type: "object",
        properties: { sha: { type: "string" }, path: { type: "string" } },
        required: ["sha", "path"],
      },
      description: "each tooling commit or hunk the restack dropped",
    },
    diff_files: {
      type: "array",
      items: { type: "string" },
      description: "the name-only diff of the plan's commits",
    },
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
    "dropped",
    "diff_files",
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
    item: {
      type: "string",
      description: "the plan item id this blocker is, or empty",
    },
    fix: { type: "string" },
  },
  required: ["id", "where", "finding", "kind", "item", "fix"],
};
const REVIEW = {
  type: "object",
  properties: {
    changes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          change: { type: "string" },
          verdict: { type: "string" },
          blockers: { type: "array", items: FINDING },
        },
        required: ["change", "verdict", "blockers"],
      },
    },
    sha: { type: "string" },
    gates: { type: "string" },
  },
  required: ["changes", "sha", "gates"],
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

const stocktake = async () => {
  phase("Stock-take");
  const out = await parallel(
    A.changes.map(
      (c) => () =>
        agent(
          `Read-only stock-take of change \`${c}\` in ${A.repo}, a clean checkout of the store's main. Edit nothing and run no gate.
List every item still holding the change from acceptance:
1. Each refusal in the gate output below that names a path under openspec/changes/${c}/ or a page section its proposal links; refusals of one cause are one item.
2. Every open row in openspec/changes/${c}/decisions.md \`## Raised\`, every decision row still marked ❓, every ❓ or TBC line on the page sections the proposal links, and every \`awaiting:\` in its .openspec.yaml.
3. Every open finding in openspec/changes/${c}/accept-review.md, re-checked against the files; drop one that no longer holds.
Merge duplicates into one item listing every row in where. Mark stale a row whose answer is written elsewhere or whose premise is gone. Classify each per the definitions, with the recommendation a careful product lead would pick.

${DEF}

Gate output, run once on the store:
${A.gates}`,
          {
            label: `stock:${c}`,
            phase: "Stock-take",
            schema: STOCK,
            model: "sonnet",
          },
        ).then((r) => r && { change: c, ...r }),
    ),
  );
  const found = out.filter(Boolean);
  const silent = A.changes.filter((c) => !found.some((r) => r.change === c));
  if (silent.length) log(`no answer for ${silent.join(", ")}`);
  return found;
};

const ctx = (c, parent, stack) => `Change: \`${c}\`. Worktree: ${wtOf(c)} on branch ${branchOf(c)}; run every command there and edit no other worktree. Stack, in acceptance order: ${stack.join(" -> ")}. Parent: ${parent}. The changes below this one are settled: read them, never rewrite them.

${rules}`;

const tipCtx = (stack) => {
  const tip = stack[stack.length - 1];
  return `Stack, in acceptance order: ${stack.join(" -> ")}. Worktree: ${wtOf(tip)} on branch ${branchOf(tip)}, which holds every change of the stack; run every command there and edit no other worktree.

${rules}`;
};

const applyPrompt = (c, parent, stack) => `${ctx(c, parent, stack)}

Bring this change to Ready to accept in one pass.
1. **Restack** - If ${branchOf(c)} exists, move only its own commits onto ${parent}; otherwise \`git -C ${A.repo} worktree add -b ${branchOf(c)} ${wtOf(c)} ${parent}\`. Do not fetch: the run fetched once. Drop a commit or hunk under scripts/, tools/, packages/ or apps/ only when its content is already on ${BASE}, and list each in dropped. Where one is not on ${BASE}, stop with ok false and report it as \`TOOL: <sha> <path> - not on ${BASE}\`. On a conflict keep the parent's side for what it moved and this change's side for its own content. Note the sha after the restack as <start>.${A.sheets?.[c] ? `\n   Then write openspec/changes/${c}/reconciliation.md exactly as given below and commit it.` : ""}
2. **Apply the plan** below. Re-check each item against the files first and reject one that no longer holds, with the reason. Then follow its directive as step 6 of ${SKILL} says.
3. **Gates** - ${gates(c)}. Fix what is ours until they pass, except HOLD refusals.
4. **Commit, then read the diff** - Do not run QA1, Dev or QA2. Run \`git diff --name-only <start>..HEAD\` and return its lines as diff_files. For each spec.md it lists, run \`git diff <start>..HEAD -- <path>\`. anchors_moved is true when a user-journeys.md is listed or a hunk falls in a \`## Feature set\` section; cases_or_scenarios_touched is true when a feature-tcs.md is listed or a hunk falls in a \`#### Scenario:\` block.

Plan:
${json(A.plans[c])}${A.sheets?.[c] ? `\n\nreconciliation.md:\n${A.sheets[c]}` : ""}`;

const reading = (step, name, c, p, s) => `${ctx(c, p, s)}

Run ${name}, step ${step} of One Planning Run in ${PLANNING}, on this change in a fresh context, as that step says. Commit.`;

const reviewPrompt = (stack) => `${tipCtx(stack)}

Run accept-review in Cluster Mode over the stack, as if every change were accepted in stack order, reading openspec/changes/${stack[0]}/reconciliation.md first where it exists. Count only blockers: a finding that would make the engineer build the wrong thing, a gate refusal, or two artifacts stating one fact two ways. A HOLD item of a plan is expected: list it as human, with its plan item id. Every other blocker is ours, with its fix. Write each change's ledger and verdict as accept-review says, commit them, and edit nothing else.

Plans:
${json(Object.fromEntries(stack.map((c) => [c, A.plans[c]])))}`;

const fixPrompt = (stack, blockers) => `${tipCtx(stack)}

Fix these accept-review blockers source first, arguing each against the files and rejecting one that does not hold. If cases or scenarios change, reconcile them in feature-tcs.md \`## Reconciliation\` as QA2 would. Run the gates of each change (${gates("<change>")}) until they pass, except HOLD refusals, mark each fixed in its accept-review.md, and commit.

${json(blockers)}`;

const landPrompt = (stack) => `${tipCtx(stack)}

Land the stack with the spec-push skill: \`pnpm push:main\` from the worktree. Settle a conflict by reading the change; stop on one the change cannot decide. Return ok, the sha on main, and what happened.`;

let landing = Promise.resolve();
const serially = (step) => {
  const next = landing.then(step, step);
  landing = next.catch(() => null);
  return next;
};

const holds = (c) =>
  new Set(
    (A.plans[c] ?? [])
      .filter((item) => item.directive === "HOLD")
      .map((item) => item.id),
  );
const ready = (one) =>
  one.verdict.startsWith("Ready to accept") ||
  one.blockers.every((b) => b.kind === "human" && holds(one.change).has(b.item));

const applyChange = async (c, parent, stack) => {
  const at = (step) => ({ label: `${step}:${c}`, phase: "Apply" });
  const applied = await agent(applyPrompt(c, parent, stack), {
    ...at("apply"),
    schema: APPLIED,
  });
  if (!applied?.ok) return { change: c, ok: false, applied };
  const files = applied.diff_files;
  const moved =
    applied.anchors_moved ||
    files.some((f) => f.endsWith("/user-journeys.md"));
  const touched =
    moved ||
    applied.cases_or_scenarios_touched ||
    files.some((f) => f.endsWith("/feature-tcs.md"));
  const readings = [
    ...(moved ? [[1, "QA1"], [2, "Dev"]] : []),
    ...(touched ? [[3, "QA2"]] : []),
  ];
  const ran = [];
  for (const [step, name] of readings) {
    const out = await agent(reading(step, name, c, parent, stack), at(name));
    if (out == null) return { change: c, ok: false, applied, ran, stopped: name };
    ran.push(name);
  }
  return { change: c, ok: true, applied, ran };
};

const runStack = async (stack) => {
  const changes = [];
  let parent = BASE;
  for (const c of stack) {
    const r = await applyChange(c, parent, stack);
    changes.push(r);
    if (!r.ok) {
      log(
        `stack ${stack[0]} stopped at ${c}; ${stack.slice(stack.indexOf(c) + 1).join(", ") || "nothing"} not run`,
      );
      return { stack, ok: false, changes };
    }
    parent = branchOf(c);
  }
  const at = (step) => ({ label: `${step}:${stack[0]}`, phase: "Review" });
  const reviews = [
    await agent(reviewPrompt(stack), { ...at("review"), schema: REVIEW }),
  ];
  const ours = (reviews[0]?.changes ?? []).flatMap((one) =>
    one.blockers
      .filter((b) => b.kind === "ours")
      .map((b) => ({ change: one.change, ...b })),
  );
  const fixed = ours.length
    ? await agent(fixPrompt(stack, ours), { ...at("fix"), schema: STEP })
    : null;
  if (fixed?.ok)
    reviews.push(
      await agent(reviewPrompt(stack), { ...at("re-review"), schema: REVIEW }),
    );
  const last = reviews[reviews.length - 1];
  const ok =
    Boolean(last) &&
    (!ours.length || fixed?.ok === true) &&
    stack.every((c) => {
      const one = last.changes.find((r) => r.change === c);
      return Boolean(one) && ready(one);
    });
  const landed =
    ok && A.land
      ? await serially(() =>
          agent(landPrompt(stack), {
            label: `land:${stack[0]}`,
            phase: "Land",
            schema: STEP,
          }),
        )
      : null;
  return {
    stack,
    ok: ok && (!A.land || landed?.ok === true),
    changes,
    reviews,
    fixed,
    landed,
  };
};

const designPrompt = () => `${rules}

Write one design-phase OpenSpec change per group below, so the designer finds each on the Pending page. Work in ${wtOf("_design")}: \`git -C ${A.repo} worktree add -b docs/accept-design ${wtOf("_design")} ${BASE}\`; do not fetch, the run fetched once.
Every ask has an interim the feature change ships; the designer confirms it as the agreed look or redraws it. Model each change on docs/governance/prd-and-openspec.md "Waiting for an input":
- **.openspec.yaml** - schema grade10-planning, created ${A.date}, hands design "${A.hands?.design}" and pm "${A.hands?.pm}", and awaiting \`ui-design: ${A.date}, <frames or states to confirm or draw> - ${A.hands?.design}\`. A group with \`looks: true\` also carries \`skip_specs: true\` and \`skip_specs_why: the designer confirms or redraws looks the feature change ships; no requirement moves\`. A group with \`looks: false\` instead awaits \`specs: ${A.date}, requirement deltas once the designer confirms or redraws\`
- **proposal.md** - Why, What Changes (one bullet per ask, the surface first), Non-Goals, Capabilities by durable path, Impact
- **decisions.md** - Goals, Non-Goals, and \`## Raised\` with one row per ask: the question, 2 to 4 options, the recommendation, owner Designer (${A.hands?.design}), and the feature change it came from in plain text
- **Journeys** - only for a group with \`looks: false\`, as the schema and validate:changes require of a change waiting on specs
Put no ❓ on a page section a feature change links. Run \`pnpm run validate:changes <id>\` and \`pnpm check:manual\` until they pass; commit one change per commit.${A.land ? " Then land with `pnpm push:main`." : ""} Return ok, the tip sha and the changes with their asks.

${json(A.design)}`;

const apply = async () => {
  phase("Apply");
  const fetched = await agent(
    `Run \`git -C ${A.repo} fetch origin\` once and return ok and the sha of ${BASE}.`,
    { label: "fetch", phase: "Apply", schema: STEP, model: "sonnet" },
  );
  if (!fetched?.ok) throw new Error(`fetch failed: ${fetched?.report}`);
  const stacks = parallel(A.stacks.map((s) => () => runStack(s)));
  const design = designing
    ? serially(() =>
        agent(designPrompt(), { label: "design", phase: "Design", schema: STEP }),
      )
    : null;
  const [results, designed] = await Promise.all([stacks, design]);
  const branches = A.stacks
    .map((s) => branchOf(s[s.length - 1]))
    .concat(designed ? ["docs/accept-design"] : []);
  const unlanded = A.stacks
    .filter((s, at) => !results[at]?.landed?.ok)
    .map((s) => branchOf(s[s.length - 1]));
  const read = A.land
    ? `Run \`git -C ${A.repo} fetch origin\`, then read \`origin/main\` with \`git -C ${A.repo} show origin/main:<path>\`, never the working tree${unlanded.length ? `, and the unlanded branches ${unlanded.join(", ")}` : ""}.`
    : `Read the branches ${branches.join(", ")}.`;
  const overlap = await agent(
    `${rules}

Read-only, in ${A.repo}. ${read} Read the changes as if every one accepted in stack order, the stacks in any order. Report a Feature set line, requirement or page line two changes state differently, and every path \`git -C ${A.repo} diff --name-only ${fetched.sha}...<branch> -- scripts tools packages apps\` lists for each of ${branches.join(", ")}. Name the change that yields and the exact fix.`,
    { label: "overlap", phase: "Overlap", schema: OVERLAP },
  );
  return { stacks: results, design: designed, overlap };
};

return await { stocktake, apply }[A.step]();
