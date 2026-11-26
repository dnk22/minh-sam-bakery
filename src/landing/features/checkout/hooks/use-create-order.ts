"use client";
import { useReducer, useRef } from "react";
import type { CreateOrderInput, Order } from "@/lib/contracts/order/order.types";
import { createOrder, CheckoutSubmitError } from "../api/checkout.client";
import {
  clearCheckoutSessionPending,
  completeCheckoutSession,
  isCurrentCheckoutSession,
  markCheckoutSessionPending,
} from "../store/checkout-session-store";
import { idleSubmission, submissionReducer, visibleSubmission } from "./checkout-submission-machine";

export function useCreateOrder(sessionId: string | null) {
  const [state, dispatch] = useReducer(submissionReducer, sessionId, idleSubmission);
  const activeAttempt = useRef<{ sessionId: string; attemptId: number } | null>(null);
  const attemptSequence = useRef(0);
  const visible = visibleSubmission(state, sessionId);

  async function submit(input: CreateOrderInput, onSuccess: (order: Order) => void) {
    if (!sessionId || visible.status === "uncertain" || activeAttempt.current?.sessionId === sessionId) return;
    if (!markCheckoutSessionPending(sessionId)) {
      dispatch({ type: "set-error", sessionId, error: "Không thể lưu trạng thái đặt hàng. Vui lòng kiểm tra trình duyệt." });
      return;
    }
    const attemptId = ++attemptSequence.current;
    activeAttempt.current = { sessionId, attemptId };
    dispatch({ type: "start", sessionId, attemptId });

    let order: Order;
    try {
      order = await createOrder(input);
    } catch (caught) {
      const uncertain = !(caught instanceof CheckoutSubmitError) || caught.uncertain;
      if (!uncertain) clearCheckoutSessionPending(sessionId);
      if (isCurrentCheckoutSession(sessionId)) {
        dispatch({
          type: uncertain ? "uncertain" : "failed",
          sessionId,
          attemptId,
          error: caught instanceof CheckoutSubmitError
            ? caught.message
            : "Chưa xác minh được kết quả tạo đơn. Vui lòng liên hệ cửa hàng.",
        });
      }
      if (activeAttempt.current?.sessionId === sessionId && activeAttempt.current.attemptId === attemptId) activeAttempt.current = null;
      return;
    }

    if (completeCheckoutSession(sessionId, order)) {
      dispatch({ type: "succeeded", sessionId, attemptId });
      onSuccess(order);
    } else {
      clearCheckoutSessionPending(sessionId);
    }
    if (activeAttempt.current?.sessionId === sessionId && activeAttempt.current.attemptId === attemptId) activeAttempt.current = null;
  }

  return {
    submit,
    pending: visible.status === "submitting",
    uncertain: visible.status === "uncertain",
    error: visible.error,
    setError: (error: string) => dispatch({ type: "set-error", sessionId, error }),
  };
}
