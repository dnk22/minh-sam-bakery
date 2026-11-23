import type { Metadata } from "next";
import { CheckoutPage } from "@/landing/features/checkout/components/checkout-page";

export const metadata: Metadata = {
  title: "Thanh toán | Minh Sâm Bakery",
  description: "Nhập thông tin nhận bánh và chọn hình thức thanh toán cho đơn hàng Minh Sâm.",
  robots: { index: false, follow: true },
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
