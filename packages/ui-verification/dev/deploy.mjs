#!/usr/bin/env node
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

// The Storybook build's receipt: it names the commit a hosted reference
// capture draws from. The deployed Worker reads it to notice a deploy.

const git = promisify(execFile);
export const RECEIPT_FILE = "ui-verification-build.json";

async function files(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await files(path)));
    else if (entry.isFile()) found.push(path);
  }
  return found;
}

/** A digest of every built file but the receipt, by path then content. */
export async function artifactDigest(directory) {
  const root = resolve(directory);
  const hash = createHash("sha256");
  const paths = (await files(root))
    .map((path) => relative(root, path).split(sep).join("/"))
    .filter((path) => path !== RECEIPT_FILE)
    .sort();
  for (const path of paths) {
    hash.update(`${path}\0`);
    hash.update(await readFile(join(root, path)));
    hash.update("\0");
  }
  return hash.digest("hex");
}

export async function writeBuildReceipt({ directory, repoRoot }) {
  const read = async (args) =>
    (await git("git", args, { cwd: repoRoot })).stdout.trim();
  const [commit, status] = await Promise.all([
    read(["rev-parse", "HEAD"]),
    read(["status", "--porcelain"]),
  ]);
  if (status !== "")
    throw new Error(
      "a build receipt names a clean commit; commit or discard the changes first",
    );
  const receipt = {
    schemaVersion: 1,
    target: "reference",
    commit,
    artifactDigest: await artifactDigest(directory),
  };
  await writeFile(
    join(directory, RECEIPT_FILE),
    `${JSON.stringify(receipt, null, 2)}\n`,
  );
  return receipt;
}

async function main([command, ...args]) {
  if (command === "receipt") {
    const [directory] = args;
    const receipt = await writeBuildReceipt({
      directory: resolve(directory),
      repoRoot: process.cwd(),
    });
    console.log(`build receipt for ${receipt.commit}`);
    return;
  }
  throw new Error("usage: deploy.mjs receipt <storybook-static>");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
