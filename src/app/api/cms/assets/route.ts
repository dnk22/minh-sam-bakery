import { requireUploadAccess, uploadError } from "@/cms/lib/api/uploads-bff";
import { backendBaseUrl } from "@/lib/api/backend-client";

function validAssetPath(path: string) {
  return path.startsWith("/uploads/") && !path.includes("..") && !path.includes("\\") && path.length <= 1_024;
}

export async function GET(request: Request) {
  const auth = await requireUploadAccess();
  if ("response" in auth) return auth.response;
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!validAssetPath(path)) return uploadError(400, undefined, "Đường dẫn ảnh không hợp lệ.");
  try {
    const response = await fetch(`${backendBaseUrl()}${path}`, { cache: "no-store", redirect: "error", headers: { Authorization: `Bearer ${auth.accessToken}` }, signal: AbortSignal.timeout(30_000) });
    if (!response.ok) return uploadError(response.status === 404 ? 404 : 502, undefined, response.status === 404 ? "Không tìm thấy ảnh." : undefined);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("image/")) return uploadError(502, undefined, "Backend trả về nội dung không phải ảnh.");
    return new Response(response.body, { status: 200, headers: { "Content-Type": contentType, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return uploadError(502); }
}
