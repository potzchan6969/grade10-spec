import {
  BLOCK_SPECS,
  type Block,
  type BodyItem,
  type Frontmatter,
  type PageAst,
  parsePage,
  serializePage,
  trimBlankLines,
} from "../content/grammar";
import { isPageIcon, PAGE_ICONS } from "../content/icons";

/**
 * What the forms edit. A draft holds every attribute as the string the field
 * shows, so a half-typed value has somewhere to live; `buildPage` is the one
 * place a draft becomes an AST, and it reads `BLOCK_SPECS` for every rule it
 * enforces — required, oneOf, int — so a new block type needs no code here.
 */

type BlockSpec = (typeof BLOCK_SPECS)[string];
type AttrSpec = BlockSpec["attrs"][number];

export type Attrs = Record<string, string>;

export type DraftProse = { id: string; type: "prose"; markdown: string };
export type DraftLeaf = { id: string; type: string; attrs: Attrs };
export type DraftContainer = {
  id: string;
  type: string;
  attrs: Attrs;
  body: DraftItem[];
};

export type DraftItem = DraftProse | DraftLeaf;
export type DraftBlock = DraftItem | DraftContainer;

export type DraftFrontmatter = {
  title: string;
  summary: string;
  spec: string;
  icon: string;
  audience: string;
  order: string;
  reviewed: string;
};

export type Draft = {
  frontmatter: DraftFrontmatter;
  blocks: DraftBlock[];
};

export type BlockProblem = { attr?: string; message: string };
/** Problems by draft id, plus the two page-level ids below. */
export type Problems = Map<string, BlockProblem[]>;

export const FRONTMATTER_ID = "frontmatter";
export const PAGE_ID = "page";

export type BuildResult =
  | { ok: true; ast: PageAst; source: string }
  | { ok: false; problems: Problems };

export const BLOCK_TYPES: string[] = ["prose", ...Object.keys(BLOCK_SPECS)];

export function isContainer(block: DraftBlock): block is DraftContainer {
  return block.type !== "prose" && BLOCK_SPECS[block.type]?.container === true;
}

export function attrsOf(type: string): readonly AttrSpec[] {
  return BLOCK_SPECS[type]?.attrs ?? [];
}

let counter = 0;
export function draftId(): string {
  counter += 1;
  return `d${counter}`;
}

// --- reading a page into a draft ----------------------------------------

function attrsFromBlock(block: Block): Attrs {
  const record = block as unknown as Record<string, unknown>;
  const attrs: Attrs = {};
  for (const attr of attrsOf(block.type)) {
    const value = record[attr.name];
    attrs[attr.name] = value === undefined ? "" : String(value);
  }
  return attrs;
}

function itemFromBlock(block: BodyItem): DraftItem {
  return block.type === "prose"
    ? { id: draftId(), type: "prose", markdown: block.markdown }
    : { id: draftId(), type: block.type, attrs: attrsFromBlock(block) };
}

function blockFromAst(block: Block): DraftBlock {
  if (block.type !== "prose" && BLOCK_SPECS[block.type]?.container) {
    const container = block as Block & { body: BodyItem[] };
    return {
      id: draftId(),
      type: block.type,
      attrs: attrsFromBlock(block),
      body: container.body.map(itemFromBlock),
    };
  }
  return itemFromBlock(block as BodyItem);
}

export function draftFromAst(ast: PageAst): Draft {
  return {
    frontmatter: {
      title: ast.frontmatter.title,
      summary: ast.frontmatter.summary ?? "",
      spec: ast.frontmatter.spec ?? "",
      icon: ast.frontmatter.icon ?? "",
      audience: ast.frontmatter.audience ?? "",
      order:
        ast.frontmatter.order === undefined
          ? ""
          : String(ast.frontmatter.order),
      reviewed: ast.frontmatter.reviewed ?? "",
    },
    blocks: ast.blocks.map(blockFromAst),
  };
}

