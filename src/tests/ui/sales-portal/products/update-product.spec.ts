import { test, expect } from "fixtures/business.fixture";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import _ from "lodash";
import { convertToFullDateAndTime } from "utils/date.utils";
import { TAGS } from "data/tags";


test.describe("[Sales Portal] [Products] [E2E Update]", async () => {
    let id = "";
    let token = "";

    test("Update product with services", {
        tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.UI],
    },
        async ({
            addNewProductUIService,
            productsListPage,
            editUIService
        }) => {
            token = await productsListPage.getAuthToken();
            await addNewProductUIService.open();
            const createdProduct = await addNewProductUIService.create();
            id = createdProduct._id;
            await productsListPage.closeToast()
            await editUIService.open(id)
            const editedProduct = await editUIService.edit(id)
            await expect(productsListPage.toastMessage).toContainText(NOTIFICATIONS.PRODUCT_UPDATED);
            await expect(productsListPage.tableRowByName(editedProduct.name)).toBeVisible();

            await productsListPage.detailsButton(editedProduct.name).click();
            const { detailsModal } = productsListPage;
            await detailsModal.waitForOpened();
            const actual = await detailsModal.getData();

            expect(actual).toEqual({
                ..._.omit(editedProduct, ["_id"]),
                createdOn: convertToFullDateAndTime(editedProduct.createdOn),
            });

        });

    test.afterEach(async ({ productsApiService }) => {
        if (id) await productsApiService.delete(token, id);
        id = "";
    });
});