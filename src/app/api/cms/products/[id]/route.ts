import { requireProductAccess, productError, productJson, validProductId } from "@/cms/features/products/api/product-bff";
import { backendProductDetail } from "@/cms/features/products/api/products.server";
import { backendDeleteProduct, backendUpdateProduct } from "@/cms/features/products/api/products.server";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { productPatchSchema } from "@/cms/features/products/schemas/product.schema";
import { revalidateTag } from "next/cache";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProductAccess();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!validProductId(id)) return productError(400);
  try { return productJson(await backendProductDetail(auth.accessToken, id, request.signal)); }
  catch (error) { return productError(502, error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTrustedSameOriginRequest(request)) return productError(403);
  if (!hasJsonContentType(request)) return productError(400);
  const auth = await requireProductAccess();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!validProductId(id)) return productError(400);
  let body: unknown;
  try { body = await request.json(); } catch { return productError(400); }
  try {
    const current = await backendProductDetail(auth.accessToken, id, request.signal);
    const parsed = productPatchSchema.safeParse(body);
    if (!parsed.success) return productError(400);
    if (parsed.data.price !== undefined || parsed.data.salePrice !== undefined) {
      const prices = productPatchSchema.safeParse({ price: parsed.data.price ?? current.price, salePrice: parsed.data.salePrice === undefined ? current.salePrice ?? null : parsed.data.salePrice });
      if (!prices.success) return productError(400);
    }
    const saved = await backendUpdateProduct(auth.accessToken, id, parsed.data);
    revalidateTag("catalog-products", "max");
    revalidateTag(`catalog-product-${current.slug}`, "max");
    revalidateTag(`catalog-product-${saved.slug}`, "max");
    return productJson(saved);
  } catch (error) { return productError(502, error); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTrustedSameOriginRequest(request)) return productError(403);
  const auth = await requireProductAccess();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!validProductId(id)) return productError(400);
  try {
    const current = await backendProductDetail(auth.accessToken, id, request.signal);
    const result = await backendDeleteProduct(auth.accessToken, id);
    revalidateTag("catalog-products", "max");
    revalidateTag(`catalog-product-${current.slug}`, "max");
    return productJson(result);
  } catch (error) { return productError(502, error); }
}
