import { COUNTRIES } from "data/salesPortal/customers/countries";

export enum DELIVERY_TYPE {
  DELIVERY = "Delivery",
  PICKUP = "Pickup",
}

export enum DELIVERY_LOCATION {
  HOME = "Home",
  OTHER = "Other",
}

export interface IDeliveryFormData {
  deliveryType: DELIVERY_TYPE;
  deliveryDate: string;
  location: DELIVERY_LOCATION;
  country: COUNTRIES;
  city: string;
  street: string;
  house: string;
  flat: string;
}
