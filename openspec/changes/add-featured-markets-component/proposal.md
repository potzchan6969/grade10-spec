# Add Featured Markets component

PRD: [`docs/prds/predictions/featured-markets-component.md`](../../../docs/prds/predictions/featured-markets-component.md)

## Why

The current Featured Markets experience is store-connected and cannot be consumed from this repository. A portable, controlled component system lets Stakeland and future apps provide their own market data while preserving the intended experience.

## Scope

- Add Stakeland-dark foundation primitives and Featured Markets desktop/mobile composites.
- Export strict async-state, selection, market presentation, chart, and summary-card contracts.
- Add a prop-driven ECharts line-chart runtime and narrowly revise shared-component policy to permit its local DOM lifecycle.
- Add docs, tests, stories, package build output, and consumer integration guidance.

## Consumer impact

`@acetrader/pred-spec-ui` gains backward-compatible `Button` props and new public exports. Stakeland-site must adapt app stores, feeds, formatting, routing, and analytics into the exported controlled props; no consumer migration is required until it adopts the component.

## Non-goals

No API integration, market normalization, live subscriptions, app routing, analytics, candlestick charts, or app design-system imports are added.
