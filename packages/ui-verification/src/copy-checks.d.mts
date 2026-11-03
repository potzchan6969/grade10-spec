export type IssueSeverity = "error" | "warn" | "info";

export interface CopyIssue {
  severity: IssueSeverity;
  kind: string;
  message: string;
}

export function parseMessage(text: string): {
  args: Set<string>;
  tags: Set<string>;
  error: string | null;
};

export function checkValue(input: {
  locale: string;
  value: string | undefined;
  reference: string | undefined;
}): CopyIssue[];

export function blocksApproval(issues: readonly CopyIssue[]): boolean;
