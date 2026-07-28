# `@acetrader/pred-spec-ui`

Portable, app-neutral React components produced alongside product specifications. React remains a peer dependency; the package includes ECharts for the prop-driven Featured Markets line chart.

Components may use shadcn/ui utility classes. Consumer applications must use Tailwind CSS v4 and import the package stylesheet once from their global CSS:

```css
@import "tailwindcss";
@import "@acetrader/pred-spec-ui/styles.css";
```

The stylesheet loads shadcn's shared Tailwind utilities and scans this package's emitted `dist/` files, so generated component classes are included in the consumer's Tailwind output.

## Consumer setup with a Git submodule

From a consuming application repository:

```bash
git submodule add git@github.com:9gag/acetrader-predictions-spec.git vendor/pred-spec
pnpm add file:vendor/pred-spec/packages/ui-components
```

Import from the package name:

```tsx
import { Button } from '@acetrader/pred-spec-ui';

export function SavePanel() {
  return <Button onClick={() => undefined}>Save</Button>;
}
```

The package commits its generated `dist/` directory so the `file:` dependency works without this repository's development dependencies. The consumer controls styling with normal selectors, for example `button[data-tone='primary']`.

## Updating a consumer

1. In the consumer repository, update the submodule to a reviewed commit from this repository.
2. Reinstall with `pnpm install` if the package version or exports changed.
3. Run the consumer application's tests and visual review.
4. Commit the submodule SHA and lockfile together.

## Featured Markets

`FeaturedMarkets` is a responsive, controlled surface. Consumers supply normalized duration/event data, selection state, callbacks, formatted values, and chart points; the component never fetches, subscribes to a market feed, routes, or records analytics.

```tsx
import {
  FeaturedMarkets,
  type FeaturedMarketsProps,
} from "@acetrader/pred-spec-ui";

const props: FeaturedMarketsProps = {
  // assets, durations, typed async market states, selection, and callbacks
};

export function PredictionFeature() {
  return <FeaturedMarkets {...props} />;
}
```

The package owns only ECharts' local DOM lifecycle in `FeaturedMarketLineChart`: it mounts the renderer, updates it when resolved props change, observes resize, and disposes it on unmount. It does not own product or external application state.

## Featured Markets test reference

Featured Markets uses layered checks. Keep each layer focused on the risk it is intended to catch; do not move application-store, API, routing, or analytics tests into this portable package.

| Test type | Where it lives | What it verifies |
| --- | --- | --- |
| Static component-policy check | `packages/ui-components/scripts/check-stateless-components.sh` | Shared components do not introduce local product state, stores, data access, routing, analytics, or undocumented browser runtime APIs. |
| Type checking and package build | `pnpm run build:components` | Public generic props and discriminated async states compile into the published package. |
| Story render tests | `apps/ui/src/stories/FeaturedMarkets.stories.tsx` | The desktop chart, loading, error, and mobile layouts render from consumer-supplied props. |
| Browser interaction tests | `Interactions` story's `play` function | Controlled asset/event selection updates accessible DOM state and selected market content in Chromium. |
| Chart-runtime render coverage | `DesktopChart` story | ECharts mounts from ready-state fixture data in a browser, using the package's only allowed DOM-backed runtime. |

### State-contract sample

The async union ensures each boundary must explicitly handle loading, empty, error, or resolved data:

```ts
export type FeaturedAsyncState<T> =
  | { status: "loading" }
  | { status: "empty"; message?: string }
  | { status: "error"; message: string; onRetry?: () => void }
  | { status: "ready"; data: T };
```

For example, the loading story intentionally supplies no market data:

```tsx
export const Loading: Story = {
  render: () => (
    <FeaturedMarkets
      {...featuredProps}
      durationMarkets={{ status: "loading" }}
    />
  ),
};
```

### Controlled-interaction sample

Story fixtures may use local state to emulate a consumer. The shared component itself remains controlled.

```tsx
function FeaturedMarketsDemo() {
  const [selection, setSelection] = useState(featuredProps.selection);

  return (
    <FeaturedMarkets
      {...featuredProps}
      selection={selection}
      onSelectionChange={setSelection}
    />
  );
}
```

The `Interactions` story then exercises that contract in Chromium:

```tsx
await userEvent.click(canvas.getByRole("tab", { name: /ETH/ }));
expect(canvas.getByRole("tab", { name: /ETH/ }))
  .toHaveAttribute("aria-selected", "true");

await userEvent.click(
  canvas.getByRole("button", { name: "Will Bitcoin exceed $150K?" }),
);
expect(
  canvas.getByRole("heading", { name: "Will Bitcoin exceed $150K?" }),
).toBeInTheDocument();
```

### Running the implemented checks

```bash
pnpm run check:components
pnpm run build:components
pnpm --dir apps/ui exec vitest run
pnpm --dir apps/ui run build-storybook
pnpm run lint
```

The Storybook Vitest project uses headless Chromium through Playwright, configured in `apps/ui/vite.config.ts`. `build-storybook` is a separate production-build check, not a substitute for interaction coverage.

### Current limits and extension guidance

The Storybook accessibility addon is enabled, but its project setting is currently `a11y.test: "todo"`; it reports violations without failing CI. Change it to `"error"` only when the affected stories meet the resulting baseline.

Visual regression baselines and isolated chart-option unit tests are not implemented yet. Add visual coverage with deterministic chart data and disabled/frozen animation; extract a pure option-builder first if chart-option rules become sufficiently complex. End-to-end tests of actual stores, API mapping, navigation, countdowns, or analytics belong in a consuming application.

## Authoring components

Components must be prop-driven and free of data access, routing, stores, feature flags, analytics, context, and local product state. A documented DOM-backed visual runtime may use refs, effects, and browser APIs only to mount, update from props, resize, and dispose itself. Add an exported prop type, write Storybook stories in `apps/ui`, then run:

```bash
pnpm run check:components
pnpm run build:components
```

Commit the generated `dist/` files whenever `src/` or its public exports change.
