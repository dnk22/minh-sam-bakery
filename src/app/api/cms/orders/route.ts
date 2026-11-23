import { requireOrderAccess, orderError, orderJson } from "@/cms/features/orders/api/order-bff";
import { backendOrderList } from "@/cms/features/orders/api/orders.server";
import { parseOrderListQuery } from "@/cms/features/orders/lib/order-data";

export async function GET(request: Request) {
  const auth = await requireOrderAccess();
  if ("response" in auth) return auth.response;
  const query = new URL(request.url).searchParams;
  const view = query.getAll("view");
  if (view.length !== 1 || !["pending", "delivery", "completed"].includes(view[0])) return orderError(400);
  const parsed = parseOrderListQuery(query);
  if (!parsed.ok) return orderError(400);
  try {
    return orderJson(await backendOrderList(auth.accessToken, view[0] as "pending" | "delivery" | "completed", parsed.data, request.signal));
  } catch (error) {
    return orderError(502, error);
  }
}
