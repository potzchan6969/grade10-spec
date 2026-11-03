import { ArrowSquareOut } from "@phosphor-icons/react";
import { type ComponentProps, memo, type ReactNode, useMemo } from "react";
import Markdown, { type Components } from "react-markdown";
import { Link as RouterLink } from "react-router";
import remarkGfm from "remark-gfm";
import {
  type ManualIndex,
  REFERENCES_ROUTE,
  routeForReference,
  routeForSpec,
} from "../api/derive";
import {
  GITHUB_BLOB,
  resolveRelative,
  routeForPagePath,
  slugify,
} from "../api/paths";
import { traceAnchor } from "../api/phases";
import { REF_PATTERN, resolveRef } from "../content/refs";
import {
  columnCount,
  EQUAL_WIDTH_PROPERTY,
  equalWidthColumns,
  equalWidthTables,
} from "../content/table-layout";
import { AnchorLink } from "./anchor";
import { PhaseChip, type PhaseMarksScope, phaseNamed } from "./phase-chip";

/** Where a markdown href actually points, once the store layout is applied. */
type Target =
  | { kind: "external"; href: string }
  | { kind: "hash"; href: string }
  | { kind: "route"; to: string }
  | { kind: "github"; href: string }
  | { kind: "dead"; raw: string };

const SAFE_PROTOCOL = /^(https?:|mailto:)/i;
const ANY_PROTOCOL = /^[a-z][a-z0-9+.-]*:/i;
/** Store files the manual never renders: read them where they live. */
const FILED_UNDER = ["docs/governance/", "docs/references/", "openspec/"];
const REFERENCE_FILE = /^docs\/references\/(.+)\.md$/;
/** The routes that are the app's own rather than a page's. Prose may link to
 * any of them, and a route the app does not serve still reads as dead. */
const APP_ROUTES = new Set(["/", "/design", "/phases", REFERENCES_ROUTE]);

export function classifyHref(
  href: string,
  baseDir: string,
  index: ManualIndex,
): Target {
  if (href.startsWith("#")) return { kind: "hash", href };
  if (SAFE_PROTOCOL.test(href)) return { kind: "external", href };
  // Anything else carrying a protocol (javascript:, data:) never becomes a link.
  if (ANY_PROTOCOL.test(href)) return { kind: "dead", raw: href };

  const [pathPart, hash = ""] = href.split("#", 2);

  // An app-absolute path is a route link, checked against the routes that
  // actually exist so a typo still reads as dead.
  if (pathPart.startsWith("/")) {
    const known =
      APP_ROUTES.has(pathPart) ||
      index.pageByRoute.has(pathPart) ||
      index.referenceByRoute.has(pathPart);
    if (!known) return { kind: "dead", raw: href };
    return {
      kind: "route",
      to: hash === "" ? pathPart : `${pathPart}#${hash}`,
    };
  }

  const resolved = resolveRelative(baseDir, pathPart);
  if (resolved === null) return { kind: "dead", raw: href };

  const store = routeForStoreFile(resolved, index);
  if (store)
    return { kind: "route", to: hash === "" ? store : `${store}#${hash}` };

  if (FILED_UNDER.some((prefix) => resolved.startsWith(prefix))) {
    return { kind: "github", href: `${GITHUB_BLOB}/${resolved}` };
  }

  const page = index.pageByPath.get(resolved);
  const route = page?.route ?? routeForPagePath(index.manualDir, resolved);
  if (page && route) {
    return { kind: "route", to: hash === "" ? route : `${route}#${hash}` };
  }
  return { kind: "dead", raw: href };
}

/** The page that shows a store file, where one does: a reference is its own
 * page, and one the snapshot does not list is read where it lives. */
function routeForStoreFile(
  resolved: string,
  index: ManualIndex,
): string | null {
  const reference = REFERENCE_FILE.exec(resolved);
  if (reference) {
    if (reference[1] === "README") return REFERENCES_ROUTE;
    const route = routeForReference(reference[1]);
    return index.referenceByRoute.has(route) ? route : null;
  }
  return null;
}

function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/** Minimal hast: the tree react-markdown hands a rehype plugin. */
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/** Where a reference is text, not a reference. Code carries none by
 * construction — the walk never enters it — and a link already points
 * somewhere. */
const OPAQUE = new Set(["a", "code", "pre"]);
const REF_PROPERTY = "dataRef";

/**
 * Lifts `[[…]]` out of text nodes into marked spans the renderer resolves.
 * One text node is the whole of a token: `[[a**b**]]` is three nodes by the
 * time it arrives, so it is not a reference — and never becomes one.
 */
function inlineRefs() {
  return (tree: unknown) => {
    splitRefs(tree as HastNode);
  };
}

