#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";

const api = process.env.GITHUB_API_URL ?? "https://api.github.com";
const token = process.env.APP_DEPLOYMENTS_READ_TOKEN;
const repository = process.env.APP_DEPLOYMENTS_REPOSITORY ?? "9gag/grade10";
const task = "grade10:availability";
const eventPath = process.env.GITHUB_EVENT_PATH;
const now = new Date().toISOString();

if (!token) {
  writeEnv("MANUAL_DEPLOYMENT_RECEIPTS", "[]");
  writeEnv("MANUAL_AVAILABILITY_STATUS", "unconfigured");
  process.stderr.write(
    "APP_DEPLOYMENTS_READ_TOKEN is not set; deployment availability will read as unknown.\n",
  );
  process.exit(0);
}
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
  throw new Error(`Invalid APP_DEPLOYMENTS_REPOSITORY: ${repository}`);
}

const event = eventPath ? JSON.parse(readFileSync(eventPath, "utf8")) : {};
const eventName = process.env.GITHUB_EVENT_NAME;
if (eventName === "repository_dispatch") {
  const hint = event.client_payload ?? {};
  if (
    event.action !== "deployment-evidence-updated" ||
    hint.repository !== repository ||
    !Number.isInteger(Number(hint.deploymentId)) ||
    typeof hint.environment !== "string"
  ) {
    throw new Error(
      "Deployment refresh hint does not name the configured repository and a deployment id",
    );
  }
}

const [owner, repo] = repository.split("/");
const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

async function get(path) {
  const response = await fetch(`${api}${path}`, { headers });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `GitHub API ${response.status} for ${path}: ${detail.slice(0, 500)}`,
    );
  }
  return response.json();
}

const deployments = [];
for (let page = 1; page <= 5; page++) {
  const found = await get(
    `/repos/${owner}/${repo}/deployments?task=${encodeURIComponent(task)}&per_page=100&page=${page}`,
  );
  if (!Array.isArray(found))
    throw new Error("GitHub deployments response is not an array");
  deployments.push(...found);
  if (found.length < 100) break;
}
if (deployments.length === 500) {
  throw new Error(
    "Deployment history exceeds 500 records; refusing to silently truncate availability",
  );
}

if (eventName === "repository_dispatch") {
  const requested = Number(event.client_payload.deploymentId);
  const deployment = deployments.find((one) => one.id === requested);
  if (
    !deployment ||
    deployment.task !== task ||
    deployment.environment !== event.client_payload.environment
  ) {
    throw new Error(
      `Deployment ${requested} is not a ${task} deployment in ${repository}`,
    );
  }
}

const byEnvironment = new Map();
for (const deployment of deployments) {
  // GitHub's task query is a narrowing hint, not a trust boundary. A
  // repository can retain old or manually-created deployments with the same
  // environment, and only this task's receipt shape is availability evidence.
  if (deployment.task !== task) continue;
  const rows = byEnvironment.get(deployment.environment) ?? [];
  rows.push(deployment);
  byEnvironment.set(deployment.environment, rows);
}

const receipts = [];
for (const [environment, rows] of byEnvironment) {
  rows.sort(
    (left, right) => Date.parse(right.created_at) - Date.parse(left.created_at),
  );
  let included = 0;
  for (const deployment of rows) {
    const statuses = await get(
      `/repos/${owner}/${repo}/deployments/${deployment.id}/statuses?per_page=1`,
    );
    const status = statuses[0];
    if (!status) continue;
    const payload = receiptPayload(deployment);
    // An invalid historical receipt leaves availability unknown. It must not
    // stop the manual from displaying a later valid observation.
    if (!validReceipt(payload) || payload.environment !== environment) continue;
    receipts.push({
      ...payload,
      fetchedAt: now,
      deploymentStatus: status.state,
      deploymentUrl: status.target_url ?? undefined,
    });
    included++;
    if (included === 2) break;
  }
}

let eventReceipt;
if (eventName === "repository_dispatch") {
  const id = Number(event.client_payload.deploymentId);
  const deployment = deployments.find((one) => one.id === id);
  const statuses = await get(
    `/repos/${owner}/${repo}/deployments/${id}/statuses?per_page=1`,
  );
  const status = statuses[0];
  const payload = receiptPayload(deployment);
  if (!status || !validReceipt(payload)) {
    throw new Error(
      `Deployment ${id} has no valid availability receipt status`,
    );
  }
  eventReceipt = {
    ...payload,
    fetchedAt: now,
    deploymentStatus: status.state,
    deploymentUrl: status.target_url ?? undefined,
  };
}

function receiptPayload(deployment) {
  try {
    return typeof deployment.payload === "string"
      ? JSON.parse(deployment.payload)
      : deployment.payload;
  } catch {
    return undefined;
  }
}

receipts.sort(
  (left, right) => Date.parse(left.observedAt) - Date.parse(right.observedAt),
);
const json = JSON.stringify(receipts);
const envFile = process.env.GITHUB_ENV;
if (envFile) {
  const delimiter = `RECEIPTS_${randomUUID().replaceAll("-", "")}`;
  appendFileSync(
    envFile,
    `MANUAL_DEPLOYMENT_RECEIPTS<<${delimiter}\n${json}\n${delimiter}\n`,
  );
  appendFileSync(envFile, "MANUAL_AVAILABILITY_STATUS=ready\n");
  if (eventName === "repository_dispatch") {
    appendFileSync(
      envFile,
      `MANUAL_DEPLOYMENT_ID=${Number(event.client_payload.deploymentId)}\n`,
    );
    appendFileSync(
      envFile,
      `MANUAL_DEPLOYMENT_EVENT_RECEIPT=${JSON.stringify(eventReceipt)}\n`,
    );
  }
} else {
  process.stdout.write(`${json}\n`);
}

function writeEnv(name, value) {
  const envFile = process.env.GITHUB_ENV;
  if (envFile) appendFileSync(envFile, `${name}=${value}\n`);
  else process.stdout.write(`${JSON.stringify({ [name]: value })}\n`);
}

function validReceipt(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.version === 1 &&
      typeof value.environment === "string" &&
      typeof value.resolvedRef === "string" &&
      typeof value.observedAt === "string" &&
      Array.isArray(value.components) &&
      Array.isArray(value.changes) &&
      Array.isArray(value.servingSet?.newly) &&
      Array.isArray(value.servingSet?.still) &&
      Array.isArray(value.servingSet?.noLonger),
  );
}
