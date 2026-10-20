import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, it } from "vitest";

const MESSAGES = join(import.meta.dirname, "../messages");

const catalogFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return catalogFiles(path);
    return entry.name.endsWith(".json") ? [path] : [];
  });

/** Each key an object names twice, as its dotted path. JSON.parse keeps the
 *  last and drops the first without a word, so it cannot be asked. */
function duplicateKeys(source: string): string[] {
  const found: string[] = [];
  const open: ({ keys: Set<string>; path: string } | "array")[] = [];
  let pending = "";
  let expectingKey = false;
  for (let at = 0; at < source.length; at++) {
    const char = source[at];
    const top = open.at(-1);
    if (char === '"') {
      let end = at + 1;
      while (source[end] !== '"') end += source[end] === "\\" ? 2 : 1;
      if (expectingKey && top && top !== "array") {
        const key = JSON.parse(source.slice(at, end + 1)) as string;
        pending = `${top.path}${key}`;
        if (top.keys.has(key)) found.push(pending);
        top.keys.add(key);
        expectingKey = false;
      }
      at = end;
    } else if (char === "{") {
      open.push({ keys: new Set(), path: pending ? `${pending}.` : "" });
      expectingKey = true;
    } else if (char === "[") {
      open.push("array");
    } else if (char === "}" || char === "]") {
      open.pop();
    } else if (char === ",") {
      expectingKey = top !== undefined && top !== "array";
    }
  }
  return found;
}

it("names no key twice in any catalog", () => {
  const twice = catalogFiles(MESSAGES).flatMap((file) =>
    duplicateKeys(readFileSync(file, "utf8")).map(
      (key) => `${relative(MESSAGES, file)}: ${key}`,
    ),
  );
  expect(twice).toEqual([]);
});

it("finds a key named twice, however deep", () => {
  expect(
    duplicateKeys(
      '{"a": {"b": "1", "c": ["x", "b", {"d": 1, "d": 2}], "b": "2"}, "e": 1}',
    ),
  ).toEqual(["a.c.d", "a.b"]);
});
