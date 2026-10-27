import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { SIDE_TABS, type SideTab } from "../blocks/side-blocks";
import { browserKeyStore, STORAGE } from "../editor/config";

export const NAV_WIDTH = { min: 220, initial: 304, max: 480 } as const;
/** A rail let go narrower than this folds away. */
export const NAV_FOLD_AT = 180;
export const PANEL_WIDTH = { min: 320, initial: 520 } as const;
/** The page keeps at least this much beside the panel. */
export const PAGE_MIN_WIDTH = 420;

type Stored = {
  navWidth: number;
  navCollapsed: boolean;
  panelWidth: number;
  tab: SideTab;
};

const DEFAULTS: Stored = {
  navWidth: NAV_WIDTH.initial,
  navCollapsed: false,
  panelWidth: PANEL_WIDTH.initial,
  tab: "ui",
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/** Whatever a reader left, with anything unreadable put back to default. */
export function readStored(raw: string | null): Stored {
  try {
    const parsed: Partial<Stored> = JSON.parse(raw ?? "");
    return {
      navWidth:
        typeof parsed.navWidth === "number"
          ? clamp(parsed.navWidth, NAV_WIDTH.min, NAV_WIDTH.max)
          : DEFAULTS.navWidth,
      navCollapsed: parsed.navCollapsed === true,
      panelWidth:
        typeof parsed.panelWidth === "number"
          ? Math.max(parsed.panelWidth, PANEL_WIDTH.min)
          : DEFAULTS.panelWidth,
      tab: SIDE_TABS.includes(parsed.tab as SideTab)
        ? (parsed.tab as SideTab)
        : DEFAULTS.tab,
    };
  } catch {
    return DEFAULTS;
  }
}

const WIDE = "(min-width: 64rem)";

/** The desktop rail's breakpoint, `lg`: below it the rail is a drawer and
 * nothing folds or splits. */
function useWide(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(WIDE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

export type Layout = Stored & {
  /** The rail is folded on a wide screen: the page reads in two columns. */
  split: boolean;
  setNavWidth: (width: number) => void;
  setNavCollapsed: (collapsed: boolean) => void;
  setPanelWidth: (width: number) => void;
  setTab: (tab: SideTab) => void;
  /** Whether the page being read has anything to show beside it. */
  sideShown: boolean;
  setSideShown: (shown: boolean) => void;
};

const LayoutContext = createContext<Layout | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState(() =>
    readStored(browserKeyStore.get(STORAGE.layout)),
  );
  const [sideShown, setSideShown] = useState(false);
  const wide = useWide();

  const update = useCallback((patch: Partial<Stored>) => {
    setStored((current) => {
      const next = { ...current, ...patch };
      browserKeyStore.set(STORAGE.layout, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<Layout>(
    () => ({
      ...stored,
      split: wide && stored.navCollapsed,
      setNavWidth: (navWidth) => update({ navWidth }),
      setNavCollapsed: (navCollapsed) => update({ navCollapsed }),
      setPanelWidth: (panelWidth) => update({ panelWidth }),
      setTab: (tab) => update({ tab }),
      sideShown,
      setSideShown,
    }),
    [stored, wide, update, sideShown],
  );

  return <LayoutContext value={value}>{children}</LayoutContext>;
}

export function useLayout(): Layout {
  const layout = use(LayoutContext);
  if (!layout) throw new Error("useLayout runs inside a LayoutProvider");
  return layout;
}

/** The layout where there is one: a page rendered outside the shell, as in a
 * test, reads in one column. */
export function useLayoutMaybe(): Layout | null {
  return use(LayoutContext);
}
