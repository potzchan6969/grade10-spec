/*
 * The check through its own hooks, in throwaway copies of the store: each
 * case commits or pushes as a person would and reads what the hook said.
 */
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { AGENT, DESIGNER, fixture } from "./fixture.mjs";

const CARD = "packages/ui/src/blocks/card/card.tsx";
const BUTTON = "packages/design-system/src/components/button.tsx";
const PAGE = "apps/preview/src/pages/home.tsx";
const TOKENS = "packages/design-system/tokens.json";

const card = (
  padding = "p-4",
  extra = "",
) => `import { cn } from "../../lib/cn";

export function Card({ children }) {
  const label = "card";
  return (
    <div className={cn("rounded-lg ${padding} shadow-sm")}>
      {children}${extra}
    </div>
  );
}
`;

const tokens = (brand = "#E11D48", more = "") => `{
  "color": {
    "brand": { "$type": "color", "$value": "${brand}" }${more}
  }
}
`;

let repos = [];
function store(options) {
  const repo = fixture(options);
  repos.push(repo);
  repo.write(CARD, card());
  repo.write(TOKENS, tokens());
  repo.commit("feat: the card", { as: DESIGNER });
  return repo;
}
afterEach(() => {
  for (const repo of repos) repo.cleanup();
  repos = [];
});

const stopped = (result) => {
  assert.equal(
    result.status,
    1,
    `expected a stop, got ${result.status}: ${result.err}`,
  );
  return result.err;
};
const passed = (result) =>
  assert.equal(result.status, 0, `expected a pass: ${result.err}`);

