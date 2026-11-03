import { execFile } from "node:child_process";
import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { storyCases } from "../../../scripts/storybook/case-ids.mjs";
import { createCaptureCoordinator } from "../src/capture-coordinator.mjs";
import { openCaptureSession } from "../src/reference-capture.mjs";

// The local workbench hosts the capture coordinator in-process: Durable
// Object storage becomes JSON files beside the archive, and an alarm becomes
// a timer that survives a restart through its stored wake time.

const git = promisify(execFile);
const ALARM_KEY = "alarm";

export function createFileCoordinatorStorage(archiveRoot) {
  const directory = join(archiveRoot, "ui-verification", "v1", "coordinator");
  const fileOf = (key) => join(directory, `${encodeURIComponent(key)}.json`);
  return {
    async get(key) {
      try {
        return JSON.parse(await readFile(fileOf(key), "utf8"));
      } catch (error) {
        if (error?.code === "ENOENT") return undefined;
        throw error;
      }
    },
    async put(key, value) {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const temporary = `${fileOf(key)}.${process.pid}.tmp`;
      await writeFile(temporary, JSON.stringify(value), { mode: 0o600 });
      await rename(temporary, fileOf(key));
    },
    async delete(key) {
      await rm(fileOf(key), { force: true });
    },
    // The Durable Object storage options the coordinator uses: a prefix, a
    // key to start after, and a limit, in key order.
    async list({ prefix = "", startAfter, limit } = {}) {
      let names;
      try {
        names = await readdir(directory);
      } catch (error) {
        if (error?.code === "ENOENT") return new Map();
        throw error;
      }
      const keys = names
        .filter((entry) => entry.endsWith(".json"))
        .map((name) => decodeURIComponent(name.slice(0, -".json".length)))
        .filter(
          (key) =>
            key.startsWith(prefix) &&
            (startAfter === undefined || key > startAfter),
        )
        .sort()
        .slice(0, limit ?? Number.POSITIVE_INFINITY);
      const values = new Map();
      for (const key of keys) values.set(key, await this.get(key));
      return values;
    },
  };
}

export function gitProvenance(repoRoot) {
  return async () => {
    const read = async (args) =>
      (await git("git", args, { cwd: repoRoot })).stdout.trim();
    const [commit, branch, status] = await Promise.all([
      read(["rev-parse", "HEAD"]),
      read(["rev-parse", "--abbrev-ref", "HEAD"]),
      read(["status", "--porcelain"]),
    ]);
    return {
      commit,
      ref: branch === "HEAD" ? "detached" : branch,
      verified: status === "",
    };
  };
}

export function createLocalCoordinator({
  archive,
  archiveRoot,
  repoRoot,
  launch,
  now = () => Date.now(),
}) {
  const storage = createFileCoordinatorStorage(archiveRoot);
  const provenance = gitProvenance(repoRoot);
  let timer;
  let coordinator;

  async function setAlarm(time) {
    await storage.put(ALARM_KEY, time);
    clearTimeout(timer);
    timer = setTimeout(
      () => {
        void storage
          .delete(ALARM_KEY)
          .then(() => coordinator.alarm())
          .catch((error) =>
            console.error("[ui-verification-captures] alarm failed", error),
          );
      },
      Math.max(0, time - now()),
    );
    timer.unref?.();
  }

  coordinator = createCaptureCoordinator({
    storage,
    archive,
    setAlarm,
    now,
    openSession: () => openCaptureSession({ launch, provenance }),
  });

  // A restart keeps a pending wake time, so an interrupted run resumes.
  void storage
    .get(ALARM_KEY)
    .then((time) => (typeof time === "number" ? setAlarm(time) : undefined))
    .catch((error) =>
      console.error("[ui-verification-captures] could not resume", error),
    );

  // The checkout's stories are declared as it stands, so a block or a
  // primitive can be approved here with no site run.
  void Promise.all([provenance(), storyCases({ root: repoRoot })])
    .then(([{ commit, ref }, cases]) =>
      coordinator.declareStories({ cases, commit, ref }),
    )
    .catch((error) =>
      console.error(
        "[ui-verification-captures] could not declare stories",
        error,
      ),
    );

  return coordinator;
}
