/** What the form hands back: trimmed field values, nothing normalized beyond
 * that. Mapping `""` to null-or-absent is the consumer's wire concern. */
type ProfileFormValues = { displayName: string; bio: string };

export type { ProfileFormValues };
