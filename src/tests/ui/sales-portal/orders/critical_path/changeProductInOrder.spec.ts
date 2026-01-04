import { generateProductData } from "data/salesPortal/products/generateProductData";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/business.fixture";

test.describe("[UI][Orders][Edit Product details] - Change Product", () => {
    let orderId: string;
    let customerId: string;
    let productId: string;
    let customerName: string;
    let productName: string;
    let token: string;

    test.beforeAll(async ({ loginApiService, customersApiService, productsApiService }) => {
        const { token: authToken } = await loginApiService.loginAsAdminWithUser();
        token = authToken;

        // Создаем зависимости через API (один раз для всех тестов в файле)
        const customer = await customersApiService.create(token, generateCustomerData());
        customerId = customer._id;
        customerName = customer.name;

        const product = await productsApiService.create(token, generateProductData());
        productId = product._id;
        productName = product.name;
    });

    test.beforeEach(async ({ homeUIService, ordersListUIService, addNewOrderUIService }) => {
        await homeUIService.openAsLoggedInUser();
        
        await ordersListUIService.openOrdersList();
        await ordersListUIService.createNewOrder();
        const { order } = await addNewOrderUIService.createMinimalOrderStable(customerName, productName);
        orderId = order._id;
    });

    test.afterEach(async ({ ordersApiService }) => {
        if (orderId) {
            await ordersApiService.delete(orderId, token);
            orderId = "";
        }
    });

    test.afterAll(async ({ customersApiService, productsApiService }) => {
        if (customerId) await customersApiService.delete(token, customerId);
        if (productId) await productsApiService.delete(token, productId);
    });

    test("Should successfully change product with count validation", 
        { tag: [TAGS.UI, TAGS.CRITICAL_PATH, TAGS.ORDERS] },
        async ({
            ordersListUIService,
            orderDetailsPage,
            editProductsModal,
        }) => {
            await ordersListUIService.openOrderDetails(orderId);
            await orderDetailsPage.waitForOpened();
            
            await orderDetailsPage.clickEditProduct();
            await editProductsModal.waitForOpened();
                    
            const productsCount = await editProductsModal.getProductDropdownsCount();
            expect(productsCount).toBeGreaterThan(0);
        
            const chosenProduct = await editProductsModal.selectOtherProduct(0);
            await editProductsModal.clickSave();
            
            await orderDetailsPage.verifyToastMessage(NOTIFICATIONS.ORDER_UPDATED);
            await orderDetailsPage.closeSpecificToast(NOTIFICATIONS.ORDER_UPDATED);
            
            await expect(orderDetailsPage.productNames).toContainText([chosenProduct]);
        }
    );
});