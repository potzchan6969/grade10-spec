/*
 * The merge rule: the result is compared with git's own merge of the
 * parents, so a line git would have kept and the result drops is a stop, and
 * a pull bringing the other side's own removals is not. Whoever commits it.
 */
import { blame, git, readAt, short } from "./git.mjs";
import { normalize, removedLines } from "./lines.mjs";

const SKIPPED = /^(?:[[\](){}<>/;,]+|<{7}.*|={7}|>{7}.*)$/;

/** The merge commit is scratch, never pushed, so a runner with no identity still makes it. */
const SCRATCH_IDENTITY = {
  GIT_AUTHOR_NAME: "design-override",
  GIT_AUTHOR_EMAIL: "design-override@localhost",
  GIT_COMMITTER_NAME: "design-override",
  GIT_COMMITTER_EMAIL: "design-override@localhost",
};

/** Git's merge of the parents, as a tree; a conflict leaves its markers in. */
function gitMerge([head, ...rest], base) {
  let tree;
  for (const other of rest) {
    const out = git(
      [
        "merge-tree",
        "--write-tree",
        "--no-messages",
        "-z",
        ...(base ? ["--merge-base", base] : []),
        head,
        other,
      ],
      { ok: [0, 1] },
    );
    tree = out.split("\0")[0];
    head = git(
      ["commit-tree", tree, "-p", head, "-p", other, "-m", "design-override"],
      { env: SCRATCH_IDENTITY },
    ).trim();
  }
  return tree;
}

function holder(parents, file, line) {
  for (const parent of parents) {
    const lines = (readAt(parent, file) ?? "").split("\n");
    const i = lines.findIndex((l) => normalize(l) === line);
    if (i !== -1) return { parent, n: i + 1 };
  }
  return undefined;
}

/**
 * The lines `result` (a sha, or the index) drops that git's merge of
 * `parents` keeps; `base` pins the merge base, as a replayed commit's own parent.
 */
export function mergeStops(parents, result, paths, base) {
  const lines = removedLines(
    gitMerge(parents, base),
    result,
    paths,
    (_path, text) => {
      const line = normalize(text);
      return line !== "" && !SKIPPED.test(line);
    },
  );
  return lines.map(({ file, before }) => {
    const held = holder(parents, file, normalize(before));
    return {
      file,
      before,
      parent: held && short(held.parent),
      setBy: held && blame(held.parent, file, held.n),
    };
  });
}
