import type { ReactNode } from "react";

/**
 * Slack `mrkdwn`, read: `*bold*`, `` `code` `` and `<url|title>`.
 *
 * Its own small reader rather than the markdown pipeline, because it is not
 * markdown: `*one star*` is bold in Slack and italic in markdown, and a link
 * is written the other way round. Three forms is the whole dialect the
 * messages in `scripts/openspec/lib/wording.mjs` use, so three forms is what
 * this reads — anything else stays the text it is, which is what Slack does
 * with it too.
 *
 * The three entities `escapeSlackText` writes are read back, so a change
 * titled with an `&` shows the `&` a hand would see rather than the escape
 * the message carries.
 */

type SlackToken =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "code"; text: string }
  | { kind: "link"; href: string; title: string };

// Order is precedence: a span of code before bold, so a `*` inside code stays
// as it is written; bold may not open or close on whitespace or run over a
// line; a link's url holds no `<`, `>` or `|`.
const MRKDWN = /`([^`]+)`|\*(\S(?:[^*\n]*\S)?)\*|<([^<>|\s]+)(?:\|([^<>]*))?>/g;

const SAFE_HREF = /^(?:https?:|mailto:|\/)/i;

/** The three characters Slack's own markup reads as syntax, back as
 * themselves. */
function spoken(text: string): string {
  return text
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

export function parseMrkdwn(text: string): SlackToken[] {
  const tokens: SlackToken[] = [];
  let cut = 0;
  for (const match of text.matchAll(MRKDWN)) {
    const [whole, code, bold, href, title] = match;
    if (match.index > cut) {
      tokens.push({ kind: "text", text: spoken(text.slice(cut, match.index)) });
    }
    cut = match.index + whole.length;

    if (code !== undefined) tokens.push({ kind: "code", text: code });
    else if (bold !== undefined) {
      tokens.push({ kind: "bold", text: spoken(bold) });
    } else if (href !== undefined && SAFE_HREF.test(href)) {
      tokens.push({ kind: "link", href, title: spoken(title ?? href) });
    } else tokens.push({ kind: "text", text: spoken(whole) });
  }
  if (cut < text.length) {
    tokens.push({ kind: "text", text: spoken(text.slice(cut)) });
  }
  return tokens;
}

function render(tokens: SlackToken[]): ReactNode[] {
  return tokens.map((token, position) => {
    const key = `${token.kind}-${position}`;
    switch (token.kind) {
      case "bold":
        return <strong key={key}>{token.text}</strong>;
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
          >
            {token.title}
          </a>
        );
      default:
        return token.text;
    }
  });
}

/** One message, whole: its own newlines are kept as lines, because that is
 * what they are in the thread. `pre-line` rather than a span per line — bold
 * never runs over a newline, so the lines need no element of their own to be
 * told apart. */
export function SlackText({ text }: { text: string }) {
  return (
    <span className="whitespace-pre-line">{render(parseMrkdwn(text))}</span>
  );
}
