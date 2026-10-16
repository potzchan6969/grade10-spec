## 1. The coupon list story (grade10-spec)

- [x] 1.1 `CouponList`'s `Wallet` story draws every coupon with no code and no copy action, and its play test holds that (`packages/ui/src/blocks/loyalty-membership/coupon-list.stories.tsx`)
- [x] 1.2 The Coupons page embeds the `Wallet` story in place of `Default`, and its 🚧 comes off
- [ ] 1.3 Verify: the story's play test in the Storybook lane — blocked: the local headless browser crashes on load in this sandbox; run `pnpm --dir packages/ui test:stories` where a browser runs
