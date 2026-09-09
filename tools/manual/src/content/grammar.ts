import YAML from "yaml";
// Explicit extension: `check:manual` loads the grammar under plain node, which
// resolves no extensionless path of its own.
import { isPageIcon, PAGE_ICONS, type PageIcon } from "./icons.ts";

/** The page grammar: YAML frontmatter plus a sequence of blocks. Directives
 * sit at column 0; everything between them is prose. `parsePage` and
 * `serializePage` are pure and isomorphic — see DESIGN.md for the laws. */

export type Frontmatter = {
  title: string;
  summary?: string;
  spec?: string;
  /** The glyph the rail and the cards show beside the title. Named from a
   * fixed vocabulary so a typo is a parse error, not a blank row. */
  icon?: PageIcon;
  /** Who a capability page serves. Absent means the product's own users;
   * `operator` moves the page into the derived Admin nav group. */
  audience?: "operator";
  order?: number;
};

export type ProseBlock = { type: "prose"; markdown: string };
export type SpecBlock = {
  type: "spec";
  id: string;
  requirement?: string;
  scenario?: string;
  story?: string;
};
export type CasesBlock = { type: "cases"; id: string };
export type ChangesBlock = { type: "changes"; spec: string };
export type FigmaBlock = {
  type: "figma";
  url: string;
  title: string;
  /** The Figma component set this frame is about, named by hand for an assembly
   * frame whose own node id answers to no set. `check:manual` holds it to the
   * design-sync report's own keys, so it cannot name a set nothing checks. */
  set?: string;
};
export type StoryBlock = {
  type: "story";
  id: string;
  title?: string;
  height?: number;
};
export type ImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
};
export type ChildrenBlock = { type: "children" };

export type LeafBlock =
  | SpecBlock
  | CasesBlock
  | ChangesBlock
  | FigmaBlock
  | StoryBlock
  | ImageBlock
  | ChildrenBlock;

export type BodyItem = ProseBlock | LeafBlock;

export const CALLOUT_KINDS = ["note", "decision", "warning"] as const;
export type CalloutKind = (typeof CALLOUT_KINDS)[number];
export const AUDIENCES = [
  "pm",
  "designer",
  "qa",
  "engineer",
  "operator",
] as const;
export type Audience = (typeof AUDIENCES)[number];

export type CalloutBlock = {
  type: "callout";
  kind: CalloutKind;
  /** Who wrote the callout (`@handle`) and when (`YYYY-MM-DD`). Hand-written
   * judgment rots silently, so a `warning` — the manual saying the store is
   * wrong about itself — is expected to carry both; `check:manual` warns on
   * one that does not. */
  author?: string;
  date?: string;
  body: BodyItem[];
};
export type DetailBlock = {
  type: "detail";
  title: string;
  for?: Audience;
  body: BodyItem[];
};
/** Steps in order. Neighbouring flows sharing one title are the same flow
 * under different conditions, and `case` names the one each walks. */
export type FlowBlock = {
  type: "flow";
  title: string;
  case?: string;
  diagram?: string;
  body: BodyItem[];
};

/** A worked case: what is bought, then a ledger of steps with a running
 * balance, then the why. `readExample` in blocks/example-shape.ts holds the
 * shape. */
export type ExampleBlock = {
  type: "example";
  title: string;
  tier?: string;
  shipping?: string;
  periods?: string;
  body: BodyItem[];
};

export type ContainerBlock =
  | CalloutBlock
  | DetailBlock
  | FlowBlock
  | ExampleBlock;
export type Block = ProseBlock | LeafBlock | ContainerBlock;

export type PageAst = { frontmatter: Frontmatter; blocks: Block[] };

export class GrammarError extends Error {
  readonly line: number;
  constructor(line: number, message: string) {
    super(`line ${line}: ${message}`);
    this.name = "GrammarError";
    this.line = line;
  }
}

type AttrSpec = {
  name: string;
  required?: boolean;
  kind?: "string" | "int";
  oneOf?: readonly string[];
};

type BlockSpec = {
  container: boolean;
  attrs: AttrSpec[];
  check?: (attrs: Record<string, string | number>) => string | null;
};

