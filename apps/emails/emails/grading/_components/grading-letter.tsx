import type { ReactNode } from "react";
import { Heading, Section, Text } from "react-email";

import { Grade10EmailShell } from "@/emails/_components/grade10-email-shell";
import { PrimaryCta } from "@/emails/_components/primary-cta";
import {
  GradingFooter,
  type GradingFooterProps,
} from "@/emails/grading/_components/grading-footer";
import {
  SubmissionLine,
  type SubmissionLineProps,
} from "@/emails/grading/_components/submission-line";

export type Fact = {
  label: string;
  value: string;
  /** A quieter line under the value. */
  subtext?: string;
};

/** The label · value rows every grading letter states its facts in. */
export function FactsGroup({ facts }: { facts: Fact[] }) {
  return (
    <Section className="my-6">
      {facts.map((fact) => (
        <Section key={`${fact.label}:${fact.value}`}>
          <Text className="mb-0.5 mt-0 text-sm text-secondary-fg">
            {fact.label}
          </Text>
          <Text
            className={`mt-0 text-lg font-bold leading-tight text-fg ${fact.subtext ? "mb-0.5" : "mb-4"}`}
          >
            {fact.value}
          </Text>
          {fact.subtext ? (
            <Text className="mb-4 mt-0 text-sm text-secondary-fg">
              {fact.subtext}
            </Text>
          ) : null}
        </Section>
      ))}
    </Section>
  );
}

/** A paragraph after the lead — one fact the reader would act on. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-3 mt-0 text-lg leading-base text-fg-2">{children}</Text>
  );
}

export type GradingLetterProps = {
  preheader: string;
  heading: string;
  /** `Hi Jasmine,` — the collector's own name. */
  greeting: string;
  /** The lead: one paragraph, or several short ones rendered in order. */
  lead: string | string[];
  /** The blocks this letter carries after the lead, in the order it carries them. */
  children?: ReactNode;
  /** What rides with the letter. A letter with no document names nothing. */
  attachments?: string[];
  cta?: { href: string; label: string };
  submission: SubmissionLineProps;
  footer: GradingFooterProps;
};

/**
 * The shell every collector letter about a submission is written in: the
 * heading, the greeting, the lead, the letter's own blocks, then the
 * submission's line and the shop's footer.
 */
export function GradingLetter({
  preheader,
  heading,
  greeting,
  lead,
  children,
  attachments = [],
  cta,
  submission,
  footer,
}: GradingLetterProps) {
  const leadParagraphs = Array.isArray(lead) ? lead : [lead];

  return (
    <Grade10EmailShell preheader={preheader}>
      <Heading as="h1" className="mb-4 mt-0 text-heading font-bold text-fg">
        {heading}
      </Heading>
      <Text className="mb-3 mt-0 text-lg leading-base text-fg-2">
        {greeting}
      </Text>
      {leadParagraphs.map((paragraph) => (
        <Text
          className="mb-3 mt-0 text-lg leading-base text-fg-2"
          key={paragraph}
        >
          {paragraph}
        </Text>
      ))}
      {children}
      {cta ? <PrimaryCta href={cta.href} label={cta.label} /> : null}
      {attachments.length > 0 ? (
        <Text className="mb-0 mt-0 text-sm leading-base text-fg-3">
          Attached: {attachments.join(", ")}.
        </Text>
      ) : null}
      <SubmissionLine {...submission} />
      <GradingFooter {...footer} />
    </Grade10EmailShell>
  );
}
