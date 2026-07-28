# `@acetrader/pred-spec-ui`

Portable, stateless React components produced alongside product specifications. The package deliberately has no app dependencies and treats React as a peer dependency.

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

## Authoring components

Components must be prop-driven and free of data access, routing, stores, effects, context, and browser APIs. Add an exported prop type, write Storybook stories in `apps/ui`, then run:

```bash
pnpm run check:components
pnpm run build:components
```

Commit the generated `dist/` files whenever `src/` or its public exports change.
