#!/bin/sh
# Points git at .githooks on install. A GitHub runner is skipped: no person is
# there to confirm a stop, so the report on main reads its commits. Not `CI`:
# agent sessions set it to avoid a TTY.
[ -n "$GITHUB_ACTIONS" ] && exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
git config core.hooksPath .githooks
