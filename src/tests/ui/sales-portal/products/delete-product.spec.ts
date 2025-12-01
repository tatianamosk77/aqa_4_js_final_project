import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/business.fixture";

test.describe("[Sales Portal] [Products]", () => {
    test("Delete", {
        tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.UI],
    }, async ({
        productsListUIService,
        homeUIService,
        productsApiService,
        productsListPage,
        productsApi,
    }) => {
        const token = await productsListPage.getAuthToken();
        await productsListPage.open();
        const createdProduct = await productsApiService.create(token);
        await homeUIService.openModule("Products");
        await productsListUIService.deleteProduct(createdProduct.name);
        const deleted = await productsApi.getById(createdProduct._id, token);
        expect(deleted.status).toBe(STATUS_CODES.NOT_FOUND);
        await expect(productsListPage.toastMessage).toContainText(NOTIFICATIONS.PRODUCT_DELETED);
        await expect(productsListPage.tableRowByName(createdProduct.name)).not.toBeVisible();

    });
});