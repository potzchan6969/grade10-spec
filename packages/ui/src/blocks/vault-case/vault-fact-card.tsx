import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { type ReactNode, useId } from "react";

/** One fact: its label, unique on its card, and its value as the consumer
 * formatted it. */
type VaultFactRow = { label: string; value: ReactNode };

type VaultFactCardCopy = {
  title: string;
  /** The line under the title. */
  description?: string;
  /** What the rows are the figures of; the title names them when omitted. */
  rowsLabel?: string;
};

type VaultFactCardProps = {
  copy: VaultFactCardCopy;
  /** What reads first under the title, before the rows. */
  lead?: ReactNode;
  rows?: readonly VaultFactRow[];
  /** What reads after the rows. */
  children?: ReactNode;
  /** The card's controls, after everything else. */
  actions?: ReactNode;
  /** The space between the lead, the rows and the body. */
  gap?: "sm" | "md";
  className?: string;
};

/**
 * One titled card of facts: a lead, label and value rows, a body, then
 * actions, each drawn only when given. The card is a region named by its
 * title, so a screen reader lands on it by what it is about, and the rows
 * are a table named by what they are the figures of.
 *
 * The card keeps the design system's own `card` slot, which the vault's
 * pages find a case card by.
 */
function VaultFactCard({
  copy,
  lead,
  rows = [],
  children,
  actions,
  gap = "sm",
  className,
}: VaultFactCardProps) {
  const titleId = useId();
  const hasContent = lead != null || rows.length > 0 || children != null;

  return (
    <Card aria-labelledby={titleId} className={className} role="region">
      <CardHeader>
        <CardTitle id={titleId}>{copy.title}</CardTitle>
        {copy.description ? (
          <CardDescription>{copy.description}</CardDescription>
        ) : null}
      </CardHeader>
      {hasContent ? (
        <CardContent>
          <VStack gap={gap}>
            {lead}
            {rows.length > 0 ? (
              <Table aria-label={copy.rowsLabel ?? copy.title}>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="flex-1">{row.label}</TableCell>
                      <TableCell align="end" className="flex-1">
                        {row.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
            {children}
          </VStack>
        </CardContent>
      ) : null}
      {actions != null ? <CardFooter>{actions}</CardFooter> : null}
    </Card>
  );
}

export type { VaultFactCardCopy, VaultFactCardProps, VaultFactRow };
export { VaultFactCard };
