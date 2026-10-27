import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { SiteHeader } from "@grade10/ui";
import { type ReactNode, useEffect, useState } from "react";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../../pages/store-content";
import {
  MEMBERSHIP_STORY_ID,
  storyHref,
} from "../../../pages/workbench-story-nav";
import { TOP_UPS_BREADCRUMBS, TOP_UPS_MANUAL_PATH } from "./top-ups-content";

/**
 * The note a wireframe carries at its top: the design still to settle, and the
 * manual page the screen reads from. Mirrors PrototypeNote in
 * pages/vault-shared.tsx; kept local so the loyalty feature does not reach
 * into another domain's shared file.
 */
function TopUpsPrototypeNote({ settles }: { settles: string }) {
  return (
    <aside
      aria-label="Not yet designed"
      className="flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-4"
      role="note"
    >
      <Text size="sm" weight="medium">
        Not yet designed
      </Text>
      <Text size="sm" tone="secondary">
        The design must still settle {settles} Manual page:{" "}
        <Link
          href={`https://spec.grade10-stg.com/p/grade10-site/${TOP_UPS_MANUAL_PATH}`}
        >
          {TOP_UPS_MANUAL_PATH}
        </Link>
        .
      </Text>
    </aside>
  );
}

/** Account › Membership › the surface's own name. */
function TopUpsBreadcrumbs({ current }: { current: string }) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="#account">
        {TOP_UPS_BREADCRUMBS.account}
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href={storyHref(MEMBERSHIP_STORY_ID)}>
        {TOP_UPS_BREADCRUMBS.membership}
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>{current}</BreadcrumbItem>
    </Breadcrumbs>
  );
}

/** Reads the 640px line — the picker's surface swaps across it, as the
 * membership page's pass does: a bottom drawer below, a floating dialog up. */
const SM_UP_MQ = "(min-width: 640px)";
function useSmUp() {
  const [smUp, setSmUp] = useState(
    () => typeof window === "undefined" || window.matchMedia(SM_UP_MQ).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(SM_UP_MQ);
    const onChange = () => setSmUp(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return smUp;
}

/** The store's header and footer around the top-up wireframes. */
function TopUpsPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="flex w-full max-w-5xl flex-col gap-8">{children}</div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

export { TopUpsBreadcrumbs, TopUpsPageShell, TopUpsPrototypeNote, useSmUp };
