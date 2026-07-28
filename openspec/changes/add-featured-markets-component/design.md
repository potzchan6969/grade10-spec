# Design

`FeaturedMarkets` is a controlled responsive root. Its generic discriminated selection identifies either a duration market or event; typed async states independently model duration/event lists and each presentation.

The package supplies foundational `Stack`, `Surface`, `Text`, `Badge`, `Skeleton`, and `SegmentedControl` components, then composes navigation, source tabs, market header/stats/outcomes/insight, desktop chart cards, and mobile summary cards.

`FeaturedMarketLineChart` is the only DOM-backed runtime. It receives a resolved line series, optional current/reference values, formatting precision, and an accessible description. It mounts ECharts, updates it when props change, observes resize, and disposes on unmount. It has no feed, application state, timer, store, or router dependency.

The stateless checker allows refs, effects, and `ResizeObserver` solely below `src/FeaturedMarkets/chart-runtime/`; it rejects all external integration and local product-state patterns in the package.

Validation includes component tests, Storybook interaction stories, stateless checking, generated declarations, and linting.
