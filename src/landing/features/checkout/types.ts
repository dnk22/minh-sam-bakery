export type FulfillmentMethod = "pickup" | "delivery";

export type CheckoutLineItem = {
  productId: string;
  productName: string;
  productImage: string;
  productImageAlt: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
};

export type CheckoutDraft = {
  fullName: string;
  phone: string;
  email: string;
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress: string;
  receiveDate: string;
  notes: string;
};

export type CheckoutField = "fullName" | "phone" | "email" | "deliveryAddress" | "receiveDate";
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export type CheckoutReceipt = {
  orderCode: string;
  createdAt: string;
};

export type CheckoutStage = "closed" | "editing" | "pickup-success" | "bank-transfer";
