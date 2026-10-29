import { expect, test } from "playwright/test";

for (const [component, story, alt, soldOut] of [
  ["cartitem-picture", "picture", "Card front", false],
  ["cartitem-picture", "picture-without-alt", "Gengar VMAX", false],
  ["cartitem-picture", "picture-with-empty-alt", "Gengar VMAX", false],
  ["cartitem-picture", "picture-with-whitespace-alt", "  ", false],
  ["cartitem-picture", "sold-out-picture", "Card front", true],
  ["cartdrawerbody", "pictures", "  ", false],
  ["cartdrawer", "pictures", "Card front", true],
] as const) {
  test(`${story.includes("alt") ? "shared-ui-store-cart-SC-65 - " : ""}supplied picture and callbacks - ${component}/${story}`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=store-cart-blocks-${component}--${story}&viewMode=story`,
    );
    const row = page
      .locator('[data-slot="cart-item"]')
      .filter({ hasText: "Gengar VMAX" });
    const image = row.locator("img");
    await expect(image).toHaveAttribute("alt", alt);
    await expect
      .poll(() =>
        image.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(row).toHaveAttribute(
      "data-status",
      soldOut ? "soldOut" : "default",
    );
    await expect(
      row.getByRole("button", { name: "Gengar VMAX", exact: true }),
    ).toBeEnabled();
    await expect(
      row.getByRole("button", { name: "Remove item" }),
    ).toBeEnabled();
    await expect(row.getByText("HK$100.00", { exact: true })).toBeVisible();
    if (soldOut) {
      await expect(row.getByText("Sold Out", { exact: true })).toBeVisible();
      await expect(image.locator("..")).toHaveCSS("opacity", "0.5");
      await expect(
        row.getByRole("button", { name: "Increase quantity" }),
      ).toHaveCount(0);
    } else {
      await expect(
        row.getByRole("button", { name: "Increase quantity" }),
      ).toBeEnabled();
    }
  });
}

for (const story of ["without-picture", "empty-picture-source"]) {
  test(`shared-ui-store-cart-SC-66 - Missing picture retains the placeholder (${story})`, async ({
    page,
  }) => {
    const productRequests: string[] = [];
    page.on("request", (request) => {
      if (/graphql|\/api\/|\/products\//.test(request.url()))
        productRequests.push(request.url());
    });
    await page.goto(
      `/iframe.html?id=store-cart-blocks-cartitem-picture--${story}&viewMode=story`,
    );
    const row = page
      .locator('[data-slot="cart-item"]')
      .filter({ hasText: "Gengar VMAX" });
    await expect(
      row.getByRole("button", { name: "Gengar VMAX", exact: true }),
    ).toBeVisible();
    await expect(row.locator("img")).toHaveCount(0);
    await expect(row.locator('button[aria-hidden="true"] > div')).toBeVisible();
    await expect(row.getByText("HK$100.00", { exact: true })).toBeVisible();
    await expect(row.getByRole("spinbutton")).toHaveValue("1");
    expect(productRequests).toEqual([]);
    expect(
      await page.evaluate(() =>
        Object.keys(localStorage).filter((key) => /cart|picture/i.test(key)),
      ),
    ).toEqual([]);
  });
}

test("shared-ui-store-cart-SC-64 - A supplied cart picture loads in the existing frame", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=store-cart-blocks-cartitem-picture--picture&viewMode=story",
  );
  const row = page
    .locator('[data-slot="cart-item"]')
    .filter({ hasText: "Gengar VMAX" });
  const image = row.locator("img");
  await expect(image).toHaveAttribute("alt", "Card front");
  await expect(image).toHaveAttribute("src", /cart-picture\.svg\?v=7$/);
  await expect
    .poll(() =>
      image.evaluate(
        (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(image.locator("..")).toHaveAttribute("aria-hidden", "true");
  await expect(image.locator("..")).toHaveAttribute("tabindex", "-1");
});
