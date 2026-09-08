import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import type { NavProduct } from "../api/derive";
import { PageIcon } from "../blocks/page-icon";

export function ProductCard({ product }: { product: NavProduct }) {
  return (
    <Link
      className="flex h-full flex-col gap-2 rounded-(--radius-2xl) border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted"
      to={product.to}
    >
      <div className="flex items-start gap-2">
        <PageIcon
          className="mt-0.5 shrink-0 text-secondary-foreground"
          name={product.icon}
        />
        <Text as="span" className="min-w-0 flex-1" weight="bold">
          {product.title}
        </Text>
        {product.changeCount > 0 ? (
          <Badge size="sm" variant="warning">
            {product.changeCount} in flight
          </Badge>
        ) : null}
      </div>

      {product.summary ? (
        <Text as="p" className="flex-1" size="sm" tone="secondary">
          {product.summary}
        </Text>
      ) : (
        <Text as="p" className="flex-1" size="sm" tone="secondary">
          No landing page written yet.
        </Text>
      )}

      <Text as="span" size="xs" tone="secondary">
        {product.capabilities.length}{" "}
        {product.capabilities.length === 1 ? "capability" : "capabilities"}
      </Text>
    </Link>
  );
}
