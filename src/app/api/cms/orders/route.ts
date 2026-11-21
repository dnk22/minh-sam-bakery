import { requireOrderAccess, orderError, orderJson } from "@/cms/features/orders/api/order-bff";
import { backendOrderList } from "@/cms/features/orders/api/orders.server";
import { parseOrderListQuery } from "@/cms/features/orders/lib/order-data";

export async function GET(request: Request) {
  const auth = await requireOrderAccess();
  if ("response" in auth) return auth.response;
  const parsed = parseOrderListQuery(new URL(request.url).searchParams);
  if (!parsed.ok) return orderError(400);
  try {
    return orderJson(await backendOrderList(auth.accessToken, parsed.data, request.signal));
  } catch (error) {
    return orderError(502, error);
  }
}
