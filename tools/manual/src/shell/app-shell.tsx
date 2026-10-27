import { type CSSProperties, useRef, useState } from "react";
import { Outlet } from "react-router";
import { useSnapshot } from "../api/snapshot-provider";
import { useHashFlash } from "../blocks/anchor";
import { SnapshotFooter } from "./footer";
import { Header } from "./header";
import {
  clamp,
  LayoutProvider,
  NAV_FOLD_AT,
  NAV_WIDTH,
  useLayout,
} from "./layout";
import { MainMoved } from "./main-moved";
import { PageSectionsProvider } from "./page-sections";
import { ResizeHandle } from "./resize-handle";
import { useScrollMemory } from "./scroll-memory";
import { SidePanelSlot } from "./side-panel";
import { Sidebar } from "./sidebar";
import {
  FixtureNotice,
  SnapshotLoading,
  SnapshotUnavailable,
} from "./snapshot-state";

export function AppShell() {
  return (
    <LayoutProvider>
      <Shell />
    </LayoutProvider>
  );
}

function Shell() {
  const snapshot = useSnapshot();
  const layout = useLayout();
  const row = useRef<HTMLDivElement>(null);
  const [navDraft, setNavDraft] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);
  const ready = snapshot.status === "ready";
  // A new page starts at the top and back returns where you left it; a hash
  // belongs to the seek, which keeps looking until the row it names exists.
  useScrollMemory();
  useHashFlash(ready);

  return (
    <div
      className="group/shell min-h-dvh bg-background text-foreground"
      data-nav={layout.navCollapsed ? "collapsed" : undefined}
      data-nav-folding={
        navDraft !== null && navDraft < NAV_FOLD_AT ? "" : undefined
      }
      style={
        {
          "--manual-nav-width": `${clamp(navDraft ?? layout.navWidth, NAV_FOLD_AT, NAV_WIDTH.max)}px`,
        } as CSSProperties
      }
    >
      <Header
        navOpen={navOpen}
        onNavigate={closeNav}
        onToggleNav={() => setNavOpen((on) => !on)}
      />

      {/* Scrim. The header's toggle is the named control, so this one stays out
          of the accessibility tree rather than answering to the same name. Its
          presence is also what holds the page behind still — see the drawer
          rule in `index.css`. */}
      {navOpen ? (
        <button
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-overlay lg:hidden"
          data-slot="manual-nav-scrim"
          onClick={closeNav}
          tabIndex={-1}
          type="button"
        />
      ) : null}

      <PageSectionsProvider ready={ready}>
        <div className="mx-auto flex w-full max-w-[100rem]">
          <Sidebar onNavigate={closeNav} open={navOpen} />
          {layout.navCollapsed ? null : (
            <ResizeHandle
              className="max-lg:hidden"
              grows={1}
              label="Resize the navigation; drag to the left to fold it away"
              max={NAV_WIDTH.max}
              min={NAV_WIDTH.min}
              onCommit={(next) => {
                setNavDraft(null);
                if (next < NAV_FOLD_AT) layout.setNavCollapsed(true);
                else
                  layout.setNavWidth(clamp(next, NAV_WIDTH.min, NAV_WIDTH.max));
              }}
              onMove={setNavDraft}
              onToggle={() => layout.setNavCollapsed(true)}
              width={layout.navWidth}
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex min-w-0 flex-1" ref={row}>
              <main className="min-w-0 flex-1 px-5 py-10 lg:px-12">
                <div className="mx-auto w-full min-w-0 max-w-4xl">
                  {snapshot.status === "loading" ? <SnapshotLoading /> : null}
                  {snapshot.status === "error" ? (
                    <SnapshotUnavailable message={snapshot.message} />
                  ) : null}
                  {snapshot.status === "ready" ? (
                    <>
                      {snapshot.source === "fixture" ? (
                        <FixtureNotice reason={snapshot.reason} />
                      ) : null}
                      {/* Above the page, inside the column it reads in: what
                        the banner says is about the reading, not the route. */}
                      <MainMoved />
                      <Outlet />
                    </>
                  ) : null}
                </div>
              </main>
              <SidePanelSlot rowWidth={() => row.current?.clientWidth ?? 0} />
            </div>

            {snapshot.status === "ready" ? (
              <SnapshotFooter snapshot={snapshot.snapshot} />
            ) : null}
          </div>
        </div>
      </PageSectionsProvider>
    </div>
  );
}
