import { generateProductData } from "data/salesPortal/products/generateProductData";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/business.fixture";

test.describe("[Smoke][Sales Portal][Orders] Manager", () => {
    let token: string;
    let customerName: string;
    let customerId: string;
    let productName: string;
    let productId: string;
    let orderId: string;
  
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
  
    test("Should successfully add manager to order", 
        { tag: [TAGS.UI, TAGS.CRITICAL_PATH, TAGS.ORDERS] },
        async ({
          homeUIService,
          ordersListUIService,
          orderDetailsPage,
          ordersListPage,
          addNewOrderUIService,
          assignManagerModal,
        }) => {
          await homeUIService.openAsLoggedInUser();
          await ordersListUIService.openOrdersList();

          await ordersListUIService.createNewOrder();
          const response = await addNewOrderUIService.createMinimalOrderStable(
            customerName,
            productName
          );
          orderId = response.order._id;

          await ordersListPage.navigateToOrderDetails(orderId);
          await orderDetailsPage.waitForOpened();
          
          await orderDetailsPage.clickSelectManager();
         
          const managerName = await assignManagerModal.chooseDifferentManager();
         
          await assignManagerModal.clickSave();
         
          await orderDetailsPage.verifyToastMessage(NOTIFICATIONS.MANAGER_ASSIGNED);
                  
          const assignedManager = await orderDetailsPage.getAssignedManagerName();
          expect(assignedManager).toBe(managerName);
        });
    });