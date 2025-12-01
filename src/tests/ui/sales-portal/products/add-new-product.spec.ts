import { test, expect } from "fixtures/business.fixture";
import { credentials } from "config/env";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { HomePage } from "ui/pages/home.page";
import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";
import { ProductsListPage } from "ui/pages/products/productsList.page";
import { TAGS } from "data/tags";

test.describe("[Sales Portal] [Products]", async () => {
  let id = "";
  let token = "";

  test(
    "Add new product with services",
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.PRODUCTS],
    },
    async ({ addNewProductUIService, productsListPage }) => {

      await addNewProductUIService.open();
      const createdProduct = await addNewProductUIService.create();
      id = createdProduct._id;
      token = await productsListPage.getAuthToken();
      await expect(productsListPage.toastMessage).toContainText(NOTIFICATIONS.PRODUCT_CREATED);
      await expect(productsListPage.tableRowByName(createdProduct.name)).toBeVisible();
    },
  );

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
    id = "";
  });

  test.skip(
    "Add new product",
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.UI],
    },
    async ({ page }) => {
      const homePage = new HomePage(page);
      const productsListPage = new ProductsListPage(page);
      const addNewProductPage = new AddNewProductPage(page);

      await homePage.open();

      await homePage.waitForOpened();
      await homePage.clickOnViewModule("Products");
      await productsListPage.waitForOpened();
      await productsListPage.clickAddNewProduct();
      await addNewProductPage.waitForOpened();
      const productData = generateProductData();
      await addNewProductPage.fillForm(productData);
      await addNewProductPage.clickSave();
      await productsListPage.waitForOpened();
      await expect(productsListPage.toastMessage).toContainText(NOTIFICATIONS.PRODUCT_CREATED);
      await expect(productsListPage.tableRowByName(productData.name)).toBeVisible();
    },
  );

  test.skip("Add new product OLD", async ({ page }) => {
    const homePage = new HomePage(page);
    const productsListPage = new ProductsListPage(page);
    const addNewProductPage = new AddNewProductPage(page);

    //login page
    const emailInput = page.locator("#emailinput");
    const passwordInput = page.locator("#passwordinput");
    const loginButton = page.locator("button[type='submit']");

    await homePage.open();
    await expect(emailInput).toBeVisible();
    await emailInput.fill(credentials.username);
    await passwordInput.fill(credentials.password);
    await loginButton.click();

    await homePage.waitForOpened();

    await homePage.clickOnViewModule("Products");

    await productsListPage.waitForOpened();

    await productsListPage.clickAddNewProduct();

    await addNewProductPage.waitForOpened();

    const productData = generateProductData();
    await addNewProductPage.fillForm(productData);
    await addNewProductPage.clickSave();

    await productsListPage.waitForOpened();

    await expect(productsListPage.toastMessage).toContainText(NOTIFICATIONS.PRODUCT_CREATED);
    await expect(productsListPage.tableRowByName(productData.name)).toBeVisible();
  });
});