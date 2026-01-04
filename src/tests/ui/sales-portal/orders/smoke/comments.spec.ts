import { test, expect } from "fixtures/business.fixture";
import { TAGS } from "data/tags";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";

test.describe("[Smoke][Sales Portal][Orders] Comments", () => {
  let token: string;
  let customerName: string;
  let orderId: string;

  test.beforeAll(async ({ loginApiService, customersApiService }) => {
    const { token: authToken } = await loginApiService.loginAsAdminWithUser();
    token = authToken;

    const customer = await customersApiService.create(token, generateCustomerData());
    customerName = customer.name;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderId) {
      await ordersApiService.delete(orderId, token);
      orderId = "";
    }
  });

  test(
    "Comments - create comment",
    { tag: [TAGS.SMOKE, TAGS.ORDERS, TAGS.UI] },
    async ({ ordersListUIService, addNewOrderUIService, commentsTab }) => {
      await ordersListUIService.openOrdersList();
      await ordersListUIService.createNewOrder();
      const response = await addNewOrderUIService.createMinimalOrder(customerName);
      orderId = response.order._id;
      await ordersListUIService.openOrderDetails(orderId);

      // comments tab is opened by default
      await expect(commentsTab.uniqueElement).toBeVisible();

      const commentText = "test comment";
      await commentsTab.typeComment(commentText);
      await expect(commentsTab.createNewCommentButton).toBeEnabled();
      await commentsTab.clickCreate();

      const createdCommentText = await commentsTab.getCommentText(0);
      expect(createdCommentText).toBe(commentText);
    }
  );

  test(
    "Comments - delete comment",
    { tag: [TAGS.SMOKE, TAGS.ORDERS, TAGS.UI] },
    async ({ ordersListUIService, addNewOrderUIService, commentsTab }) => {
      await ordersListUIService.openOrdersList();
      await ordersListUIService.createNewOrder();

      const response = await addNewOrderUIService.createMinimalOrder(customerName);
      orderId = response.order._id;
      await ordersListUIService.openOrderDetails(orderId);

      const commentText = "comment to delete";
      await commentsTab.typeComment(commentText);
      await commentsTab.clickCreate();

      const createdCommentText = await commentsTab.getCommentText(0);
      expect(createdCommentText).toBe(commentText);

      await commentsTab.clickDeleteComment(0);
      await commentsTab.waitForSpinners();

      const comments = await commentsTab.getAllComments();
      expect(comments.length).toBe(0);
    }
  );
});
