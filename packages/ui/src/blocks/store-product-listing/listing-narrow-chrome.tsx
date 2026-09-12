import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxList } from "@grade10/design-system/components/forms/checkbox-list";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { IconProvider } from "@grade10/design-system/components/providers/icon-provider";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown, Check } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import type {
  AsyncState,
  FilterGroup,
  FilterSelection,
  SortOption,
} from "./types";

type ListingNarrowChromeCopy = {
  /** Clears the open facet drawer’s draft only. */
  clear: string;
  /** Applies the open facet drawer’s draft and closes. */
  showResults: string;
};

type ListingNarrowChromeProps = {
  copy: ListingNarrowChromeCopy;
  resultCount: ReactNode;
  sortOptions?: readonly SortOption[];
  sortValue?: string;
  onSortChange?: (optionId: string) => void;
  groups: AsyncState<readonly FilterGroup[]>;
  selection?: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onGroupExpand?: (groupId: string) => void;
  className?: string;
};

type OpenDrawer = { kind: "sort" } | { kind: "facet"; groupId: string } | null;

function facetPillLabel(
  group: FilterGroup,
  selectedIds: readonly string[],
): ReactNode {
  if (selectedIds.length === 0) return group.label;
  if (selectedIds.length === 1) {
    const option = group.options.find((entry) => entry.id === selectedIds[0]);
    return option?.label ?? group.label;
  }
  const compact = group.compactLabel ?? group.label;
  return (
    <>
      {compact} ({selectedIds.length})
    </>
  );
}

function applyGroupDraft(
  groupId: string,
  draftIds: readonly string[],
  appliedIds: readonly string[],
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void,
) {
  if (onFilterChange == null) return;
  const draft = new Set(draftIds);
  const applied = new Set(appliedIds);
  for (const id of applied) {
    if (!draft.has(id)) onFilterChange(groupId, id, false);
  }
  for (const id of draft) {
    if (!applied.has(id)) onFilterChange(groupId, id, true);
  }
}

/**
 * Narrow listing chrome: result count plus sort and facet pills that open
 * bottom drawers. Facet drawers hold a draft until Show Results.
 */
function ListingNarrowChrome({
  copy,
  resultCount,
  sortOptions = [],
  sortValue,
  onSortChange,
  groups,
  selection = {},
  onFilterChange,
  onGroupExpand,
  className,
}: ListingNarrowChromeProps) {
  const [open, setOpen] = useState<OpenDrawer>(null);
  const [draft, setDraft] = useState<readonly string[]>([]);

  const activeSort =
    sortOptions.find((option) => option.id === sortValue) ?? sortOptions[0];
  const sortPillLabel = activeSort?.shortLabel ?? activeSort?.label ?? null;

  const visibleGroups =
    groups.status === "ready"
      ? groups.data.filter((group) => group.options.length > 0)
      : [];

  const openFacetGroup =
    open?.kind === "facet"
      ? visibleGroups.find((group) => group.id === open.groupId)
      : undefined;

  const openSort = () => setOpen({ kind: "sort" });

  const openFacet = (groupId: string) => {
    const group = visibleGroups.find((entry) => entry.id === groupId);
    setDraft([...(selection[groupId] ?? [])]);
    setOpen({ kind: "facet", groupId });
    if (group?.expandLabel != null) onGroupExpand?.(groupId);
  };

  const closeDrawer = () => setOpen(null);

  return (
    <IconProvider>
      <VStack
        className={cn("w-full gap-3", className)}
        data-slot="listing-narrow-chrome"
        gap="none"
      >
        <p
          className="text-2xl font-bold text-foreground"
          data-slot="listing-narrow-chrome-count"
          role="status"
        >
          {resultCount}
        </p>

        <div
          className="-mx-8 overflow-x-auto overscroll-x-contain"
          data-slot="listing-narrow-chrome-pills"
        >
          <HStack
            className="w-max min-w-full flex-nowrap items-center gap-2 px-8"
            gap="none"
          >
            {sortPillLabel != null ? (
              <Button
                className="shrink-0"
                onClick={openSort}
                size="sm"
                trailing={<CaretDown aria-hidden size={14} />}
                type="button"
                variant="secondary"
              >
                {sortPillLabel}
              </Button>
            ) : null}

            {groups.status === "loading"
              ? null
              : visibleGroups.map((group) => (
                  <Button
                    className="shrink-0"
                    key={group.id}
                    onClick={() => openFacet(group.id)}
                    size="sm"
                    trailing={<CaretDown aria-hidden size={14} />}
                    type="button"
                    variant="secondary"
                  >
                    {facetPillLabel(group, selection[group.id] ?? [])}
                  </Button>
                ))}
          </HStack>
        </div>

        <Drawer
          open={open?.kind === "sort"}
          swipeDirection="down"
          onOpenChange={(next) => {
            if (!next) closeDrawer();
          }}
        >
          <DrawerContent aria-label="Sort">
            <DrawerHeader>
              <DrawerTitle>Sort</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="gap-1">
              {sortOptions.map((option) => {
                const selected = option.id === (sortValue ?? activeSort?.id);
                return (
                  <button
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-full px-3 py-3 text-left text-sm font-medium text-foreground hover:bg-muted",
                      selected && "bg-muted",
                    )}
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (!selected) onSortChange?.(option.id);
                      closeDrawer();
                    }}
                  >
                    <span>{option.label}</span>
                    {selected ? <Check aria-hidden size={16} /> : null}
                  </button>
                );
              })}
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Drawer
          open={open?.kind === "facet" && openFacetGroup != null}
          swipeDirection="down"
          onOpenChange={(next) => {
            if (!next) closeDrawer();
          }}
        >
          {openFacetGroup != null ? (
            <DrawerContent
              aria-label={String(openFacetGroup.label)}
              className="[--drawer-content-max-height:80dvh]"
            >
              <DrawerHeader>
                <DrawerTitle>{openFacetGroup.label}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <CheckboxList>
                  {openFacetGroup.options.map((option) => {
                    const selected = draft.includes(option.id);
                    return (
                      <CheckboxListInput
                        checked={selected}
                        count={option.count}
                        disabled={option.disabled}
                        key={option.id}
                        size="sm"
                        onCheckedChange={(next) => {
                          setDraft((current) =>
                            next === true
                              ? current.includes(option.id)
                                ? current
                                : [...current, option.id]
                              : current.filter((id) => id !== option.id),
                          );
                        }}
                      >
                        {option.label}
                      </CheckboxListInput>
                    );
                  })}
                </CheckboxList>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  className="w-full"
                  size="sm"
                  type="button"
                  onClick={() => {
                    applyGroupDraft(
                      openFacetGroup.id,
                      draft,
                      selection[openFacetGroup.id] ?? [],
                      onFilterChange,
                    );
                    closeDrawer();
                  }}
                >
                  {copy.showResults}
                </Button>
                <Button
                  className="w-full"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setDraft([])}
                >
                  {copy.clear}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          ) : null}
        </Drawer>
      </VStack>
    </IconProvider>
  );
}

export type { ListingNarrowChromeCopy, ListingNarrowChromeProps };
export { ListingNarrowChrome };
