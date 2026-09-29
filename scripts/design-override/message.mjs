/*
 * What a commit message says to the check: the `Design-Override:` line in its
 * last paragraph, and the co-authors it names.
 */

/** The message file as git will record it: cut at the scissors, comments dropped. */
export function cleanMessage(text, commentChar = "#") {
  const lines = text.replace(/\r/g, "").split("\n");
  const cut = lines.indexOf(
    `${commentChar} ------------------------ >8 ------------------------`,
  );
  return (cut === -1 ? lines : lines.slice(0, cut))
    .filter((line) => !line.startsWith(commentChar))
    .join("\n");
}

export function readMessage(text) {
  const last = text
    .replace(/\r/g, "")
    .trim()
    .split(/\n\s*\n/)
    .at(-1)
    .split("\n");
  const line = last.find((l) => /^design-override:/i.test(l));
  return {
    override: line?.replace(/^design-override:/i, "").trim(),
    coAuthors: [...text.matchAll(/^co-authored-by:.*<([^>]+)>/gim)].map(
      ([, email]) => email.toLowerCase(),
    ),
  };
}