export function draftFromSource(source: string): Draft {
  return draftFromAst(parsePage(source));
}

/** A new block with every field present and the required choices pre-picked. */
export function newDraftBlock(type: string): DraftBlock {
  if (type === "prose") return { id: draftId(), type: "prose", markdown: "" };

  const attrs: Attrs = {};
  for (const attr of attrsOf(type)) {
    attrs[attr.name] = attr.required && attr.oneOf ? attr.oneOf[0] : "";
  }
  return BLOCK_SPECS[type]?.container
    ? {
        id: draftId(),
        type,
        attrs,
        body: [{ id: draftId(), type: "prose", markdown: "" }],
      }
    : { id: draftId(), type, attrs };
}

// --- checking -------------------------------------------------------------

/** Prose that would not survive a round trip — a line of it parses as a
 * directive, or closes a container that never opened. */
export function proseProblem(markdown: string): string | null {
  const text = trimBlankLines(markdown);
  if (text === "") return null;
  try {
    const ast = parsePage(`---\ntitle: probe\n---\n\n${text}\n`);
    const only = ast.blocks[0];
    if (
      ast.blocks.length === 1 &&
      only.type === "prose" &&
      only.markdown === text
    ) {
      return null;
    }
  } catch (cause) {
    const said = cause instanceof Error ? cause.message : String(cause);
    return `this is not plain prose — ${said}`;
  }
  return "a line here reads as a directive; indent it or wrap it in a code fence";
}

/** Checks what the field holds, spaces and all. Only emptiness is judged on
 * the trimmed value — a field of spaces is an empty field — because the value
 * that goes to disk is the one the author typed, and a caption of ` — ` is
 * data nobody asked us to drop. */
function checkAttr(attr: AttrSpec, raw: string): BlockProblem | null {
  if (raw.trim() === "") {
    return attr.required
      ? { attr: attr.name, message: `${attr.name} is required` }
      : null;
  }
  if (raw.includes('"')) {
    return { attr: attr.name, message: `a " cannot appear in an attribute` };
  }
  if (attr.oneOf && !attr.oneOf.includes(raw)) {
    return {
      attr: attr.name,
      message: `must be one of ${attr.oneOf.join(", ")}`,
    };
  }
  if (attr.kind === "int") {
    const number = Number(raw);
    if (!Number.isInteger(number) || number <= 0) {
      return { attr: attr.name, message: "must be a positive whole number" };
    }
  }
  return null;
}

type Built = { problems: BlockProblem[]; block: BodyItem | null };

/** One card's own problems, and the block it makes when it has none. */
export function checkItem(item: DraftItem | DraftContainer): Built {
  if (item.type === "prose") {
    const markdown = trimBlankLines((item as DraftProse).markdown);
    const problem = proseProblem(markdown);
    if (problem) return { problems: [{ message: problem }], block: null };
    return {
      problems: [],
      block: markdown === "" ? null : { type: "prose", markdown },
    };
  }

  const spec = BLOCK_SPECS[item.type];
  if (!spec) {
    return {
      problems: [{ message: `unknown block \`${item.type}\`` }],
      block: null,
    };
  }

  const attrs = (item as DraftLeaf).attrs;
  const problems: BlockProblem[] = [];
  const values: Record<string, string | number> = {};
  for (const attr of spec.attrs) {
    const raw = attrs[attr.name] ?? "";
    const problem = checkAttr(attr, raw);
    if (problem) {
      problems.push(problem);
      continue;
    }
    if (raw.trim() === "") continue;
    values[attr.name] = attr.kind === "int" ? Number(raw) : raw;
  }

  const complained =
    spec.check && problems.length === 0 ? spec.check(values) : null;
  if (complained) problems.push({ message: complained });
  if (problems.length > 0) return { problems, block: null };

  return { problems: [], block: { type: item.type, ...values } as BodyItem };
}

/** What a card renders as its own preview: the block it makes right now,
 * with whatever of its body is already valid. */
