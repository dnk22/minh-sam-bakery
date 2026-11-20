import { requireProductAccess, productError, productJson } from "@/cms/features/products/api/product-bff";
import { backendProductList } from "@/cms/features/products/api/products.server";
import { parseProductListQuery } from "@/cms/features/products/lib/product-data";

export async function GET(request: Request) {
  const auth = await requireProductAccess();
  if ("response" in auth) return auth.response;
  const parsed = parseProductListQuery(new URL(request.url).searchParams);
  if (!parsed.ok) return productError(400);
  try { return productJson(await backendProductList(auth.accessToken, parsed.data, request.signal)); }
  catch (error) { return productError(502, error); }
}
