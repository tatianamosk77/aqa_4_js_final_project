
// import { test as base } from './business.fixture';
// import { extractTestData } from '../utils/helper';
// import { IOrderFromResponse } from '../types/orders.types';

// export interface ICreateOrderData {
//   id: string;
//   productsIds: string[];
//   customerId: string;
// }
// export interface ICustomOrder {
//   orderInProcessStatus: (count?: number) => Promise<ICreateOrderData>;
//   orderDraftStatus: (count?: number) => Promise<ICreateOrderData>;
//   orderDraftStatusWithPartialTeardown: (count?: number) => Promise<ICreateOrderData>;
//   orderDraftWithDeliveryStatus: (count?: number) => Promise<ICreateOrderData>;
//   orderCanceledStatus: (count?: number) => Promise<ICreateOrderData>;
//   orderPartiallyReceivedStatus: (
//     count?: number,
//     receivedCount?: number,
//   ) => Promise<ICreateOrderData>;
//   orderReceivedStatus: (count?: number) => Promise<ICreateOrderData>;
//   orderManagerAssignedStatus: (count?: number) => Promise<ICreateOrderData>;
// }

// export const orderInProcessStatus = base.extend<ICustomOrder>({
//   orderInProcessStatus: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 1) => {
//       const token = await signInApiService.loginAsLocalUser();
//       order = await ordersApiService.createInProcessOrder(count, token);

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
//   },
// });

// export const orderDraftStatus = base.extend<ICustomOrder>({
//   orderDraftStatus: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 1) => {
//       const token = await signInApiService.loginAsLocalUser();
//       order = await ordersApiService.createDraftOrder(count, token);

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
//   },
// });

// export const orderDraftStatusWithPartialTeardown = base.extend<ICustomOrder>({
//   orderDraftStatusWithPartialTeardown: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 1) => {
//       const token = await signInApiService.loginAsLocalUser();
//       order = await ordersApiService.createDraftOrder(count, token);

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.partialTearDown(productsIds, [customerId]);
//   },
// });

// export const orderDraftWithDeliveryStatus = base.extend<ICustomOrder>({
//   orderDraftWithDeliveryStatus: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 1) => {
//       const token = await signInApiService.loginAsLocalUser();
//       order = await ordersApiService.createDraftOrderWithDelivery(count, token);

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
//   },
// });

// export const orderCanceledStatus = base.extend<ICustomOrder>({
//   orderCanceledStatus: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 1) => {
//       const token = await signInApiService.loginAsLocalUser();
//       order = await ordersApiService.createCanceledOrder(count, token);

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
//   },
// });

// export const orderPartiallyReceivedStatus = base.extend<ICustomOrder>({
//   orderPartiallyReceivedStatus: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 2, receivedCount = 1) => {
//       const productCount = Math.max(count, 2);
//       const token = await signInApiService.loginAsLocalUser();

//       order = await ordersApiService.createPartiallyReceivedOrder(
//         receivedCount,
//         productCount,
//         token,
//       );

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
//   },
// });

// export const orderReceivedStatus = base.extend<ICustomOrder>({
//   orderReceivedStatus: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 1) => {
//       const token = await signInApiService.loginAsLocalUser();

//       order = await ordersApiService.createReceivedOrder(count, token);

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
//   },
// });

// export const orderManagerAssignedStatus = base.extend<ICustomOrder>({
//   orderManagerAssignedStatus: async (
//     { signInApiService, ordersApiService, dataDisposalUtils },
//     use,
//   ) => {
//     let order: IOrderFromResponse;
//     let id: string = '',
//       productsIds: string[] = [],
//       customerId: string = '';

//     const orderDataFactory = async (count: number = 1) => {
//       const token = await signInApiService.loginAsLocalUser();

//       order = await ordersApiService.createManagerAssignedOrder(count, token);

//       ({ id, productsIds, customerId } = extractTestData(order));
//       return { id, productsIds, customerId };
//     };
//     await use(orderDataFactory);

//     await dataDisposalUtils.tearDown([id], productsIds, [customerId]);
//   },
// });

// export const test = mergeTests(
//   orderInProcessStatus,
//   orderDraftStatus,
//   orderDraftStatusWithPartialTeardown,
//   orderDraftWithDeliveryStatus,
//   orderCanceledStatus,
//   orderPartiallyReceivedStatus,
//   orderReceivedStatus,
//   orderManagerAssignedStatus,
// );

// export { expect } from '@playwright/test';