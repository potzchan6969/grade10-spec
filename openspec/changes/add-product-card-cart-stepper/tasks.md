# Tasks

## 1. Specification

- [x] 1.1 Record cart stepper contract in OpenSpec change delta

## 2. Implementation

- [x] 2.1 Add `ProductCardCartControl` and `ProductCardCartStepperRow`
- [x] 2.2 Integrate morphing control into `ProductCardImage`
- [x] 2.3 Replace `onCartClick` / `onProductAction` with quantity callbacks
- [x] 2.4 Update stories, fixtures, and preview cart loop
- [x] 2.5 Remove prototype harness
- [x] 2.6 Fold spec delta into durable spec

## 3. Validation

- [x] 3.1 `pnpm run typecheck`
- [x] 3.2 `pnpm run lint`
- [x] 3.3 `pnpm run test:stories:ui` (listing stories green; pre-existing `store-order-detail` audit drift unrelated)
