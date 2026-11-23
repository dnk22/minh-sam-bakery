import type { Metadata } from "next";
import { CartPage } from "@/landing/features/cart/components/cart-page";

export const metadata: Metadata = {
  title: "Giỏ hàng | Minh Sâm Bakery",
  description: "Xem và chọn sản phẩm cần thanh toán trong giỏ hàng Minh Sâm.",
  robots: { index: false, follow: true },
};

export default function CartRoute() {
  return <CartPage />;
}
