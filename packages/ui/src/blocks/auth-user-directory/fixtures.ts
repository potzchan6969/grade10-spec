/* Example directory content for the stories only. A consumer supplies its
 * own; nothing here is a default. The words are a console's, written out here
 * because these components carry none of their own. */

import type { UserDirectoryRow, UserRoleOption, UserSessionRow } from "./types";
import type { UserModerationDialogCopy } from "./user-moderation-dialog";
import type { UserRolesDialogCopy } from "./user-roles-dialog";
import type { UserSessionsDialogCopy } from "./user-sessions-dialog";
import type { UserTableCopy } from "./user-table";

const USERS: UserDirectoryRow[] = [
  {
    id: "u1",
    email: "active@example.com",
    name: "Active Person",
    roles: ["staff", "auditor"],
    banned: false,
    twoFactorEnabled: true,
    created: "5 Jan 2026",
  },
  {
    id: "u2",
    email: "banned@example.com",
    roles: ["user"],
    banned: true,
    twoFactorEnabled: false,
    created: "6 Feb 2026",
  },
];

const ROLE_OPTIONS: UserRoleOption[] = [
  { id: "admin", label: "admin", permissions: "everything" },
  { id: "staff", label: "staff", permissions: "store:read, store:write" },
  { id: "support", label: "support", permissions: "user:list, session:list" },
  { id: "treasurer", label: "treasurer", permissions: "vault:payout" },
  { id: "auditor", label: "auditor", permissions: "audit:read" },
];

const SESSIONS: UserSessionRow[] = [
  { id: "ses_one", started: "5 Jan 2026, 09:14" },
  { id: "ses_two", started: "2 Feb 2026, 18:02" },
];

const TABLE_COPY: UserTableCopy = {
  headings: {
    id: "Id",
    email: "Email",
    name: "Name",
    roles: "Roles",
    status: "Status",
    twoFactor: "2FA",
    created: "Created",
  },
  noName: "—",
  status: { active: "active", banned: "banned" },
  twoFactor: { on: "On", off: "Off" },
  actions: {
    sessions: "Sessions",
    roles: "Roles",
    ban: "Ban",
    unban: "Unban",
    delete: "Delete",
  },
};

const ROLES_COPY: UserRolesDialogCopy = {
  title: "Edit roles",
  description:
    "Grants act on the next admin call; unchecking everything leaves a plain user account.",
  confirm: "Save roles",
  cancel: "Cancel",
  selfLockout:
    "This is your own account — saving without admin locks you out of this panel.",
};

const BAN_COPY: UserModerationDialogCopy = {
  title: "Ban user",
  description:
    "A ban reaches the apps once the five-minute session cookie cache expires.",
  confirm: "Ban",
  cancel: "Cancel",
  reason: "Reason (optional)",
};

const SESSIONS_COPY: UserSessionsDialogCopy = {
  title: "Sessions",
  description:
    "End one session or every session of this account. The secret that authenticates a session is never shown.",
  headings: { session: "Session", started: "Created" },
  loading: "Loading sessions...",
  empty: "No sessions.",
  revoke: "Revoke",
  revokeAll: "Revoke all",
  close: "Close",
};

export {
  BAN_COPY,
  ROLE_OPTIONS,
  ROLES_COPY,
  SESSIONS,
  SESSIONS_COPY,
  TABLE_COPY,
  USERS,
};
