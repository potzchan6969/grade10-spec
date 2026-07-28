# Design

`FeaturedMarkets` is a controlled responsive root. Its generic discriminated selection identifies either a duration market or event; typed async states independently model duration/event lists and each presentation.

The package supplies foundational `Stack`, `Surface`, `Text`, `Badge`, `Skeleton`, and `SegmentedControl` components, then composes navigation, source tabs, market header/stats/outcomes/insight, desktop chart cards, and mobile summary cards.

`FeaturedMarketLineChart` is the DOM-backed chart runtime. It receives a resolved line series, optional current/reference values, formatting precision, and an accessible description. It mounts ECharts, updates it when props change, observes resize, and disposes on unmount. It has no feed, application-state subscription, store, or router dependency.

The app-neutral checker permits internal React state, effects, refs, timers, and browser APIs for presentation and DOM behavior throughout the package. It rejects external data, persistence, application stores, routing, analytics, and feature-flag integrations; consumer-owned product state continues to enter through props.

Validation includes component tests, Storybook interaction stories, stateless checking, generated declarations, and linting.
