import { spawn } from "node:child_process";
import { createServer } from "node:net";

function hasPortArgument(args) {
  return args.some(
    (argument) =>
      argument === "--port" ||
      argument === "-p" ||
      argument.startsWith("--port=") ||
      (argument.startsWith("-p") && argument.length > 2),
  );
}

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to determine an available Storybook port."));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(address.port);
      });
    });
  });
}

const DEFAULT_WORKSPACE_DIRECTORY = "apps/preview";

const storybookArguments = process.argv
  .slice(2)
  .filter((argument) => argument !== "--");

let workspaceDirectory = DEFAULT_WORKSPACE_DIRECTORY;
if (storybookArguments[0] === "--dir") {
  const [, directory] = storybookArguments.splice(0, 2);
  if (!directory) {
    console.error("--dir requires a workspace directory.");
    process.exit(1);
  }
  workspaceDirectory = directory;
}

if (!hasPortArgument(storybookArguments)) {
  const port = await findAvailablePort();
  storybookArguments.push("--port", String(port));
  console.log(`Starting Storybook on an available port: ${port}`);
}

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const child = spawn(
  pnpm,
  [
    "--dir",
    workspaceDirectory,
    "exec",
    "storybook",
    "dev",
    ...storybookArguments,
  ],
  { stdio: "inherit" },
);

child.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
