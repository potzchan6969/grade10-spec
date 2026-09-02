import { Text } from "@grade10/design-system/components/display/text";
import type { ReactNode } from "react";

type PageHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  summary?: string;
  children?: ReactNode;
};

export function PageHeading({
  eyebrow,
  title,
  summary,
  children,
}: PageHeadingProps) {
  return (
    <header className="mb-8 border-border-subtle border-b pb-6">
      {eyebrow ? (
        <div className="mb-2 font-medium text-secondary-foreground text-xs uppercase tracking-wide">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="font-heading font-bold text-3xl text-foreground leading-tight">
        {title}
      </h1>
      {summary ? (
        <Text as="p" className="mt-3 max-w-[62ch]" size="lg" tone="secondary">
          {summary}
        </Text>
      ) : null}
      {children}
    </header>
  );
}
