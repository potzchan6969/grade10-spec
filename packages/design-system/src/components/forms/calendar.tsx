"use client";

import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@grade10/design-system/components/forms/select";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  type ChangeEvent,
  type ComponentProps,
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type DateRange,
  type DayButtonProps,
  DayPicker,
  type DropdownProps,
  dateMatchModifiers,
  getDefaultClassNames,
  type Matcher,
  useDayPicker,
} from "react-day-picker";

const defaultClassNames = getDefaultClassNames();

const MonthNavContext = createContext<RefObject<boolean> | null>(null);

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isSameMonth(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

function daysOnGrid(month: Date, weekStartsOn: number): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() - weekStartsOn + 7) % 7));
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const end = new Date(last);
  end.setDate(last.getDate() + ((weekStartsOn + 6 - last.getDay() + 7) % 7));
  const days: Date[] = [];
  for (
    const cursor = new Date(start);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    days.push(new Date(cursor));
  }
  return days;
}

function selectedDates(
  selected: Date | Date[] | DateRange | undefined,
): Date[] {
  if (selected == null) {
    return [];
  }
  if (selected instanceof Date) {
    return [selected];
  }
  if (Array.isArray(selected)) {
    return selected;
  }
  return [selected.from, selected.to].filter(
    (date): date is Date => date != null,
  );
}

function isDisabledDate(
  date: Date,
  disabled: Matcher | Matcher[] | undefined,
): boolean {
  if (disabled == null) {
    return false;
  }
  return dateMatchModifiers(date, disabled);
}

function focusDateAfterMonthChange({
  month,
  selected,
  weekStartsOn,
  disabled,
}: {
  month: Date;
  selected: Date | Date[] | DateRange | undefined;
  weekStartsOn: number;
  disabled: Matcher | Matcher[] | undefined;
}): Date | undefined {
  const grid = daysOnGrid(month, weekStartsOn);
  if (grid.length === 0) {
    return undefined;
  }
  const onGrid = selectedDates(selected).find((date) =>
    grid.some((cell) => isSameDay(cell, date)),
  );
  if (onGrid) {
    return onGrid;
  }
  const sample = selectedDates(selected)[0];
  if (sample) {
    const sameDay = new Date(
      month.getFullYear(),
      month.getMonth(),
      sample.getDate(),
    );
    if (
      isSameMonth(sameDay, month) &&
      !isDisabledDate(sameDay, disabled) &&
      grid.some((cell) => isSameDay(cell, sameDay))
    ) {
      return sameDay;
    }
  }
  return grid.find((date) => !isDisabledDate(date, disabled)) ?? grid[0];
}

function CalendarRoot({
  className,
  rootRef,
  ...props
}: ComponentProps<"div"> & { rootRef?: ComponentProps<"div">["ref"] }) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn("w-fit", className)}
      {...props}
    />
  );
}

function isMonthDropdown(options: DropdownProps["options"]): boolean {
  return (
    (options?.length ?? 0) > 0 &&
    (options?.length ?? 0) <= 12 &&
    (options ?? []).every((option) => option.value >= 0 && option.value <= 11)
  );
}

function shortMonthName(monthIndex: number, localeCode: string): string {
  return new Date(2020, monthIndex, 1).toLocaleDateString(localeCode, {
    month: "short",
  });
}

