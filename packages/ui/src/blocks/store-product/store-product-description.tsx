import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useId, useState } from "react";

type StoreProductDescriptionProps = {
  description: string;
};

function StoreProductDescription({
  description,
}: StoreProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();
  const hasLongDescription = description.length > 160;

  return (
    <VStack data-slot="store-product-description" gap="sm">
      <Text
        id={descriptionId}
        tone="secondary"
        className={hasLongDescription && !expanded ? "line-clamp-3" : undefined}
      >
        {description}
      </Text>
      {hasLongDescription ? (
        <Button
          aria-controls={descriptionId}
          aria-expanded={expanded}
          className="self-start"
          onClick={() => setExpanded((value) => !value)}
          size="sm"
          variant="ghost"
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      ) : null}
    </VStack>
  );
}

export type { StoreProductDescriptionProps };
export { StoreProductDescription };
