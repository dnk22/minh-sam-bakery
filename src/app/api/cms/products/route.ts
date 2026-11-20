import { requireProductAccess, productError, productJson } from "@/cms/features/products/api/product-bff";
import { backendProductList } from "@/cms/features/products/api/products.server";
import { parseProductListQuery } from "@/cms/features/products/lib/product-data";
import { productWriteSchema } from "@/cms/features/products/schemas/product.schema";
import { backendCreateProduct } from "@/cms/features/products/api/products.server";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { revalidateTag } from "next/cache";

export async function GET(request: Request) {
  const auth = await requireProductAccess();
  if ("response" in auth) return auth.response;
  const parsed = parseProductListQuery(new URL(request.url).searchParams);
  if (!parsed.ok) return productError(400);
  try { return productJson(await backendProductList(auth.accessToken, parsed.data, request.signal)); }
  catch (error) { return productError(502, error); }
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return productError(403);
  if (!hasJsonContentType(request)) return productError(400);
  const auth = await requireProductAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return productError(400); }
  const parsed = productWriteSchema.safeParse(body);
  if (!parsed.success) return productError(400);
  try {
    const saved = await backendCreateProduct(auth.accessToken, parsed.data);
    revalidateTag("catalog-products", "max");
    return productJson(saved, 201);
  } catch (error) { return productError(502, error); }
}
