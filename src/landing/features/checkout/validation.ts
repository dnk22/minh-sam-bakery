import type { CheckoutDraft, CheckoutErrors, CheckoutField } from "./types.ts";

const phonePattern = /^(?:\+84|0)(?:\d[ .-]?){8,10}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function localCalendarDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function initialCheckoutDraft(): CheckoutDraft {
  return {
    fullName: "",
    phone: "",
    email: "",
    fulfillmentMethod: "pickup",
    deliveryAddress: "",
    receiveDate: "",
    deliveryTime: "",
    notes: "",
    paymentMethod: "AT_STORE",
  };
}

export function validateCheckoutDraft(
  draft: CheckoutDraft,
  today = localCalendarDate(),
): { errors: CheckoutErrors; firstInvalidField?: CheckoutField } {
  const errors: CheckoutErrors = {};
  if (!draft.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
  if (!draft.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (!phonePattern.test(draft.phone.trim())) errors.phone = "Số điện thoại chưa đúng định dạng.";
  if (draft.email.trim() && !emailPattern.test(draft.email.trim())) errors.email = "Email chưa đúng định dạng.";
  if (draft.fulfillmentMethod === "delivery" && !draft.deliveryAddress.trim()) {
    errors.deliveryAddress = "Vui lòng nhập địa chỉ giao hàng.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.receiveDate) || Number.isNaN(Date.parse(draft.receiveDate)) || draft.receiveDate < today) {
    errors.receiveDate = draft.fulfillmentMethod === "pickup"
      ? "Vui lòng chọn ngày nhận bánh hợp lệ."
      : "Vui lòng chọn ngày giao bánh hợp lệ.";
  }
  if (draft.deliveryTime.length > 100) errors.deliveryTime = "Khung giờ không được vượt quá 100 ký tự.";
  if (draft.fulfillmentMethod === "delivery" && draft.paymentMethod === "AT_STORE") {
    errors.paymentMethod = "Thanh toán tại cửa hàng chỉ áp dụng khi nhận tại cửa hàng.";
  }
  const order: CheckoutField[] = ["fullName", "phone", "email", "deliveryAddress", "receiveDate", "deliveryTime", "paymentMethod"];
  return { errors, firstInvalidField: order.find((field) => errors[field]) };
}

export function normalizeCheckoutDraft(draft: CheckoutDraft): CheckoutDraft {
  return {
    ...draft,
    fullName: draft.fullName.trim().replace(/\s+/g, " "),
    phone: draft.phone.trim(),
    email: draft.email.trim().toLowerCase(),
    deliveryAddress: draft.deliveryAddress.trim().replace(/\s+/g, " "),
    deliveryTime: draft.deliveryTime.trim(),
    notes: draft.notes.trim(),
  };
}
