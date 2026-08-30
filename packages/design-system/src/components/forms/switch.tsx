import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const switchVariants = cva(
  "group/switch inline-flex shrink-0 cursor-pointer items-center rounded-(--radius-full) bg-background-strong p-0.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        lg: "h-6 w-11",
        md: "h-5 w-9",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-(--radius-full) bg-background shadow-[0_1px_0_var(--shadow-color,rgb(117_114_111_/_20%))] transition-transform duration-150 ease-out motion-reduce:transition-none",
  {
    variants: {
      size: {
        lg: "size-5 group-data-checked/switch:translate-x-5",
        md: "size-4 group-data-checked/switch:translate-x-4",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  },
);

/**
 * A binary toggle control. Lets users turn a single setting on or off.
 *
 * Figma (`2548:237`) draws a pill track with a sliding thumb. Unchecked track
 * is `Base/background-strong`; checked is `Base/primary`. Disabled dims the whole
 * control
 * at `Opacity/opacity-50`. Two sizes: `lg` (44×24, 20px thumb) and `md` (36×20,
 * 16px thumb). Track padding is 2px; the thumb slides ~150ms ease.
 */
function Switch({
  className,
  size = "lg",
  ...props
}: SwitchPrimitive.Root.Props & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  );
}

export type SwitchSize = NonNullable<
  VariantProps<typeof switchVariants>["size"]
>;
export { Switch, switchVariants };
