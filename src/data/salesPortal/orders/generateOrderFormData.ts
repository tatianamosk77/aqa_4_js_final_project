import { faker } from "@faker-js/faker";

export interface IOrderFormUIData {
  customer?: string | number;
  products?: Array<string | number | "random">;
}

export function generateOrderFormData(): IOrderFormUIData {
  return {
    customer: "random",
    products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => "random" as const),
  };
}

export function generateMinimalOrderFormData(): IOrderFormUIData {
  return {
    customer: 0,
    products: [0],
  };
}

export function generateSpecificOrderFormData(
  customerIndex: number,
  productIndices: number[]
): IOrderFormUIData {
  return {
    customer: customerIndex,
    products: productIndices,
  };
}
