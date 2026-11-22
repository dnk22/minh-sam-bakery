import { Suspense } from "react";
import { NotificationsPage } from "@/cms/features/notification-center/components/notifications-page/notifications-page";
export default function CmsNotificationsPage() { return <Suspense fallback={null}><NotificationsPage /></Suspense>; }
