import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import {
  CaretRight,
  ChatCenteredText,
  Check,
  CloudLightning,
  Info,
} from "@phosphor-icons/react";
import { type ReactNode, useEffect, useRef } from "react";
import type { FactRow } from "../page-blocks/fact-card";
import type { NoteListItem } from "../page-blocks/note-list";
import type {
  VisitAct,
  VisitFact,
  VisitNoticeIcon,
  VisitNoticeTone,
  VisitTone,
} from "./types";
import { VisitActRow } from "./visit-act-row";
import { VisitFacts, VisitSection } from "./visit-facts";
import {
  VisitPass,
  type VisitPassCopy,
  type VisitPassSize,
} from "./visit-pass";
import {
  VisitPhaseHeader,
  type VisitPhaseHeaderCopy,
} from "./visit-phase-header";
import {
  VisitReconnecting,
  type VisitReconnectingProps,
} from "./visit-reconnecting";
import { VISIT_INK_2, VISIT_INK_3, VISIT_TINT } from "./visit-tones";

/** A notice: its words under a title, or its words alone, in its tint and
 * behind its glyph. */
type VisitNoticeCopy = {
  title?: string;
  text: string;
  link?: string;
  /** Info when omitted. */
  tone?: VisitNoticeTone;
  /** Info when omitted. */
  icon?: VisitNoticeIcon;
};

type VisitBodyCopy = VisitPhaseHeaderCopy & {
  /** What the collector just did, toasted once each time it changes. */
  said?: string;
  notice?: VisitNoticeCopy;
  /** The pass's words, drawn when the visit has a name. */
  pass?: VisitPassCopy;
  /** The line under the acts. */
  footNote?: string;
  yourVisit: string;
  before: string;
  told: string;
  /** Where the visit's mail goes, at the foot. */
  foot?: string;
};

/** Where the notice sits: under the header, or after the acts and their note. */
type VisitNoticeAt = "top" | "afterActs";

type VisitBodyProps = {
  copy: VisitBodyCopy;
  tone: VisitTone;
  /** Who the visit is booked for; without a name no pass is drawn. */
  name?: string | null;
  /** The compact pass before the day, the large one on it. */
  passSize?: VisitPassSize;
  /** Where the notice's link leads. */
  noticeHref?: string;
  noticeAt?: VisitNoticeAt;
  acts: readonly VisitAct[];
  /** An open change, cancel or running-late sheet, over the page. */
  panel?: ReactNode;
  facts: readonly VisitFact[];
  /** What to bring and know, drawn only when given. */
  before?: readonly NoteListItem[];
  /** What the collector told the desk, drawn only when given. */
  told?: readonly FactRow[];
  /** A live page that lost its signal. */
  reconnecting?: VisitReconnectingProps;
  /** The said toast closed, by the collector or by its timer. */
  onDismiss: () => void;
};

const NOTICE_ICON = {
  info: Info,
  message: ChatCenteredText,
  weather: CloudLightning,
} as const satisfies Record<VisitNoticeIcon, unknown>;

/** How long a said toast stays, as the board times it. */
const SAID_MS = 4000;

/**
 * One visit's page in whichever phase the consumer worded: where it stands,
 * a notice, the pass, the acts, the visit's facts, what to bring and what
 * the collector told the desk. A change, cancel or running-late sheet opens
 * over it; what the collector just did is toasted.
 *
 * The consumer mounts the design system's `<Toast />` once at its root.
 */