const REF_PLUGINS = [inlineRefs];

const RULE_PROPERTY = "dataPhaseRule";
const RULE_HEADING_PROPERTY = "dataPhaseHeading";
const HEADING_TAGS = new Set(["h2", "h3", "h4"]);
const MARK_ONLY = /^[\s🚧❓]*$/u;

function hastText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

/** The bold name a list item opens with, past its mark: what a rule is. */
function ruleName(item: HastNode): { parent: HastNode; at: number } | null {
  const children = item.children ?? [];
  for (let at = 0; at < children.length; at += 1) {
    const child = children[at];
    if (child.type === "text" && MARK_ONLY.test(child.value ?? "")) continue;
    if (child.type !== "element") return null;
    if (child.tagName === "strong") return { parent: item, at };
    // A loose list wraps the item's words in a paragraph.
    if (child.tagName === "p") return ruleName(child);
    return null;
  }
  return null;
}

/**
 * Marks each rule's bold name with the heading above it, so a rule whose
 * phase differs from its heading's can wear a chip. A block that opens
 * below its heading — after a `::phase` block — knows no heading, and asks
 * by the rule alone.
 */
function phaseRules() {
  return (tree: unknown) => {
    let heading: string | null = null;
    const visit = (node: HastNode) => {
      if (node.type === "element" && HEADING_TAGS.has(node.tagName ?? "")) {
        heading = slugify(hastText(node));
        return;
      }
      if (node.type === "element" && node.tagName === "li") {
        const found = ruleName(node);
        if (found) {
          const strong = found.parent.children?.[found.at] as HastNode;
          found.parent.children?.splice(found.at + 1, 0, {
            type: "element",
            tagName: "span",
            properties: {
              [RULE_PROPERTY]: traceAnchor(hastText(strong)),
              [RULE_HEADING_PROPERTY]: heading ?? "",
            },
            children: [],
          });
        }
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree as HastNode);
  };
}

function splitRefs(parent: HastNode) {
  if (!parent.children) return;
  const split: HastNode[] = [];
  for (const child of parent.children) {
    if (child.type === "text") {
      split.push(...refTokens(child.value ?? ""));
      continue;
    }
    if (!(child.type === "element" && OPAQUE.has(child.tagName ?? ""))) {
      splitRefs(child);
    }
    split.push(child);
  }
  parent.children = split;
}

function refTokens(value: string): HastNode[] {
  const tokens: HastNode[] = [];
  let at = 0;
  for (const match of value.matchAll(REF_PATTERN)) {
    if (match.index > at) {
      tokens.push({ type: "text", value: value.slice(at, match.index) });
    }
    tokens.push({
      type: "element",
      tagName: "span",
      properties: { [REF_PROPERTY]: match[1] },
      children: [],
    });
    at = match.index + match[0].length;
  }
  if (tokens.length === 0) return [{ type: "text", value }];
  if (at < value.length) tokens.push({ type: "text", value: value.slice(at) });
  return tokens;
}

/**
 * A reference wears the target's title as it reads today, so a rename can
 * never orphan the prose that cites it. One that resolves to nothing, or to
 * two things, gets the dead-link treatment with the resolver's own words.
 */
function InlineRef({ index, raw }: { index: ManualIndex; raw: string }) {
  const resolved = resolveRef(raw, index.titleBySpec);
  if (!resolved.ok) {
    return (
      <span
        className="text-destructive line-through decoration-destructive/60"
        title={resolved.reason}
      >
        {`[[${raw}]]`}
      </span>
    );
  }

  return (
    <RouterLink
      className="decoration-dotted"
      to={routeForSpec(index, resolved.spec)}
    >
      {resolved.title}
    </RouterLink>
  );
}

type SpanProps = ComponentProps<"span"> & {
  node?: { properties?: Record<string, unknown> };
};

type MarkdownViewProps = {
  text: string;
  /** Directory the relative links resolve against — the file's own home. */
  baseDir: string;
  index: ManualIndex;
  /** Headings get slug ids and a copy-link. Off where ids would collide. */
  anchors?: boolean;
  /** Manual-page prose only. A reference document is quoted, not authored
   * here, so its brackets stay brackets. */
  refs?: boolean;
  /** A page's phases, where its prose wears their chips. */
  phases?: PhaseMarksScope | null;
  className?: string;
};

/**
 * GitHub markdown, raw HTML off. Off is load-bearing: pages are editable in the
 * browser, so the renderer is the line that keeps an edit from becoming script.
 * Memoized: a parse is pure in its props, and every location change re-renders
 * the page, so an unmemoized view re-parses all of it on a section click.
 */
export const MarkdownView = memo(function MarkdownView({
  text,
  baseDir,
  index,
  anchors = false,
  refs = false,
  phases = null,
  className,
}: MarkdownViewProps) {
  const components = useMemo<Components>(
    () => ({
      span: ({ children, node, ...rest }: SpanProps) => {
        const rule = node?.properties?.[RULE_PROPERTY];
        if (typeof rule === "string") {
          const heading = node?.properties?.[RULE_HEADING_PROPERTY];
          const chip = phases?.marks.rule(
            typeof heading === "string" && heading !== "" ? heading : null,
            rule,
          );
          if (!phases || !chip) return null;
          return (
            <>
              {" "}
              <PhaseChip
                apart
                assignment={chip}
                phase={phaseNamed(phases.phases, chip.phase)}
                small
              />
            </>
          );
        }
        const raw = node?.properties?.[REF_PROPERTY];
        if (typeof raw !== "string") return <span {...rest}>{children}</span>;
        return <InlineRef index={index} raw={raw} />;
      },
      a: ({ href, children }: ComponentProps<"a">) => {
        const target = classifyHref(href ?? "", baseDir, index);
        if (target.kind === "route") {
          return <RouterLink to={target.to}>{children}</RouterLink>;
        }
        if (target.kind === "hash") {
          return <a href={target.href}>{children}</a>;
        }
        if (target.kind === "dead") {
          return (
            <span
              className="text-destructive line-through decoration-destructive/60"
              title={`dead link: ${target.raw}`}
            >
              {children}
            </span>
          );
        }
        return (
          <a
            className="inline-flex items-baseline gap-0.5"
            href={target.href}
            rel="noreferrer noopener"
            target="_blank"
          >
            {children}
            <span className="inline-flex translate-y-px opacity-60">
              <ArrowSquareOut aria-hidden size={12} />
            </span>
          </a>
        );
      },
      h1: ({ children }: ComponentProps<"h1">) => (
        <Heading anchors={anchors} level={2} phases={phases}>
          {children}
        </Heading>
      ),
      h2: ({ children }: ComponentProps<"h2">) => (
        <Heading anchors={anchors} level={2} phases={phases}>
          {children}
        </Heading>
      ),
      h3: ({ children }: ComponentProps<"h3">) => (
        <Heading anchors={anchors} level={3} phases={phases}>
          {children}
        </Heading>
      ),
      table: ({
        children,
        node,
      }: ComponentProps<"table"> & { node?: HastNode }) => {
        const spec = node?.properties?.[EQUAL_WIDTH_PROPERTY];
        const tracks =
          typeof spec === "string"
            ? equalWidthColumns(columnCount(node), spec)
            : null;
        return (
          <div
            className={
              tracks
                ? "manual-table-scroll manual-table-equal"
                : "manual-table-scroll"
            }
          >
            <table
              style={
                tracks ? { gridTemplateColumns: tracks.join(" ") } : undefined
              }
            >
              {children}
            </table>
          </div>
        );
      },
      img: ({ src, alt }: ComponentProps<"img">) => (
        <img
          alt={alt ?? ""}
          loading="lazy"
          src={typeof src === "string" ? src : ""}
        />
      ),
    }),
    [anchors, baseDir, index, phases],
  );

  const remarkPlugins = useMemo<
    ComponentProps<typeof Markdown>["remarkPlugins"]
  >(() => [remarkGfm, equalWidthTables], []);
  const rehypePlugins = useMemo(
    () => [...(refs ? REF_PLUGINS : []), ...(phases ? [phaseRules] : [])],
    [refs, phases],
  );

  return (
    <div className={className ?? "manual-prose"}>
      <Markdown
        components={components}
        rehypePlugins={rehypePlugins.length > 0 ? rehypePlugins : undefined}
        remarkPlugins={remarkPlugins}
      >
        {text}
      </Markdown>
    </div>
  );
});

function Heading({
  level,
  anchors,
  phases,
  children,
}: {
  level: 2 | 3;
  anchors: boolean;
  phases: PhaseMarksScope | null;
  children: ReactNode;
}) {
  const id = anchors ? slugify(textOf(children)) : undefined;
  const Tag = level === 2 ? "h2" : "h3";
  const chip = id && phases ? phases.marks.heading(id) : undefined;
  return (
    <Tag className="group/anchor flex flex-wrap items-center gap-1" id={id}>
      <span>{children}</span>
      {chip && phases ? (
        <span className="ml-1 inline-flex" data-heading-aside>
          <PhaseChip
            assignment={chip}
            phase={phaseNamed(phases.phases, chip.phase)}
          />
        </span>
      ) : null}
      {id ? <AnchorLink id={id} label="Copy link to this heading" /> : null}
    </Tag>
  );
}
