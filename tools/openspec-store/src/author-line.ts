/** A proposal's `**Author:** @handle - YYYY-MM-DD` line. One home for the
 * editor that drafts it, the store that reads it, and the schema's template
 * and rule, which a test holds to it. */
export const AUTHOR_LINE =
  /^\*\*Author:\*\*\s*@([A-Za-z0-9][A-Za-z0-9_-]*)(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?\s*$/m;

export const authorLine = (handle: string, date: string): string =>
  `**Author:** @${handle} - ${date}`;
