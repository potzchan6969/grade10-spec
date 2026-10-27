import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  CheckCircle,
  CircleNotch,
  HourglassMedium,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import {
  MEMBERSHIP_STORY_ID,
  navigateToStory,
  storyHref,
} from "../../../pages/workbench-story-nav";
import {
  MEMBER_EMAIL,
  TOP_UP_COPY,
  TOP_UP_RESULT_COPY,
  UNDER_REVIEW_REFERENCE,
} from "./top-ups-content";
import {
  TopUpsBreadcrumbs,
  TopUpsPageShell,
  TopUpsPrototypeNote,
} from "./top-ups-shared";

/** Back to the pack picker the member came from. */
const TOP_UP_DIALOG_STORY_ID =
  "loyalty-top-ups-prototypes-top-up-dialog--default";

/** Top-Up History, where a held top-up shows until a Grade10 email exists. */
const TOP_UP_HISTORY_STORY_ID =
  "loyalty-top-ups-prototypes-top-up-history--default";

type TopUpResultState =
  | "confirming"
  | "added"
  | "under-review"
  | "not-approved"
  | "not-completed";

const copy = TOP_UP_RESULT_COPY;
const MEMBERSHIP_HREF = storyHref(MEMBERSHIP_STORY_ID);

/** The Back to Membership link, drawn as an outline button. */
function BackToMembership() {
  return (
    <Button render={<a href={MEMBERSHIP_HREF} />} size="md" variant="outline">
      {copy.backToMembership}
    </Button>
  );
}

/** One centred result: icon well, title, description lines and actions. */
function ResultPanel({
  icon,
  title,
  description,
  actions,
}: {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 py-8 text-center">
      <div className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-background">
        {icon}
      </div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <div className="flex flex-col gap-1">
        <Text className="text-secondary-foreground">{description}</Text>
      </div>
      {actions ? (
        <div className="flex flex-wrap justify-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

function ResultBody({ state }: { state: TopUpResultState }) {
  if (state === "confirming") {
    return (
      <div aria-live="polite" role="status">
        <ResultPanel
          description={copy.confirming.description}
          icon={
            <span aria-hidden className="inline-flex animate-spin">
              <CircleNotch size={28} weight="bold" />
            </span>
          }
          title={copy.confirming.title}
        />
      </div>
    );
  }

  if (state === "added") {
    return (
      <ResultPanel
        actions={
          <>
            <Button render={<a href="#shop" />} size="md">
              {copy.added.shop}
            </Button>
            <BackToMembership />
          </>
        }
        description={
          <>
            {copy.added.balance(2200)}
            <br />
            {copy.added.receipt(MEMBER_EMAIL)}
          </>
        }
        icon={
          <CheckCircle
            aria-hidden
            color="var(--success)"
            size={28}
            weight="regular"
          />
        }
        title={copy.added.title(1000)}
      />
    );
  }

  if (state === "under-review") {
    return (
      <ResultPanel
        actions={
          <>
            <Button
              render={<a href={storyHref(TOP_UP_HISTORY_STORY_ID)} />}
              size="md"
            >
              {copy.underReview.history}
            </Button>
            <BackToMembership />
          </>
        }
        description={
          <>
            {copy.underReview.description(45000, 50000)}
            <br />
            {copy.underReview.safeToLeave}
            <Text as="span" className="mt-1 block" size="sm" tone="muted">
              {copy.underReview.reference(UNDER_REVIEW_REFERENCE)}
            </Text>
          </>
        }
        icon={
          <HourglassMedium
            aria-hidden
            color="var(--secondary-foreground)"
            size={28}
            weight="regular"
          />
        }
        title={copy.underReview.title}
      />
    );
  }

  if (state === "not-approved") {
    return (
      <ResultPanel
        actions={
          <>
            <Button render={<a href={MEMBERSHIP_HREF} />} size="md">
              {copy.backToMembership}
            </Button>
            <Button render={<a href="#contact" />} size="md" variant="outline">
              {copy.notApproved.contact}
            </Button>
          </>
        }
        description={copy.notApproved.description}
        icon={
          <XCircle
            aria-hidden
            color="var(--destructive)"
            size={28}
            weight="regular"
          />
        }
        title={copy.notApproved.title}
      />
    );
  }

  return (
    <ResultPanel
      actions={
        <>
          <Button
            onClick={() => navigateToStory(TOP_UP_DIALOG_STORY_ID)}
            size="md"
          >
            {copy.notCompleted.retry}
          </Button>
          <BackToMembership />
        </>
      }
      description={copy.notCompleted.description}
      icon={
        <WarningCircle
          aria-hidden
          color="var(--warning)"
          size={28}
          weight="regular"
        />
      }
      title={copy.notCompleted.title}
    />
  );
}

/**
 * Where the member lands back from Stripe's checkout: confirmed, credited,
 * held for review, rejected or abandoned. A wireframe until the design lands.
 */
function TopUpResultPrototype({ state }: { state: TopUpResultState }) {
  return (
    <TopUpsPageShell>
      <TopUpsPrototypeNote settles="how a held top-up is surfaced until a Grade10 email exists, and where the receipt link lives." />
      <TopUpsBreadcrumbs current={TOP_UP_COPY.title} />
      <ResultBody state={state} />
    </TopUpsPageShell>
  );
}

export type { TopUpResultState };
export { TopUpResultPrototype };
