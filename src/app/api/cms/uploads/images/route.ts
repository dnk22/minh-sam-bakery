import { categoryError, categoryJson, requireCategoryAccess } from "@/cms/features/categories/api/category-bff";
import { isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { backendUploadImages } from "@/cms/lib/api/uploads.server";
import { validateImageUploadBatch, validateSingleImageUpload } from "@/cms/lib/api/upload-validation";

const ALLOWED_FOLDERS = new Set(["categories", "products"]);

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return categoryError(403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) return categoryError(400, undefined, "Yêu cầu upload không hợp lệ.");
  const auth = await requireCategoryAccess();
  if ("response" in auth) return auth.response;
  const folder = new URL(request.url).searchParams.get("folder") ?? "categories";
  if (!ALLOWED_FOLDERS.has(folder)) return categoryError(400, undefined, "Thư mục upload không hợp lệ.");

  let incoming: FormData;
  try { incoming = await request.formData(); } catch { return categoryError(400, undefined, "Không thể đọc tệp upload."); }
  const files = incoming.getAll("files");
  if (!files.every((file) => file instanceof File)) return categoryError(400, undefined, "Tệp upload không hợp lệ.");
  const typedFiles = files as File[];
  const validationError = folder === "categories" ? validateSingleImageUpload(typedFiles) : validateImageUploadBatch(typedFiles);
  if (validationError) return categoryError(400, undefined, validationError);
  const outgoing = new FormData();
  typedFiles.forEach((file) => outgoing.append("files", file, file.name));
  try { return categoryJson(await backendUploadImages(auth.accessToken, outgoing, folder), 201); }
  catch (error) { return categoryError(502, error, "Không thể tải ảnh lên lúc này."); }
}
