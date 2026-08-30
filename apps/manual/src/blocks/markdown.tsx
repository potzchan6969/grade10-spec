import { ArrowSquareOut } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useMemo } from "react";
import Markdown, { type Components } from "react-markdown";
import { Link as RouterLink } from "react-router";
import remarkGfm from "remark-gfm";
import { type ManualIndex, routeForSpec } from "../api/derive";
import {
  GITHUB_BLOB,
  resolveRelative,
  routeForPagePath,
  slugify,
  specTitle,
} from "../api/paths";
import { REF_PATTERN, resolveRef } from "../content/refs";
import { AnchorLink } from "./anchor";

/** Where a markdown href actually points, once the store layout is applied. */
type Target =
  | { kind: "external"; href: string }
  | { kind: "hash"; href: string }
  | { kind: "route"; to: string }
  | { kind: "github"; href: string }
  | { kind: "dead"; raw: string };

const SAFE_PROTOCOL = /^(https?:|mailto:)/i;
const ANY_PROTOCOL = /^[a-z][a-z0-9+.-]*:/i;
const FILED_UNDER = ["docs/prds/", "docs/governance/"];
/** The routes that are the app's own rather than a page's. Prose may link to
 * any of them, and a route the app does not serve still reads as dead. */
const APP_ROUTES = new Set(["/", "/planning", "/qa", "/design"]);

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
    const known = APP_ROUTES.has(pathPart) || index.pageByRoute.has(pathPart);
    if (!known) return { kind: "dead", raw: href };
    return {
      kind: "route",
      to: hash === "" ? pathPart : `${pathPart}#${hash}`,
    };
  }

  const resolved = resolveRelative(baseDir, pathPart);
  if (resolved === null) return { kind: "dead", raw: href };

  if (FILED_UNDER.some((prefix) => resolved.startsWith(prefix))) {
    return { kind: "github", href: `${GITHUB_BLOB}/${resolved}` };
  }

  const page = index.pageByPath.get(resolved);
  const route = page?.route ?? routeForPagePath(resolved);
  if (page && route) {
    return { kind: "route", to: hash === "" ? route : `${route}#${hash}` };
  }
  return { kind: "dead", raw: href };
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
function InlineRef({
  index,
  pageSpec,
  raw,
}: {
  index: ManualIndex;
  pageSpec?: string;
  raw: string;
}) {
  const resolved = resolveRef(raw, index.snapshot, pageSpec);
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

  const { target } = resolved;
  const route = routeForSpec(index, target.spec);
  return (
    <RouterLink
      className="decoration-dotted"
      to={target.kind === "spec" ? route : `${route}#${target.id}`}
    >
      {target.kind === "spec"
        ? specTitle({ id: target.spec, title: target.title })
        : target.title}
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
  /** Manual-page prose only. Spec text mirrored from the store is quoted, not
   * authored here, so its brackets stay brackets. */
  refs?: boolean;
  /** The page's own `spec:` — the scope a bare id resolves inside. */
  pageSpec?: string;
  className?: string;
};

/**
 * GitHub markdown, raw HTML off. Off is load-bearing: pages are editable in the
 * browser, so the renderer is the line that keeps an edit from becoming script.
 */
export function MarkdownView({
  text,
  baseDir,
  index,
  anchors = false,
  refs = false,
  pageSpec,
  className,
}: MarkdownViewProps) {
  const components = useMemo<Components>(
    () => ({
      span: ({ children, node, ...rest }: SpanProps) => {
        const raw = node?.properties?.[REF_PROPERTY];
        if (typeof raw !== "string") return <span {...rest}>{children}</span>;
        return <InlineRef index={index} pageSpec={pageSpec} raw={raw} />;
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
        <Heading anchors={anchors} level={2}>
          {children}
        </Heading>
      ),
      h2: ({ children }: ComponentProps<"h2">) => (
        <Heading anchors={anchors} level={2}>
          {children}
        </Heading>
      ),
      h3: ({ children }: ComponentProps<"h3">) => (
        <Heading anchors={anchors} level={3}>
          {children}
        </Heading>
      ),
      table: ({ children }: ComponentProps<"table">) => (
        <div className="manual-table-scroll">
          <table>{children}</table>
        </div>
      ),
      img: ({ src, alt }: ComponentProps<"img">) => (
        <img
          alt={alt ?? ""}
          loading="lazy"
          src={typeof src === "string" ? src : ""}
        />
      ),
    }),
    [anchors, baseDir, index, pageSpec],
  );

  return (
    <div className={className ?? "manual-prose"}>
      <Markdown
        components={components}
        rehypePlugins={refs ? REF_PLUGINS : undefined}
        remarkPlugins={[remarkGfm]}
      >
        {text}
      </Markdown>
    </div>
  );
}

function Heading({
  level,
  anchors,
  children,
}: {
  level: 2 | 3;
  anchors: boolean;
  children: ReactNode;
}) {
  const id = anchors ? slugify(textOf(children)) : undefined;
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag className="group/anchor flex scroll-mt-24 items-center gap-1" id={id}>
      <span>{children}</span>
      {id ? <AnchorLink id={id} label="Copy link to this heading" /> : null}
    </Tag>
  );
}