/** Attribute order here is the canonical order. */
export const BLOCK_SPECS: Record<string, BlockSpec> = {
  spec: {
    container: false,
    attrs: [
      { name: "id", required: true },
      { name: "requirement" },
      { name: "scenario" },
      { name: "story" },
    ],
    check: (a) => {
      const selectors = ["requirement", "scenario", "story"].filter(
        (s) => a[s] !== undefined,
      );
      return selectors.length > 1
        ? `use only one of requirement, scenario, story`
        : null;
    },
  },
  cases: { container: false, attrs: [{ name: "id", required: true }] },
  changes: { container: false, attrs: [{ name: "spec", required: true }] },
  figma: {
    container: false,
    attrs: [
      { name: "url", required: true },
      { name: "title", required: true },
      { name: "set" },
    ],
  },
  story: {
    container: false,
    attrs: [
      { name: "id", required: true },
      { name: "title" },
      { name: "height", kind: "int" },
    ],
  },
  image: {
    container: false,
    attrs: [
      { name: "src", required: true },
      { name: "alt", required: true },
      { name: "caption" },
    ],
    check: (a) =>
      String(a.alt ?? "").trim() === "" ? "alt must not be empty" : null,
  },
  children: { container: false, attrs: [] },
  callout: {
    container: true,
    attrs: [
      { name: "kind", required: true, oneOf: CALLOUT_KINDS },
      { name: "author" },
      { name: "date" },
    ],
    check: (a) => {
      if (
        a.author !== undefined &&
        !/^@[A-Za-z0-9][A-Za-z0-9_-]*$/.test(String(a.author))
      ) {
        return "`author` is a GitHub handle with the @";
      }
      if (a.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(a.date))) {
        return "`date` is `YYYY-MM-DD`";
      }
      return null;
    },
  },
  detail: {
    container: true,
    attrs: [
      { name: "title", required: true },
      { name: "for", oneOf: AUDIENCES },
    ],
  },
  flow: {
    container: true,
    attrs: [
      { name: "title", required: true },
      { name: "case" },
      { name: "diagram" },
    ],
  },
  example: {
    container: true,
    attrs: [
      { name: "title", required: true },
      { name: "tier" },
      { name: "shipping" },
      { name: "periods" },
    ],
  },
};

const FRONTMATTER_KEYS = [
  "title",
  "summary",
  "spec",
  "icon",
  "audience",
  "order",
] as const;

const LEAF_RE = /^::([a-z][a-z0-9-]*)(\{.*\})?\s*$/;
const CONTAINER_OPEN_RE = /^:::([a-z][a-z0-9-]*)(\{.*\})?\s*$/;
const CONTAINER_CLOSE_RE = /^:::\s*$/;
const FENCE_RE = /^(`{3,}|~{3,})/;
const ATTR_RE = /^([a-z][a-z0-9-]*)="([^"]*)"/;

export function parsePage(text: string): PageAst {
  const lines = text.split("\n");
  const { frontmatter, bodyStart } = parseFrontmatter(lines);
  const { blocks, end } = scanBlocks(lines, bodyStart, null);
  if (end !== lines.length) {
    throw new GrammarError(end + 1, "stray `:::` outside a container");
  }
  return { frontmatter, blocks };
}

function parseFrontmatter(lines: string[]): {
  frontmatter: Frontmatter;
  bodyStart: number;
} {
  if (lines[0]?.endsWith("\r"))
    throw new GrammarError(1, "page uses CRLF line endings; save with LF");
  if (lines[0] !== "---")
    throw new GrammarError(1, "page must start with `---` frontmatter");
  const close = lines.indexOf("---", 1);
  if (close === -1) throw new GrammarError(1, "unclosed frontmatter");
  const raw = lines.slice(1, close).join("\n");
  let data: unknown;
  try {
    data = YAML.parse(raw) ?? {};
  } catch (e) {
    throw new GrammarError(
      1,
      `frontmatter is not valid YAML: ${(e as Error).message}`,
    );
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new GrammarError(1, "frontmatter must be a mapping");
  }
  const entries = data as Record<string, unknown>;
  for (const key of Object.keys(entries)) {
    if (!(FRONTMATTER_KEYS as readonly string[]).includes(key)) {
      throw new GrammarError(1, `unknown frontmatter key \`${key}\``);
    }
  }
  const fm: Frontmatter = { title: requireString(entries, "title") };
  if (entries.summary !== undefined)
    fm.summary = requireString(entries, "summary");
  if (entries.spec !== undefined) fm.spec = requireString(entries, "spec");
  if (entries.icon !== undefined) {
    if (!isPageIcon(entries.icon)) {
      throw new GrammarError(
        1,
        `\`icon\` must be one of: ${PAGE_ICONS.join(", ")}`,
      );
    }
    fm.icon = entries.icon;
  }
  if (entries.audience !== undefined) {
    if (entries.audience !== "operator") {
      throw new GrammarError(1, "`audience` must be `operator` when present");
    }
    fm.audience = entries.audience;
  }
  if (entries.order !== undefined) {
    if (typeof entries.order !== "number" || !Number.isInteger(entries.order)) {
      throw new GrammarError(1, "`order` must be an integer");
    }
    fm.order = entries.order;
  }
  return { frontmatter: fm, bodyStart: close + 1 };
}

