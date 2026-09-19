import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { artifactLabel } from "../api/change-artifacts";
import type { Dependency } from "../api/derive";
import type { Overlay } from "../api/overlays";
import { behindLabelOf, ROLE_LABEL } from "../api/stage-view";
import type { ChangeSuite, Role } from "../api/types";

/**
 * What sits beside a change's stage: the five overlays, in the table's order
 * and nothing outside them.
 *
 * One row of chips wherever a change is shown, so a reader meets one list and
 * never two names for one fact. Each chip carries the thing a reader would act
 * on — the wait as its author wrote it, the change that blocks this one, the
 * day count, the earliest behind artifact and its hand, the suite's verdict —
 * and none of them moves the stage.
 */
export function OverlayChips({
  overlays,
  dependencies,
  suites = [],
}: {
  overlays: Overlay[];
  /**
   * The change's own dependencies, for the page's own reading: one chip per
   * id it names, whichever of in flight, shipped or names-no-change it is.
   * The overlay's own `blocked` kind carries only the ones still unreleased —
   * enough for the board's card, which wears one closed list of chips — so a
   * caller with room for the whole reading passes this instead of leaving it
   * to a second, separate list. Omitted, the card's own overlay-driven chip
   * shows.
   */
  dependencies?: Dependency[];
  /** The change's suites, so the Suite chip's title carries their counts —
   * what a second, fuller list would otherwise exist only to repeat. */
  suites?: ChangeSuite[];
}) {
  type Chip = { key: string; kind: Overlay["kind"]; node: ReactNode };
  const overlayChip = (overlay: Overlay): Chip => ({
    key: `${overlay.kind}:${keyOf(overlay)}`,
    kind: overlay.kind,
    node: <OverlayChip overlay={overlay} suites={suites} />,
  });
  const dependencyChip = (dependency: Dependency): Chip => ({
    key: `blocked:${dependency.id}`,
    kind: "blocked",
    node: <DependencyChip dependency={dependency} />,
  });

  const chips: Chip[] =
    dependencies === undefined
      ? overlays.map(overlayChip)
      : [
          ...overlays
            .filter((overlay) => overlay.kind === "waiting")
            .map(overlayChip),
          ...dependencies.map(dependencyChip),
          ...overlays
            .filter((overlay) => overlay.kind !== "waiting")
            .filter((overlay) => overlay.kind !== "blocked")
            .map(overlayChip),
        ];

  if (chips.length === 0) return null;

  return (
    <ul className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      {chips.map(({ key, kind, node }) => (
        <li
          className="flex flex-wrap items-center gap-1.5"
          data-overlay={kind}
          key={key}
        >
          {node}
        </li>
      ))}
    </ul>
  );
}

function keyOf(overlay: Overlay): string {
  if (overlay.kind === "waiting" || overlay.kind === "behind")
    return overlay.artifact;
  if (overlay.kind === "blocked") return overlay.change;
  return overlay.kind;
}

function OverlayChip({
  overlay,
  suites,
}: {
  overlay: Overlay;
  suites: ChangeSuite[];
}) {
  if (overlay.kind === "waiting") {
    return (
      <>
        <Badge size="sm" variant="warning">
          <span>Waiting</span>
          <span className="opacity-80">{artifactLabel(overlay.artifact)}</span>
        </Badge>
        <Text as="span" size="xs" tone="secondary">
          {overlay.text}
        </Text>
        <Owed hand={overlay.hand} role={overlay.role} />
      </>
    );
  }

  if (overlay.kind === "blocked") {
    return (
      <Link title={overlay.change} to={`/in-flight#${overlay.change}`}>
        <Badge size="sm" variant="warning">
          <span>Blocked</span>
          <span className="max-w-56 truncate opacity-80">{overlay.change}</span>
        </Badge>
      </Link>
    );
  }

  if (overlay.kind === "idle") {
    return (
      <Badge
        size="sm"
        title={
          overlay.shelved
            ? "Nothing has landed on this change for a month — it sits on the shelf rather than in its lane"
            : "Whole days since a task was ticked, a group claimed or an artifact added"
        }
        variant={overlay.shelved ? "error" : "warning"}
      >
        {`idle ${overlay.days} days`}
      </Badge>
    );
  }

  if (overlay.kind === "behind") {
    return (
      <>
        <Badge size="sm" title={behindLabelOf(overlay)} variant="warning">
          <span>Behind</span>
          <span className="opacity-80">{artifactLabel(overlay.artifact)}</span>
        </Badge>
        <Owed hand={overlay.hand} role={overlay.role} />
      </>
    );
  }

  return (
    <Badge
      size="sm"
      title={suiteCountsTitle(suites)}
      variant={overlay.verdict === "approved" ? "success" : "warning"}
    >
      <span>Suite</span>
      <span className="opacity-80">{overlay.verdict}</span>
    </Badge>
  );
}

/** The suite's counts, for the chip's title — what a second, fuller list
 * would otherwise exist only to repeat: the total, then draft, reviewed and
 * retired where each is more than none. Undefined where nothing was passed,
 * which leaves the chip with no title rather than an empty one. */
function suiteCountsTitle(suites: ChangeSuite[]): string | undefined {
  if (suites.length === 0) return undefined;
  const totals = suites.reduce(
    (sum, suite) => ({
      total: sum.total + suite.cases.total,
      draft: sum.draft + suite.cases.draft,
      actual: sum.actual + suite.cases.actual,
      deprecated: sum.deprecated + suite.cases.deprecated,
    }),
    { total: 0, draft: 0, actual: 0, deprecated: 0 },
  );
  const parts = [
    totals.draft > 0 ? `${totals.draft} draft` : null,
    totals.actual > 0 ? `${totals.actual} reviewed` : null,
    totals.deprecated > 0 ? `${totals.deprecated} retired` : null,
  ].filter((part): part is string => part !== null);

  return `${totals.total} ${totals.total === 1 ? "case" : "cases"}${
    parts.length > 0 ? ` · ${parts.join(" · ")}` : ""
  }`;
}

/**
 * One dependency, as the page's own reading names it: in flight, shipped, or
 * — the lie the board says out loud rather than dropping — naming no change
 * at all. The overlay's own `blocked` chip only ever carries the first of
 * these; this is what a caller with room for the whole reading renders
 * instead.
 */
function DependencyChip({ dependency }: { dependency: Dependency }) {
  const label = dependency.change?.title ?? dependency.id;

  if (dependency.state === "missing") {
    return (
      <Badge
        size="sm"
        title={`\`depends_on: ${dependency.id}\` names no change, in flight or archived`}
        variant="error"
      >
        {dependency.id} — names no change
      </Badge>
    );
  }

  const blocking = dependency.state === "blocking";
  return (
    <Link title={label} to={`/in-flight#${dependency.id}`}>
      <Badge size="sm" variant={blocking ? "warning" : "outline"}>
        <span className="max-w-56 truncate">{dependency.id}</span>
        <span className="opacity-70">{blocking ? "in flight" : "shipped"}</span>
      </Badge>
    </Link>
  );
}

/** Whose overlay it is: the handle the change names for that artifact's role,
 * or the role read as open where it names nobody — the overlay carries no
 * handle at all then, so there is nothing here to see through. */
function Owed({ hand, role }: { hand?: string; role?: Role }) {
  if (role === undefined) return null;
  const named = hand !== undefined;

  return (
    <Text
      as="span"
      className={named ? "font-mono" : undefined}
      size="xs"
      tone="secondary"
    >
      {named ? `@${hand}` : `${ROLE_LABEL[role]} — open`}
    </Text>
  );
}
