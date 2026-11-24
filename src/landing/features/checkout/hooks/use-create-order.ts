"use client";
import { useRef, useState } from "react";
import type { CreateOrderInput, Order } from "@/lib/contracts/order/order.types";
import { createOrder, CheckoutSubmitError } from "../api/checkout.client";
import { clearPending, markPending, saveReceipt } from "../store/checkout-receipt";

export function useCreateOrder() {
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [error, setError] = useState("");
  async function submit(input: CreateOrderInput, onSuccess: (order: Order) => void) {
    if (lock.current || uncertain) return;
    if (!markPending()) { setError("Không thể lưu trạng thái đặt hàng. Vui lòng kiểm tra trình duyệt."); return; }
    lock.current = true; setPending(true); setError("");
    try {
      const order = await createOrder(input);
      saveReceipt(order);
      onSuccess(order);
      clearPending();
    } catch (caught) {
      const unknown = !(caught instanceof CheckoutSubmitError) || caught.uncertain;
      setUncertain(unknown);
      if (!unknown) clearPending();
      setError(caught instanceof CheckoutSubmitError ? caught.message : "Chưa xác minh được kết quả tạo đơn. Vui lòng liên hệ cửa hàng.");
    } finally { lock.current = false; setPending(false); }
  }
  return { submit, pending, uncertain, error, setError };
}
