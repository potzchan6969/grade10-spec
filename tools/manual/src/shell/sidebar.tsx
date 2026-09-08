import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import {
  BookOpenText,
  CaretDown,
  CaretRight,
  type Icon,
} from "@phosphor-icons/react";
import { use, useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import type { Incubating, NavGroup, NavItem, NavProduct } from "../api/derive";
import { buildIndex, REFERENCES_ROUTE, soleProduct } from "../api/derive";
import { useSnapshot } from "../api/snapshot-provider";
import { CapabilityPip } from "../blocks/capability-status";
import { browserKeyStore, STORAGE } from "../editor/config";
import { NewPageAction } from "../editor/edit-actions";
import {
  navSections,
  PageSectionsContext,
  SectionLinks,
} from "./page-sections";

const FIXED_ENTRIES: { to: string; label: string; icon: Icon }[] = [];

/** One row shape for everything in the rail — the fixed views, products and
 * leaves differ in tone, never in geometry. */
const ROW =
  "flex h-8 items-center gap-2 rounded-(--radius-md) px-2 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * What this reader holds open. The rail used to follow the route alone, so
 * leaving a product — or following an incubating entry onto the In Flight
 * board — snapped the branch shut under the reader. Now a branch opens when
 * its own page is visited and stays as the reader last left it, across
 * navigations and reloads.
 */
type NavMemory = { open: string[]; shut: string[] };

function readMemory(): NavMemory {
  try {
    const parsed: unknown = JSON.parse(browserKeyStore.get(STORAGE.nav) ?? "");
    if (typeof parsed === "object" && parsed !== null) {
      const { open, shut } = parsed as Record<string, unknown>;
      return { open: onlyStrings(open), shut: onlyStrings(shut) };
    }
  } catch {
    /* a fresh browser, or storage switched off — start from the route */
  }
  return { open: [], shut: [] };
}

function onlyStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((one) => typeof one === "string")
    : [];
}

function useNavMemory() {
  const [memory, setMemory] = useState<NavMemory>(readMemory);

  const write = useCallback(
    (update: (prev: NavMemory) => NavMemory) =>
      setMemory((prev) => {
        const next = update(prev);
        if (next !== prev) {
          browserKeyStore.set(STORAGE.nav, JSON.stringify(next));
        }
        return next;
      }),
    [],
  );

  const openBranch = useCallback(
    (key: string) =>
      write((prev) =>
        prev.open.includes(key) ? prev : { ...prev, open: [...prev.open, key] },
      ),
    [write],
  );
  const toggleBranch = useCallback(
    (key: string) =>
      write((prev) => ({
        ...prev,
        open: prev.open.includes(key)
          ? prev.open.filter((one) => one !== key)
          : [...prev.open, key],
      })),
    [write],
  );
  const toggleSection = useCallback(
    (title: string) =>
      write((prev) => ({
        ...prev,
        shut: prev.shut.includes(title)
          ? prev.shut.filter((one) => one !== title)
          : [...prev.shut, title],
      })),
    [write],
  );

  return { memory, openBranch, toggleBranch, toggleSection };
}

