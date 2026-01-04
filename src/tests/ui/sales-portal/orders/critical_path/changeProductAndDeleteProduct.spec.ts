import { generateProductData } from "data/salesPortal/products/generateProductData";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/business.fixture";

test.describe("[UI][Orders][Edit Product details] - Change and Delete", () => {
    let orderId: string;
    let customerId: string;
    let productId: string;
    let customerName: string;
    let productName: string;
    let token: string;

    test.beforeAll(async ({ loginApiService, customersApiService, productsApiService }) => {
        const { token: authToken } = await loginApiService.loginAsAdminWithUser();
        token = authToken;
        
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

    test("Should successfully change and then delete product in the Order", 
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
    
        const changedProductName = await editProductsModal.selectOtherProduct(0);
        await expect(editProductsModal.saveButton).toBeEnabled();
        await editProductsModal.clickSave();
        await editProductsModal.waitForClosed();
        
        await orderDetailsPage.verifyToastMessage(NOTIFICATIONS.ORDER_UPDATED);
        await orderDetailsPage.closeSpecificToast(NOTIFICATIONS.ORDER_UPDATED);
    
        await expect(orderDetailsPage.productNames).toContainText([changedProductName]);
    
        await orderDetailsPage.clickEditProduct();
        await editProductsModal.waitForOpened();
    
        const currentCount = await editProductsModal.getProductDropdownsCount();
        if (currentCount <= 1) {
            await editProductsModal.clickAddProduct();
            await editProductsModal.selectOtherProduct(1); 
        }
    
        await editProductsModal.deleteProduct(changedProductName);
        
        await expect(editProductsModal.saveButton).toBeEnabled();
        await editProductsModal.clickSave();
        await editProductsModal.waitForClosed();
    
        await orderDetailsPage.verifyToastMessage(NOTIFICATIONS.ORDER_UPDATED);
        await orderDetailsPage.closeSpecificToast(NOTIFICATIONS.ORDER_UPDATED);
                
        const finalProducts = await orderDetailsPage.getProductNames();
        expect(finalProducts).not.toContain(changedProductName);
    });
});