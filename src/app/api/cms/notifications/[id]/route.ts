import { notificationError, notificationJson, requireNotificationAccess, validNotificationId } from "@/cms/features/notification-center/api/notification-bff";
import { backendNotificationDetail } from "@/cms/features/notification-center/api/notifications.server";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) { const { id } = await context.params; if (!validNotificationId(id)) return notificationError(400); const auth = await requireNotificationAccess(); if ("response" in auth) return auth.response; try { return notificationJson(await backendNotificationDetail(auth.accessToken, id, request.signal)); } catch (error) { return notificationError(502, error); } }
