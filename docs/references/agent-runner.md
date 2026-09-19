# Agent Runner

What Operations sets up so a change's thread can wake an agent, and so the
push workflow's `reread` job can run one, as of 2026-09. Decided facts and
open ones both live here; [Agent Rounds](../prds/products/shared/planning/agent-rounds.md)
names it as the runner and links back. Read this as what the workspace and
the repository need, not as a requirement — nothing here is tested.

## The Workspace

| Item | Needs | ❓ |
| --- | --- | --- |
| **Plan** | A Team or Enterprise Slack plan with Routines enabled — Claude Tag runs on top of Routines | Confirmed by the vendor's docs; which plan this workspace holds is Operations' |
| **Pairing** | A workspace Owner runs `@Claude connect` at [claude.ai/admin-settings/claude-tag](https://claude.ai/admin-settings/claude-tag) | ❓ Which Owner, and when |
| **The app's repository access** | GitHub App access to this repository, granted during that same setup | ❓ Whether it is scoped to this repository alone |
| **A spend limit** | Set at pairing time; the vendor's setup flow asks for one | ❓ What the limit is |

Members mention `@Claude` in a public planning-channel thread to start or
continue a session; a bot may post into that thread with `chat.postMessage`
and `thread_ts`. Whether Claude reacts to a bot's own reply in the thread is
unconfirmed — the round's summary and a landing's reply are both machine
posts, so a thread that goes quiet after one is a question for Operations
before it is a bug.

## The Slack App's Scopes

| Scope | For |
| --- | --- |
| `chat:write` | Posting the round's reply, the landing's line, and the push workflow's own messages |
| `channels:read` or the workspace's equivalent | Resolving the planning channel and the role channels in `docs/prds/team.yaml` |

The exact scope names are the app's own manifest, which Operations holds;
this row names what the two workflows below call, not the manifest.

## The Secret's Home

Every secret the two workflows read is a repository (or organization)
secret under **Settings → Secrets and variables → Actions**, on this
repository — never in a file here, and never in the re-read job's own
agent environment, which holds none of them. `SLACK_BOT_TOKEN` is read by
plain steps only, in both workflows; `CLAUDE_CODE_OAUTH_TOKEN` is read once,
by the `reread` job's action step, and is the credential Operations gets from
the same pairing as the thread.

## Variables and Secrets

Every `vars.*` and secret `.github/workflows/proposal-notify.yml` and
`.github/workflows/digest.yml` read, in one table.

| Name | Kind | Read by | What it is |
| --- | --- | --- | --- |
| `SLACK_BOT_TOKEN` | Secret | `notify`, `reread`, `digest` | The Slack app's bot token; posts every message these workflows send |
| `CLAUDE_CODE_OAUTH_TOKEN` | Secret | `reread` | The action's own credential, from the Claude Tag pairing |
| `SLACK_PLANNING_CHANNEL_ID` | Variable | `notify`, `reread` | The planning channel; the channel post, and the `reread` job's fallback where a change has no `thread:` |
| `SLACK_CHANNEL_ID` | Variable | `notify`, `reread` | Read where `SLACK_PLANNING_CHANNEL_ID` is unset — the older name, kept so a workspace that set it first is not broken |
| `SLACK_WORKSPACE_URL` | Variable | `notify` | Builds the permalink a direct message and a `your-turn` reply link to |
| `NOTIFY_DMS` | Variable | `notify` | Turns the per-hand direct messages on; the channel post runs without it |
| `TCS_SHEET_URL` | Variable | `notify` | Named in the message that tells QA to walk a run sheet |
| `AGENT_REREAD` | Variable | `reread` | The whole job's switch; unset or not `"true"` runs nothing |
| `AGENT_MODEL` | Variable | `reread` | The model `--model` names; the workflow never names one itself |
| `DIGEST_ENABLED` | Variable | `digest` | The weekly digest's own switch |

## The Action

`anthropics/claude-code-action@v1` needs `actions/checkout` to have run
first, and one of `anthropic_api_key` or `claude_code_oauth_token` — this
store passes `claude_code_oauth_token`. `claude_args` carries `--max-turns`,
`--allowedTools` and `--model`; `settings` is the JSON file
`scripts/openspec/reread-settings.mjs` writes per matrix entry. Every run
starts fresh — there is no resume the action offers on its own, which is why
the round itself reads the branch, `main` and the thread before doing
anything (`docs/governance/system-design.md`, Resilience).

## What Is Still Open

- ❓ Whether the app that holds a change's thread is the same Claude Tag
  pairing the `reread` job authenticates as, or a second app — Operations
  confirms
- ❓ Whether Claude reacts to a bot's reply inside a thread it did not open
  itself
- ❓ The spend limit, and who is told when a run is refused for it
