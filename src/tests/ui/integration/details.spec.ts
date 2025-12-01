import { test, expect } from "fixtures/business.fixture";
import { generateProductResponseData } from "data/salesPortal/products/generateProductData";
import _ from "lodash";
import { convertToFullDateAndTime } from "utils/date.utils";
import { TAGS } from "data/tags";

test.describe("[Integration] [Sales Portal] [Products]", () => {
    test("Product Details",
        {
            tag: [TAGS.VISUAL_REGRESSION, TAGS.PRODUCTS, TAGS.INTEGRATION],
        },
        async ({ loginAsAdmin, productsListPage, mock }) => {

            const expectedProductResponse = generateProductResponseData();
            await mock.productsPage({
                Products: [expectedProductResponse],
                IsSuccess: true,
                ErrorMessage: null,
                total: 1,
                page: 1,
                limit: 10,
                search: "",
                manufacturer: [],
                sorting: {
                    sortField: "createdOn",
                    sortOrder: "desc",
                },
            });

            await mock.productDetailsModal({
                Product: expectedProductResponse,
                IsSuccess: true,
                ErrorMessage: null,
            });
            await loginAsAdmin()
            await productsListPage.open();
            await productsListPage.waitForOpened();
            await productsListPage.clickAction(expectedProductResponse.name, "details");
            const { detailsModal } = productsListPage;
            await detailsModal.waitForOpened();
            const actual = await detailsModal.getData();
            expect(actual).toEqual({
                ..._.omit(expectedProductResponse, ["_id"]),
                createdOn: convertToFullDateAndTime(expectedProductResponse.createdOn),
            });
        });
});