import { cmsApiClient } from "./client";

export async function uploadCmsImage(file: File, folder: string, signal?: AbortSignal) {
  const formData = new FormData();
  formData.append("files", file);
  const result = await cmsApiClient.post<Array<{ url: string }>>(`/uploads/images?folder=${encodeURIComponent(folder)}`, formData, { signal, timeoutMs: 30_000 });
  if (!result[0]?.url) throw new Error("Upload không trả về URL ảnh.");
  return result[0].url;
}

export async function uploadCmsImages(files: File[], folder: string, signal?: AbortSignal) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const result = await cmsApiClient.post<Array<{ url: string }>>(`/uploads/images?folder=${encodeURIComponent(folder)}`, formData, { signal, timeoutMs: 60_000 });
  if (result.length !== files.length || result.some((item) => !item.url)) throw new Error("Upload không trả về đủ URL ảnh.");
  return result.map((item) => item.url);
}
