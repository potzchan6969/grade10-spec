# Featured Markets reusable component

## Summary

Prediction-market applications need a consistent featured-markets surface that can display curated duration and trending markets without coupling the view to an app's stores, feeds, routing, or analytics. The reusable component provides desktop navigation/chart and mobile card layouts from consumer-supplied state.

## Context

- Problem or opportunity: The Stakeland Featured Markets panel combines valuable UI patterns with application-owned data orchestration, preventing reuse by another consumer.
- Evidence and links: Source reference: `/Users/tonyliang/workspace/stakeland-site/apps/bull-bear/bull-bear-site/components/features/predictions/FeaturedMarkets/FeaturedMarketsPanelWithStore.tsx`.
- Related PRDs, OpenSpec changes, and designs: `openspec/changes/add-featured-markets-component/`.

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

## Experience and requirements

### Primary flow

1. The consuming app supplies duration markets, trending events, and a controlled selection.
2. On desktop, the user selects a duration, asset, or trending event; the app updates selection through callbacks and the panel renders the matching chart or card presentation.
3. On mobile, the user switches between Crypto and Trending tabs and sees the supplied card stack.
4. The app owns any resulting navigation, retry, source change, or Browse All behavior.

### States and edge cases

| State | User-facing behavior | Recovery or next action |
| --- | --- | --- |
| Loading | Labelled skeletons preserve panel/card placement. | Consumer replaces the typed state when data resolves. |
| Empty | A supplied or default no-markets message is visible. | User can select another navigation item when available. |
| Error | Visible error message and optional retry action. | Consumer owns retry callback and data refresh. |
| Narrow viewport | Desktop panel becomes the controlled mobile tab and card layout. | No navigation state is lost. |
| Chart unavailable | Chart content renders an empty/error status without masking the market summary. | Consumer supplies updated chart state. |

### Acceptance criteria

- [ ] The public selection and async-state inputs are discriminated unions and all user interaction is callback-driven.
- [ ] Desktop and mobile layouts render from the same market model without app imports or external data access.
- [ ] Loading, empty, error, disabled, source-selection, and narrow-width states are visible in Storybook.
- [ ] The ECharts line chart accepts resolved points and cleans up its local chart instance; it never fetches or subscribes to data.
- [ ] Keyboard users can operate navigation, segmented controls, actions, and retry controls with visible focus.

## UI component contract

| Component | Required props/states | Accessibility notes | Consumers |
| --- | --- | --- | --- |
| `FeaturedMarkets` | Controlled selection, mobile tab, typed duration/event async states, callbacks | Navigation and tabs expose selected state programmatically. | Stakeland-site and future prediction-market apps. |
| `FeaturedMarketLineChart` | Typed line-chart async state with accessible description | The chart has an accessible summary and does not use color as its sole signal. | `FeaturedMarketChartCard`; standalone integrations. |
| Foundation primitives | Content and visual-state props | Semantic elements and focus styles are built in. | Featured Markets and future portable surfaces. |

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

## Accessibility and content

- Keyboard and focus behavior: Buttons and tabs are native controls with focus-visible styling; disabled actions use native disabled semantics.
- Screen-reader labels and announcements: Consumer supplies chart description, source/action labels, and status text; loading and error states are labelled.
- Responsive behavior: Desktop is shown at 768px and above; mobile cards and segmented tabs are shown below that width.
- Content and localization constraints: All market labels, number formatting, countdown/status text, and error content are supplied by consumers.

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| State ownership | Decided | Consumers own market and selection state; ECharts owns only its DOM lifecycle. | Product + engineering |
| Chart engine | Decided | Use ECharts for a prop-driven single line series with optional reference marker. | Engineering |
| Runtime exception | Decided | Refs/effects/ResizeObserver are limited to the documented chart-runtime directory. | Engineering |

## Rollout and risks

- ECharts increases package weight; consumers should import this feature only where needed.
- Input values can become stale if consumer feeds lag; the component never claims data freshness.
- Start with the Stakeland consumer and validate visual and interaction parity before wider reuse.
