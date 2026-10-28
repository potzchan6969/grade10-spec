import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
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
} from "../../workbench-story-nav";
import {
  TOP_UP_COPY,
  TOP_UP_RESULT_COPY,
  UNDER_REVIEW_REFERENCE,
} from "./top-ups-content";
import { TopUpsBreadcrumbs, TopUpsPageShell, useSmUp } from "./top-ups-shared";

/** Back to the pack picker the member came from. */
const TOP_UP_DIALOG_STORY_ID = "loyalty-top-ups-screens-top-up-dialog--default";

/** Top-Up History, where a held top-up shows until a Grade10 email exists. */
const TOP_UP_HISTORY_STORY_ID =
  "loyalty-top-ups-screens-top-up-history--default";

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

type ResultContent = {
  wellClass: string;
  icon: ReactNode;
  /** The outcome line; also the modal's accessible name. */
  title: string;
  description: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  /** Still settling — the modal cannot be dismissed while it runs. */
  live?: boolean;
};

/** Everything a result says, before the surface it says it on. */
function resultContent(state: TopUpResultState): ResultContent {
  if (state === "confirming") {
    return {
      description: copy.confirming.description,
      icon: (
        <span aria-hidden className="inline-flex animate-spin">
          <CircleNotch size={28} weight="bold" />
        </span>
      ),
      live: true,
      title: copy.confirming.title,
      wellClass: "bg-muted",
    };
  }

  if (state === "added") {
    return {
      actions: (
        <Button render={<a href={MEMBERSHIP_HREF} />} size="md">
          {copy.backToMembership}
        </Button>
      ),
      description: copy.added.balance(2200),
      icon: (
        <CheckCircle
          aria-hidden
          color="var(--success)"
          size={28}
          weight="regular"
        />
      ),
      title: copy.added.title(1000),
      wellClass: "bg-success/10",
    };
  }

  if (state === "under-review") {
    return {
      actions: (
        <Button
          render={<a href={storyHref(TOP_UP_HISTORY_STORY_ID)} />}
          size="md"
        >
          {copy.underReview.history}
        </Button>
      ),
      description: copy.underReview.description,
      icon: (
        <HourglassMedium
          aria-hidden
          color="var(--secondary-foreground)"
          size={28}
          weight="regular"
        />
      ),
      meta: copy.underReview.reference(UNDER_REVIEW_REFERENCE),
      title: copy.underReview.title,
      wellClass: "bg-muted",
    };
  }

  if (state === "not-approved") {
    return {
      actions: (
        <Button render={<a href={MEMBERSHIP_HREF} />} size="md">
          {copy.backToMembership}
        </Button>
      ),
      description: copy.notApproved.description,
      icon: (
        <XCircle
          aria-hidden
          color="var(--destructive)"
          size={28}
          weight="regular"
        />
      ),
      title: copy.notApproved.title,
      wellClass: "bg-destructive/10",
    };
  }

  return {
    actions: (
      <>
        <Button
          onClick={() => navigateToStory(TOP_UP_DIALOG_STORY_ID)}
          size="md"
        >
          {copy.notCompleted.retry}
        </Button>
        <BackToMembership />
      </>
    ),
    description: copy.notCompleted.description,
    icon: (
      <WarningCircle
        aria-hidden
        color="var(--warning)"
        size={28}
        weight="regular"
      />
    ),
    title: copy.notCompleted.title,
    wellClass: "bg-warning/10",
  };
}

/** One centred result: a tinted icon well, the title (the modal's own title
 * element, so it names the surface), one description line, an optional muted
 * meta line and the actions. */
function ResultPanel({
  wellClass,
  icon,
  title,
  description,
  meta,
  actions,
}: Omit<ResultContent, "title" | "live"> & { title: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 py-4 text-center">
      <div
        className={`inline-flex size-14 shrink-0 items-center justify-center rounded-full ${wellClass}`}
      >
        {icon}
      </div>
      {title}
      <Text className="text-secondary-foreground">{description}</Text>
      {meta ? (
        <Text size="sm" tone="muted">
          {meta}
        </Text>
      ) : null}
      {actions ? (
        <div className="flex flex-wrap justify-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/**
 * Where the member lands back from Stripe's hosted checkout — confirmed,
 * credited, held for review, rejected or abandoned — as a modal over the page
 * they left: a dialog from 640px up, a bottom drawer below. Dismissing it
 * returns to Membership. A wireframe until the design lands.
 */
function TopUpResultPrototype({ state }: { state: TopUpResultState }) {
  const smUp = useSmUp();
  const content = resultContent(state);

  const onOpenChange = (open: boolean) => {
    if (!open && !content.live) navigateToStory(MEMBERSHIP_STORY_ID);
  };

  const titleClass =
    "w-full text-center font-heading text-3xl font-semibold tracking-tight text-balance";
  const panel = (title: ReactNode) => {
    const body = <ResultPanel {...content} title={title} />;
    return content.live ? (
      <div aria-live="polite" role="status">
        {body}
      </div>
    ) : (
      body
    );
  };

  return (
    <TopUpsPageShell>
      <TopUpsBreadcrumbs current={TOP_UP_COPY.title} />
      {smUp ? (
        <Dialog onOpenChange={onOpenChange} open>
          <DialogContent
            className="sm:max-w-md"
            showCloseButton={!content.live}
          >
            <DialogBody className="items-center">
              {panel(
                <DialogTitle className={titleClass}>
                  {content.title}
                </DialogTitle>,
              )}
            </DialogBody>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer onOpenChange={onOpenChange} open swipeDirection="down">
          <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
            <DrawerBody className="items-center">
              {panel(
                <DrawerTitle className={titleClass}>
                  {content.title}
                </DrawerTitle>,
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </TopUpsPageShell>
  );
}

export type { TopUpResultState };
export { TopUpResultPrototype };
