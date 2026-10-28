import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { dirOf, humanize } from "../api/paths";
import { caseParts, type TestCase } from "../api/suites";
import { AnchorLink, useHashTarget } from "../blocks/anchor";
import { useBlockScope } from "../blocks/block-scope";
import { MarkdownView } from "../blocks/markdown";
import type { SectionRule } from "../blocks/side-blocks";

export type CaseRow = { testCase: TestCase; rules: string[] };

const SEVERITY_DOT: Record<string, string> = {
  blocker: "bg-destructive",
  critical: "bg-destructive",
  major: "bg-warning",
  minor: "bg-muted-foreground/40",
};

/** One section's cases: a line each, under the rule it proves, the rules in
 * the order the section names them. */
export function CaseList({
  rows,
  rules,
}: {
  rows: CaseRow[];
  rules: SectionRule[];
}) {
  const nameOf = (anchor: string) =>
    rules.find((rule) => rule.anchor === anchor)?.name ?? humanize(anchor);
  // Unnamed rules, then the whole section, after the section's own.
  const place = (anchor: string) => {
    const at = rules.findIndex((rule) => rule.anchor === anchor);
    return at >= 0 ? at : anchor === "" ? rules.length + 1 : rules.length;
  };
  const groups = new Map<string, CaseRow[]>();
  for (const row of rows) {
    const rule = row.rules[0] ?? "";
    groups.set(rule, [...(groups.get(rule) ?? []), row]);
  }
  const ordered = [...groups].sort(([a], [b]) => place(a) - place(b));
  return (
    <div className="flex flex-col gap-4">
      {ordered.map(([rule, cases]) => (
        <section className="flex flex-col gap-1.5" key={rule || "section"}>
          <Text
            as="h3"
            className="px-1"
            size="xs"
            tone="secondary"
            weight="bold"
          >
            {rule ? nameOf(rule) : "Whole section"}
          </Text>
          <ul className="divide-y divide-border-subtle overflow-hidden rounded-(--radius-xl) border border-border bg-background-subtle">
            {cases.map(({ testCase, rules: traced }) => (
              <CaseLine
                also={traced.slice(1).map(nameOf)}
                key={testCase.id}
                testCase={testCase}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** A case's claim on one line; open, how to walk it. */
function CaseLine({ testCase, also }: { testCase: TestCase; also: string[] }) {
  const id = `case-${testCase.id.replace(/\W+/g, "-").toLowerCase()}`;
  const targeted = useHashTarget(id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (targeted) setOpen(true);
  }, [targeted]);

  return (
    <li className="group/anchor scroll-mt-24" id={id}>
      <div className="flex items-center pr-1">
        <button
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-start gap-2 px-3 py-2 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => setOpen((on) => !on)}
          type="button"
        >
          <span
            className={`mt-1.5 size-2 shrink-0 rounded-full ${SEVERITY_DOT[testCase.severity ?? ""] ?? "bg-border"}`}
            title={testCase.severity}
          />
          <span className="sr-only">{testCase.severity}</span>
          <Text as="span" className="min-w-0 flex-1" size="sm">
            {testCase.title}
            {also.length > 0 ? (
              <Text as="span" size="xs" tone="muted">
                {" · also "}
                {also.join(", ")}
              </Text>
            ) : null}
          </Text>
          <span
            className={`mt-1 inline-flex shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
          >
            <CaretRight aria-hidden size={12} weight="bold" />
          </span>
        </button>
        <AnchorLink id={id} label="Copy link to this case" />
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <CaseWalk testCase={testCase} />
        </div>
      </div>
    </li>
  );
}

/** Where the case starts, what to do and what to see, beside short labels. */
function CaseWalk({ testCase }: { testCase: TestCase }) {
  const parts = caseParts(testCase.body);
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 px-3 pt-1 pb-3 pl-7">
      {parts.lead ? (
        <Part label="">
          <Inline text={parts.lead} testCase={testCase} />
        </Part>
      ) : null}
      {parts.given.length > 0 ? (
        <Part label="Given">
          {parts.given.map((text) => (
            <Inline key={text} testCase={testCase} text={text} />
          ))}
        </Part>
      ) : null}
      {parts.other.map(({ label, text }) => (
        <Part key={label} label={label}>
          <Inline testCase={testCase} text={text} />
        </Part>
      ))}
      {parts.steps.length > 0 ? (
        <Part label="Do">
          <ol className="flex flex-col gap-1">
            {parts.steps.map((text, position) => (
              <li className="flex gap-2" key={text}>
                <StepNumber step={position + 1} />
                <Inline testCase={testCase} text={text} />
              </li>
            ))}
          </ol>
        </Part>
      ) : null}
      {parts.expect.length > 0 ? (
        <Part label="Then">
          <ul className="flex flex-col gap-1">
            {parts.expect.map(({ step, text }) => (
              <li className="flex gap-2" key={`${step}-${text}`}>
                {step ? <StepNumber step={step} /> : null}
                <Inline testCase={testCase} text={text} />
              </li>
            ))}
          </ul>
        </Part>
      ) : null}
      <Text as="p" className="col-start-2" face="mono" size="xs" tone="muted">
        {testCase.id}
        {testCase.severity ? ` · ${testCase.severity}` : ""}
      </Text>
    </div>
  );
}

function Part({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Text as="span" className="pt-0.5" size="xs" tone="muted" weight="bold">
        {label}
      </Text>
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
    </>
  );
}

function StepNumber({ step }: { step: number }) {
  return (
    <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] text-secondary-foreground">
      {step}
    </span>
  );
}

function Inline({ testCase, text }: { testCase: TestCase; text: string }) {
  const { index } = useBlockScope();
  return (
    <MarkdownView
      baseDir={dirOf(testCase.suite)}
      className="manual-prose min-w-0 text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-0"
      index={index}
      text={text}
    />
  );
}
