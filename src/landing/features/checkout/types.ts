export type FulfillmentMethod = "pickup" | "delivery";
export type PaymentMethod = "AT_STORE" | "BANK_TRANSFER";

export type CheckoutDraft = {
  fullName: string;
  phone: string;
  email: string;
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress: string;
  receiveDate: string;
  deliveryTime: string;
  notes: string;
  paymentMethod: PaymentMethod;
};

export type CheckoutField =
  | "fullName"
  | "phone"
  | "email"
  | "deliveryAddress"
  | "receiveDate"
  | "deliveryTime"
  | "paymentMethod";

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;
