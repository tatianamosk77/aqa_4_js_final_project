import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/business.fixture";

test.describe("[UI] [Orders]", () => {
	let token = "";
	let id_product = "";
	let id_order = "";
	let id_customer = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.beforeEach(async ({ loginUIService }) => {
		//убрать, когда пойму из-за чего редиректит не туда куда надо
		await loginUIService.loginAsAdmin();
	});

	test.afterEach(async ({ productsApiService, customersApiService, ordersApiService }) => {
		if (id_order) await ordersApiService.deleteOrder(token, id_order);
		id_order = "";
		if (id_customer) await customersApiService.delete(id_customer, token);
		id_customer = "";
		if (id_product) await productsApiService.delete(token, id_product);
		id_product = "";
	});

	test(
		"Add order with service",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ addNewOrderPage, ordersListPage, ordersListUIService, customersApiService, productsApi }) => {
			// token = await ordersListPage.getAuthToken();
			const customer = await customersApiService.create(token);
			id_customer = customer._id;
			const customer_name = customer.name;

			const createdProduct = await productsApi.create(generateProductData(), token);
			id_product = createdProduct.body.Product._id;
			const product_name = createdProduct.body.Product.name;

			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await expect(addNewOrderPage.createOrderPageTitle).toHaveText("Create Order");

			await addNewOrderPage.selectCustomerAndProduct(customer_name, product_name);
			await addNewOrderPage.clickCreate();

			await ordersListPage.waitForOpened();
			await expect(ordersListPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_CREATED);

			await expect(ordersListPage.tableRowsByEmail(customer.email)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: any) => order.email === customer.email);
			console.log(order);
			id_order = order!._id;
		},
	);
});