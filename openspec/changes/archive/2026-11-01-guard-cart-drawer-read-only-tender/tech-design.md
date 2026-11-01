## Context

The shared Cart Drawer already accepts optional callbacks for promo, held-code,
points, disclosure, and tender-removal state. Its footer and nested promo sheet
currently call those callbacks optionally, but several corresponding controls
are rendered regardless of whether a callback exists. The affected component
and Storybook stories live in `packages/ui`; the component owns no tender data,
cart state, navigation, or persistence.

The [shared Cart Drawer capability](../../specs/shared/ui/store-cart/spec.md)
defines the callback-gated behavior. The Grade10 host remains a separate
consumer change and continues to own the decision to supply display-only
context or interactive tender callbacks.

## Goals / Non-Goals

**Goals:**

- Keep the optional callback API backward compatible.
- Make each tender action disappear when its matching callback is absent.
- Preserve supplied promo and points context in display-only states.
- Preserve the current interactive rendering, callback payloads, loading states,
  and consumer-owned state transitions.
- Prove both modes with Storybook interaction checks.

**Non-Goals:**

- A new read-only prop or a combined-quote contract.
- Any cart, checkout, backend, persistence, or navigation change.
- Changes to design tokens, Figma frames, or the visual hierarchy of existing
  controls.

## Decisions

### Keep callback props optional and derive presence at the render boundary

The public `CartDrawer`, `CartDrawerFooter`, and `CartPromoSheet` props remain
unchanged. Each component derives whether its own action can act from the
callback it already receives, then omits the action when the callback is
missing. No consumer passes a no-op function to make the control disappear.

The render ownership is:

| Surface | Callback | Missing callback result |
| --- | --- | --- |
| Typed promo entry and Apply | `onApplyPromo` | Omit the input and Apply pair |
| Applicable held-code Apply | `onSelectHeldPromo` | Keep the ticket and omit its action slot |
| Points amount entry and Apply | `onApplyPoints` | Omit the entry and Apply pair |
| Use max | `onUseMaxPoints` | Omit the Use max link |
| Applied promo Remove | `onRemovePromo` | Keep the applied value and omit Remove |
| Applied points Remove | `onRemovePoints` | Keep the applied value and omit Remove |
| Promo disclosure | `onPromoStateChange` | Omit the disclosure trigger |
| Points disclosure | `onPointsStateChange` | Omit the disclosure trigger |

The existing `onBrowseLoyalty` guard remains unchanged. Callback presence is a
necessary rendering condition; existing state, loading, and open-state guards
remain the conditions that disable an otherwise available action.

**Rejected — pass no-op callbacks.** A no-op still renders an action and lets a
consumer accidentally present an affordance that cannot change tender.

**Rejected — render disabled controls.** A disabled Apply button or input still
claims the action exists and leaves space for a mutation the consumer did not
authorize. The shared chrome contract uses absence for an unavailable action.

**Rejected — add a `readOnly` prop.** A second mode flag would duplicate the
callback contract, allow contradictory combinations, and make every consumer
keep the flag synchronized with its handlers.

### Preserve display-only context independently from actions

The adapter must not filter out a held code, refusal reason, points balance,
basket ceiling, or conversion rate merely because an action callback is
missing. The promo sheet keeps the ticket rows and their supplied details; the
points disclosure keeps its supplied context. When points entry is omitted, the
implementation renders the context through the existing copy and value path
without creating a replacement tender input.

Applied promo and points values also remain visible when their removal callback
is absent. The component only removes the corresponding Remove control; it
does not infer that a missing callback means the value should be cleared.

**Rejected — hide the entire tender section.** That would prevent a read-only
consumer from showing current eligibility and the points ceiling, which are the
facts this contract is intended to preserve.

### Keep the interactive path unchanged

When a matching callback is supplied, the existing handler continues to receive
the trimmed typed code, held-code id, or points amount. Existing loading,
validation, collapse, and consumer-owned total updates remain unchanged. The
Storybook interactive member state supplies the complete callback set and
proves the action controls remain present and callable.

### Verify at the shared component boundary

Add Storybook states for a read-only member context and a complete interactive
member context. Their play functions inspect rendered controls and invoke the
callbacks with spies. The read-only state supplies display-only promo and
points context while omitting mutation callbacks; it must not rely on a
running application or backend.

## Risks / Trade-offs

- **[Risk] A consumer relied on a dead control's reserved space.** → The
  callback was never able to perform the action; the contract intentionally
  removes that space and typecheck does not hide the migration.
- **[Risk] Points context loses its existing visual path when the input is
  absent.** → Keep balance, ceiling, and rate rendering covered by the
  read-only Storybook state before changing the component.
- **[Risk] A partial callback set hides more controls than intended.** → Use a
  callback matrix in the Storybook checks and assert that unrelated supplied
  actions remain present.
- **[Risk] The Grade10 host still supplies interactive callbacks.** → Keep host
  wiring outside this change and call out the required submodule bump and host
  reconciliation in the follow-on implementation work.

## Migration Plan

1. Land the shared component guard and Storybook coverage in `grade10-spec`.
2. Publish the store change and advance consumers to the resulting shared UI
   commit.
3. In the Grade10 application, pass `selectedHeldPromoId={null}` and omit promo
   and points mutation callbacks when the host is intended to remain read-only.
4. Roll back by reverting the shared UI commit and consumer gitlink if the
   guarded rendering breaks an existing interactive consumer; no data rollback
   is required.

## Open Questions

None.
