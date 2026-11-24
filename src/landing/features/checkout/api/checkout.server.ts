import "server-only";
import { backendRequest } from "@/lib/api/backend-client";
import { isOrder } from "@/lib/contracts/order/order.schema";
import type { CreateOrderInput } from "@/lib/contracts/order/order.types";

export async function createBackendOrder(input: CreateOrderInput) {
  return (await backendRequest({
    path: "/api/v1/public/orders/create", method: "POST", body: input,
    cache: "no-store", timeoutMs: 25000, validate: isOrder, requireHttps: true,
  })).data;
}