function requireString(entries: Record<string, unknown>, key: string): string {
  const value = entries[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new GrammarError(1, `\`${key}\` must be a non-empty string`);
  }
  return value;
}

/** Scans a run of blocks from `start`. At top level (`containerLine` null)
 * it runs to end of input; inside a container it stops at the bare `:::`.
 * Returns the index after the run: the close line for a container, or
 * `lines.length` at top level. */
function scanBlocks(
  lines: string[],
  start: number,
  containerLine: number | null,
): { blocks: Block[]; end: number } {
  const blocks: Block[] = [];
  const prose: string[] = [];
  let fence: string | null = null;
  let i = start;

  const flushProse = () => {
    const markdown = trimBlankLines(prose.join("\n"));
    prose.length = 0;
    if (markdown !== "") blocks.push({ type: "prose", markdown });
  };

  while (i < lines.length) {
    const line = lines[i];
    const lineNo = i + 1;

    if (fence !== null) {
      prose.push(line);
      if (line.startsWith(fence)) fence = null;
      i += 1;
      continue;
    }
    const fenceMatch = FENCE_RE.exec(line);
    if (fenceMatch) {
      prose.push(line);
      fence = fenceMatch[1];
      i += 1;
      continue;
    }

    if (CONTAINER_CLOSE_RE.test(line)) {
      flushProse();
      return { blocks, end: i };
    }

    const containerMatch = CONTAINER_OPEN_RE.exec(line);
    if (containerMatch) {
      if (containerLine !== null) {
        throw new GrammarError(lineNo, "containers do not nest");
      }
      flushProse();
      const head = makeBlock(
        containerMatch[1],
        containerMatch[2],
        lineNo,
        true,
      );
      const inner = scanBlocks(lines, i + 1, lineNo);
      if (inner.end === lines.length) {
        throw new GrammarError(lineNo, "unclosed container");
      }
      blocks.push({
        ...head,
        body: inner.blocks as BodyItem[],
      } as ContainerBlock);
      i = inner.end + 1;
      continue;
    }

    const leafMatch = LEAF_RE.exec(line);
    if (leafMatch) {
      flushProse();
      blocks.push(
        makeBlock(leafMatch[1], leafMatch[2], lineNo, false) as LeafBlock,
      );
      i += 1;
      continue;
    }

    if (/^:{2,}/.test(line)) {
      throw new GrammarError(
        lineNo,
        `not a valid directive: \`${line.trim()}\``,
      );
    }

    prose.push(line);
    i += 1;
  }

  if (containerLine !== null) {
    throw new GrammarError(containerLine, "unclosed container");
  }
  flushProse();
  return { blocks, end: i };
}

