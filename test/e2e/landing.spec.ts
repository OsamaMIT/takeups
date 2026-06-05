import { expect, test } from "@playwright/test";

test("landing page exposes create and join flows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("TAKEUPS").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Create Room/i })).toBeVisible();
  await page.getByPlaceholder("Enter your name").fill("Judge");
  await page.getByRole("button", { name: /Create Room/i }).click();
  await expect(page).toHaveURL(/\/room\/[A-Z0-9]+/);
});
