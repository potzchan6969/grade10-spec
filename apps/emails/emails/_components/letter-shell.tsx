import type { ReactNode } from "react";
import { Heading, Section, Text } from "react-email";

import {
  EmailFooter,
  type EmailFooterProps,
} from "@/emails/_components/email-footer";
import { list } from "@/emails/_components/format";
import { Grade10EmailShell } from "@/emails/_components/grade10-email-shell";
import { PrimaryCta } from "@/emails/_components/primary-cta";

export type Fact = {
  label: string;
  value: string;
  /** A quieter line under the value. */
  subtext?: string;
};

/** The label · value rows a letter states its facts in — the facts table, how
 * to pay, the reminder schedule and the notice all share it. */
export function FactsGroup({
  facts,
  heading,
}: {
  facts: Fact[];
  heading?: string;
}) {
  return (
    <Section className="my-6">
      {heading ? (
        <Text className="mb-2 mt-0 text-sm font-bold text-fg">{heading}</Text>
      ) : null}
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

export type LetterShellProps = {
  preheader: string;
  heading: string;
  /** `Hi Jasmine,` — the reader's own name. */
  greeting: string;
  /** The lead: one paragraph, or several short ones rendered in order. */
  lead: string | string[];
  /** The blocks this letter carries after the lead, in the order it carries them. */
  children?: ReactNode;
  /** What rides with the letter. A letter with no document names nothing. */
  attachments?: string[];
  cta?: { href: string; label: string };
  /** The line that names what the letter is about — a submission, a case. */
  trailer: ReactNode;
  footer: EmailFooterProps;
};

/**
 * The shell every collector letter is written in: the heading, the greeting,
 * the lead, the letter's own blocks, then the line naming what the letter is
 * about and the shop's footer — which names the party by its registered name
 * and carries no copyright line, as the worker's does not.
 *
 * `Grade10EmailShell` here, `@grade10/email/render`'s `BaseLayout` in the
 * worker — the two shells cannot be shared, so this one is an unchecked copy
 * of the layout and a checked copy of the facts.
 */
export function LetterShell({
  preheader,
  heading,
  greeting,
  lead,
  children,
  attachments = [],
  cta,
  trailer,
  footer,
}: LetterShellProps) {
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
          Attached: {list(attachments)}.
        </Text>
      ) : null}
      {trailer}
      <EmailFooter {...footer} copyright={false} />
    </Grade10EmailShell>
  );
}
