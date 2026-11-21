import { requireOrderAccess, orderError, orderJson } from "@/cms/features/orders/api/order-bff";
import { backendOrderDetail } from "@/cms/features/orders/api/orders.server";
import { validOrderId } from "@/cms/features/orders/lib/order-data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOrderAccess();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!validOrderId(id)) return orderError(400);
  try {
    return orderJson(await backendOrderDetail(auth.accessToken, id, request.signal));
  } catch (error) {
    return orderError(502, error);
  }
}
