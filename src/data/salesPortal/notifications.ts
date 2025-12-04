export enum NOTIFICATIONS {
  PRODUCT_CREATED = "Product was successfully created",
  BAD_REQUEST = "Incorrect request body",
  PRODUCT_DELETED = "Product was successfully deleted",
  PRODUCT_UPDATED = "Product was successfully updated",
  CUSTOMER_CREATED = "Customer was successfully created",
}

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Not authorized",
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  PRODUCT_ALREADY_EXISTS: (name: string) => `Product with name '${name}' already exists`,
};
