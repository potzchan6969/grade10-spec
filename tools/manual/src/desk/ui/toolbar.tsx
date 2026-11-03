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
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { CaretDown, X } from "@phosphor-icons/react";
import { SURFACE_LABEL, SURFACES, type Surface } from "../../api/desk";
import {
  FILTER_LABEL,
  FILTERS,
  type FilterKey,
  type Filters,
  filterOptions,
  filterValueLabel,
  type RunReading,
} from "../model";

/** Which surface this device marks, and what the list shows. */
export function Toolbar({
  reading,
  surface,
  filters,
  shown,
  phaseName,
  onSurface,
  onFilter,
}: {
  reading: RunReading;
  surface: Surface;
  filters: Filters;
  shown: number;
  phaseName: (id: string) => string;
  onSurface: (surface: Surface) => void;
  onFilter: (key: FilterKey, value: string | undefined) => void;
}) {
  const label = (key: FilterKey, value: string) =>
    key === "phase" ? phaseName(value) : filterValueLabel(key, value);
  const total = reading.view.spec.cases.length;
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
      {FILTERS.map((key) => {
        const options = filterOptions(reading, key, surface);
        const chosen = filters[key];
        if (options.length < 2 && !chosen) return null;
        if (chosen)
          return (
            <FilterChip
              aria-label={`Remove the ${FILTER_LABEL[key]} filter`}
              key={key}
              onClick={() => onFilter(key, undefined)}
              selected
              size="sm"
              trailing={<X aria-hidden />}
            >
              {FILTER_LABEL[key]}: {label(key, chosen)}
            </FilterChip>
          );
        return (
          <DropdownMenu key={key}>
            <DropdownMenuTrigger
              render={
                <FilterChip size="sm" trailing={<CaretDown aria-hidden />} />
              }
            >
              {FILTER_LABEL[key]}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit min-w-40">
              <DropdownMenuRadioGroup
                onValueChange={(value: string) => onFilter(key, value)}
                value={chosen ?? ""}
              >
                {options.map((value) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {label(key, value)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
      {shown < total ? (
        <Text as="span" size="xs" tone="secondary">
          showing {shown} of {total} cases
        </Text>
      ) : null}
    </div>
  );
}
