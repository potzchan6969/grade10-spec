# Featured Markets reusable component

## Summary

Prediction-market applications need a consistent featured-markets surface that can display curated duration and trending markets without coupling the view to an app's stores, feeds, routing, or analytics. The reusable component provides desktop navigation/chart and mobile card layouts from consumer-supplied state.

## Context

- Problem or opportunity: The Stakeland Featured Markets panel combines valuable UI patterns with application-owned data orchestration, preventing reuse by another consumer.
- Evidence and links: Source reference: `/Users/tonyliang/workspace/stakeland-site/apps/bull-bear/bull-bear-site/components/features/predictions/FeaturedMarkets/FeaturedMarketsPanelWithStore.tsx`.
- Related PRDs, OpenSpec changes, and designs: durable requirements at [`openspec/specs/grade10-store/featured-markets/spec.md`](../../../openspec/specs/grade10-store/featured-markets/spec.md).

## Goals

- Render the Featured Markets desktop and mobile experiences from typed, controlled consumer data.
- Provide reusable Stakeland-dark primitives for the surface, navigation, market cards, and chart.
- Support a locally managed ECharts renderer without connecting the package to external market state.

## Non-goals

- Fetching markets, subscribing to prices, deriving countdowns, navigating, or recording analytics.
- Candlestick, multi-series, or trading-terminal charting.
- Copying app-specific icons, stores, feature flags, or runtime query behavior.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Prediction-market visitor | Browsing a curated selection of crypto duration and trending markets. | Find a market and understand its current supplied information on any screen size. |
| Consuming application engineer | Integrating the feature with an app-specific feed and router. | Supply data and callbacks through a stable, strictly typed API. |

## Experience

### Primary flow

1. The consuming app supplies duration markets, trending events, and a controlled selection.
2. On desktop, the user selects a duration, asset, or trending event; the app updates selection through callbacks and the panel renders the matching chart or card presentation.
3. On mobile, the user switches between Crypto and Trending tabs and sees the supplied card stack.
4. The app owns any resulting navigation, retry, source change, or Browse All behavior.

## Requirements

Checkable requirements, state behavior, accessibility, content ownership, and the component export contract live in [`openspec/specs/grade10-store/featured-markets/spec.md`](../../../openspec/specs/grade10-store/featured-markets/spec.md). That spec is the source of truth an implementing engineer builds from; change it, not this document, when a requirement changes.

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| Stakeland prediction-market site | Maps stores, live feed, timers, routing, and analytics into component props and callbacks. | Replaces the store-connected panel rather than importing it. |
| Future embedded prediction surfaces | Uses the exported primitives or summary cards with normalized input. | Imports the package stylesheet and ECharts dependency transitively. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Selection and action events | Consumer-owned analytics for navigation and market actions. | Consuming application. |
| Rendering failures | Consumer-owned chart/data error instrumentation. | Consuming application. |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| State ownership | Decided | Consumers own market and selection state; ECharts owns only its DOM lifecycle. | Product + engineering |
| Chart engine | Decided | Use ECharts for a prop-driven single line series with optional reference marker. | Engineering |
| Internal behavior | Decided | Components may use internal state, effects, timers, and browser APIs for presentation and DOM behavior; market data and other external product state remain consumer-owned. | Engineering |

## Rollout and risks

- ECharts increases package weight; consumers should import this feature only where needed.
- Input values can become stale if consumer feeds lag; the component never claims data freshness.
- Start with the Stakeland consumer and validate visual and interaction parity before wider reuse.
