import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import { artifactLabel } from "../api/change-artifacts";
import type { Overlay } from "../api/overlays";
import { behindLabelOf, ROLE_LABEL } from "../api/stage-view";
import type { Role } from "../api/types";

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
export function OverlayChips({ overlays }: { overlays: Overlay[] }) {
  if (overlays.length === 0) return null;

  return (
    <ul className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      {overlays.map((overlay) => (
        <li
          className="flex flex-wrap items-center gap-1.5"
          data-overlay={overlay.kind}
          // Two waits are two chips of one kind, and what each names — the
          // artifact it is written against, the change it waits for — is what
          // tells them apart. The record holds one line per artifact and one
          // id per dependency, so no two chips carry the same pair.
          key={`${overlay.kind}:${keyOf(overlay)}`}
        >
          <Chip overlay={overlay} />
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

function Chip({ overlay }: { overlay: Overlay }) {
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
      variant={overlay.verdict === "approved" ? "success" : "warning"}
    >
      <span>Suite</span>
      <span className="opacity-80">{overlay.verdict}</span>
    </Badge>
  );
}

/** Whose overlay it is: the handle the change names for that artifact's role,
 * or the role itself where it names nobody. */
function Owed({ hand, role }: { hand?: string; role?: Role }) {
  if (role === undefined) return null;
  const named = hand !== undefined && hand !== role;

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
