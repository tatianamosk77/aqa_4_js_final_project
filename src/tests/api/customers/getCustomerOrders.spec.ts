import { test, expect } from "fixtures/business.fixture";
import { TAGS } from "data/tags";
import { customerOrdersSchema } from "data/schemas/orders/order.schema";
import { generateCustomerOrdersResponse } from "data/salesPortal/orders/generateOrderData";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";

test.describe("[API] [Sales Portal] [Customers]", () => {
  const ids: string[] = [];
  const token = "";

  test.afterEach(async ({ customersApiService }) => {
    if (ids.length) {
      for (const id of ids) {
        await customersApiService.delete(token, id);
      }
      ids.length = 0;
    }
  });

  test(
    "Get Customer Orders - Schema Validation",
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    async () => {
      const customerId = "19308a48c1b03ca52a43f6a8"; // any id
      const mockOrdersResponse = generateCustomerOrdersResponse(customerId, 3);

      console.log("Generated mock data:", JSON.stringify(mockOrdersResponse, null, 2));

      validateJsonSchema(customerOrdersSchema, mockOrdersResponse);

      expect(mockOrdersResponse.Orders).toHaveLength(3);
      expect(mockOrdersResponse.IsSuccess).toBe(true);
      expect(mockOrdersResponse.ErrorMessage).toBeNull();

      mockOrdersResponse.Orders.forEach(order => {
        expect(order.customer._id).toBe(customerId);
        expect(order).toHaveProperty("_id");
        expect(order).toHaveProperty("status");
        expect(order).toHaveProperty("products");
        expect(order).toHaveProperty("total_price");
        expect(order).toHaveProperty("createdOn");

        if (order.products.length > 0) {
          const calculatedTotal = order.products.reduce(
            (sum, product) => sum + product.price * product.amount,
            0
          );
          expect(order.total_price).toBe(calculatedTotal);
        }
      });
    }
  );
});