test("shared-design-sync-design-override-SC-02 - each look-line kind stops", () => {
  const kinds = {
    class: `<span className="text-sm" />`,
    variant: `variants: { size: { sm: "h-8" } },`,
    style: `<span style={{ gap: 4 }} />`,
    motion: `  transition: { duration: 0.2 },`,
    named: `const FADE_MS = 200;`,
    string: `const base = "items-center gap-2";`,
  };
  for (const [kind, line] of Object.entries(kinds)) {
    const repo = store();
    repo.write(BUTTON, `export const x = 1;\n${line}\n`);
    repo.commit(`feat: add ${kind}`, { as: DESIGNER });
    repo.write(BUTTON, "export const x = 1;\n");
    const err = stopped(repo.commit(`fix: drop ${kind}`));
    assert.match(
      err,
      new RegExp(line.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      kind,
    );
  }
});

test("shared-design-sync-design-override-SC-02 - a story's title stops", () => {
  const repo = store();
  const story = "packages/design-system/src/components/button.stories.tsx";
  repo.write(story, `export default {\n  title: "Primitives/Button",\n};\n`);
  repo.commit("feat: story", { as: DESIGNER });
  repo.write(story, `export default {\n  title: "Base/Button",\n};\n`);
  assert.match(
    stopped(repo.commit("chore: rename story")),
    /title: "Primitives\/Button"/,
  );
});

test("shared-design-sync-design-override-SC-03 - a block moved in from an older copy names only the lines it lost", () => {
  const repo = store();
  const banner = (motion) => `export function Banner() {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0 }}
${motion}    />
  );
}
`;
  repo.write(
    PAGE,
    banner(
      "      transition={{ duration: 0.4 }}\n      animate={{ opacity: 1, ease: [0.2, 0, 0, 1] }}\n",
    ),
  );
  repo.commit("feat: banner", { as: DESIGNER });
  repo.remove(PAGE);
  repo.write("packages/ui/src/blocks/banner/banner.tsx", banner(""));
  const err = stopped(repo.commit("refactor: move the banner to blocks"));
  assert.match(err, /transition=\{\{ duration: 0.4 \}\}/);
  assert.match(err, /animate=\{\{ opacity: 1/);
  assert.doesNotMatch(err, /className="flex gap-4"/);
  assert.doesNotMatch(err, /initial=/);
});

test("shared-design-sync-design-override-SC-04 - a changed or removed token stops, naming its path", () => {
  const repo = store();
  repo.write(TOKENS, tokens("#000000"));
  assert.match(stopped(repo.commit("chore: darker brand")), /color\.brand/);
  repo.write(TOKENS, `{\n  "color": {}\n}\n`);
  assert.match(stopped(repo.commit("chore: drop brand")), /color\.brand/);
});

test("shared-design-sync-design-override-SC-05 - an added token passes", () => {
  const repo = store();
  repo.write(
    TOKENS,
    tokens(
      undefined,
      `,\n    "ink": { "$type": "color", "$value": "#111111" }`,
    ),
  );
  passed(repo.commit("feat: ink token"));
});

test("shared-design-sync-design-override-SC-06 - code moved unchanged from a preview page into blocks passes", () => {
  const repo = store();
  const hero = `export function Hero() {\n  return <section className="grid gap-6 p-8" />;\n}\n`;
  repo.write(PAGE, `import { Card } from "./card";\n\n${hero}`);
  repo.commit("feat: hero", { as: DESIGNER });
  repo.write(PAGE, `import { Card } from "./card";\n`);
  repo.write("packages/ui/src/blocks/hero/hero.tsx", hero);
  passed(repo.commit("refactor: lift the hero into blocks"));
});

test("shared-design-sync-design-override-SC-07 - formatting passes", () => {
  const repo = store();
  repo.write(
    CARD,
    card()
      .replace(
        `<div className={cn("rounded-lg p-4 shadow-sm")}>`,
        `<div   className={cn("rounded-lg p-4 shadow-sm")}  >`,
      )
      .replaceAll("  ", "    "),
  );
  passed(repo.commit("style: format"));
  repo.write(
    CARD,
    card().replace(
      `    <div className={cn("rounded-lg p-4 shadow-sm")}>`,
      `    <div\n      className={cn("rounded-lg p-4 shadow-sm")}\n    >`,
    ),
  );
  passed(repo.commit("style: wrap the tag"));
});

test("shared-design-sync-design-override-SC-08 - lines that set no look pass", () => {
  const repo = store();
  const extras = `type Props = { title: string };\n// the card's frame\n\n`;
  repo.write(CARD, extras + card());
  repo.commit("feat: typed card", { as: DESIGNER });
  repo.write(
    CARD,
    card()
      .replace(`import { cn } from "../../lib/cn";\n`, "")
      .replace(`  const label = "card";\n`, ""),
  );
  repo.write(
    "packages/ui/src/blocks/card/card.stories.tsx",
    `export default { title: "Blocks/Card" };\n`,
  );
  passed(repo.commit("refactor: tidy"));
});

test("shared-design-sync-design-override-SC-09 - a path outside the watched paths passes", () => {
  const repo = store();
  repo.write("scripts/tool.tsx", `<div className="p-4" />\n`);
  repo.commit("feat: tool");
  repo.write("scripts/tool.tsx", `<div className="p-6" />\n`);
  passed(repo.commit("fix: tool"));
});

test("shared-design-sync-design-override-SC-46 - a reordered class list stops", () => {
  const repo = store();
  repo.write(
    CARD,
    card().replace("rounded-lg p-4 shadow-sm", "p-4 rounded-lg shadow-sm"),
  );
  const err = stopped(repo.commit("style: sort classes"));
  assert.match(
    err,
    /before {2}<div className=\{cn\("rounded-lg p-4 shadow-sm"\)\}>/,
  );
  assert.match(
    err,
    /after {3}<div className=\{cn\("p-4 rounded-lg shadow-sm"\)\}>/,
  );
});

test("shared-design-sync-design-override-SC-10 - the stop shows before, after and who set it", () => {
  const repo = store();
  const setter = repo.head().slice(0, 8);
  repo.write(CARD, card("p-2"));
  const err = stopped(repo.commit("fix: lint"));
  assert.match(err, new RegExp(`^${CARD}$`, "m"));
  assert.match(err, /before {2}.*p-4/);
  assert.match(err, /after {3}.*p-2/);
  assert.match(err, new RegExp(`set by {2}Constance, 2026-09-01, ${setter}`));
});

test("shared-design-sync-design-override-SC-11 - a motion line removed with nothing in its place shows no after", () => {
  const repo = store();
  const fade = "packages/ui/src/blocks/fade.tsx";
  repo.write(
    fade,
    "export const fade = {\n  transition: { duration: 0.2 },\n};\n",
  );
  repo.commit("feat: fade", { as: DESIGNER });
  repo.write(fade, "export const fade = {\n};\n");
  const err = stopped(repo.commit("fix: instant fade"));
  assert.match(err, /before {2}transition: \{ duration: 0\.2 \},/);
  assert.match(err, /set by {2}Constance, 2026-09-01/);
  assert.doesNotMatch(err, /after {3}/);
});

test("shared-design-sync-design-override-SC-12 - the stop ends with the line to add", () => {
  const repo = store();
  repo.write(CARD, card("p-2"));
  const paragraphs = stopped(repo.commit("fix: lint")).trim().split("\n\n");
  assert.match(paragraphs.at(-2), /ask whether/);
  assert.equal(paragraphs.at(-1), "Design-Override: <what changes and why>");
});

function branchPair(repo, mine, theirs) {
  repo.must(["checkout", "-q", "-b", "feature"]);
  mine();
  repo.must(["checkout", "-q", "main"]);
  theirs();
  repo.must(["checkout", "-q", "feature"]);
}

test("shared-design-sync-design-override-SC-13 - a merge that keeps an old copy stops", () => {
  const repo = store();
  branchPair(
    repo,
    () => {
      repo.write(CARD, card("p-4", "\n      <footer />"));
      repo.commit("feat: footer");
    },
    () => {
      repo.write(CARD, card("p-6"));
      repo.commit("feat: roomier card", { as: DESIGNER });
    },
  );
  repo.git(["merge", "-q", "--no-commit", "main"]);
  repo.write(CARD, card("p-4", "\n      <footer />"));
  const err = stopped(repo.commit("Merge main"));
  assert.match(err, /drops lines one side of the merge holds/);
  assert.match(err, /p-6/);
  assert.match(err, /held by/);
});

test("shared-design-sync-design-override-SC-14 - a clean pull passes", () => {
  const repo = store();
  branchPair(
    repo,
    () => {
      repo.write(
        "packages/ui/src/blocks/other.tsx",
        "export const other = 1;\n",
      );
      repo.commit("feat: other");
    },
    () => {
      repo.write(
        CARD,
        card().replace(
          `    <div className={cn("rounded-lg p-4 shadow-sm")}>\n`,
          "",
        ),
      );
      repo.commit("feat: flatter card", { as: DESIGNER });
    },
  );
  passed(repo.git(["merge", "-q", "--no-edit", "main"]));
});

test("shared-design-sync-design-override-SC-15 - a line both sides hold, removed by the merge, stops", () => {
  const repo = store();
  branchPair(
    repo,
    () => {
      repo.write("packages/ui/src/blocks/a.tsx", "export const a = 1;\n");
      repo.commit("feat: a");
    },
    () => {
      repo.write("packages/ui/src/blocks/b.tsx", "export const b = 1;\n");
      repo.commit("feat: b");
    },
  );
  repo.git(["merge", "-q", "--no-commit", "main"]);
  repo.write(CARD, card().replace(`  const label = "card";\n`, ""));
  assert.match(stopped(repo.commit("Merge main")), /const label = "card";/);
});

test("shared-design-sync-design-override-SC-16 - the designer's merge is held", () => {
  const repo = store();
  branchPair(
    repo,
    () => {
      repo.write(CARD, card("p-4", "\n      <aside />"));
      repo.commit("feat: aside", { as: DESIGNER });
    },
    () => {
      repo.write(CARD, card("p-4", "\n      <footer />"));
      repo.commit("feat: footer");
    },
  );
  repo.git(["merge", "-q", "--no-commit", "main"], { as: DESIGNER });
  repo.write(CARD, card("p-4", "\n      <aside />"));
  assert.match(
    stopped(repo.commit("Merge main", { as: DESIGNER })),
    /<footer \/>/,
  );
});

test("shared-design-sync-design-override-SC-47 - a line dropped outside the watched paths passes a merge", () => {
  const repo = store();
  const doc = "docs/prds/page.md";
  repo.write(doc, "one\n");
  repo.commit("docs: page");
  branchPair(
    repo,
    () => {
      repo.write(doc, "one\nmine\n");
      repo.commit("docs: mine");
    },
    () => {
      repo.write(doc, "one\ntheirs\n");
      repo.commit("docs: theirs");
    },
  );
  repo.git(["merge", "-q", "--no-commit", "main"]);
  repo.write(doc, "one\nmine\n");
  passed(repo.commit("Merge main"));
});

test("shared-design-sync-design-override-SC-24 - the line passes every stop in two blocks, beside a co-author", () => {
  const repo = store();
  const alert = "packages/ui/src/blocks/alert/alert.tsx";
  repo.write(alert, `<div className="p-4 rounded-md" />\n`);
  repo.commit("feat: alert", { as: DESIGNER });
  repo.write(CARD, card("p-2"));
  repo.write(alert, `<div className="p-2 rounded-md" />\n`);
  stopped(repo.commit("fix: tighter"));
  passed(
    repo.commit(
      "fix: tighter\n\nCo-authored-by: Echo <ecchochan@gmail.com>\nDesign-Override: tighter padding on both alerts, agreed with the designer",
    ),
  );
});

test("shared-design-sync-design-override-SC-25 - an empty reason is refused", () => {
  const repo = store();
  repo.write(CARD, card("p-2"));
  const err = stopped(repo.commit("fix: tighter\n\nDesign-Override:   "));
  assert.match(err, /has no reason/);
  assert.match(err, /p-2/);
});

test("shared-design-sync-design-override-SC-26 - the line outside the last paragraph does not count", () => {
  const repo = store();
  repo.write(CARD, card("p-2"));
  stopped(
    repo.commit(
      "fix: tighter\n\nDesign-Override: agreed\n\nMore words after it.",
    ),
  );
});

test("the line is found when the message carries a verbose diff", () => {
  const repo = store();
  repo.write(CARD, card("p-2"));
  repo.must(["add", "-A"]);
  repo.write(
    "editor.sh",
    `printf 'fix: tighter\\n\\nDesign-Override: agreed\\n' | cat - "$1" > "$1.new" && mv "$1.new" "$1"\n`,
  );
  passed(
    repo.git([
      "-c",
      `core.editor=sh ${repo.dir}/editor.sh`,
      "commit",
      "-q",
      "-v",
    ]),
  );
});

test("shared-design-sync-design-override-SC-28 - the designer as author passes", () => {
  const repo = store();
  repo.write(CARD, card("p-2"));
  passed(repo.commit("fix: polish", { as: DESIGNER }));
});

test("shared-design-sync-design-override-SC-29 - an agent authors a motion change the designer commits, and it passes", () => {
  const repo = store();
  const fade = "packages/ui/src/blocks/fade.tsx";
  repo.write(
    fade,
    "export const fade = {\n  transition: { duration: 0.2 },\n};\n",
  );
  repo.commit("feat: fade", { as: DESIGNER });
  repo.write(
    fade,
    "export const fade = {\n  transition: { duration: 0.4 },\n};\n",
  );
  passed(repo.commit("fix: slower fade", { as: AGENT, committer: DESIGNER }));
});

test("shared-design-sync-design-override-SC-30 - the designer as co-author passes, whatever the case of the e-mail", () => {
  const repo = store();
  repo.write(CARD, card("p-2"));
  passed(
    repo.commit("fix: polish\n\nCo-authored-by: C <TANGCONSTANCE@GMAIL.COM>", {
      as: "Claude <noreply@anthropic.com>",
    }),
  );
});

test("shared-design-sync-design-override-SC-31 - an agent with no known person is held", () => {
  const repo = store();
  repo.write(CARD, card("p-2"));
  stopped(repo.commit("fix: polish", { as: AGENT }));
});

test("with no designer in the map, nobody is exempt", () => {
  const repo = store({ team: "handles: {}\nchannels: {}\n" });
  repo.write(CARD, card("p-2"));
  stopped(repo.commit("fix: polish", { as: DESIGNER }));
});

test("shared-design-sync-design-override-SC-49 - the check refuses when it cannot read the team", () => {
  const repo = store();
  repo.remove("docs/prds/team.yaml");
  repo.write(CARD, card("p-2"));
  const result = repo.commit("fix: polish");
  assert.notEqual(result.status, 0);
  assert.match(
    result.err,
    /could not check this: could not read docs\/prds\/team\.yaml/,
  );
});

test("only the staged change is checked at commit", () => {
  const repo = store();
  repo.write("packages/ui/src/blocks/other.tsx", "export const other = 1;\n");
  repo.must(["add", "packages/ui/src/blocks/other.tsx"]);
  repo.write(CARD, card("p-2"));
  passed(repo.git(["commit", "-q", "-m", "feat: other"]));
  assert.match(repo.must(["status", "--short"]), /card\.tsx/);
});

function withRemote(repo) {
  const bare = `${repo.dir}.remote`;
  repo.must(["init", "-q", "--bare", bare], { cwd: "/" });
  repo.must(["remote", "add", "origin", bare]);
  repo.must(["push", "-q", "--no-verify", "origin", "main"]);
  return bare;
}

test("shared-design-sync-design-override-SC-33 - a commit that skipped the check is refused at push", () => {
  const repo = store();
  withRemote(repo);
  repo.write(CARD, card("p-2"));
  repo.must(["add", "-A"]);
  repo.must(["commit", "-q", "--no-verify", "-m", "fix: lint"]);
  const sha = repo.head().slice(0, 8);
  const err = stopped(repo.git(["push", "-q", "origin", "main"]));
  assert.match(err, new RegExp(`commit ${sha} fix: lint`));
  assert.match(err, /p-2/);
});

test("shared-design-sync-design-override-SC-34 - a merge is checked at commit", () => {
  const repo = store();
  branchPair(
    repo,
    () => {
      repo.write(CARD, card("p-3"));
      repo.commit("fix: p-3", { as: DESIGNER });
    },
    () => {
      repo.write(CARD, card("p-5"));
      repo.commit("fix: p-5", { as: DESIGNER });
    },
  );
  assert.notEqual(repo.git(["merge", "-q", "main"]).status, 0);
  repo.write(CARD, card("p-3"));
  assert.match(stopped(repo.commit("Merge main")), /p-5/);
});

test("shared-design-sync-design-override-SC-35 - a new branch is checked over its own commits only", () => {
  const repo = store();
  withRemote(repo);
  repo.write(CARD, card("p-2"));
  repo.must(["add", "-A"]);
  repo.must(["commit", "-q", "--no-verify", "-m", "fix: skipped"]);
  repo.must(["push", "-q", "--no-verify", "origin", "main"]);
  repo.must(["checkout", "-q", "-b", "fresh"]);
  repo.write("packages/ui/src/blocks/other.tsx", "export const other = 1;\n");
  repo.commit("feat: other");
  passed(repo.git(["push", "-q", "origin", "fresh"]));
});

test("shared-design-sync-design-override-SC-36 - deleting a branch checks nothing", () => {
  const repo = store();
  withRemote(repo);
  repo.must(["checkout", "-q", "-b", "old"]);
  repo.write(CARD, card("p-2"));
  repo.must(["add", "-A"]);
  repo.must(["commit", "-q", "--no-verify", "-m", "fix: skipped"]);
  repo.must(["push", "-q", "--no-verify", "origin", "old"]);
  passed(repo.git(["push", "-q", "origin", "--delete", "old"]));
});

test("shared-design-sync-design-override-SC-37 - install sets the hooks in a person's clone and not in CI", () => {
  const repo = store();
  const hooksPath = () =>
    repo.git(["config", "--get", "core.hooksPath"]).out.trim();
  assert.equal(hooksPath(), ".githooks");
  repo.must(["config", "--unset", "core.hooksPath"]);
  assert.equal(repo.install({ CI: "true" }).status, 0);
  assert.equal(hooksPath(), "");
});

test("a person's own git config changes no answer", () => {
  const repo = store({
    gitConfig:
      "[merge]\n\tconflictStyle = diff3\n[color]\n\tui = always\n[diff]\n\tnoprefix = true\n\texternal = false\n",
  });
  branchPair(
    repo,
    () => {
      repo.write(CARD, card("p-3"));
      repo.commit("fix: p-3", { as: DESIGNER });
    },
    () => {
      repo.write(CARD, card("p-5"));
      repo.commit("fix: p-5", { as: DESIGNER });
    },
  );
  repo.git(["merge", "-q", "main"]);
  repo.write(CARD, card("p-3"));
  const err = stopped(repo.commit("Merge main"));
  assert.match(err, /p-5/);
  assert.doesNotMatch(err, /p-4/);
  assert.ok(!err.includes("\u001b"), "no colour codes");
});
