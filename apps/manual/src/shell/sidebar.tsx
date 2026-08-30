import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import {
  CaretDown,
  CaretRight,
  ClipboardText,
  ClockCounterClockwise,
  House,
  type Icon,
  Kanban,
  PenNib,
} from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import type { Incubating, NavGroup, NavItem, NavProduct } from "../api/derive";
import { buildIndex } from "../api/derive";
import { useSnapshot } from "../api/snapshot-provider";
import { CapabilityPip } from "../blocks/capability-status";
import { NewPageAction } from "../editor/edit-actions";

const FIXED_ENTRIES: { to: string; label: string; icon: Icon }[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/recent", label: "Recent", icon: ClockCounterClockwise },
  { to: "/planning", label: "Planning", icon: Kanban },
  { to: "/qa", label: "QA", icon: ClipboardText },
  { to: "/design", label: "Design", icon: PenNib },
];

/** One row shape for everything in the rail — the fixed views, products and
 * leaves differ in tone, never in geometry. */
const ROW =
  "flex h-8 items-center gap-2 rounded-(--radius-md) px-2 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50";

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
};

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const snapshot = useSnapshot();
  const index =
    snapshot.status === "ready" ? buildIndex(snapshot.snapshot) : null;

  return (
    <aside
      className={cn(
        "w-72 shrink-0 border-border border-r bg-sidebar",
        "[scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]",
        // Below the header's z-50 so its close button stays reachable.
        "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:pt-16 max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
        // `invisible` rather than a bare translate: an off-screen drawer must
        // also be out of the focus order.
        open
          ? "max-lg:translate-x-0"
          : "max-lg:invisible max-lg:-translate-x-full",
        "lg:visible lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:w-64 lg:translate-x-0 lg:overflow-y-auto motion-reduce:transition-none",
      )}
      data-slot="manual-sidebar"
    >
      <div className="flex flex-col gap-5 px-3 py-6">
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
              </li>
            ))}
          </ul>
        </nav>

        {index === null ? (
          <Text as="p" className="px-4" size="xs" tone="secondary">
            Navigation appears once the snapshot is in hand.
          </Text>
        ) : (
          <nav
            aria-label="Manual contents"
            className="flex flex-col gap-5 border-border-subtle border-t pt-4"
          >
            {index.groups.map((group) => (
              <GroupSection
                group={group}
                key={group.title}
                onNavigate={onNavigate}
              />
            ))}
            {index.topicGroups.map((group) => (
              <FlatSection
                items={group.topics}
                key={group.title}
                onNavigate={onNavigate}
                title={group.title}
              />
            ))}
            <FlatSection
              items={index.guides}
              onNavigate={onNavigate}
              title="Guides"
            />
            <IncubatingSection
              items={index.incubating}
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
  onNavigate,
}: {
  group: NavGroup;
  onNavigate: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <SectionHeading
        collapsed={collapsed}
        onToggle={() => setCollapsed((on) => !on)}
        title={group.title}
      />
      {collapsed ? null : (
        <ul className="mt-1 space-y-0.5 pl-5">
          {group.products.map((product) => (
            <ProductBranch
              key={product.id}
              onNavigate={onNavigate}
              product={product}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductBranch({
  product,
  onNavigate,
}: {
  product: NavProduct;
  onNavigate: () => void;
}) {
  const { pathname } = useLocation();
  const onRoute =
    pathname === product.to || pathname.startsWith(`${product.to}/`);
  const [forced, setForced] = useState(false);
  const expanded = onRoute || forced;
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
            onClick={() => setForced((on) => !on)}
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
      to={`/planning#${incubating.change.id}`}
    >
      <span className="min-w-0 flex-1 truncate italic">{incubating.title}</span>
      <CapabilityPip status="incubating" />
    </NavLink>
  );
}

function FlatSection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  onNavigate: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  if (items.length === 0) return null;

  return (
    <div>
      <SectionHeading
        collapsed={collapsed}
        onToggle={() => setCollapsed((on) => !on)}
        title={title}
      />
      {collapsed ? null : (
        <ul className="mt-1 space-y-0.5 pl-5">
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
  onNavigate,
}: {
  items: Incubating[];
  onNavigate: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  if (items.length === 0) return null;

  return (
    <div>
      <SectionHeading
        collapsed={collapsed}
        onToggle={() => setCollapsed((on) => !on)}
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
  );
}
