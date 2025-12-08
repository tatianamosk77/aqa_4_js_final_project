import { Page } from '@playwright/test';
import { HomeModuleButton, HomePage } from 'ui/pages/home.page';
import { ProductsListPage } from 'ui/pages/products/productsList.page';
import { CustomersListPage } from 'ui/pages/customers/customerListPage';
import { logStep } from 'utils/report/logStep.utils';

export class HomeUIService {
  homePage: HomePage;
  productsListPage: ProductsListPage;
  customersListPage: CustomersListPage;
  constructor(private page: Page) {
    this.homePage = new HomePage(page);
    this.productsListPage = new ProductsListPage(page);
    this.customersListPage = new CustomersListPage(page);
  }

  @logStep('Open module on Home page')
  async openModule(moduleName: HomeModuleButton) {
    await this.homePage.clickOnViewModule(moduleName);

    if (moduleName === 'Products') {
      await this.productsListPage.waitForOpened();
    }
    if (moduleName === 'Customers') {
      await this.customersListPage.waitForOpened();
    }
  }
}
