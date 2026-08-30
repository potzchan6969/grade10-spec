# Storybook preview app

This project is the Storybook workbench for whole product pages. It composes
design-system primitives and `@grade10/ui` blocks as a consuming application
would; it is not a production application.

## Page stories

- A story under the `Pages/` folder renders the entire shopper-facing page:
  its header, main content, and footer. Do not present an isolated collection
  of blocks as a page.
- Put page-only content and stand-in data beside the story in `src/pages/`.
  The page owns its state loop and callbacks; packages only receive props.
- Declare `parameters: { layout: "fullscreen" }` for every page story.

## Flow stories

- A story under a `Flows` folder uses `FlowContainer` from
  `packages/ui/src/blocks/shared/flow-container.tsx`.
- One flow story covers one component behaviour. Put that behaviour's related
  cases and states in the same `FlowContainer`; do not make a new Storybook
  story for each state.
- Give every flow a description below its cards. Explain why the cases need
  coverage, how the component changes for them, and the expected outcome.
  Do not repeat the component's general purpose or implementation details.
