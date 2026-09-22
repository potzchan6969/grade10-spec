import { useState } from "react";
import { Outlet } from "react-router";
import { useSnapshot } from "../api/snapshot-provider";
import { useHashFlash } from "../blocks/anchor";
import { SnapshotFooter } from "./footer";
import { Header } from "./header";
import { MainMoved } from "./main-moved";
import { PageSectionsProvider } from "./page-sections";
import { useScrollMemory } from "./scroll-memory";
import { Sidebar } from "./sidebar";
import {
  FixtureNotice,
  SnapshotLoading,
  SnapshotUnavailable,
} from "./snapshot-state";

export function AppShell() {
  const snapshot = useSnapshot();
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);
  const ready = snapshot.status === "ready";
  // A new page starts at the top and back returns where you left it; a hash
  // belongs to the seek, which keeps looking until the row it names exists.
  useScrollMemory();
  useHashFlash(ready);

  return (
    <div className="min-h-dvh bg-background text-foreground">
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

          <div className="flex min-w-0 flex-1 flex-col">
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

            {snapshot.status === "ready" ? (
              <SnapshotFooter snapshot={snapshot.snapshot} />
            ) : null}
          </div>
        </div>
      </PageSectionsProvider>
    </div>
  );
}
