/*
 * RULES: what the store holds and what the manual owes it — a durable spec no
 * page shows, a product or topic with no landing page, a `manual.yaml` entry
 * naming nothing, a spec shaped so the archive would break it, and a file the
 * readers refused outright.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { manualYaml } from "./context.mjs";

/** Disk shape decides what must have a page; `manual.yaml` may add a
 * page-only product or topic, but only one that actually has pages. Only the
 * store's own manual owes the whole disk shape a page — a manual in another
 * repository owes landing pages for exactly what it lists. */
export function checkTaxonomy(roots, config, shape, paths, add) {
  const root = roots.content;
  const manual = roots.manual;
  const configPath = manualYaml(roots);
  const listed = config.groups.flatMap((group) => group.products);
  const onDisk = new Set(shape.products);
  const hasPages = (id) =>
    paths.some((path) => path.startsWith(`${manual}/products/${id}/`));

  const pageOnly = listed.filter((id) => !onDisk.has(id) && hasPages(id));
  for (const id of listed) {
    if (onDisk.has(id) || hasPages(id)) continue;
    add(
      "config",
      configPath,
      `\`${id}\` is neither a spec-dir product nor a page-only product with pages under ${manual}/products/${id}/`,
    );
  }

  const topics = new Set(shape.topics);
  const listedTopics = config.platform.flatMap((group) => group.topics);
  for (const id of listedTopics) {
    if (topics.has(id) || existsSync(join(root, topicPage(manual, id)))) {
      continue;
    }
    add(
      "config",
      configPath,
      `\`${id}\` is neither a spec-dir topic nor a page-only topic with a page at ${topicPage(manual, id)}`,
    );
  }

  const owedProducts = roots.own
    ? [...shape.products, ...pageOnly]
    : listed.filter((id) => onDisk.has(id) || hasPages(id));
  for (const id of new Set(owedProducts)) {
    requirePage(
      add,
      root,
      `${manual}/products/${id}/index.md`,
      `product \`${id}\``,
    );
  }
  const owedTopics = roots.own
    ? shape.topics
    : listedTopics.filter((id) => topics.has(id));
  for (const id of owedTopics) {
    requirePage(add, root, topicPage(manual, id), `topic \`${id}\``);
  }
  for (const slug of config.guides) {
    requirePage(add, root, `${manual}/guides/${slug}.md`, `guide \`${slug}\``);
  }
}

function _refusal(id, error) {
  return `${id}${error.line ? ` line ${error.line}` : ""}: ${error.message}`;
}

const topicPage = (manual, id) => `${manual}/platform/${id}.md`;

function requirePage(add, root, path, what) {
  if (!existsSync(join(root, path)))
    add("page", path, `${what} has no page here`);
}
