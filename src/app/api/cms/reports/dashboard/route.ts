import { requireDashboardAccess, dashboardError, dashboardJson } from "@/cms/features/dashboard/api/dashboard-bff";
import { backendDashboard } from "@/cms/features/dashboard/api/dashboard.server";
import { parseDashboardQuery } from "@/cms/features/dashboard/lib/dashboard-query";

export async function GET(request: Request) {
  const auth = await requireDashboardAccess();
  if ("response" in auth) return auth.response;
  const params = parseDashboardQuery(new URL(request.url).searchParams);
  if (!params) return dashboardError(400);
  try { return dashboardJson(await backendDashboard(auth.accessToken, params, request.signal)); }
  catch (error) { return dashboardError(502, error); }
}
