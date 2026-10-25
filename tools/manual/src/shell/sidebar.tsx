import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { BookOpenText, CaretDown, CaretRight } from "@phosphor-icons/react";
import { type MouseEvent, use, useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import type { NavGroup, NavItem, NavProduct } from "../api/derive";
import { buildIndex, REFERENCES_ROUTE, soleProduct } from "../api/derive";
import { useSnapshot } from "../api/snapshot-provider";
import { CapabilityPip } from "../blocks/capability-status";
import { PageIcon } from "../blocks/page-icon";
import { browserKeyStore, STORAGE } from "../editor/config";
import { NewPageAction } from "../editor/edit-actions";
import {
  navSections,
  PageSectionsContext,
  SectionLinks,
} from "./page-sections";

/** One row shape for everything in the rail — the fixed views, products and
 * leaves differ in tone, never in geometry. */
const ROW =
  "flex h-8 items-center gap-2 rounded-(--radius-md) px-2 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * What this reader holds open. The rail used to follow the route alone, so
 * leaving a product — or following an incubating entry onto the Board —
 * snapped the branch shut under the reader. Now a branch opens when
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
        "top-16 h-[calc(100dvh-4rem)] w-76 shrink-0 overflow-y-auto overscroll-contain border-border border-r bg-sidebar pb-[env(safe-area-inset-bottom)]",
        "[scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]",
        // Drawer. Below the header's z-50 so its close button stays reachable.
        "max-lg:fixed max-lg:left-0 max-lg:z-40 max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
        // `invisible` rather than a bare translate: an off-screen drawer must
        // also be out of the focus order.
        open
          ? "max-lg:translate-x-0"
          : "max-lg:invisible max-lg:-translate-x-full",
        "lg:visible lg:sticky lg:w-76 lg:translate-x-0 motion-reduce:transition-none",
      )}
      data-slot="manual-sidebar"
    >
      <div className="flex flex-col gap-5 px-3 py-6">
        {/* One landmark: the fixed views and the store's contents are two
         * lists of the same rail, and two `nav`s named alike gave a screen
         * reader's landmark list two entries a reader could not tell apart.
         * The divider is the second list's own top border. */}
        <nav aria-label="Manual">
          <ul className="space-y-0.5"></ul>

          {index === null ? (
            <Text as="p" className="px-4 pt-5" size="xs" tone="secondary">
              Navigation appears once the snapshot is in hand.
            </Text>
          ) : (
            <div className="mt-5 flex flex-col gap-5 border-border-subtle border-t pt-4">
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
            </div>
          )}
        </nav>

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
  const expandable = product.capabilities.length > 0;
  const active = pathname === product.to;

  return (
    <li>
      {/* One target: the row opens the product, and folds it only once the
       * reader is already on it, so a click never both leaves a page and
       * hides the rows under it. */}
      <NavLink
        aria-expanded={expandable ? expanded : undefined}
        className={cn(ROW, active && "bg-muted font-medium")}
        end
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (active) {
            event.preventDefault();
            memory.toggleBranch(branchKey);
            return;
          }
          openBranch(branchKey);
          onNavigate();
        }}
        to={product.to}
      >
        {/* The slot is kept whether or not the domain wears a glyph, so one
         * missing icon never ragged-edges the titles beside it. */}
        <span className="flex size-4 shrink-0 items-center justify-center text-secondary-foreground">
          <PageIcon name={product.icon} />
        </span>
        <span className="min-w-0 flex-1 truncate">{product.title}</span>
        {product.changeCount > 0 ? (
          <Badge className="tabular-nums" size="sm" variant="outline">
            {product.changeCount}
          </Badge>
        ) : null}
        {expandable ? (
          <span className="flex size-4 shrink-0 items-center justify-center text-secondary-foreground">
            {expanded ? (
              <CaretDown aria-hidden size={12} weight="bold" />
            ) : (
              <CaretRight aria-hidden size={12} weight="bold" />
            )}
          </span>
        ) : null}
      </NavLink>

      {expanded && expandable ? (
        <ul className="mt-0.5 ml-3 space-y-0.5 border-border-subtle border-l pl-2">
          <CapabilityRows onNavigate={onNavigate} product={product} />
        </ul>
      ) : null}
    </li>
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
        <PageIcon name={item.icon} />
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
