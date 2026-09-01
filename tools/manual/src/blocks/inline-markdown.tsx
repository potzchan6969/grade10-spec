import type { ReactNode } from "react";
import { type InlineToken, parseInline } from "../content/inline";

function render(tokens: InlineToken[]): ReactNode[] {
  return tokens.map((token, position) => {
    const key = `${token.kind}-${position}`;
    switch (token.kind) {
      case "strong":
        return <strong key={key}>{render(token.children)}</strong>;
      case "em":
        return <em key={key}>{render(token.children)}</em>;
      case "code":
        return (
          <code
            className="rounded-(--radius-sm) bg-muted px-1 py-px font-mono text-[0.9em]"
            key={key}
          >
            {token.text}
          </code>
        );
      case "link":
        return (
          <a
            className="underline decoration-border-strong underline-offset-2"
            href={token.href}
            key={key}
            rel="noreferrer noopener"
            target="_blank"
          >
            {render(token.children)}
          </a>
        );
      default:
        return token.text;
    }
  });
}

/** Inline markdown, no block elements — safe inside a clamped line or a link. */
export function InlineMarkdown({ text }: { text: string }) {
  return <>{render(parseInline(text))}</>;
}
