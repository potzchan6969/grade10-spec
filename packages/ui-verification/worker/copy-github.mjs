// The hosted workbench ships approved copy as one pull request on the spec
// store, and reads back whether it merged and whether the site's pin of the
// store has reached that merge yet. Moving the pin stays a person's commit.

import { ArchiveError } from "../src/archive.mjs";
import { applyEdits } from "../src/copy-catalog.mjs";

const API = "https://api.github.com";

function decodeBase64(value) {
  const binary = atob(value.replace(/\n/g, ""));
  return new TextDecoder().decode(
    Uint8Array.from(binary, (character) => character.charCodeAt(0)),
  );
}

const personLabel = (who) => who.email ?? who.subject;

function pullRequestBody(edits, author) {
  const lines = edits.map(
    (edit) =>
      `- \`${edit.layer}/${edit.locale}/${edit.namespace}\` \`${edit.key}\`: ${JSON.stringify(edit.baseValue)} → ${JSON.stringify(edit.value)} (proposed by ${personLabel(edit.proposer)})`,
  );
  return [
    `Copy edits approved in the workbench's Copy review, shipped by ${personLabel(author)}.`,
    "",
    ...lines,
    "",
    "The site shows them once grade10 moves its `external/grade10-spec` pin past this merge and deploys.",
  ].join("\n");
}

export function createGitHubCopyShipper({
  token,
  repo = "9gag/grade10-spec",
  base = "main",
  siteRepo = "9gag/grade10",
  siteBranch = "main",
  pinPath = "external/grade10-spec",
  fetcher = globalThis.fetch,
}) {
  if (typeof token !== "string" || token === "")
    throw new TypeError("a GitHub token is required to ship copy");

  async function github(method, path, body, { allow404 = false } = {}) {
    const response = await fetcher(`${API}${path}`, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "grade10-copy-review",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (allow404 && response.status === 404) return null;
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new ArchiveError(
        502,
        "GITHUB_FAILED",
        `GitHub ${method} ${path} answered ${response.status}: ${detail.slice(0, 200)}`,
      );
    }
    return response.json();
  }

  return {
    async ship(edits, author) {
      const ref = await github("GET", `/repos/${repo}/git/ref/heads/${base}`);
      const baseCommit = ref.object.sha;
      const { files, applied, skipped } = await applyEdits(
        edits,
        async (path) => {
          const file = await github(
            "GET",
            `/repos/${repo}/contents/${path}?ref=${baseCommit}`,
            undefined,
            { allow404: true },
          );
          return file ? decodeBase64(file.content) : null;
        },
      );
      if (applied.length === 0) return { applied, skipped, shipment: null };

      const commit = await github(
        "GET",
        `/repos/${repo}/git/commits/${baseCommit}`,
      );
      const tree = await github("POST", `/repos/${repo}/git/trees`, {
        base_tree: commit.tree.sha,
        tree: files.map((file) => ({
          path: file.path,
          mode: "100644",
          type: "blob",
          content: file.text,
        })),
      });
      const title = `chore(i18n): ship ${applied.length} reviewed copy edit${applied.length === 1 ? "" : "s"}`;
      const created = await github("POST", `/repos/${repo}/git/commits`, {
        message: title,
        tree: tree.sha,
        parents: [baseCommit],
      });
      const branch = `copy-review/${new Date().toISOString().slice(0, 10)}-${globalThis.crypto.randomUUID().slice(0, 8)}`;
      await github("POST", `/repos/${repo}/git/refs`, {
        ref: `refs/heads/${branch}`,
        sha: created.sha,
      });
      const pull = await github("POST", `/repos/${repo}/pulls`, {
        title,
        head: branch,
        base,
        body: pullRequestBody(applied, author),
      });
      return {
        applied,
        skipped,
        shipment: {
          kind: "pull-request",
          repo,
          number: pull.number,
          url: pull.html_url,
          branch,
          baseCommit,
        },
      };
    },

    async status(changeset) {
      const shipment = changeset.shipment;
      if (shipment?.kind !== "pull-request") return null;
      const pull = await github(
        "GET",
        `/repos/${shipment.repo}/pulls/${shipment.number}`,
      );
      const pullRequest = {
        state: pull.merged ? "merged" : pull.state,
        mergeCommit: pull.merged ? pull.merge_commit_sha : null,
      };
      if (!pull.merged) return { pullRequest, site: null };
      const pin = await github(
        "GET",
        `/repos/${siteRepo}/contents/${pinPath}?ref=${siteBranch}`,
      );
      const compare = await github(
        "GET",
        `/repos/${shipment.repo}/compare/${pull.merge_commit_sha}...${pin.sha}`,
      );
      return {
        pullRequest,
        site: {
          pin: pin.sha,
          includesMerge: ["identical", "ahead"].includes(compare.status),
        },
      };
    },
  };
}
