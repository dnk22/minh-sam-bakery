"use client";

import { useSyncExternalStore } from "react";

import {
  getCheckoutSessionServerSnapshot,
  getCheckoutSessionSnapshot,
  subscribeCheckoutSession,
} from "../store/checkout-session-store";

export function useCheckoutSession() {
  return useSyncExternalStore(
    subscribeCheckoutSession,
    getCheckoutSessionSnapshot,
    getCheckoutSessionServerSnapshot,
  );
}