function VisitBody({
  copy,
  tone,
  name,
  passSize = "compact",
  noticeHref,
  noticeAt = "top",
  acts,
  panel,
  facts,
  before,
  told,
  reconnecting,
  onDismiss,
}: VisitBodyProps) {
  useSaidToast(copy.said, onDismiss);
  const notice = copy.notice ? (
    <VisitNotice href={noticeHref} notice={copy.notice} />
  ) : null;
  return (
    <div className="flex flex-col" data-slot="visit-page">
      {reconnecting ? (
        <div className="mb-4">
          <VisitReconnecting {...reconnecting} />
        </div>
      ) : null}
      <div className="pt-5">
        <VisitPhaseHeader
          copy={{
            phase: copy.phase,
            note: copy.note,
            title: copy.title,
            lede: copy.lede,
          }}
          tone={tone}
        />
      </div>
      {noticeAt === "top" && notice ? (
        <div className="mt-4">{notice}</div>
      ) : null}
      {copy.pass && name ? (
        <div className="mt-4">
          <VisitPass copy={copy.pass} name={name} size={passSize} />
        </div>
      ) : null}
      {acts.length > 0 ? (
        <div className="pt-4">
          <VisitActRow acts={acts} />
        </div>
      ) : null}
      {copy.footNote ? (
        <p className={cn("m-0 mt-3 text-[13px] leading-[18px]", VISIT_INK_2)}>
          {copy.footNote}
        </p>
      ) : null}
      {noticeAt === "afterActs" && notice ? (
        <div className="mt-4">{notice}</div>
      ) : null}
      <div className="pt-6">
        <VisitFacts copy={{ title: copy.yourVisit }} facts={facts} />
      </div>
      {before && before.length > 0 ? (
        <div className="pt-6">
          <VisitSection slot="visit-before" title={copy.before}>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {before.map((line) => (
                <li
                  className="flex items-start gap-2.5 text-sm leading-5"
                  key={line.id}
                >
                  <Check
                    aria-hidden
                    className={cn("mt-0.5 size-4 shrink-0", VISIT_INK_2)}
                  />
                  <span>{line.content}</span>
                </li>
              ))}
            </ul>
          </VisitSection>
        </div>
      ) : null}
      {told && told.length > 0 ? (
        <div className="pt-6">
          <VisitSection slot="visit-told" title={copy.told}>
            <dl className="m-0 flex flex-col gap-2">
              {told.map((row) => (
                <div
                  className="flex justify-between gap-3 text-sm leading-5"
                  key={row.label}
                >
                  <dt className={VISIT_INK_2}>{row.label}</dt>
                  <dd className="m-0 text-right font-semibold tabular-nums">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </VisitSection>
        </div>
      ) : null}
      {copy.foot ? (
        <p
          className={cn(
            "m-0 mt-6 mb-8 text-[13px] leading-[18px]",
            VISIT_INK_3,
          )}
        >
          {copy.foot}
        </p>
      ) : null}
      {panel}
    </div>
  );
}

/** Toasts the said line once each time it changes, and tells the consumer
 * when the toast has gone so the same words can be said again. */
function useSaidToast(said: string | undefined, onDismiss: () => void) {
  const dismissed = useRef(onDismiss);
  dismissed.current = onDismiss;
  useEffect(() => {
    if (!said) return;
    const close = () => dismissed.current();
    toast.success(said, {
      duration: SAID_MS,
      onAutoClose: close,
      onDismiss: close,
    });
  }, [said]);
}

/** A tinted box with its glyph: the title bold over the words, or the words
 * alone, and the link under them. */
function VisitNotice({
  notice,
  href,
}: {
  notice: VisitNoticeCopy;
  href?: string;
}) {
  const Icon = NOTICE_ICON[notice.icon ?? "info"];
  const tint = notice.tone ?? "info";
  return (
    <div
      className={cn("flex gap-2.5 rounded-xl px-3.5 py-3", VISIT_TINT[tint])}
      data-slot="visit-notice"
      data-tone={tint}
      role="note"
    >
      <Icon aria-hidden className="mt-px size-[18px] shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {notice.title ? (
          <strong className="text-[15px] leading-5 font-bold">
            {notice.title}
          </strong>
        ) : null}
        <span className="text-sm leading-5">{notice.text}</span>
        {notice.link && href ? (
          <a
            className={cn(
              buttonVariants({ size: "sm", variant: "ghost" }),
              "-ml-3 min-h-11 self-start text-sm font-bold underline underline-offset-3",
            )}
            href={href}
          >
            {notice.link}
            <CaretRight aria-hidden className="size-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

export type { VisitBodyCopy, VisitBodyProps, VisitNoticeAt, VisitNoticeCopy };
export { VisitBody };
