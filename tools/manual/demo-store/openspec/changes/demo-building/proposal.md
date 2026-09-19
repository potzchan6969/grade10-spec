# The Building stage

**Author:** @tester - 2026-09-04

## Why

The fixture walk needs a change with one task ticked and one still open, so a
reader can tell the Building stage from Planned, and a dependency that has
not shipped yet, so the Blocked overlay has something to name.

## What Changes

- **The first task lands**, and the second waits on `demo-planned`.
