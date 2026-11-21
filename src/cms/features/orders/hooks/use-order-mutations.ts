"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/cms/lib/notifications";

import { updateOrderStatus } from "../api/orders.client";
import { orderInvalidationKeys, orderQueryKeys } from "../lib/order-query-keys";
import type { OrderStatus } from "../types";

export function useOrderMutations() {
  const client = useQueryClient();
  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(id, { status }),
      onSuccess: async (order) => {
        client.setQueryData(orderQueryKeys.detail(order.id), order);
        const [listsKey, detailKey] = orderInvalidationKeys(order.id);
        await Promise.all([
          client.invalidateQueries({ queryKey: listsKey }),
          client.invalidateQueries({ queryKey: detailKey }),
        ]);
        notify.success("Đã cập nhật trạng thái đơn hàng.");
      },
      onError: () => notify.error("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại."),
    }),
  };
}
