import "server-only";

import { backendRequest } from "@/lib/api/backend-client";
import type { PublicFilterRequest } from "./query";
import { isPublicFilterResponse } from "./response";

export async function fetchGlobalSearchResults(filters: PublicFilterRequest) {
  const response = await backendRequest({
    path: "/api/v1/public/filter",
    method: "POST",
    body: filters,
    validate: isPublicFilterResponse,
    cache: "no-store",
  });
  return response.data;
}
