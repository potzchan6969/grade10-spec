import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type CampaignDate = {
  /** The day as the page writes it: "30 Nov". */
  day: string;
  text: string;
  /** Already behind us, drawn filled. */
  past?: boolean;
};

/** One titled side panel of a campaign: its dates, where to collect. */
function CampaignPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <VStack
      className="rounded-2xl border border-border p-5"
      data-slot="campaign-panel"
      gap="sm"
    >
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </VStack>
  );
}

/** The campaign's days in order, on a line. */
function CampaignDates({ dates }: { dates: readonly CampaignDate[] }) {
  return (
    <ol className="m-0 grid list-none p-0" data-slot="campaign-dates">
      {dates.map((date, at) => (
        <li
          className="relative grid grid-cols-[4.5rem_1rem_1fr] gap-3 pb-4 text-sm last:pb-0"
          data-past={date.past ? "" : undefined}
          key={`${date.day}-${date.text}`}
        >
          <span className="font-bold tabular-nums">{date.day}</span>
          <span
            aria-hidden
            className={cn(
              "z-10 mt-1 size-3 rounded-full border-2 border-primary bg-card",
              date.past && "bg-primary",
            )}
          />
          {at < dates.length - 1 ? (
            <span
              aria-hidden
              className="absolute top-5 bottom-0 left-[calc(4.5rem+0.75rem+0.375rem-1px)] w-0.5 bg-border"
            />
          ) : null}
          <span>{date.text}</span>
        </li>
      ))}
    </ol>
  );
}

/** Short questions, each opening on its answer. */
function CampaignQuestions({
  questions,
}: {
  questions: readonly { question: string; answer: string }[];
}) {
  return (
    <div className="grid" data-slot="campaign-questions">
      {questions.map((one, at) => (
        <details
          className="group border-b border-border py-3 text-sm last:border-b-0"
          key={one.question}
          open={at === 0}
        >
          <summary className="cursor-pointer font-bold marker:text-primary">
            {one.question}
          </summary>
          <p className="pt-2 text-secondary-foreground">{one.answer}</p>
        </details>
      ))}
    </div>
  );
}

export type { CampaignDate };
export { CampaignDates, CampaignPanel, CampaignQuestions };
