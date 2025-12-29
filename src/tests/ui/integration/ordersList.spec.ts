import { test, expect } from "fixtures/business.fixture";
import { apiConfig } from "config/apiConfig";
import { OrdersSortField, OrdersTableHeader, HEADER_TO_SORT_FIELD } from "data/types/order.types";
import { SortOrder } from "data/types/core.types";
import { convertToDateAndTime } from "utils/date.utils";
import { TAGS } from "data/tags";
import { generateOrderData } from "data/salesPortal/orders/generateOrderData";

test.describe.serial("[Integration] [Sales Portal] [Orders] [Table Sorting]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ customersApiService }) => {
    await customersApiService.delete(token, id);
  });

  const directions = ["asc", "desc"] as SortOrder[];
  for (const header of [
    "Order Number",
    "Email",
    "Price",
    "Delivery",
    "Status",
    "Assigned Manager",
    "Created On",
  ] as OrdersTableHeader[]) {
    for (const direction of directions) {
      test(
        `Field: ${header}, direction: ${direction} → sends correct API sort and updates UI`,
        {
          tag: [TAGS.VISUAL_REGRESSION, TAGS.ORDERS, TAGS.INTEGRATION],
        },
        async ({
          loginAsAdmin,
          loginApiService,
          customersApiService,
          ordersListUIService,
          ordersListPage,
          mock,
        }) => {
          const headersMapper: Record<string, OrdersSortField> = HEADER_TO_SORT_FIELD;
          token = await loginApiService.loginAsAdmin();
          const customer = await customersApiService.create(token);
          id = customer._id;
          const order1 = generateOrderData(customer._id);
          const order2 = generateOrderData(customer._id);
          const order3 = generateOrderData(customer._id);
          const orders = [order1, order2, order3];
          await mock.ordersPage({
            Orders: orders,
            IsSuccess: true,
            ErrorMessage: null,
            total: 1,
            page: 1,
            limit: 10,
            search: "",
            status: [],
            sorting: {
              sortField: headersMapper[header]!,
              sortOrder: directions.find(el => el !== direction)!,
            },
          });

          await loginAsAdmin();
          await ordersListUIService.open();

          await mock.ordersPage({
            Orders: orders,
            IsSuccess: true,
            ErrorMessage: null,
            total: 1,
            page: 1,
            limit: 10,
            search: "",
            status: [],
            sorting: {
              sortField: headersMapper[header]!,
              sortOrder: direction,
            },
          });
          const request = await ordersListPage.interceptRequest(
            apiConfig.endpoints.orders,
            ordersListPage.clickTableHeader.bind(ordersListPage),
            header
          );

          await ordersListPage.waitForOpened();
          expect(request.url()).toBe(
            `${apiConfig.baseURL}${apiConfig.endpoints.orders}?sortField=${headersMapper[header]}&sortOrder=${direction}&page=1&limit=10`
          );

          const url = new URL(request.url());

          expect(url.pathname).toBe(apiConfig.endpoints.orders);
          expect(url.searchParams.get("sortField")).toBe(HEADER_TO_SORT_FIELD[header]);
          expect(url.searchParams.get("sortOrder")).toBe(direction);
          expect(url.searchParams.get("page")).toBe("1");
          expect(url.searchParams.get("limit")).toBe("10");

          await expect(ordersListPage.tableHeaderArrow(header, { direction })).toBeVisible();

          const tableData = await ordersListPage.getTableData();
          expect(tableData.length).toBe(orders.length);
          tableData.forEach((order, i) => {
            const expected = {
              ...orders[i],
              createdOn: convertToDateAndTime(orders[i]!.createdOn),
              assignedManager: orders[i]!.assignedManager ?? "-",
              delivery: orders[i]!.delivery ?? "-",
            };
            expect(order).toMatchObject({
              assignedManager: expected.assignedManager,
              delivery: expected.delivery,
              createdOn: expected.createdOn,
              email: expected.customer!.email,
              orderNumber: expected._id,
              status: expected.status,
              price: expected.total_price,
            });
          });
        }
      );
    }
  }
});
