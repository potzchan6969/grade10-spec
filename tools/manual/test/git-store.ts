import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

/** A git repository to write a store into, for the readers that only mean
 * anything against real commits. */
export function gitStore(prefix = "manual-store-") {
  const root = mkdtempSync(join(tmpdir(), prefix));
  const git = (args: string[]) =>
    execFileSync(
      "git",
      ["-c", "user.email=manual@test", "-c", "user.name=manual", ...args],
      { cwd: root, stdio: "ignore" },
    );
  const write = (path: string, text: string) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  const commit = (message: string) => {
    git(["add", "-A"]);
    git(["commit", "--quiet", "-m", message]);
  };
  git(["init", "--quiet", "."]);
  return { root, git, write, commit };
}
