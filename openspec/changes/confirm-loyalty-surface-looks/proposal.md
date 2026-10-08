**Author:** @ecchochan - 2026-10-07

## Why

never-lock-a-coupon gives a reward coupon no code, while the Coupons page's
story draws a code and a Copy code button on every coupon. The picture
promises a code the member will not find.

The design-phase asks this change opened are answered as recommended
(decisions Q1-Q2): the reward editor's departures from the mock are the
agreed look. What is left to build is the story.

**Metric:** coupon pictures on the Coupons page that draw a code a reward
coupon lacks, down to none.

## What Changes

- **Coupon list story** - a new story of the member's coupon list with no
  code and no copy action, embedded on the Coupons page in place of the one
  it shows

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/loyalty/programme`: the coupon list's story

## Impact

- **`packages/ui`** - the coupon list stories
- **Feature changes** - never-lock-a-coupon and align-reward-editor-design
  ship as built and do not wait on this change

## References

- [Coupons · Validity](../../../docs/prds/products/grade10-site/loyalty/coupons.md#validity)
