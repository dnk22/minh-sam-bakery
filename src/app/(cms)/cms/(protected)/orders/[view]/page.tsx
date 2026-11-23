import { notFound } from "next/navigation";

import { OrdersPage } from "@/cms/features/orders/components/orders-page/orders-page";
import { isOrderView } from "@/cms/features/orders/lib/order-views";

export default async function CmsOrderViewPage({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  if (!isOrderView(view)) notFound();
  return <OrdersPage view={view} />;
}
