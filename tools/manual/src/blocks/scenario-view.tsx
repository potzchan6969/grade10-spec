import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { scenarioAnchor } from "../api/anchors";
import type { Requirement, Scenario } from "../api/types";
import { AnchorLink } from "./anchor";
import { InlineMarkdown } from "./inline-markdown";

const KEYWORDS = ["GIVEN", "WHEN", "THEN", "AND", "BUT", "IF"];
// A step opens on one Gherkin word or a run of them — the store writes
// `**AND THEN**` as often as `**WHEN**`.
const RUN = `(?:${KEYWORDS.join("|")})(?:\\s+(?:${KEYWORDS.join("|")}))*`;
const MARKED = new RegExp(`^\\*\\*(${RUN})\\*\\*\\s*(.*)$`);
const BARE = new RegExp(`^(${RUN})\\b\\s+(.*)$`);

export type Step = { key: string; keyword?: string; text: string };

/** Gherkin lines as the store writes them: `- **WHEN** …`, or plain prose. */
export function parseSteps(text: string): Step[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line, position) => {
      const bare = line.replace(/^[-*]\s+/, "");
      const key = `${position}:${bare.slice(0, 32)}`;
      const match = MARKED.exec(bare) ?? BARE.exec(bare);
      return match
        ? { key, keyword: match[1], text: match[2] }
        : { key, text: bare };
    });
}

export function ScenarioView({
  requirement,
  scenario,
}: {
  requirement: Requirement;
  scenario: Scenario;
}) {
  const id = scenarioAnchor(requirement, scenario);
  const steps = parseSteps(scenario.text);

  return (
    <div
      className="group/anchor scroll-mt-24 rounded-(--radius-xl) border border-border-subtle bg-background-subtle px-4 py-3"
      id={id}
    >
      <div className="flex items-center gap-2">
        {scenario.id ? (
          <Badge className="font-mono" size="sm" variant="outline">
            {scenario.id}
          </Badge>
        ) : null}
        <Text as="span" size="sm" weight="medium">
          {scenario.name}
        </Text>
        <AnchorLink
          className="ml-auto"
          id={id}
          label="Copy link to this scenario"
        />
      </div>

      <ul className="mt-2 space-y-1">
        {steps.map((step) => (
          <li className="flex gap-2 text-sm leading-relaxed" key={step.key}>
            {step.keyword ? (
              <span className="w-14 shrink-0 pt-px font-mono font-semibold text-[0.6875rem] text-primary uppercase tracking-wide">
                {step.keyword}
              </span>
            ) : (
              <span aria-hidden className="w-14 shrink-0" />
            )}
            <span className="text-secondary-foreground">
              <InlineMarkdown text={step.text} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
