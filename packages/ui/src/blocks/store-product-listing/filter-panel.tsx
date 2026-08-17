import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { CheckboxList } from "@grade10/design-system/components/forms/checkbox-list";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { cn } from "@grade10/design-system/lib/utils";
import { AsyncMessage } from "../shared/async-message";
import type { AsyncState, FilterGroup, FilterSelection } from "./types";

type FilterPanelProps = {
  /** Accessible name for the landmark. Consumer-supplied, like all copy. */
  label: string;
  groups: AsyncState<readonly FilterGroup[]>;
  selection: FilterSelection;
  onFilterChange: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  className?: string;
};

const PANEL_CLASS =
  "flex w-full shrink-0 flex-col gap-6 overflow-hidden rounded-(--radius-xl) border border-border bg-card p-4 xl:w-[260px]";

/**
 * Filter groups with their counts. Figma set `Filter Panel` (`4229:3273`) is a
 * card shell around one or more `Checkbox List` groups — no variant axes.
 *
 * Renderable on its own, so a search-results surface can reuse it without the
 * browse root. The panel reports a selection change and displays what it is
 * given; it never holds the selection, and never recounts what the consumer
 * supplied.
 */
function FilterPanel({
  label,
  groups,
  selection,
  onFilterChange,
  className,
}: FilterPanelProps) {
  return (
    <aside
      aria-label={label}
      className={cn(PANEL_CLASS, className)}
      data-slot="filter-panel"
    >
      {groups.status === "loading" ? (
        <div className="flex flex-col gap-6" data-slot="filter-loading">
          {[0, 1, 2].map((group) => (
            <div className="flex flex-col gap-2" key={group}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      ) : null}

      {groups.status === "empty" || groups.status === "error" ? (
        <AsyncMessage
          action={groups.action}
          message={groups.message}
          slot={`filter-${groups.status}`}
        />
      ) : null}

      {groups.status === "ready"
        ? groups.data
            .filter((group) => group.options.length > 0)
            .map((group) => (
              <CheckboxList key={group.id} label={group.label}>
                {group.options.map((option) => (
                  <CheckboxListInput
                    checked={(selection[group.id] ?? []).includes(option.id)}
                    count={option.count}
                    disabled={option.disabled}
                    key={option.id}
                    onCheckedChange={(checked) =>
                      onFilterChange(group.id, option.id, checked)
                    }
                    size="sm"
                    value={option.id}
                  >
                    {option.label}
                  </CheckboxListInput>
                ))}
              </CheckboxList>
            ))
        : null}
    </aside>
  );
}

export type { FilterPanelProps };
export { FilterPanel };
