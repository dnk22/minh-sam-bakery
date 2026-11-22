import { notificationError, notificationJson, requireNotificationAccess } from "@/cms/features/notification-center/api/notification-bff";
import { backendUnreadCount } from "@/cms/features/notification-center/api/notifications.server";
export async function GET(request: Request) { const auth = await requireNotificationAccess(); if ("response" in auth) return auth.response; try { return notificationJson(await backendUnreadCount(auth.accessToken, request.signal)); } catch (error) { return notificationError(502, error); } }
