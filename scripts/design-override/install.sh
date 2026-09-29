#!/bin/sh
# Points git at .githooks on install. CI commits are left to the report on main,
# since no person is there to confirm a stop.
[ -n "$CI" ] && exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
git config core.hooksPath .githooks
