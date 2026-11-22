import { isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { notificationError, notificationJson, requireNotificationAccess, validNotificationId } from "@/cms/features/notification-center/api/notification-bff";
import { backendMarkNotificationUnread } from "@/cms/features/notification-center/api/notifications.server";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) { if (!isTrustedSameOriginRequest(request)) return notificationError(403); const { id } = await context.params; if (!validNotificationId(id)) return notificationError(400); const auth = await requireNotificationAccess(); if ("response" in auth) return auth.response; try { return notificationJson(await backendMarkNotificationUnread(auth.accessToken, id)); } catch (error) { return notificationError(502, error); } }
