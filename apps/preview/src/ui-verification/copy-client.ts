import { apiUrl, requestJson } from "./archive-client";
import type {
  CopyCell,
  CopyChangeset,
  CopyDecision,
  CopyProposal,
  CopyRecords,
  CopyReviewRecord,
} from "./copy-review-model";

function post<T>(base: string, pathname: string, body: unknown): Promise<T> {
  return requestJson(apiUrl(base, pathname), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as Promise<T>;
}

export async function listCopyRecords(
  base: string,
  signal?: AbortSignal,
): Promise<CopyRecords> {
  return (await requestJson(apiUrl(base, "/api/copy/records"), {
    signal,
  })) as CopyRecords;
}

/** Whether approved copy ships as a pull request or into this checkout. */
export async function copyShipsTo(
  base: string,
  signal?: AbortSignal,
): Promise<"pull-request" | "files"> {
  const info = (await requestJson(apiUrl(base, "/api/archive-info"), {
    signal,
  })) as { storage?: { kind?: string } };
  return info.storage?.kind === "filesystem" ? "files" : "pull-request";
}

export const markReviewed = (
  base: string,
  input: CopyCell & { valueHash: string },
) => post<CopyReviewRecord>(base, "/api/copy/reviews", input);

export const proposeEdit = (
  base: string,
  input: CopyCell & {
    baseValue: string | null;
    baseHash: string;
    value: string;
    reference: string | undefined;
  },
) => post<CopyProposal>(base, "/api/copy/proposals", input);

export const decideEdit = (
  base: string,
  input: {
    proposalId: string;
    verdict: CopyDecision["verdict"];
    comment?: string;
  },
) => post<CopyDecision>(base, "/api/copy/decisions", input);

export const shipEdits = (base: string, proposalIds: string[]) =>
  post<CopyChangeset>(base, "/api/copy/changesets", { proposalIds });
