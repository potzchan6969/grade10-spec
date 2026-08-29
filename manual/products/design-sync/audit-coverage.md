---
title: What the audit must find
summary: The obligations of the unattended design-to-code run — omissions, coverage, honest reporting, and what fails it.
spec: design-sync/audit-coverage
order: 1
---

This capability governs the rail's obligations, not any component's appearance.
It answers two questions: what the run must find, and where it must look.

## Omission counts as a finding

Silence is not agreement. If a Figma node draws a visible fill or stroke and no
audited element claims it, that is reported — and so is the reverse, code
painting something the design does not draw. A node an implementation renders as
several elements is judged once, by asking whether *any* of those elements
claims the value, so splitting a div never hides an omission.

The exception is narrow and deliberate: a property a node is permitted to leave
unstated is reported as unchecked, not as a finding.

::spec{id="design-sync/audit-coverage" requirement="A drawn value the code omits is a finding"}

## Everywhere, and honestly

The sweep audits every component directory carrying an audit table, in the
shared component package and the design system alike — no component is excluded
by which package it lives in, and the site header and footer are in scope. A
directory with no audit table reads as uncovered rather than as passing.

The run says what it could not check. Every unchecked class is named alongside
the checked ones, and a run in which nothing could be checked is not reported
like one where everything matched. Coverage is named by component rather than by
directory, so a directory the other rail already covers is not reported as a
gap.

## What fails the run

A value that disagrees with Figma fails, in both rails. A finding that does not
claim the code draws the wrong thing — a missing description, an unmapped axis
option, a Figma component with no code counterpart — stays advisory and does not
fail.

:::callout{kind="warning"}
One component currently has the exact problem this rail exists to prevent: the
order-history status is mapped to one Figma node by its code-connect file and to
a different node by its audit table. Two sources of truth disagree about which
node it came from, and a designer needs to settle which is right.
:::

:::callout{kind="warning"}
Two real gaps in coverage today. No auction block has an audit table or a Figma
mapping at all, so the whole lot page is outside the sweep. And the filter chip
in the design system ships with no stories file, which leaves it invisible to
the story-driven half of the checks.
:::

## The contract

::spec{id="design-sync/audit-coverage"}
