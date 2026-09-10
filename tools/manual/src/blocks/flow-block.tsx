import { Text } from "@grade10/design-system/components/display/text";
import { CaretDown, FlowArrow } from "@phosphor-icons/react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import type { FlowBlock } from "../content/grammar";
import { AnchorLink, useHashTarget } from "./anchor";
import { BlockView } from "./block-view";
import { placeCard } from "./card-place";
import {
  claimedStep,
  type FlowPhase,
  type FlowStep,
  flowSteps,
  splitFlow,
  stepClaims,
  stepTokens,
} from "./flow-steps";
import { InlineMarkdown } from "./inline-markdown";
import { useInlineSvg } from "./inline-svg";
import { PanStrip } from "./pan-strip";

/** A step pointed at from one side, so the other can answer it: a row lights
 * the part of the drawing it names, a part of the drawing lights its row. */
type Pointed = { step: FlowStep; from: "row" | "drawing" };

type Point = (step: FlowStep | null) => void;

/** With a drawing on screen the steps fold away behind their count: a part of
 * the drawing tells its own step on hover, and a click on one opens the list
 * at that step. Without one, or while a deep link names a step, they stand
 * open. */
export function FlowBlockView({
  block,
  select,
}: {
  block: FlowBlock;
  /** The case picker, where this flow is one of several (`block-list.tsx`). */
  select?: ReactNode;
}) {
  const phases = useMemo(() => splitFlow(block), [block]);
  const steps = useMemo(() => flowSteps(phases), [phases]);
  const [pointed, setPointed] = useState<Pointed | null>(null);
  const pointFrom =
    (from: Pointed["from"]): Point =>
    (step) =>
      setPointed(step ? { step, from } : null);

  const drawing = useInlineSvg(block.diagram ?? null);
  const foldable =
    drawing.state.status === "loading" || drawing.state.status === "ready";
  const targeted = useHashTarget(
    ...steps.map((step) => step.id),
    ...phases.map((phase) => phase.id),
  );
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (targeted) setOpened(true);
  }, [targeted]);
  const open = !foldable || opened;
  const count = `${steps.length} ${steps.length === 1 ? "step" : "steps"}`;

  return (
    <section
      aria-label={block.title}
      className="my-6 overflow-hidden rounded-(--radius-2xl) border border-border bg-card"
    >
      <header className="flex items-center gap-2 border-border-subtle border-b bg-background-subtle px-4 py-2.5">
        <span className="inline-flex text-secondary-foreground">
          <FlowArrow aria-hidden size={16} />
        </span>
        <Text as="span" size="sm" weight="bold">
          {block.title}
        </Text>
        {select}
        {foldable ? (
          <button
            aria-expanded={open}
            className="-mr-1.5 ml-auto flex cursor-pointer items-center gap-1 rounded-(--radius-md) px-1.5 py-0.5 text-secondary-foreground text-xs outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={() => setOpened((on) => !on)}
            type="button"
          >
            {count}
            <span
              className={`inline-flex transition-transform ${open ? "rotate-180" : ""}`}
            >
              <CaretDown aria-hidden size={12} weight="bold" />
            </span>
          </button>
        ) : (
          <Text as="span" className="ml-auto" size="xs" tone="secondary">
            {count}
          </Text>
        )}
      </header>

      {block.diagram ? (
        <FlowDiagram
          drawing={drawing}
          onPoint={pointFrom("drawing")}
          pointed={pointed}
          src={block.diagram}
          steps={steps}
        />
      ) : null}

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div
          className="divide-y divide-border-subtle overflow-hidden"
          inert={!open}
        >
          {phases.map((phase) => (
            <PhaseSection
              key={phase.id}
              onPoint={block.diagram ? pointFrom("row") : null}
              phase={phase}
              pointed={pointed?.from === "drawing" ? pointed.step : null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PhaseSection({
  phase,
  onPoint,
  pointed,
}: {
  phase: FlowPhase;
  onPoint: Point | null;
  pointed: FlowStep | null;
}) {
  const first = phase.steps[0];
  const last = phase.steps[phase.steps.length - 1];

  return (
    <section className="px-4 py-4" id={phase.id}>
      {phase.title === null ? null : (
        <header className="mb-3 flex items-baseline gap-3">
          <Text
            as="h3"
            className="uppercase tracking-wide"
            size="xs"
            weight="bold"
          >
            <InlineMarkdown text={phase.title} />
          </Text>
          {first ? (
            <Text as="span" className="ml-auto" size="xs" tone="secondary">
              {first === last
                ? `Step ${first.number}`
                : `Steps ${first.number}–${last.number}`}
            </Text>
          ) : null}
        </header>
      )}

      {phase.lede.length === 0 ? null : (
        <div className="manual-flow-body mb-4 text-secondary-foreground">
          <Items items={phase.lede} />
        </div>
      )}

      {first ? (
        <ol start={first.number}>
          {phase.steps.map((step, position) => (
            <StepRow
              key={step.id}
              last={position === phase.steps.length - 1}
              lit={pointed?.id === step.id}
              onPoint={onPoint}
              step={step}
            />
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function StepRow({
  step,
  last,
  lit,
  onPoint,
}: {
  step: FlowStep;
  last: boolean;
  lit: boolean;
  onPoint: Point | null;
}) {
  const claim = onPoint
    ? {
        onBlur: () => onPoint(null),
        onFocus: () => onPoint(step),
        onMouseEnter: () => onPoint(step),
        onMouseLeave: () => onPoint(null),
      }
    : {};

  return (
    <li
      className="group/anchor relative flex gap-3 pb-5 last:pb-0"
      data-lit={lit ? "" : undefined}
      id={step.id}
      {...claim}
    >
      {last ? null : (
        <span
          aria-hidden
          className="-translate-x-1/2 absolute top-7 bottom-0 left-3 w-px bg-border"
        />
      )}
      <StepNumber lit={lit} number={step.number} />
      <div className="min-w-0 flex-1">
        <div className="flex min-h-6 items-center gap-1">
          <Text
            as="span"
            className="rounded-(--radius-md) transition-colors group-data-lit/anchor:bg-primary-muted group-data-lit/anchor:px-1.5 group-data-lit/anchor:text-primary"
            size="sm"
            weight="bold"
          >
            <InlineMarkdown text={step.title} />
          </Text>
          <AnchorLink
            className="shrink-0"
            id={step.id}
            label="Copy link to this step"
          />
        </div>
        {step.items.length === 0 ? null : (
          <div className="manual-flow-body mt-1">
            <Items items={step.items} />
          </div>
        )}
      </div>
    </li>
  );
}

function StepNumber({ number, lit }: { number: number; lit: boolean }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] transition-colors ${
        lit
          ? "border-primary-border bg-primary-muted text-primary"
          : "border-border bg-background text-secondary-foreground"
      }`}
    >
      {number}
    </span>
  );
}

function Items({ items }: { items: FlowStep["items"] }) {
  return (
    <>
      {items.map((item, position) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
        <BlockView block={item} key={`${item.type}-${position}`} />
      ))}
    </>
  );
}

/** Where a part of the drawing sits, in the strip's own pixels, so a card
 * beside it pans with it. */
type Anchor = { step: FlowStep; x: number; y: number; w: number; h: number };

/** The drawing beside the steps: a lit part answers the step pointed at and
 * the strip pans to show it; a part under the mouse points at its own step
 * and shows it on a card, and a click on one lands there. */
function FlowDiagram({
  src,
  drawing,
  steps,
  pointed,
  onPoint,
}: {
  src: string;
  drawing: ReturnType<typeof useInlineSvg>;
  steps: FlowStep[];
  pointed: Pointed | null;
  onPoint: Point;
}) {
  const { host, state } = drawing;
  const navigate = useNavigate();
  const [lit, setLit] = useState<Element[]>([]);
  const [parts, setParts] = useState<Element[]>([]);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  /* The chart's nodes, as the build marks them; edges and their labels
   * claim a step too but are nothing to rest a mouse on. The card tells the
   * step, so a node's own tooltip would only say it twice. */
  useEffect(() => {
    if (state.status !== "ready") return;
    const nodes = Array.from(
      state.svg.querySelectorAll("[data-step][data-node-id]"),
    );
    for (const node of nodes) node.querySelector(":scope > title")?.remove();
    setParts(nodes);
  }, [state]);

  useEffect(() => {
    if (state.status !== "ready") return;
    const tokens = pointed ? stepTokens(pointed.step) : null;
    const active: Element[] = [];
    for (const element of Array.from(
      state.svg.querySelectorAll("[data-step]"),
    )) {
      const on =
        tokens !== null &&
        stepClaims(element.getAttribute("data-step")).some((claim) =>
          tokens.has(claim),
        );
      element.classList.toggle("data-step-active", on);
      if (on) active.push(element);
    }
    setLit(active);
  }, [pointed, state]);

  const partUnder = (target: EventTarget | null) =>
    (target as Element | null)?.closest?.("[data-step]") ?? null;

  const stepOf = (part: Element | null): FlowStep | null =>
    part
      ? claimedStep(steps, stepClaims(part.getAttribute("data-step")))
      : null;

  /* Leaving a part clears it a moment later, not at once: the mouse on its
   * way to the card crosses a gap that belongs to nothing. */
  const leaving = useRef(0);
  const stay = () => window.clearTimeout(leaving.current);
  useEffect(() => () => window.clearTimeout(leaving.current), []);

  const point = (part: Element | null, now = false) => {
    stay();
    const step = stepOf(part);
    const mount = host.current;
    if (!step || !part || !mount) {
      const clear = () => {
        onPoint(null);
        setAnchor(null);
      };
      if (now) clear();
      else leaving.current = window.setTimeout(clear, CARD_GRACE);
      return;
    }
    onPoint(step);
    const box = part.getBoundingClientRect();
    const frame = mount.getBoundingClientRect();
    setAnchor({
      step,
      x: box.left - frame.left,
      y: box.top - frame.top,
      w: box.width,
      h: box.height,
    });
  };

  const card =
    anchor && pointed?.from === "drawing" && pointed.step.id === anchor.step.id
      ? anchor
      : null;

  return (
    <div className="border-border-subtle border-b bg-background-subtle py-4">
      <PanStrip holds={parts} reveal={pointed?.from === "row" ? lit : null}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: the drawing's parts are the targets; every step is also a row below, reachable by keyboard. */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: same — the rows below are the keyboard path to every step. */}
        <div
          className="manual-diagram manual-flow-diagram relative px-4"
          data-seeking={pointed ? "" : undefined}
          onClick={(event) => {
            const step = stepOf(partUnder(event.target));
            if (step) navigate({ hash: `#${step.id}` });
          }}
          onPointerLeave={() => point(null, true)}
          onPointerOver={(event) => {
            if (onCard(event.target)) stay();
            else point(partUnder(event.target));
          }}
          ref={host}
        >
          {card ? <StepCard anchor={card} /> : null}
        </div>
      </PanStrip>
      {state.status === "unavailable" ? (
        <Text
          as="p"
          className="px-4"
          size="xs"
          title={state.reason}
          tone="secondary"
        >
          {src} is not being served, so this flow runs as text. The steps read
          on their own.
        </Text>
      ) : null}
    </div>
  );
}

/** Milliseconds a part stays pointed at after the mouse leaves it. */
const CARD_GRACE = 160;

const onCard = (target: EventTarget | null) =>
  (target as Element | null)?.closest?.("[role=tooltip]") != null;

/** A step told beside its part of the drawing, placed once measured and
 * never past the strip's sides. The mouse can move onto it and read, or
 * follow a link in it, and the strip holds still under it meanwhile. */
function StepCard({ anchor }: { anchor: Anchor }) {
  const card = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<CSSProperties>({ visibility: "hidden" });

  useLayoutEffect(() => {
    const element = card.current;
    const frame = element?.parentElement;
    if (!element || !frame) return;
    setAt(
      placeCard(
        anchor,
        { w: element.offsetWidth, h: element.offsetHeight },
        { w: frame.scrollWidth, h: frame.clientHeight },
      ),
    );
  }, [anchor]);

  return (
    <div
      className="absolute z-10 w-[30rem] max-w-full select-text rounded-(--radius-xl) border border-border bg-card p-3 shadow-lg"
      data-pan-still=""
      ref={card}
      role="tooltip"
      style={at}
    >
      <div className="flex items-center gap-2">
        <StepNumber lit number={anchor.step.number} />
        <Text as="span" size="sm" weight="bold">
          <InlineMarkdown text={anchor.step.title} />
        </Text>
      </div>
      {anchor.step.items.length === 0 ? null : (
        <div className="manual-flow-body mt-2">
          <Items items={anchor.step.items} />
        </div>
      )}
    </div>
  );
}
