/*
 * What a person reads: the stop in a terminal, and the comment on `main`.
 */
import { short } from "./git.mjs";

export const MARKER = "<!-- design-override -->";
export const TRAILER = "Design-Override: <what changes and why>";

const WHY = {
  look: "changes the agreed UI design",
  merge: "drops lines one side of the merge holds",
};

const setBy = ({ setBy: who }) =>
  who && `${who.name}, ${who.date}, ${who.sha.slice(0, 8)}`;

function byFile(stops, title, line) {
  const files = Map.groupBy(stops, (stop) => stop.file);
  return [...files]
    .map(([file, lines]) => [title(file), ...lines.flatMap(line)].join("\n"))
    .join("\n\n");
}

export function stopText(result) {
  const head = `commit ${short(result.sha)} ${result.subject}\n`;
  const lines = byFile(
    result.stops,
    (file) => file,
    (stop) =>
      [
        `  before  ${stop.before}`,
        stop.after !== undefined && `  after   ${stop.after}`,
        stop.parent && `  held by ${stop.parent}`,
        setBy(stop) && `  set by  ${setBy(stop)}`,
      ].filter(Boolean),
  );
  const empty =
    result.override === ""
      ? "\nThe Design-Override line has no reason, so it is refused.\n"
      : "";
  return `${head}Design Override stopped this commit: it ${WHY[result.rule]}.

${lines}
${empty}
Show these lines to the person you work for and ask whether this change to the agreed look is intended. On their yes, end the message with their reason as its last paragraph:

${TRAILER}
`;
}

export function commentBody(result, designers) {
  const mentions = designers.map(({ handle }) => `@${handle}`).join(" ");
  const how = result.override
    ? `confirmed with \`Design-Override: ${result.override}\``
    : "reached `main` without a `Design-Override:` line, so its checks were skipped";
  const lines = byFile(
    result.stops,
    (file) => `**${file}**`,
    (stop) => [
      "```diff",
      `- ${stop.before}`,
      ...(stop.after !== undefined ? [`+ ${stop.after}`] : []),
      "```",
      ...(setBy(stop)
        ? [
            `set by ${setBy(stop)}${stop.parent ? `, held by ${stop.parent}` : ""}`,
          ]
        : []),
    ],
  );
  return `${MARKER}
${mentions} this commit ${WHY[result.rule]}, and ${how}.

${lines}
`;
}
