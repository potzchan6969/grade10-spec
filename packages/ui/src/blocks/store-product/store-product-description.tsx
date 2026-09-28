import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

type StoreProductDescriptionCopy = {
  showMore: string;
  showLess: string;
};

type StoreProductDescriptionProps = {
  copy: StoreProductDescriptionCopy;
  description: string;
};

function StoreProductDescription({
  copy,
  description,
}: StoreProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(true);
  const descriptionId = useId();
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || expanded) return;

    const updateOverflow = () => {
      if (element.clientHeight === 0 && element.scrollHeight === 0) return;
      setOverflows(element.scrollHeight > element.clientHeight + 1);
    };

    updateOverflow();

    if (typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [expanded]);

  return (
    <VStack data-slot="store-product-description" gap="sm">
      <p
        className={cn(
          "text-base leading-snug text-foreground",
          !expanded && overflows && "line-clamp-3",
        )}
        id={descriptionId}
        ref={descriptionRef}
      >
        {description}
      </p>
      {overflows ? (
        <Link
          aria-controls={descriptionId}
          aria-expanded={expanded}
          className="self-start"
          onClick={() => setExpanded((value) => !value)}
          render={<button type="button" />}
          trailing={
            <span
              className={cn(
                "inline-flex transition-transform motion-reduce:transition-none",
                expanded && "rotate-180",
              )}
            >
              <CaretDown aria-hidden size={16} />
            </span>
          }
        >
          {expanded ? copy.showLess : copy.showMore}
        </Link>
      ) : null}
    </VStack>
  );
}

export type { StoreProductDescriptionCopy, StoreProductDescriptionProps };
export { StoreProductDescription };
