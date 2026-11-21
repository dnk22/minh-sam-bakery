import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireOrderAccess, orderError, orderJson } from "@/cms/features/orders/api/order-bff";
import { backendUpdateOrderStatus } from "@/cms/features/orders/api/orders.server";
import { validOrderId } from "@/cms/features/orders/lib/order-data";
import { updateOrderStatusSchema } from "@/cms/features/orders/schemas/order.schema";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTrustedSameOriginRequest(request)) return orderError(403);
  if (!hasJsonContentType(request)) return orderError(400);
  const auth = await requireOrderAccess();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!validOrderId(id)) return orderError(400);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return orderError(400);
  }
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) return orderError(400);

  try {
    return orderJson(await backendUpdateOrderStatus(auth.accessToken, id, parsed.data, request.signal));
  } catch (error) {
    return orderError(502, error);
  }
}
