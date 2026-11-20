import { requireRoleAccess, roleError, roleJson } from "@/cms/features/roles/api/role-bff";
import { backendPermissionCatalog } from "@/cms/features/roles/api/roles.server";

export async function GET(request: Request) {
  const auth = await requireRoleAccess();
  if ("response" in auth) return auth.response;
  try { return roleJson(await backendPermissionCatalog(auth.accessToken, request.signal)); }
  catch (error) { return roleError(502, error); }
}
