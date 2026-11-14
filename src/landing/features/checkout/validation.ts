import type { CheckoutDraft, CheckoutErrors, CheckoutField } from "./types";

const phonePattern = /^(?:\+84|0)(?:\d[ .-]?){8,10}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckoutDraft(draft: CheckoutDraft): {
  errors: CheckoutErrors;
  firstInvalidField?: CheckoutField;
} {
  const errors: CheckoutErrors = {};

  if (!draft.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
  if (!draft.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (!phonePattern.test(draft.phone.trim())) errors.phone = "Số điện thoại chưa đúng định dạng.";
  if (draft.email.trim() && !emailPattern.test(draft.email.trim())) errors.email = "Email chưa đúng định dạng.";
  if (draft.fulfillmentMethod === "delivery" && !draft.deliveryAddress.trim()) errors.deliveryAddress = "Vui lòng nhập địa chỉ giao hàng.";
  if (!draft.receiveDate) errors.receiveDate = draft.fulfillmentMethod === "pickup" ? "Vui lòng chọn ngày nhận bánh." : "Vui lòng chọn ngày giao bánh.";

  const order: CheckoutField[] = ["fullName", "phone", "email", "deliveryAddress", "receiveDate"];
  return { errors, firstInvalidField: order.find((field) => errors[field]) };
}

export function normalizeCheckoutDraft(draft: CheckoutDraft): CheckoutDraft {
  return {
    ...draft,
    fullName: draft.fullName.trim().replace(/\s+/g, " "),
    phone: draft.phone.trim(),
    email: draft.email.trim().toLowerCase(),
    deliveryAddress: draft.deliveryAddress.trim().replace(/\s+/g, " "),
    notes: draft.notes.trim(),
  };
}