export function previewBlock(item: DraftBlock): Block | null {
  const head = checkItem(item);
  if (!head.block) return null;
  if (!isContainer(item)) return head.block as Block;

  const body = item.body
    .map((child) => checkItem(child).block)
    .filter((child): child is BodyItem => child !== null);
  return { ...head.block, body } as unknown as Block;
}

export function frontmatterProblems(fm: DraftFrontmatter): BlockProblem[] {
  const problems: BlockProblem[] = [];
  if (fm.title.trim() === "") {
    problems.push({ attr: "title", message: "title is required" });
  }
  if (fm.order.trim() !== "" && !Number.isInteger(Number(fm.order.trim()))) {
    problems.push({ attr: "order", message: "order is a whole number" });
  }
  if (fm.icon.trim() !== "" && !isPageIcon(fm.icon.trim())) {
    problems.push({
      attr: "icon",
      message: `icon is one of: ${PAGE_ICONS.join(", ")}`,
    });
  }
  if (
    fm.reviewed.trim() !== "" &&
    !/^\d{4}-\d{2}-\d{2}$/.test(fm.reviewed.trim())
  ) {
    problems.push({
      attr: "reviewed",
      message: "reviewed is a date, YYYY-MM-DD",
    });
  }
  if (fm.audience.trim() !== "" && fm.audience.trim() !== "operator") {
    problems.push({
      attr: "audience",
      message: "audience is `operator` or empty",
    });
  }
  return problems;
}

function frontmatterOf(fm: DraftFrontmatter): Frontmatter {
  const built: Frontmatter = { title: fm.title.trim() };
  if (fm.summary.trim() !== "") built.summary = fm.summary.trim();
  if (fm.spec.trim() !== "") built.spec = fm.spec.trim();
  const icon = fm.icon.trim();
  if (isPageIcon(icon)) built.icon = icon;
  if (fm.audience.trim() === "operator") built.audience = "operator";
  if (fm.order.trim() !== "") built.order = Number(fm.order.trim());
  if (fm.reviewed.trim() !== "") built.reviewed = fm.reviewed.trim();
  return built;
}

/** The whole page, or every reason it is not one yet. */
export function buildPage(draft: Draft): BuildResult {
  const problems: Problems = new Map();
  const record = (id: string, found: BlockProblem[]) => {
    if (found.length > 0) problems.set(id, found);
  };

  record(FRONTMATTER_ID, frontmatterProblems(draft.frontmatter));

  const blocks: Block[] = [];
  for (const item of draft.blocks) {
    const head = checkItem(item);
    record(item.id, head.problems);

    if (!isContainer(item)) {
      if (head.block) blocks.push(head.block);
      continue;
    }
    const body: BodyItem[] = [];
    for (const child of item.body) {
      const built = checkItem(child);
      record(child.id, built.problems);
      if (built.block) body.push(built.block);
    }
    if (head.block) blocks.push({ ...head.block, body } as unknown as Block);
  }

  if (problems.size > 0) return { ok: false, problems };

  const ast: PageAst = {
    frontmatter: frontmatterOf(draft.frontmatter),
    blocks,
  };
  let source: string;
  try {
    source = serializePage(ast);
  } catch (cause) {
    const said = cause instanceof Error ? cause.message : String(cause);
    problems.set(PAGE_ID, [{ message: said }]);
    return { ok: false, problems };
  }

  // The store only accepts canonical text, so prove it here rather than
  // finding out from a 400.
  try {
    if (serializePage(parsePage(source)) !== source) {
      problems.set(PAGE_ID, [
        { message: "this page does not round-trip; check the prose blocks" },
      ]);
      return { ok: false, problems };
    }
  } catch (cause) {
    const said = cause instanceof Error ? cause.message : String(cause);
    problems.set(PAGE_ID, [{ message: said }]);
    return { ok: false, problems };
  }

  return { ok: true, ast, source };
}
