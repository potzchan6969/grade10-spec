import { Text } from "@grade10/design-system/components/display/text";
import { FilterChip } from "@grade10/design-system/components/forms/filter-chip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@grade10/design-system/components/forms/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown, Funnel } from "@phosphor-icons/react";
import { useState } from "react";
import { SURFACE_LABEL, SURFACES, type Surface } from "../../api/desk";
import {
  type CaseSort,
  FILTER_LABEL,
  FILTERS,
  type FilterKey,
  type Filters,
  filterOptions,
  filterValueLabel,
  type RunReading,
  SORT_LABEL,
} from "../model";

const SORTS = Object.keys(SORT_LABEL) as CaseSort[];

/** Which surface this device marks, and what the list shows. On a phone the
 * filters wait behind one button, so the case starts on the first screen. */
export function Toolbar({
  reading,
  surface,
  filters,
  sort,
  shown,
  phaseName,
  onSurface,
  onFilter,
  onSort,
}: {
  reading: RunReading;
  surface: Surface;
  filters: Filters;
  sort: CaseSort;
  shown: number;
  phaseName: (id: string) => string;
  onSurface: (surface: Surface) => void;
  onFilter: (key: FilterKey, values: string[]) => void;
  onSort: (sort: CaseSort) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = (key: FilterKey, value: string) =>
    key === "phase" ? phaseName(value) : filterValueLabel(key, value);
  const total = reading.view.spec.cases.length;
  const active = FILTERS.filter((key) => (filters[key] ?? []).length > 0);
  return (
    <div className="flex flex-wrap items-center gap-2" data-slot="desk-toolbar">
      <Text as="span" size="xs" tone="secondary">
        Testing
      </Text>
      <Select
        onValueChange={(next: string | null) => {
          if (next && SURFACES.includes(next as Surface))
            onSurface(next as Surface);
        }}
        value={surface}
      >
        <SelectTrigger aria-label="Your surface" className="w-fit" size="sm">
          <SelectValue>{SURFACE_LABEL[surface]}</SelectValue>
        </SelectTrigger>
        <SelectContent className="w-fit min-w-(--anchor-width)">
          <SelectGroup>
            {SURFACES.map((one) => (
              <SelectItem key={one} value={one}>
                {SURFACE_LABEL[one]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FilterChip
        aria-expanded={open}
        className="lg:hidden"
        onClick={() => setOpen((held) => !held)}
        selected={active.length > 0}
        size="sm"
        trailing={<Funnel aria-hidden />}
      >
        Filters{active.length > 0 ? ` · ${active.length}` : ""}
      </FilterChip>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 max-lg:basis-full",
          !open && "max-lg:hidden",
        )}
        data-slot="desk-filters"
      >
        {FILTERS.map((key) => {
          const options = filterOptions(reading, key);
          const chosen = filters[key] ?? [];
          if (options.length < 2 && chosen.length === 0) return null;
          return (
            <DropdownMenu key={key}>
              <DropdownMenuTrigger
                render={
                  <FilterChip
                    selected={chosen.length > 0}
                    size="sm"
                    trailing={<CaretDown aria-hidden />}
                  />
                }
              >
                {FILTER_LABEL[key]}
                {chosen.length > 0
                  ? `: ${chosen.map((one) => label(key, one)).join(", ")}`
                  : ""}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit min-w-40">
                {options.map((value) => (
                  <DropdownMenuCheckboxItem
                    checked={chosen.includes(value)}
                    closeOnClick={false}
                    key={value}
                    onCheckedChange={(checked: boolean) =>
                      onFilter(
                        key,
                        checked
                          ? [...chosen, value]
                          : chosen.filter((one) => one !== value),
                      )
                    }
                  >
                    {label(key, value)}
                  </DropdownMenuCheckboxItem>
                ))}
                {chosen.length > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onFilter(key, [])}>
                      Clear {FILTER_LABEL[key]}
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
        <Select
          onValueChange={(next: string | null) => {
            if (next && SORTS.includes(next as CaseSort))
              onSort(next as CaseSort);
          }}
          value={sort}
        >
          <SelectTrigger
            aria-label="Order each section's cases by"
            className="w-fit"
            size="sm"
          >
            <SelectValue>
              {sort === "run" ? "Run order" : `By ${SORT_LABEL[sort]}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-fit min-w-(--anchor-width)">
            <SelectGroup>
              {SORTS.map((one) => (
                <SelectItem key={one} value={one}>
                  {one === "run" ? SORT_LABEL[one] : `By ${SORT_LABEL[one]}`}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {shown < total ? (
        <Text as="span" size="xs" tone="secondary">
          showing {shown} of {total} cases
        </Text>
      ) : null}
    </div>
  );
}
