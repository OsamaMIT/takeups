import { expect, test } from "@playwright/test";

test("landing page exposes create and join flows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("TAKEUPS").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Create Room/i })).toBeVisible();
  await page.getByPlaceholder("Enter your name").fill("Judge");
  await page.getByRole("button", { name: /Create Room/i }).click();
  await expect(page).toHaveURL(/\/room\/[A-Z0-9]+/);
});

test("invite room does not auto-join while typing a new name", async ({ page }) => {
  await page.goto("/room/TYP123");
  const nameInput = page.getByRole("textbox", { name: /Display Name/i });
  await expect(nameInput).toBeVisible();
  await nameInput.fill("Guest");
  await page.waitForTimeout(400);
  await expect(nameInput).toHaveValue("Guest");
  await expect(page.getByRole("button", { name: /Join Room/i })).toBeVisible();
});
