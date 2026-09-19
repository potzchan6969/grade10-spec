import { Badge } from "@grade10/design-system/components/display/badge";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Bell } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSnapshot } from "../api/snapshot-provider";
import { markSeen, readSeen, unseenCount } from "./recent-seen";

const BADGE_CAP = 9;

export function RecentBell() {
  const snapshot = useSnapshot();
  const history = snapshot.status === "ready" ? snapshot.snapshot.history : [];
  const newest = history[0]?.date;
  const [seen, setSeen] = useState(readSeen);

  useEffect(() => {
    if (!newest || seen !== null) return;
    markSeen(newest);
    setSeen(newest);
  }, [newest, seen]);

  const unseen = unseenCount(history, seen);
  const label =
    unseen === 0 ? "Recent changes" : `Recent changes, ${unseen} unseen`;

  return (
    <IconButton
      aria-label={label}
      className="relative"
      // A link dressed as a button: Base UI is told so, or it warns on every page.
      nativeButton={false}
      render={<Link to="/recent" />}
      size="md"
      title={label}
      variant="ghost"
    >
      <Bell aria-hidden />
      {unseen > 0 ? (
        <Badge
          aria-hidden
          className="-top-0.5 -right-0.5 absolute h-4 min-w-4 px-1 text-[0.625rem]"
          size="sm"
          variant="warning"
        >
          {unseen > BADGE_CAP ? `${BADGE_CAP}+` : unseen}
        </Badge>
      ) : null}
    </IconButton>
  );
}