type Memory = ReturnType<typeof useNavMemory>;

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
};

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const snapshot = useSnapshot();
  const memory = useNavMemory();
  const index =
    snapshot.status === "ready" ? buildIndex(snapshot.snapshot) : null;

  return (
    <aside
      className={cn(
        // The rail scrolls itself at every width. As a drawer it is a fixed
        // box the page cannot scroll for it, so its own overflow is the only
        // way to the rows past the fold. It clears the header and stops at the
        // dynamic viewport, so a mobile browser's own chrome never covers the
        // last row and the safe-area pad clears the home indicator.
        "top-16 h-[calc(100dvh-4rem)] w-72 shrink-0 overflow-y-auto overscroll-contain border-border border-r bg-sidebar pb-[env(safe-area-inset-bottom)]",
        "[scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]",
        // Drawer. Below the header's z-50 so its close button stays reachable.
        "max-lg:fixed max-lg:left-0 max-lg:z-40 max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
        // `invisible` rather than a bare translate: an off-screen drawer must
        // also be out of the focus order.
        open
          ? "max-lg:translate-x-0"
          : "max-lg:invisible max-lg:-translate-x-full",
        "lg:visible lg:sticky lg:w-64 lg:translate-x-0 motion-reduce:transition-none",
      )}
      data-slot="manual-sidebar"
    >
      <div className="flex flex-col gap-5 px-3 py-6">
        {FIXED_ENTRIES.length > 0 ? (
          <nav aria-label="Manual">
            <ul className="space-y-0.5">
              {FIXED_ENTRIES.map((entry) => (
                <li key={entry.to}>
                  <NavLink
                    className={({ isActive }: { isActive: boolean }) =>
                      cn(ROW, isActive && "bg-muted font-medium")
                    }
                    end
                    onClick={onNavigate}
                    to={entry.to}
                  >
                    <entry.icon aria-hidden size={16} />
                    {entry.label}
                  </NavLink>
                  <RowSections onNavigate={onNavigate} to={entry.to} />
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {index === null ? (
          <Text as="p" className="px-4" size="xs" tone="secondary">
            Navigation appears once the snapshot is in hand.
          </Text>
        ) : (
          <nav
            aria-label="Manual contents"
            className={cn("flex flex-col gap-5", FIXED_ENTRIES.length > 0 ? "pt-4 border-t border-border-subtle" : "")}
          >
            {index.groups.map((group) => (
              <GroupSection
                group={group}
                key={group.title}
                memory={memory}
                onNavigate={onNavigate}
              />
            ))}
            {index.topicGroups.map((group) => (
              <FlatSection
                items={group.topics}
                key={group.title}
                memory={memory}
                onNavigate={onNavigate}
                title={group.title}
              />
            ))}
            <FlatSection
              items={index.guides}
              memory={memory}
              onNavigate={onNavigate}
              title="Guides"
            />
            <FlatSection
              items={index.references}
              memory={memory}
              onNavigate={onNavigate}
              title="References"
              to={REFERENCES_ROUTE}
            />
            <IncubatingSection
              items={index.incubating}
              memory={memory}
              onNavigate={onNavigate}
            />
          </nav>
        )}

        <NewPageAction />
      </div>
    </aside>
  );
}

function SectionHeading({
  title,
  collapsed,
  onToggle,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-expanded={!collapsed}
      className="flex w-full cursor-pointer items-center gap-1 rounded-(--radius-md) px-3 py-1 text-left text-secondary-foreground text-xs uppercase tracking-wide transition-colors hover:text-foreground"
      onClick={onToggle}
      type="button"
    >
      {collapsed ? (
        <CaretRight aria-hidden size={12} weight="bold" />
      ) : (
        <CaretDown aria-hidden size={12} weight="bold" />
      )}
      <span className="font-medium">{title}</span>
    </button>
  );
}

function GroupSection({
  group,
  memory,
  onNavigate,
}: {
  group: NavGroup;
  memory: Memory;
  onNavigate: () => void;
}) {
  const collapsed = memory.memory.shut.includes(group.title);
  const flat = soleProduct(group);

  return (
    <div>
      <SectionHeading
        collapsed={collapsed}
        onToggle={() => memory.toggleSection(group.title)}
        title={group.title}
      />
      {collapsed ? null : (
        <ul className="mt-1 space-y-0.5 pl-5">
          {flat ? (
            <CapabilityRows onNavigate={onNavigate} product={flat} />
          ) : (
            group.products.map((product) => (
              <ProductBranch
                branchKey={`${group.title}/${product.id}`}
                key={product.id}
                memory={memory}
                onNavigate={onNavigate}
                product={product}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
}

/** A product's capabilities and incubating entries, as the `<li>` rows either
 * a branch nests or a flattened group lists directly. */
function CapabilityRows({
  product,
  onNavigate,
}: {
  product: NavProduct;
  onNavigate: () => void;
}) {
  return (
    <>
      {product.capabilities.map((capability) => (
        <li key={capability.id}>
          <LeafLink item={capability} onNavigate={onNavigate} />
        </li>
      ))}
      {product.incubating.map((one) => (
        <li key={one.specId}>
          <IncubatingLink incubating={one} onNavigate={onNavigate} />
        </li>
      ))}
    </>
  );
}

function ProductBranch({
  product,
  branchKey,
  memory,
  onNavigate,
}: {
  product: NavProduct;
  branchKey: string;
  memory: Memory;
  onNavigate: () => void;
}) {
  const { pathname } = useLocation();
  const { openBranch } = memory;
  // Only a page this branch itself lists pulls it open — a capability filed
  // under Admin opens the Admin branch, not the product's own.
  const holdsPage =
    pathname === product.to ||
    product.capabilities.some((one) => one.to === pathname);
  useEffect(() => {
    if (holdsPage) openBranch(branchKey);
  }, [holdsPage, branchKey, openBranch]);

  const expanded = memory.memory.open.includes(branchKey);
  const expandable =
    product.capabilities.length > 0 || product.incubating.length > 0;

  return (
    <li>
      <div className="flex items-center gap-0.5">
        <NavLink
          className={({ isActive }: { isActive: boolean }) =>
            cn(ROW, "min-w-0 flex-1", isActive && "bg-muted font-medium")
          }
          end
          onClick={onNavigate}
          to={product.to}
        >
          <span className="min-w-0 flex-1 truncate">{product.title}</span>
          {product.changeCount > 0 ? (
            <Badge className="tabular-nums" size="sm" variant="outline">
              {product.changeCount}
            </Badge>
          ) : null}
        </NavLink>
        {expandable ? (
          <button
            aria-expanded={expanded}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${product.title}`}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-(--radius-md) text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => memory.toggleBranch(branchKey)}
            type="button"
          >
            {expanded ? (
              <CaretDown aria-hidden size={12} weight="bold" />
            ) : (
              <CaretRight aria-hidden size={12} weight="bold" />
            )}
          </button>
        ) : (
          <span aria-hidden className="size-6 shrink-0" />
        )}
      </div>

      {expanded && expandable ? (
        <ul className="mt-0.5 ml-3 space-y-0.5 border-border-subtle border-l pl-2">
          <CapabilityRows onNavigate={onNavigate} product={product} />
        </ul>
      ) : null}
    </li>
  );
}

/**
 * A capability that exists only as a delta. It has no page to link to, so this
 * points at the change writing it — otherwise the only way to learn the
 * capability is being built is to already know its change by name.
 */
function IncubatingLink({
  incubating,
  onNavigate,
}: {
  incubating: Incubating;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      className={cn(ROW, "text-secondary-foreground hover:text-foreground")}
      onClick={onNavigate}
      title={`${incubating.specId} — introduced by ${incubating.change.title}`}
      to={`/in-flight/${incubating.change.id}`}
    >
      <span className="min-w-0 flex-1 truncate italic">{incubating.title}</span>
      <CapabilityPip status="incubating" />
    </NavLink>
  );
}

/** `to` gives the section a landing of its own, listed first. */
function FlatSection({
  title,
  items,
  memory,
  onNavigate,
  to,
}: {
  title: string;
  items: NavItem[];
  memory: Memory;
  onNavigate: () => void;
  to?: string;
}) {
  const collapsed = memory.memory.shut.includes(title);
  if (items.length === 0) return null;

  return (
    <div>
      <SectionHeading
        collapsed={collapsed}
        onToggle={() => memory.toggleSection(title)}
        title={title}
      />
      {collapsed ? null : (
        <ul className="mt-1 space-y-0.5 pl-5">
          {to ? (
            <li>
              <NavLink
                className={({ isActive }: { isActive: boolean }) =>
                  cn(ROW, isActive && "bg-muted font-medium")
                }
                end
                onClick={onNavigate}
                to={to}
              >
                <BookOpenText aria-hidden size={16} />
                What a reference is
              </NavLink>
              <RowSections onNavigate={onNavigate} to={to} />
            </li>
          ) : null}
          {items.map((item) => (
            <li key={item.id}>
              <LeafLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The delta-only capabilities whose product has no branch of its own — an
 * inventory nobody has written a page for yet is the easiest thing in the store
 * to lose entirely. */
function IncubatingSection({
  items,
  memory,
  onNavigate,
}: {
  items: Incubating[];
  memory: Memory;
  onNavigate: () => void;
}) {
  const collapsed = memory.memory.shut.includes("Incubating");
  if (items.length === 0) return null;

  return (
    <div>
      <SectionHeading
        collapsed={collapsed}
        onToggle={() => memory.toggleSection("Incubating")}
        title="Incubating"
      />
      {collapsed ? null : (
        <ul className="mt-1 space-y-0.5 pl-5">
          {items.map((one) => (
            <li key={one.specId}>
              <IncubatingLink incubating={one} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LeafLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  return (
    <>
      <NavLink
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            ROW,
            "text-secondary-foreground hover:text-foreground",
            isActive && "bg-muted font-medium text-foreground",
          )
        }
        onClick={onNavigate}
        to={item.to}
      >
        <span className="min-w-0 flex-1 truncate">{item.title}</span>
        <CapabilityPip status={item.status} />
      </NavLink>
      <RowSections onNavigate={onNavigate} to={item.to} />
    </>
  );
}

/**
 * The third level: the sections of the page being read, under its own row.
 * Only a page has them — a product branch is a shelf of pages, and an
 * incubating entry points at a change rather than at a page.
 */
function RowSections({
  to,
  onNavigate,
}: {
  to: string;
  onNavigate: () => void;
}) {
  const { pathname } = useLocation();
  const { sections, active } = use(PageSectionsContext);
  const listed = navSections(sections);

  if (to !== pathname || listed.length === 0) return null;

  return (
    <SectionLinks
      active={active}
      className="mt-0.5 mb-1 ml-4 pl-1"
      onNavigate={onNavigate}
      sections={listed}
    />
  );
}
