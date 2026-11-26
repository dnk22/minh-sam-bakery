import { Suspense } from "react";
import { QrPaymentPage } from "@/cms/features/qr-payment/components/qr-payment-page/qr-payment-page";

export default function CmsQrPaymentPage() {
  return <Suspense fallback={null}><QrPaymentPage /></Suspense>;
}
