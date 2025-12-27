import { expect, test } from "fixtures/index";
import { TAGS } from "data/tags";

test.describe("[UI] [Orders] [Navigation]", () => {
  test.describe("From Home", () => {
    test.beforeEach(async ({ homeUIService }) => {
      await homeUIService.openAsLoggedInUser();
    });

    test("Should open Orders page via navigation menu",
      { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDERS] },
      async ({ page, ordersListUIService, headerPage }) => {
        await ordersListUIService.openOrdersList();
        await ordersListUIService.verifyOrdersListLoaded();

        await expect(page).toHaveURL(/#\/orders$/);
        await expect(headerPage.moduleButtons["Orders"]).toHaveClass(/active/);
      }
    );

    test("Should open Orders page via Home module button",
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

    test("Should open Orders page by direct URL",
      { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDERS] },
      async ({ page, headerPage }) => {
        await expect(page).toHaveURL(/#\/orders$/);
        await expect(headerPage.moduleButtons["Orders"]).toHaveClass(/active/);
      }
    );

    test("Should highlight active Orders menu item",
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
