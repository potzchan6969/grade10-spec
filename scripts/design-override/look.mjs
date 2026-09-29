/*
 * The look rule: the lines a single-parent commit removes or rewrites that
 * set the agreed look, and the tokens it removes or changes.
 */
import { blame, diff, readAt } from "./git.mjs";
import { removedLines } from "./lines.mjs";

const UTILITY =
  /(?:^|\s)(?:[a-z0-9-]+:)*!?-?(?:p[xytrbls]?|m[xytrbls]?|gap(?:-[xy])?|space-[xy]|w|h|size|min-[wh]|max-[wh]|inset(?:-[xy])?|top|left|right|bottom|z|bg|text|font|leading|tracking|rounded(?:-[trblse]{1,2})?|border(?:-[trblxyse])?|ring|shadow|opacity|flex|grid|col|row|basis|items|justify|self|place|content|overflow|object|aspect|translate-[xy]|scale|rotate|duration|ease|delay|animate|transition|fill|stroke|outline|divide|line-clamp|from|via|to)-[^\s"'`]+/;
const STATE_PREFIX = /(?:^|\s)[a-z][a-z0-9-]*:[a-z!-]/;
const STRING = /(["'`])((?:\\.|(?!\1).)*)\1/g;

const LOOK = [
  /\bclass(?:Name)?\s*=/,
  /\b(?:cn|cva|clsx|twMerge|tv)\(/,
  /\b(?:variants|defaultVariants|compoundVariants|variant)\s*[=:]/,
  /\bstyle\s*[=:]\s*\{/,
  /^\s*(?:initial|animate|exit|transition|duration|ease|delay)\s*[:=]/,
  /\b[A-Z][A-Z0-9_]*_(?:MS|S|EASE|PX)\b/,
];

const IGNORED = [
  /^\s*$/,
  /^\s*import\b/,
  /^\s*export\s+(?:type\s+)?(?:\*|\{[^}]*\})\s+from\b/,
  /^\s*\}\s*from\s+["']/,
  /^\s*(?:export\s+)?(?:declare\s+)?(?:type|interface)\b/,
  /^\s*(?:\/\/|\/\*|\*|\{\s*\/\*)/,
];

const hasClassString = (line) =>
  [...line.matchAll(STRING)].some(
    ([, , body]) => UTILITY.test(body) || STATE_PREFIX.test(body),
  );

export function setsLook(path, line) {
  if (IGNORED.some((pattern) => pattern.test(line))) return false;
  if (path.endsWith(".css")) return true;
  if (/\.stories\.[jt]sx?$/.test(path) && /^\s*title\s*:/.test(line))
    return true;
  return LOOK.some((pattern) => pattern.test(line)) || hasClassString(line);
}

const isTokens = (path) => path.endsWith("tokens.json");

function tokensOf(text, path) {
  const found = new Map();
  if (text === undefined) return found;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    throw new Error(`could not read ${path} as JSON: ${cause.message}`);
  }
  const walk = (node, trail) => {
    if (typeof node !== "object" || node === null || Array.isArray(node))
      return;
    if ("$value" in node) {
      const { $description, ...token } = node;
      found.set(trail.join("."), JSON.stringify(token));
      return;
    }
    for (const [key, child] of Object.entries(node))
      walk(child, [...trail, key]);
  };
  walk(parsed, []);
  return found;
}

function lineOfToken(text, token) {
  const lines = text.split("\n");
  let at = 0;
  for (const key of token.split(".")) {
    at = lines.findIndex((line, i) => i >= at && line.includes(`"${key}"`));
    if (at === -1) return 1;
  }
  return at + 1;
}

function tokenStops(parent, commit, path) {
  const text = readAt(parent, path);
  const after = tokensOf(readAt(commit, path), path);
  return [...tokensOf(text, path)]
    .filter(([token, value]) => after.get(token) !== value)
    .map(([token, value]) => {
      const n = lineOfToken(text, token);
      return {
        file: path,
        n,
        before: `${token} ${value}`,
        after: after.has(token) ? `${token} ${after.get(token)}` : undefined,
        setBy: blame(parent, path, n),
      };
    });
}

/** The look lines `commit` (a sha, or the index) removes against `parent`. */
export function lookStops(parent, commit, paths) {
  const tokenFiles = diff(parent, commit, paths, ["--name-only"])
    .split("\n")
    .filter(isTokens);
  const lines = removedLines(
    parent,
    commit,
    paths,
    (path, text) => !isTokens(path) && setsLook(path, text),
  );
  return [
    ...lines.map((line) => ({
      ...line,
      setBy: blame(parent, line.file, line.n),
    })),
    ...tokenFiles.flatMap((path) => tokenStops(parent, commit, path)),
  ];
}
