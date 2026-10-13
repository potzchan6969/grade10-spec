import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import type { ReactNode } from "react";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../store-content";

const MANUAL_BASE = "https://spec.grade10-stg.com/p/grade10-site/";

/** The collector's page frame: the site header, the page, and the footer. */
function GradingPageShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div
          className={cn(
            "flex w-full flex-col gap-8 md:gap-10",
            wide ? "max-w-6xl" : "max-w-3xl",
          )}
        >
          {children}
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

function GradingPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {title}
        </h1>
        {description ? (
          <Text className="text-pretty text-secondary-foreground">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/** The note a wireframe carries: what the design must still settle, and the manual page. */
function PrototypeNote({
  manualPath,
  settles,
}: {
  manualPath: string;
  settles: string;
}) {
  return (
    <aside className="flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
      <Text size="sm" weight="medium">
        Not yet designed
      </Text>
      <Text size="sm" tone="secondary">
        The design must still settle {settles} Manual page:{" "}
        <Link href={`${MANUAL_BASE}${manualPath}`}>{manualPath}</Link>.
      </Text>
    </aside>
  );
}

export { GradingPageHeader, GradingPageShell, PrototypeNote };
