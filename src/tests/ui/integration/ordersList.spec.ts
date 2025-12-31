import { test, expect } from "fixtures/business.fixture";
import { apiConfig } from "config/apiConfig";
import { OrdersSortField, OrdersTableHeader, HEADER_TO_SORT_FIELD } from "data/types/order.types";
import { SortOrder } from "data/types/core.types";
import { convertToDateAndTime } from "utils/date.utils";
import { TAGS } from "data/tags";
import { generateOrderData } from "data/salesPortal/orders/generateOrderData";

test.describe("[Integration] [Sales Portal] [Orders] [Table Sorting]", () => {
  const directions = ["asc", "desc"] as const satisfies SortOrder[];

  const headers = [
    "Order Number",
    "Email",
    "Price",
    "Delivery",
    "Status",
    "Assigned Manager",
    "Created On",
  ] as const satisfies OrdersTableHeader[];

  const headerToColumnName: Record<OrdersTableHeader, string> = {
    "Order Number": "orderNumber",
    Email: "email",
    Price: "price",
    Delivery: "delivery",
    Status: "status",
    "Assigned Manager": "assignedManager",
    "Created On": "createdOn",
  };

  for (const header of headers) {
    for (const direction of directions) {
      test(`Field: ${header}, direction: ${direction} → sends correct API sort and updates UI`,
        { tag: [TAGS.VISUAL_REGRESSION, TAGS.ORDERS, TAGS.INTEGRATION] },
        async ({
          loginAsAdmin,
          loginApiService,
          customersApiService,
          ordersListPage,
          mock,
          page,
        }) => {
          let token = "";
          let id = "";

          try {
            const headersMapper: Record<string, OrdersSortField> = HEADER_TO_SORT_FIELD;

            token = await loginApiService.loginAsAdmin();
            const customer = await customersApiService.create(token);
            id = customer._id;

            const orders = [
              generateOrderData(customer._id),
              generateOrderData(customer._id),
              generateOrderData(customer._id),
            ];

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
                sortOrder: directions.find(d => d !== direction)!,
              },
            });

            await loginAsAdmin();
            await ordersListPage.open();
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

            let request: any;
            let url: URL | null = null;

            for (let attempt = 0; attempt < 3; attempt++) {
              [request] = await Promise.all([
                page.waitForResponse(res => {
                  const u = new URL(res.url());
                  return (
                    u.pathname === apiConfig.endpoints.orders &&
                    u.searchParams.get("sortField") === HEADER_TO_SORT_FIELD[header] &&
                    u.searchParams.get("sortOrder") === direction &&
                    u.searchParams.get("page") === "1" &&
                    u.searchParams.get("limit") === "10"
                  );
                }),
                ordersListPage.sortByColumn(headerToColumnName[header]),
              ]);

              url = new URL(request.url());
              if (url.searchParams.get("sortOrder") === direction) break;
            }

            await ordersListPage.waitForOpened();

            expect(url!.pathname).toBe(apiConfig.endpoints.orders);
            expect(url!.searchParams.get("sortField")).toBe(HEADER_TO_SORT_FIELD[header]);
            expect(url!.searchParams.get("sortOrder")).toBe(direction);
            expect(url!.searchParams.get("page")).toBe("1");
            expect(url!.searchParams.get("limit")).toBe("10");

            const tableData = await Promise.all(
              Array.from({ length: orders.length }, (_, i) => ordersListPage.getOrderData(i))
            );

            expect(tableData.length).toBe(orders.length);

            tableData.forEach((row, i) => {
              const expected = {
                ...orders[i],
                createdOn: convertToDateAndTime(orders[i]!.createdOn),
                assignedManager: orders[i]!.assignedManager ?? "-",
                delivery: orders[i]!.delivery ?? "-",
              };

              expect(row).toMatchObject({
                assignedManager: expected.assignedManager,
                delivery: expected.delivery,
                createdOn: expected.createdOn,
                email: expected.customer!.email,
                orderNumber: expected._id,
                status: expected.status,
                price: `$${expected.total_price}`,
              });
            });
          } finally {
            if (token && id) {
              await customersApiService.delete(token, id).catch(error => {
                console.warn(`[cleanup] Failed to delete customer ${id}:`, error?.message ?? error);
              });
            }
          }
        }
      );
    }
  }
});
