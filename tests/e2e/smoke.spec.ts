import { expect, test } from "playwright/test";

test.describe("smoke", () => {
  test("frontend shell loads from root redirect", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/algorithm-validation$/);
    await expect(page.locator(".sidebar-logo")).toHaveText("MPI");
    await expect(page.locator(".content-wrapper")).toBeVisible();
  });
});

