import { z } from "zod";



const money = z.string().trim().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, "Nhập số tiền hợp lệ, tối đa 2 chữ số thập phân.");
const optionalText = z.string().trim().max(5000);

const imageSchema = z.object({
  url: z.string().trim().min(1), alt: z.string().trim().max(500).optional(), sortOrder: z.number().int().nonnegative(), isCover: z.boolean(),
}).strict();
const variantSchema = z.object({
  sku: z.string().trim().min(1, "SKU biến thể không được để trống."), size: z.string().trim().min(1, "Kích thước không được để trống."),
  style: z.string().trim().min(1, "Kiểu không được để trống."), price: money, salePrice: z.union([money, z.literal("")]),
  status: z.enum(["ACTIVE", "INACTIVE"]), sortOrder: z.number().int().nonnegative(),
}).strict();

const imageWriteSchema = z.object({ url: z.string().trim().min(1), alt: z.string().trim().max(500).optional(), sortOrder: z.number().int().nonnegative(), isCover: z.boolean() }).strict();
const variantWriteSchema = z.object({
  sku: z.string().trim().min(1), size: z.string().trim().min(1), style: z.string().trim().min(1), price: money,
  salePrice: z.union([money, z.null()]).optional(), status: z.enum(["ACTIVE", "INACTIVE"]), sortOrder: z.number().int().nonnegative(),
}).strict();
function validateCollections(value: { images?: { isCover: boolean }[]; variants?: { sku: string; price: string; salePrice?: string | null }[]; price?: string; salePrice?: string | null }, context: z.RefinementCtx) {
  if (value.images?.length && value.images.filter(image => image.isCover).length !== 1) context.addIssue({ code: "custom", path: ["images"], message: "Phải chọn đúng một ảnh bìa." });
  const seen = new Set<string>();
  value.variants?.forEach((variant, index) => {
    const sku = variant.sku.trim().toUpperCase();
    if (seen.has(sku)) context.addIssue({ code: "custom", path: ["variants", index, "sku"], message: "SKU biến thể bị trùng." });
    seen.add(sku);
    if (variant.salePrice && greaterMoney(variant.salePrice, variant.price)) context.addIssue({ code: "custom", path: ["variants", index, "salePrice"], message: "Giá khuyến mại không được lớn hơn giá bán." });
  });
  if (value.price && value.salePrice && greaterMoney(value.salePrice, value.price)) context.addIssue({ code: "custom", path: ["salePrice"], message: "Giá khuyến mại không được lớn hơn giá bán." });
}

function greaterMoney(a: string, b: string) {
  const cents = (v: string) => { const [whole, fraction = ""] = v.split("."); return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0")); };
  if (!/^\d+(?:\.\d{1,2})?$/.test(a) || !/^\d+(?:\.\d{1,2})?$/.test(b)) return false;
  return cents(a) > cents(b);
}

const productWriteBaseSchema = z.object({
  categoryId: z.string().trim().min(1), sku: z.string().trim().min(1), name: z.string().trim().min(1), slug: z.string().trim().optional(),
  shortDescription: optionalText.optional(), description: optionalText.optional(), price: money, salePrice: z.union([money, z.null()]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).optional(), isFeatured: z.boolean().optional(), isBestSeller: z.boolean().optional(),
  seoTitle: optionalText.optional(), seoDescription: optionalText.optional(), images: z.array(imageWriteSchema).max(20).optional(), variants: z.array(variantWriteSchema).max(100).optional(),
}).strict();
export const productWriteSchema = productWriteBaseSchema.superRefine(validateCollections);
export const productPatchSchema = productWriteBaseSchema.partial().refine(value => Object.keys(value).length > 0, "Không có thay đổi để lưu.").superRefine(validateCollections);

export const productFormSchema = z.object({
  categoryId: z.string().trim().min(1, "Hãy chọn danh mục."), sku: z.string().trim().min(1, "SKU không được để trống."),
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống."), slug: z.string().trim(),
  shortDescription: optionalText, description: optionalText, price: money, salePrice: z.union([money, z.literal("")]),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]), isFeatured: z.boolean(), isBestSeller: z.boolean(),
  seoTitle: optionalText, seoDescription: optionalText, images: z.array(imageSchema).max(20), variants: z.array(variantSchema).max(100),
}).superRefine(validateCollections);
