import { requireProductAccess, productError, productJson, validProductId } from "@/cms/features/products/api/product-bff";
import { backendProductDetail } from "@/cms/features/products/api/products.server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProductAccess();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!validProductId(id)) return productError(400);
  try { return productJson(await backendProductDetail(auth.accessToken, id, request.signal)); }
  catch (error) { return productError(502, error); }
}
