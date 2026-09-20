import type { InlineToken } from "../content/inline";
import { render } from "./inline-markdown";

/**
 * Slack `mrkdwn`, read: `*bold*`, `` `code` `` and `<url|title>`.
 *
 * Its own small parser rather than the markdown pipeline, because it is not
 * markdown: `*one star*` is bold in Slack and italic in markdown, and a link
 * is written the other way round. Three forms is the whole dialect the
 * messages in `scripts/openspec/lib/wording.mjs` use, so three forms is what
 * this reads — anything else stays the text it is, which is what Slack does
 * with it too.
 *
 * The parser is the only thing here. Its three forms are `InlineToken`s, so
 * the elements are `inline-markdown.tsx`'s: a message's chip and a message's
 * link read exactly as one of the store's own lines does, and a link is the
 * router's or a new tab's by the one rule that decides it.
 *
 * The three entities `escapeSlackText` writes are read back, so a change
 * titled with an `&` shows the `&` a hand would see rather than the escape
 * the message carries.
 */

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

/** The words of one token, which is all a message's bold, code and link
 * titles ever hold: `mrkdwn` nests nothing. */
const words = (text: string): InlineToken[] => [{ kind: "text", text }];

function parseMrkdwn(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let cut = 0;
  for (const match of text.matchAll(MRKDWN)) {
    const [whole, code, bold, href, title] = match;
    if (match.index > cut) {
      tokens.push({ kind: "text", text: spoken(text.slice(cut, match.index)) });
    }
    cut = match.index + whole.length;

    if (code !== undefined) tokens.push({ kind: "code", text: code });
    else if (bold !== undefined) {
      tokens.push({ kind: "strong", children: words(spoken(bold)) });
    } else if (href !== undefined && SAFE_HREF.test(href)) {
      tokens.push({
        kind: "link",
        href,
        children: words(spoken(title ?? href)),
      });
    } else tokens.push({ kind: "text", text: spoken(whole) });
  }
  if (cut < text.length) {
    tokens.push({ kind: "text", text: spoken(text.slice(cut)) });
  }
  return tokens;
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
