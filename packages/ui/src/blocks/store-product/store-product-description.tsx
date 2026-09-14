import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
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
        id={descriptionId}
        ref={descriptionRef}
        className={cn(
          "leading-snug text-muted-foreground",
          !expanded && overflows && "line-clamp-3",
        )}
      >
        {description}
      </p>
      {overflows ? (
        <Button
          aria-controls={descriptionId}
          aria-expanded={expanded}
          className="self-start"
          onClick={() => setExpanded((value) => !value)}
          size="sm"
          variant="ghost"
        >
          {expanded ? copy.showLess : copy.showMore}
        </Button>
      ) : null}
    </VStack>
  );
}

export type { StoreProductDescriptionCopy, StoreProductDescriptionProps };
export { StoreProductDescription };