function CalendarDropdown({
  options,
  value,
  onChange,
  disabled,
  className,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const allowMonthNav = useContext(MonthNavContext);
  const { dayPickerProps } = useDayPicker();
  const selected = value === undefined ? null : String(value);
  const monthMenu = isMonthDropdown(options);
  const localeCode = dayPickerProps.locale?.code ?? "en";
  const selectedMonth = options?.find(
    (option) => String(option.value) === selected,
  );
  const triggerLabel =
    monthMenu && selectedMonth != null
      ? shortMonthName(selectedMonth.value, localeCode)
      : undefined;
  return (
    <Select
      disabled={disabled}
      items={(options ?? []).map((option) => ({
        label: option.label,
        value: String(option.value),
      }))}
      modal={false}
      onValueChange={(next) => {
        if (next == null) {
          return;
        }
        if (allowMonthNav) {
          allowMonthNav.current = true;
        }
        onChange?.({
          target: { value: next },
        } as ChangeEvent<HTMLSelectElement>);
      }}
      value={selected}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "h-8 w-fit min-w-0 gap-1 border-0 bg-transparent px-2 text-sm font-medium shadow-none hover:bg-muted",
          className,
        )}
      >
        {triggerLabel == null ? (
          <SelectValue />
        ) : (
          <SelectValue>{triggerLabel}</SelectValue>
        )}
      </SelectTrigger>
      <SelectContent align="center" alignItemWithTrigger={false}>
        {(options ?? []).map((option) => (
          <SelectItem
            disabled={option.disabled}
            key={option.value}
            value={String(option.value)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function isAriaDisabled(value: unknown): boolean {
  return value === true || value === "true";
}

function CalendarPreviousMonthButton({
  children: _children,
  className,
  disabled,
  "aria-disabled": ariaDisabled,
  onClick,
  ...props
}: ComponentProps<"button">) {
  const allowMonthNav = useContext(MonthNavContext);
  return (
    <IconButton
      className={className}
      disabled={disabled || isAriaDisabled(ariaDisabled)}
      onClick={(event) => {
        if (allowMonthNav) {
          allowMonthNav.current = true;
        }
        onClick?.(event);
      }}
      variant="outline"
      {...props}
    >
      <CaretLeft />
    </IconButton>
  );
}

function CalendarNextMonthButton({
  children: _children,
  className,
  disabled,
  "aria-disabled": ariaDisabled,
  onClick,
  ...props
}: ComponentProps<"button">) {
  const allowMonthNav = useContext(MonthNavContext);
  return (
    <IconButton
      className={className}
      disabled={disabled || isAriaDisabled(ariaDisabled)}
      onClick={(event) => {
        if (allowMonthNav) {
          allowMonthNav.current = true;
        }
        onClick?.(event);
      }}
      variant="outline"
      {...props}
    >
      <CaretRight />
    </IconButton>
  );
}

function CalendarCaptionLabel({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("text-sm font-medium", className)} {...props} />;
}

function isDateOnDisplayedGrid(
  date: Date,
  months: ReturnType<typeof useDayPicker>["months"],
): boolean {
  return months.some((calendarMonth) =>
    calendarMonth.weeks.some((week) =>
      week.days.some((cell) => isSameDay(cell.date, date)),
    ),
  );
}

function moveDate(
  date: Date,
  key: string,
  weekStartsOn: number,
): Date | undefined {
  const next = new Date(date);
  switch (key) {
    case "ArrowLeft":
      next.setDate(next.getDate() - 1);
      return next;
    case "ArrowRight":
      next.setDate(next.getDate() + 1);
      return next;
    case "ArrowUp":
      next.setDate(next.getDate() - 7);
      return next;
    case "ArrowDown":
      next.setDate(next.getDate() + 7);
      return next;
    case "Home": {
      next.setDate(next.getDate() - ((next.getDay() - weekStartsOn + 7) % 7));
      return next;
    }
    case "End": {
      next.setDate(
        next.getDate() - ((next.getDay() - weekStartsOn + 7) % 7) + 6,
      );
      return next;
    }
    default:
      return undefined;
  }
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  onKeyDown,
  ...props
}: DayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { months, dayPickerProps } = useDayPicker();
  const weekStartsOn = dayPickerProps.weekStartsOn ?? 0;
  useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      {...props}
      ref={ref}
      className={cn(
        className,
        "relative flex size-8 items-center justify-center rounded-full text-sm text-foreground tabular-nums",
        "transition-[background-color,color,transform] duration-150 ease-out",
        "hover:bg-muted active:scale-95",
        "motion-reduce:transition-none motion-reduce:active:scale-100",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        modifiers.selected &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        modifiers.today && !modifiers.selected && "bg-muted text-foreground",
        modifiers.outside && !modifiers.selected && "text-secondary-foreground",
        modifiers.disabled &&
          "pointer-events-none text-muted-foreground/40 line-through hover:bg-transparent",
      )}
      data-calendar-day={day.isoDate}
      data-day={day.isoDate}
      data-disabled={modifiers.disabled || undefined}
      data-outside={modifiers.outside || undefined}
      data-selected={modifiers.selected || undefined}
      data-today={modifiers.today || undefined}
      onKeyDown={(event) => {
        if (event.key === "PageUp" || event.key === "PageDown") {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (
          event.shiftKey &&
          (event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowDown")
        ) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        const gridKeys = [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ];
        if (gridKeys.includes(event.key)) {
          let cursor = new Date(day.date);
          let pickableOnGrid = false;
          for (let attempt = 0; attempt < 366; attempt += 1) {
            const stepped = moveDate(cursor, event.key, weekStartsOn);
            if (stepped == null) {
              break;
            }
            if (event.key === "Home" || event.key === "End") {
              if (!isDateOnDisplayedGrid(stepped, months)) {
                break;
              }
              if (!isDisabledDate(stepped, dayPickerProps.disabled)) {
                pickableOnGrid = true;
              }
              break;
            }
            if (!isDateOnDisplayedGrid(stepped, months)) {
              break;
            }
            if (!isDisabledDate(stepped, dayPickerProps.disabled)) {
              pickableOnGrid = true;
              break;
            }
            cursor = stepped;
          }
          if (!pickableOnGrid) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
        }
        onKeyDown?.(event);
      }}
      type="button"
    />
  );
}

type CalendarProps = ComponentProps<typeof DayPicker>;

const DEFAULT_START_MONTH = new Date(new Date().getFullYear() - 10, 0);
const DEFAULT_END_MONTH = new Date(new Date().getFullYear() + 10, 11);

/**
 * Month grid wrapping react-day-picker, drawn with Icon Button, Select, and
 * the theme tokens. Sunday-first weeks. Caption is previous/next in one
 * row with the month and year: both as dropdowns, month dropdown with a
 * fixed year, or a single label (`captionLayout`).
 *
 * Overflow days are selectable and do not move the caption. Only chevrons
 * and the month/year dropdowns change month. The month dropdown uses the
 * The month dropdown trigger uses the locale's short month name (`Sep`) so
 * the caption width holds while paging; the open list uses the full name
 * (`September`). Arrow / Page / Home / End stay on this grid.
 * Unselectable days are the caller's `disabled` matcher.
 *
 * **No Figma component set yet** — Storybook-first. Do not add variant axes
 * until design publishes Calendar.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  weekStartsOn = 0,
  navLayout = "around",
  startMonth = DEFAULT_START_MONTH,
  endMonth = DEFAULT_END_MONTH,
  animate = false,
  components,
  formatters,
  today,
  month,
  defaultMonth,
  onMonthChange,
  disabled,
  ...props
}: CalendarProps) {
  const todayDate = today ?? new Date();
  const selected = "selected" in props ? props.selected : undefined;
  const allowMonthNav = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [displayMonth, setDisplayMonth] = useState(() =>
    startOfMonth(month ?? defaultMonth ?? todayDate),
  );

  useEffect(() => {
    if (!month) {
      return;
    }
    setDisplayMonth((current) =>
      isSameMonth(current, month) ? current : startOfMonth(month),
    );
  }, [month]);

  const focusDay = useCallback(
    (nextMonth: Date) => {
      const target = focusDateAfterMonthChange({
        disabled,
        month: nextMonth,
        selected,
        weekStartsOn,
      });
      if (target == null) {
        return;
      }
      const year = String(target.getFullYear());
      const monthPart = String(target.getMonth() + 1).padStart(2, "0");
      const dayPart = String(target.getDate()).padStart(2, "0");
      const iso = `${year}-${monthPart}-${dayPart}`;
      requestAnimationFrame(() => {
        rootRef.current
          ?.querySelector<HTMLButtonElement>(`[data-calendar-day="${iso}"]`)
          ?.focus();
      });
    },
    [disabled, selected, weekStartsOn],
  );

  const handleMonthChange = useCallback(
    (nextMonth: Date) => {
      if (!allowMonthNav.current) {
        return;
      }
      allowMonthNav.current = false;
      setDisplayMonth(startOfMonth(nextMonth));
      onMonthChange?.(nextMonth);
      focusDay(nextMonth);
    },
    [focusDay, onMonthChange],
  );

  return (
    <MonthNavContext.Provider value={allowMonthNav}>
      <div className="w-fit" ref={rootRef}>
        <DayPicker
          {...props}
          animate={animate}
          captionLayout={captionLayout}
          className={className}
          classNames={{
            root: cn("w-fit", defaultClassNames.root),
            months: cn(
              "relative flex flex-col gap-4",
              defaultClassNames.months,
            ),
            month: cn(
              "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-4",
              defaultClassNames.month,
            ),
            month_caption: cn(
              "col-start-2 flex min-h-8 items-center justify-center",
              defaultClassNames.month_caption,
            ),
            caption_label: cn(
              "text-sm font-medium",
              defaultClassNames.caption_label,
            ),
            nav: cn(
              "col-span-3 flex items-center justify-between",
              defaultClassNames.nav,
            ),
            button_previous: cn(
              "col-start-1 row-start-1",
              defaultClassNames.button_previous,
            ),
            button_next: cn(
              "col-start-3 row-start-1",
              defaultClassNames.button_next,
            ),
            dropdowns: cn(
              "flex items-center justify-center gap-1 text-sm font-medium [&>span]:text-sm [&>span]:font-medium",
              defaultClassNames.dropdowns,
            ),
            dropdown_root: cn(defaultClassNames.dropdown_root),
            dropdown: cn(defaultClassNames.dropdown),
            month_grid: cn(
              "col-span-3 w-full border-separate border-spacing-[2px]",
              defaultClassNames.month_grid,
            ),
            weekdays: cn(defaultClassNames.weekdays),
            weekday: cn(
              "size-8 text-center text-sm font-normal text-secondary-foreground",
              defaultClassNames.weekday,
            ),
            week: cn(defaultClassNames.week),
            day: cn("p-0 text-center", defaultClassNames.day),
            today: cn(defaultClassNames.today),
            selected: cn(defaultClassNames.selected),
            disabled: cn(defaultClassNames.disabled),
            outside: cn(defaultClassNames.outside),
            hidden: cn("invisible", defaultClassNames.hidden),
            ...classNames,
          }}
          components={{
            Root: CalendarRoot,
            CaptionLabel: CalendarCaptionLabel,
            DayButton: CalendarDayButton,
            Dropdown: CalendarDropdown,
            PreviousMonthButton: CalendarPreviousMonthButton,
            NextMonthButton: CalendarNextMonthButton,
            ...components,
          }}
          disabled={disabled}
          endMonth={endMonth}
          formatters={{
            formatWeekdayName: (date) =>
              date.toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
            ...formatters,
          }}
          month={displayMonth}
          navLayout={navLayout}
          onMonthChange={handleMonthChange}
          showOutsideDays={showOutsideDays}
          startMonth={startMonth}
          today={todayDate}
          weekStartsOn={weekStartsOn}
        />
      </div>
    </MonthNavContext.Provider>
  );
}

export type { CalendarProps };
export { Calendar };
