import "server-only";

import { backendRequest } from "@/lib/api/backend-client";
import { isUploadResult } from "@/cms/lib/api/upload-validation";

export async function backendUploadImages(accessToken: string, formData: FormData, folder: string) {
  return (await backendRequest({
    path: "/api/v1/uploads/images",
    method: "POST",
    query: { folder },
    body: formData,
    accessToken,
    cache: "no-store",
    timeoutMs: 60_000,
    validate: isUploadResult,
  })).data;
}
