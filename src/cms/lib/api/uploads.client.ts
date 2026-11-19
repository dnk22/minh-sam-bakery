import { cmsApiClient } from "./client";

export async function uploadCmsImage(file: File, folder: string, signal?: AbortSignal) {
  const formData = new FormData();
  formData.append("files", file);
  const result = await cmsApiClient.post<Array<{ url: string }>>(`/uploads/images?folder=${encodeURIComponent(folder)}`, formData, { signal, timeoutMs: 30_000 });
  if (!result[0]?.url) throw new Error("Upload không trả về URL ảnh.");
  return result[0].url;
}
