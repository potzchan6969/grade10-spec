/*
 * RULES: what the manual owes its own shape — a product or topic with no
 * landing page, a guide with no page, and a `manual.yaml` entry naming
 * nothing.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { manualYaml } from "./context.mjs";

/** The pages decide what exists; `manual.yaml` may only list what has pages,
 * and every product the pages hold owes a landing page. */
export function checkTaxonomy(roots, config, shape, add) {
  const root = roots.content;
  const manual = roots.manual;
  const configPath = manualYaml(roots);
  const products = new Set(shape.products);
  const topics = new Set(shape.topics);

  for (const id of config.groups.flatMap((group) => group.products)) {
    if (products.has(id)) continue;
    add(
      "config",
      configPath,
      `\`${id}\` has no pages under ${manual}/products/${id}/`,
    );
  }
  for (const id of config.platform.flatMap((group) => group.topics)) {
    if (topics.has(id)) continue;
    add(
      "config",
      configPath,
      `\`${id}\` has no page at ${manual}/platform/${id}.md`,
    );
  }

  for (const id of products) {
    requirePage(
      add,
      root,
      `${manual}/products/${id}/index.md`,
      `product \`${id}\``,
    );
  }
  for (const slug of config.guides) {
    requirePage(add, root, `${manual}/guides/${slug}.md`, `guide \`${slug}\``);
  }
}

function requirePage(add, root, path, what) {
  if (!existsSync(join(root, path)))
    add("page", path, `${what} has no page here`);
}
