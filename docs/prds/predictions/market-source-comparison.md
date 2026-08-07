# Market source comparison (sample PRD)

> **Status:** Example only. This document demonstrates the repository's PRD format; it does not authorize implementation or a production rollout.

## Summary

When a prediction market is offered by more than one source, a trader should be able to compare the available outcomes and prices before choosing where to continue. The experience reduces ambiguity about source coverage without making a recommendation or executing a trade.

## Context

- Problem or opportunity: Equivalent market questions can have different available outcomes, prices, rules, and resolution timing across sources. Today, a user who notices a source badge must leave the product to compare them.
- Evidence and links: This is illustrative sample content; replace with research, support findings, analytics, and design links before approval.
- Related PRDs, OpenSpec changes, and designs: None. An approved implementation would create a linked change under `openspec/changes/`.

## Goals

- Let a trader see which sources offer a selected market and the current comparable outcome prices.
- Make material differences in availability or market status visible before the user leaves the detail page.
- Provide a stable, stateless comparison component that more than one consuming app can render.

## Non-goals

- Recommending a source, ranking sources, or calculating best execution.
- Placing, routing, or funding a trade.
- Reconciling mismatched source taxonomy beyond the comparison data supplied by the consuming app.
- Replacing the market-detail page or source-specific trading experience.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Active trader | I see a market offered by multiple sources. | Help me understand which source has the outcome and price I want before I navigate away. |
| Researching visitor | I am comparing market coverage without placing a trade. | Show me available and unavailable sources without implying a recommendation. |

## Experience

### Primary flow

1. A user opens a market-detail view that has comparison data for two or more sources.
2. The app displays a source comparison section below the market summary, with source name, status, outcomes, and last-updated time supplied by the app.
3. The user selects an outcome to compare its displayed price across sources.
4. The user chooses a source-specific call to action. The consuming app owns navigation and any downstream eligibility checks.

## Requirements

This example has no durable spec, because nothing here is approved. On approval its checkable requirements — the loading, single-source, unavailable-outcome, suspended, error, and narrow-viewport behavior, the accessibility obligations, and the component export contract — would be written to `openspec/specs/market-source-comparison/spec.md`, and this document would link to them from here rather than restate them.

Note the shape that leaves behind: everything above and below this section is a product decision that a requirement cannot carry. That is the test for whether a PRD is worth writing.

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| Prediction-market web app | Supplies normalized source comparison data and owns navigation from source actions. | Must map a missing outcome to an explicit unavailable state. |
| Embedded market preview | Renders the same stateless component in a compact layout. | May omit the action callback and render rows as read-only. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Comparison availability | Percentage of eligible market-detail visits that receive at least two comparable sources. | Product analytics |
| Source-action rate | Source comparison actions divided by comparison section impressions. | Product analytics |
| Comparison load failure rate | Failed comparison loads divided by comparison requests. | Platform team |

Analytics event names, properties, privacy review, and instrumentation ownership must be decided in the linked OpenSpec change; the shared component must not emit analytics directly.

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Source equivalence | Open | What level of outcome/rule similarity is required before sources are safe to compare? | Product + data |
| Freshness | Open | What freshness threshold should cause a source price to be labelled delayed or hidden? | Product + platform |
| Action destinations | Assumption | The consuming application owns source navigation and eligibility; the shared component emits a callback only. | Application team |
| Recommendation language | Decided | The comparison is descriptive, not a recommendation or best-price claim. | Product |

## Rollout and risks

- Begin with a limited set of markets whose source outcomes are known to be comparable; measure availability and load failures before expanding.
- Inaccurate source normalization could mislead users. Hide a comparison rather than presenting an uncertain match.
- Source status and prices can become stale. The consuming app must define freshness and failure behavior before release.
- Review terminology and source-linking requirements with legal/compliance before production rollout.
