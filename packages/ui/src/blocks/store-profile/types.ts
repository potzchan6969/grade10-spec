/** What the form hands back: trimmed field values, nothing normalized beyond
 * that, and what the collector did to the avatar. Mapping `""` to
 * null-or-absent, and judging the chosen file, are the consumer's concerns. */
type ProfileFormValues = {
  displayName: string;
  bio: string;
  avatar:
    | { outcome: "unchanged" }
    | { outcome: "removed" }
    | { outcome: "chosen"; file: File };
};

export type { ProfileFormValues };
