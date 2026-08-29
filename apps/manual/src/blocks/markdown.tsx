import { ArrowSquareOut } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useMemo } from "react";
import Markdown, { type Components } from "react-markdown";
import { Link as RouterLink } from "react-router";
import remarkGfm from "remark-gfm";
import type { ManualIndex } from "../api/derive";
import {
  GITHUB_BLOB,
  resolveRelative,
  routeForPagePath,
  slugify,
} from "../api/paths";
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
      pathPart === "/" ||
      pathPart === "/planning" ||
      index.pageByRoute.has(pathPart);
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

type MarkdownViewProps = {
  text: string;
  /** Directory the relative links resolve against — the file's own home. */
  baseDir: string;
  index: ManualIndex;
  /** Headings get slug ids and a copy-link. Off where ids would collide. */
  anchors?: boolean;
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
  className,
}: MarkdownViewProps) {
  const components = useMemo<Components>(
    () => ({
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
    [anchors, baseDir, index],
  );

  return (
    <div className={className ?? "manual-prose"}>
      <Markdown components={components} remarkPlugins={[remarkGfm]}>
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
