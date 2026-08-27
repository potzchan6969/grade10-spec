import type { ReactNode } from "react";

/**
 * One account as the directory shows it.
 *
 * Every value is display-ready: roles arrive parsed rather than as the
 * comma-separated string an identity system stores, and `created` arrives
 * formatted, because a package that formatted a date would be choosing a
 * locale on the consumer's behalf.
 */
type UserDirectoryRow = {
  id: string;
  email: string;
  /** Omit it and the table shows the copy's placeholder instead. */
  name?: ReactNode;
  roles: readonly string[];
  banned?: boolean;
  twoFactorEnabled?: boolean;
  created: ReactNode;
};

/**
 * One session on an account, named by an identifier the consumer can act on.
 * The secret that authenticates a session is never a prop here, because it is
 * never a thing this surface shows.
 */
type UserSessionRow = {
  id: string;
  /** Display-ready, like the row's `created`. */
  started: ReactNode;
  /** Where from, when the identity system recorded it. */
  origin?: ReactNode;
};

/** One role an operator may grant, and what holding it allows. */
type UserRoleOption = {
  id: string;
  label: string;
  /** Display-ready summary of what the role permits. */
  permissions: ReactNode;
};

export type { UserDirectoryRow, UserRoleOption, UserSessionRow };
