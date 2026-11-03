import type { ReactNode } from "react";
import { type InlineToken, parseInline } from "../../content/inline";

const CODE = "rounded-(--radius-sm) bg-muted px-1 py-px font-mono text-[0.9em]";
const PLACEHOLDER = /(<[A-Za-z][^<>\n`|]*?>)/;

/** What a placeholder stands for on this row, where it is known. */
export type Binding = (name: string) => string | undefined;

function Bound({ name, value }: { name: string; value?: string }) {
  return (
    <span
      className="inline-flex flex-col align-top leading-tight"
      data-bind={name}
    >
      <span className="font-mono text-[0.9em]">{name}</span>
      {value ? (
        <em className="font-semibold text-[0.75rem] text-accent-foreground not-italic">
          {value}
        </em>
      ) : null}
    </span>
  );
}

function split(text: string, bind: Binding, key: string): ReactNode[] {
  return text.split(PLACEHOLDER).flatMap<ReactNode>((part, at) => {
    if (part === "") return [];
    const id = `${key}-${at}`;
    return at % 2 === 1
      ? [<Bound key={id} name={part} value={bind(part)} />]
      : [part];
  });
}

function render(
  tokens: InlineToken[],
  bind: Binding,
  prefix = "",
): ReactNode[] {
  return tokens.flatMap<ReactNode>((token, position) => {
    const key = `${prefix}${token.kind}-${position}`;
    switch (token.kind) {
      case "strong":
        return [<strong key={key}>{render(token.children, bind, key)}</strong>];
      case "em":
        return [<em key={key}>{render(token.children, bind, key)}</em>];
      case "link":
        return render(token.children, bind, key);
      case "code":
        // A placeholder alone reads as itself; one inside a quote stays in it.
        return new RegExp(`^${PLACEHOLDER.source}$`).test(token.text)
          ? split(token.text, bind, key)
          : [
              <code className={CODE} key={key}>
                {split(token.text, bind, key)}
              </code>,
            ];
      default:
        return split(token.text, bind, key);
    }
  });
}

/** A line of a case as written, each placeholder with the value this row
 * used beneath it. */
export function BoundText({ text, bind }: { text: string; bind: Binding }) {
  return <>{render(parseInline(text), bind)}</>;
}
