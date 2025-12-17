export enum NOTIFICATIONS {
  PRODUCT_CREATED = "Product was successfully created",
  BAD_REQUEST = "Incorrect request body",
  PRODUCT_DELETED = "Product was successfully deleted",
  PRODUCT_UPDATED = "Product was successfully updated",
  CUSTOMER_CREATED = "Customer was successfully created",
  CUSTOMER_DELETED = "Customer was successfully deleted",
  CUSTOMER_UPDATED = "Customer was successfully updated",
  ORDER_PROCESSED = "Order processing was successfully started",
  ORDER_CANCELED = "Order was successfully canceled",
  ORDER_REOPENED = "Order was successfully reopened",
  ORDER_CREATED = "Order was successfully created",
  ORDER_NOT_CREATED = "Failed to create an order. Please try again later",
}

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Not authorized",
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,

  PRODUCT_ALREADY_EXISTS: (name: string) => `Product with name '${name}' already exists`,
  CUSTOMER_ALREADY_EXISTS: (email: string) => `Customer with email '${email}' already exists`,
};
