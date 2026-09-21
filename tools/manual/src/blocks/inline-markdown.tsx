import type { ReactNode } from "react";
import { Link } from "react-router";
import { type InlineToken, parseInline } from "../content/inline";

const CODE = "rounded-(--radius-sm) bg-muted px-1 py-px font-mono text-[0.9em]";
const LINK = "underline decoration-border-strong underline-offset-2";

/**
 * One inline token tree as elements.
 *
 * Exported because a second dialect reaches the reader through it: Slack
 * `mrkdwn` is parsed by `slack-text.tsx` and mapped onto these same tokens,
 * so the chip's class, the link's class and a link's `rel` have one
 * definition wherever a line of prose or of a message is read.
 */
export function render(tokens: InlineToken[]): ReactNode[] {
  return tokens.map((token, position) => {
    const key = `${token.kind}-${position}`;
    switch (token.kind) {
      case "strong":
        return <strong key={key}>{render(token.children)}</strong>;
      case "em":
        return <em key={key}>{render(token.children)}</em>;
      case "code":
        return (
          <code className={CODE} key={key}>
            {token.text}
          </code>
        );
      case "link":
        return (
          <InlineLink href={token.href} key={key}>
            {render(token.children)}
          </InlineLink>
        );
      default:
        return token.text;
    }
  });
}

/** One link, whichever kind it is: the manual's own route through the router,
 * because a full page load throws the reader out of the app they are already
 * in, and anything else in its own tab with no referrer — the two answers
 * `markdown.tsx` gives a link of a page. */
function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link className={LINK} to={href}>
        {children}
      </Link>
    );
  }
  return (
    <a className={LINK} href={href} rel="noreferrer noopener" target="_blank">
      {children}
    </a>
  );
}

/** Inline markdown, no block elements — safe inside a clamped line or a link. */
export function InlineMarkdown({ text }: { text: string }) {
  return <>{render(parseInline(text))}</>;
}
