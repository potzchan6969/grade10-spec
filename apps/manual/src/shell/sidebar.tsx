import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { NavigationLink } from "@grade10/design-system/components/layout/navigation-link";
import { NavigationList } from "@grade10/design-system/components/layout/navigation-list";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import type { NavGroup, NavItem, NavProduct } from "../api/derive";
import { buildIndex } from "../api/derive";
import { useSnapshot } from "../api/snapshot-provider";
import { NewPageAction } from "../editor/edit-actions";

const FIXED_ENTRIES = [
  { to: "/", label: "Home" },
  { to: "/planning", label: "Planning" },
];

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
};

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const snapshot = useSnapshot();
  const { pathname } = useLocation();
  const index =
    snapshot.status === "ready" ? buildIndex(snapshot.snapshot) : null;

  return (
    <aside
      className={cn(
        "w-72 shrink-0 border-border border-r bg-sidebar",
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
        <NavigationList
          aria-label="Manual"
          className="flex-col items-stretch gap-1"
        >
          {FIXED_ENTRIES.map((entry) => (
            <NavigationLink
              active={pathname === entry.to}
              className="h-9 justify-start"
              key={entry.to}
              render={<NavLink onClick={onNavigate} to={entry.to} />}
            >
              {entry.label}
            </NavigationLink>
          ))}
        </NavigationList>

        {index === null ? (
          <Text as="p" className="px-4" size="xs" tone="secondary">
            Navigation appears once the snapshot is in hand.
          </Text>
        ) : (
          <nav aria-label="Manual contents" className="flex flex-col gap-5">
            {index.groups.map((group) => (
              <GroupSection
                group={group}
                key={group.title}
                onNavigate={onNavigate}
              />
            ))}
            <FlatSection
              items={index.topics}
              onNavigate={onNavigate}
              title="Cross-cutting"
            />
            <FlatSection
              items={index.guides}
              onNavigate={onNavigate}
              title="Guides"
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
        <ul className="mt-1 space-y-0.5">
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

  return (
    <li>
      <div className="flex items-center gap-0.5">
        {product.capabilities.length > 0 ? (
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

        <NavLink
          className={({ isActive }: { isActive: boolean }) =>
            cn(
              "flex h-8 min-w-0 flex-1 items-center gap-2 rounded-(--radius-md) px-2 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive && "bg-muted font-medium",
            )
          }
          end
          onClick={onNavigate}
          to={product.to}
        >
          <span className="min-w-0 flex-1 truncate">{product.title}</span>
          {product.changeCount > 0 ? (
            <Badge size="sm" variant="warning">
              {product.changeCount}
            </Badge>
          ) : null}
        </NavLink>
      </div>

      {expanded && product.capabilities.length > 0 ? (
        <ul className="mt-0.5 ml-3 space-y-0.5 border-border-subtle border-l pl-2">
          {product.capabilities.map((capability) => (
            <li key={capability.id}>
              <LeafLink item={capability} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
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
        <ul className="mt-1 ml-6 space-y-0.5">
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
    <NavLink
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          "flex h-8 items-center rounded-(--radius-md) px-2 text-secondary-foreground text-sm outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
          isActive && "bg-muted font-medium text-foreground",
        )
      }
      onClick={onNavigate}
      to={item.to}
    >
      <span className="truncate">{item.title}</span>
    </NavLink>
  );
}
