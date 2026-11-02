/**
 * The member every loyalty letter preview is written over: a Gold member
 * holding 1,150 points, all of it lapsing on 14 Dec 2026, three-quarters of
 * the way to keeping Gold in a period ending 14 Jan 2027.
 *
 * Instants are ISO, so the letters print them on the shop's clock through
 * `format.ts`. Points are whole units — one point redeems one Hong Kong
 * dollar at checkout.
 */
export const previewMember = {
  memberUrl: "https://grade10.com/membership",
  shopUrl: "https://grade10.com",

  pointsExpiring: 1_150,
  expiryDay: "2026-12-14T00:00:00Z",

  tier: "Gold",
  periodProgress: 320,
  periodGoal: 500,
  periodEndsAt: "2027-01-14T15:59:59.999Z",
};
