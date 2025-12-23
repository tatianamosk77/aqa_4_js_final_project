import { ROUTES } from "config/uiConfig";
import { expect, test } from "fixtures/index";
import { TAGS } from "data/tags";

test.describe("Orders navigation", () => {
  test.describe("From Home", () => {
    test.beforeEach(async ({ page, headerPage }) => {
      await page.goto(ROUTES.HOME);
      await expect(headerPage.uniqueElement).toBeVisible();
    });

    test("Orders page can be accessed through the navigation menu",
      { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDERS] },
      async ({ page, headerPage, ordersListUIService }) => {
        await headerPage.clickModule("Orders");
        await ordersListUIService.verifyOrdersListLoaded();

        await expect(page).toHaveURL(/#\/orders$/);
        await expect(headerPage.moduleButtons["Orders"]).toHaveClass(/active/);
      }
    );

    test("Orders page can be opened via Home module button",
      { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDERS] },
      async ({ page, homePage, headerPage, ordersListUIService }) => {
        await homePage.clickOnViewModule("Orders");
        await ordersListUIService.verifyOrdersListLoaded();

        await expect(page).toHaveURL(/#\/orders$/);
        await expect(headerPage.moduleButtons["Orders"]).toHaveClass(/active/);
      }
    );
  });

  test.describe("On Orders page", () => {
    test.beforeEach(async ({ ordersListUIService, headerPage }) => {
      await ordersListUIService.openOrdersList();
      await ordersListUIService.verifyOrdersListLoaded();
      await expect(headerPage.uniqueElement).toBeVisible();
    });

    test("Orders page is opened by URL and loaded",
      { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDERS] },
      async ({ page, headerPage }) => {
        await expect(page).toHaveURL(/#\/orders$/);
        await expect(headerPage.moduleButtons["Orders"]).toHaveClass(/active/);
      }
    );

    test("Active menu item is highlighted on Orders page",
      { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDERS] },
      async ({ headerPage }) => {
        await expect(headerPage.moduleButtons["Orders"]).toHaveClass(/active/);
        await expect(headerPage.moduleButtons["Customers"]).not.toHaveClass(/active/);
        await expect(headerPage.moduleButtons["Products"]).not.toHaveClass(/active/);
        await expect(headerPage.moduleButtons["Home"]).not.toHaveClass(/active/);
      }
    );
  });
}); 