function makeBlock(
  name: string,
  rawAttrs: string | undefined,
  lineNo: number,
  container: boolean,
): Block {
  const spec = BLOCK_SPECS[name];
  if (!spec) throw new GrammarError(lineNo, `unknown directive \`${name}\``);
  if (spec.container !== container) {
    const expected = spec.container ? ":::" : "::";
    throw new GrammarError(
      lineNo,
      `\`${name}\` must be written as \`${expected}${name}\``,
    );
  }

  const attrs = parseAttrs(rawAttrs, lineNo);
  const known = new Map(spec.attrs.map((a) => [a.name, a]));
  for (const key of Object.keys(attrs)) {
    if (!known.has(key))
      throw new GrammarError(lineNo, `\`${name}\` has no attribute \`${key}\``);
  }

  const block: Record<string, string | number> = {};
  for (const attr of spec.attrs) {
    const raw = attrs[attr.name];
    if (raw === undefined) {
      if (attr.required)
        throw new GrammarError(lineNo, `\`${name}\` needs \`${attr.name}\``);
      continue;
    }
    if (attr.oneOf && !attr.oneOf.includes(raw)) {
      throw new GrammarError(
        lineNo,
        `\`${attr.name}\` must be one of ${attr.oneOf.join(", ")}`,
      );
    }
    if (attr.kind === "int") {
      const value = Number(raw);
      if (!Number.isInteger(value) || value <= 0) {
        throw new GrammarError(
          lineNo,
          `\`${attr.name}\` must be a positive integer`,
        );
      }
      block[attr.name] = value;
    } else {
      block[attr.name] = raw;
    }
  }
  if (spec.check) {
    const problem = spec.check(block);
    if (problem) throw new GrammarError(lineNo, `\`${name}\`: ${problem}`);
  }
  return { type: name, ...block } as unknown as Block;
}

function parseAttrs(
  raw: string | undefined,
  lineNo: number,
): Record<string, string> {
  if (raw === undefined) return {};
  if (!raw.startsWith("{") || !raw.endsWith("}")) {
    throw new GrammarError(lineNo, "attributes must sit inside `{...}`");
  }
  let rest = raw.slice(1, -1).trim();
  const attrs: Record<string, string> = {};
  while (rest !== "") {
    const match = ATTR_RE.exec(rest);
    if (!match) {
      throw new GrammarError(
        lineNo,
        'attributes are `name="value"` pairs; `"` cannot appear inside a value',
      );
    }
    if (attrs[match[1]] !== undefined) {
      throw new GrammarError(lineNo, `duplicate attribute \`${match[1]}\``);
    }
    attrs[match[1]] = match[2];
    rest = rest.slice(match[0].length).trimStart();
  }
  return attrs;
}

export function trimBlankLines(text: string): string {
  const lines = text.split("\n");
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === "") start += 1;
  while (end > start && lines[end - 1].trim() === "") end -= 1;
  return lines.slice(start, end).join("\n");
}

export function serializePage(ast: PageAst): string {
  const fm = serializeFrontmatter(ast.frontmatter);
  if (ast.blocks.length === 0) return fm;
  return `${fm}\n${ast.blocks.map(serializeBlock).join("\n\n")}\n`;
}

function serializeFrontmatter(fm: Frontmatter): string {
  const doc: Record<string, unknown> = {};
  for (const key of FRONTMATTER_KEYS) {
    if (fm[key] !== undefined) doc[key] = fm[key];
  }
  return `---\n${YAML.stringify(doc, { lineWidth: 0 })}---\n`;
}

function serializeBlock(block: Block): string {
  if (block.type === "prose") return trimBlankLines(block.markdown);
  const spec = BLOCK_SPECS[block.type];
  const head = `${spec.container ? ":::" : "::"}${block.type}${serializeAttrs(block, spec)}`;
  if (!spec.container) return head;
  const body = (block as ContainerBlock).body.map(serializeBlock).join("\n\n");
  return body === "" ? `${head}\n:::` : `${head}\n${body}\n:::`;
}

function serializeAttrs(block: Block, spec: BlockSpec): string {
  const parts: string[] = [];
  const record = block as unknown as Record<
    string,
    string | number | undefined
  >;
  for (const attr of spec.attrs) {
    const value = record[attr.name];
    if (value === undefined) continue;
    if (typeof value === "string" && value.includes('"')) {
      throw new GrammarError(0, `\`${attr.name}\` cannot contain \`"\``);
    }
    parts.push(`${attr.name}="${value}"`);
  }
  return parts.length === 0 ? "" : `{${parts.join(" ")}}`;
}
