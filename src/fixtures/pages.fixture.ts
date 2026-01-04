import {
  test as base,
  // Page
} from "@playwright/test";
import { AddNewCustomerPage } from "ui/pages/customers/addNewCustomerPage";
import { CustomersListPage } from "ui/pages/customers/customerListPage";
import { HomePage } from "ui/pages/home.page";
import { HeaderPage } from "ui/pages/header.page";
import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";
import { ProductsListPage } from "ui/pages/products/productsList.page";
import { LoginPage } from "ui/pages/sign-in.page";
import { AddNewCustomerUIService } from "ui/service/addNewCustomer.ui-service";
import { AddNewProductUIService } from "ui/service/addNewProduct.ui-service";
import { CustomersListUIService } from "ui/service/customersList.ui-service";
import { EditProductUIService } from "ui/service/editProduct.ui-service";
import { HomeUIService } from "ui/service/home.ui-service";
import { LoginUIService } from "ui/service/login.ui-service";
import { ProductsListUIService } from "ui/service/productsList.ui-service";
import { EditCustomerUIService } from "ui/service/editCustomer.ui-service";
import { CustomerDetailsPage } from "ui/pages/customers";
import { AssignManagerModal } from "ui/pages/orders/assignManager.modal";
import {
  AddNewOrderModal,
  CommentsTab,
  CustomerDetailsSection,
  DeliveryTab,
  HistoryTab,
  OrderDetailsPage,
  OrdersListPage,
  RequestedProductsSection,
  ScheduleDeliveryPage,
} from "ui/pages/orders";
import { OrdersListUIService } from "ui/service/ordersList.ui-service";
import { AddNewOrderUIService } from "ui/service/addNewOrder.ui-service";
import { EditOrderUIService } from "ui/service/editOrder.ui-service";
import { ConfirmationModal } from "ui/pages/confirmation.modal";
import { EditCustomerModal } from "ui/pages/orders/editCustomers.modal";
import { EditProductModal } from "ui/pages/orders/editProducts.modal";
import { OrderDetailsUIService } from "ui/service/orderDetails.ui-service";
export interface IPages {
  //pages
  loginPage: LoginPage;
  homePage: HomePage;
  productsListPage: ProductsListPage;
  customersListPage: CustomersListPage;
  addNewProductPage: AddNewProductPage;
  addNewCustomerPage: AddNewCustomerPage;
  customerDetailsPage: CustomerDetailsPage;

  ordersListPage: OrdersListPage;
  headerPage: HeaderPage;
  commentsTab: CommentsTab;
  customerDetailsSection: CustomerDetailsSection;
  requestedProductsSection: RequestedProductsSection;
  deliveryTab: DeliveryTab;
  historyTab: HistoryTab;
  orderDetailsPage: OrderDetailsPage;
  scheduleDeliveryPage: ScheduleDeliveryPage;
  addNewOrderModal: AddNewOrderModal;
  confirmationModal: ConfirmationModal;
  editCustomerModal: EditCustomerModal;
  editProductsModal: EditProductModal; 
  assignManagerModal: AssignManagerModal


  //ui-services
  homeUIService: HomeUIService;
  productsListUIService: ProductsListUIService;
  customersListUIService: CustomersListUIService;
  addNewProductUIService: AddNewProductUIService;
  addNewCustomerUIService: AddNewCustomerUIService;
  loginUIService: LoginUIService;
  editCustomerUIService: EditCustomerUIService;
  editUIService: EditProductUIService;

  ordersListUIService: OrdersListUIService;
  addNewOrderUIService: AddNewOrderUIService;
  editOrderUIService: EditOrderUIService;
  orderDetailsUIService: OrderDetailsUIService; 
}

export const test = base.extend<IPages>({
  //pages
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsListPage: async ({ page }, use) => {
    await use(new ProductsListPage(page));
  },
  customersListPage: async ({ page }, use) => {
    await use(new CustomersListPage(page));
  },
  addNewProductPage: async ({ page }, use) => {
    await use(new AddNewProductPage(page));
  },
  addNewCustomerPage: async ({ page }, use) => {
    await use(new AddNewCustomerPage(page));
  },
  customerDetailsPage: async ({ page }, use) => {
    await use(new CustomerDetailsPage(page));
  },
  ordersListPage: async ({ page }, use) => {
    await use(new OrdersListPage(page));
  },

  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },

  commentsTab: async ({ page }, use) => {
    await use(new CommentsTab(page));
  },
  customerDetailsSection: async ({ page }, use) => {
    await use(new CustomerDetailsSection(page));
  },
  requestedProductsSection: async ({ page }, use) => {
    await use(new RequestedProductsSection(page));
  },
  deliveryTab: async ({ page }, use) => {
    await use(new DeliveryTab(page));
  },
  historyTab: async ({ page }, use) => {
    await use(new HistoryTab(page));
  },
  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },
  scheduleDeliveryPage: async ({ page }, use) => {
    await use(new ScheduleDeliveryPage(page));
  },
  addNewOrderModal: async ({ page }, use) => {
    await use(new AddNewOrderModal(page));
  },
  editCustomerModal: async ({ page }, use) => {
    await use(new EditCustomerModal(page));
  },
  editProductsModal: async ({ page }, use) => {
    await use(new EditProductModal(page));
  },

  confirmationModal: async ({ page }, use) => {
    await use(new ConfirmationModal(page));
  },
  assignManagerModal: async ({ page }, use) => {
    await use(new AssignManagerModal(page));
  },
  

  //ui-services
  homeUIService: async ({ page }, use) => {
    await use(new HomeUIService(page));
  },

  productsListUIService: async ({ page }, use) => {
    await use(new ProductsListUIService(page));
  },
  customersListUIService: async (
    { addNewCustomerPage, customerDetailsPage, customersListPage },
    use
  ) => {
    await use(
      new CustomersListUIService(customersListPage, addNewCustomerPage, customerDetailsPage)
    );
  },

  addNewProductUIService: async ({ page }, use) => {
    await use(new AddNewProductUIService(page));
  },
  addNewCustomerUIService: async ({ page }, use) => {
    await use(new AddNewCustomerUIService(page));
  },
  editCustomerUIService: async ({ page }, use) => {
    await use(new EditCustomerUIService(page));
  },
  loginUIService: async ({ page }, use) => {
    await use(new LoginUIService(page));
  },
  editUIService: async ({ page }, use) => {
    await use(new EditProductUIService(page));
  },

  ordersListUIService: async ({ ordersListPage, addNewOrderModal, orderDetailsPage }, use) => {
    await use(new OrdersListUIService(ordersListPage, addNewOrderModal, orderDetailsPage));
  },
  addNewOrderUIService: async ({ page }, use) => {
    await use(new AddNewOrderUIService(page));
  },
  editOrderUIService: async ({ page }, use) => {
    await use(new EditOrderUIService(page));
  },
  orderDetailsUIService: async ({ orderDetailsPage, editCustomerModal, editProductsModal }, use) => {
    await use(new OrderDetailsUIService(orderDetailsPage, editCustomerModal, editProductsModal));
  },

});
