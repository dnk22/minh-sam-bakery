"use client";

import { useRouter } from "next/navigation";
import { CheckoutTransferModal } from "./checkout-transfer-modal";
import { CheckoutSuccessModal } from "./checkout-success-modal";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { routes } from "@/landing/lib/routes";

import { CheckoutCustomerSection } from "./checkout-customer-section";
import { CheckoutFulfillmentSection } from "./checkout-fulfillment-section";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutPaymentSection } from "./checkout-payment-section";
import { useCheckoutController, useCheckoutReady } from "../hooks/use-checkout-controller";
import { useCheckoutSession } from "../hooks/use-checkout-session";
import type { CheckoutSessionSnapshot } from "../store/checkout-session-store";

export function CheckoutPage() {
  const ready = useCheckoutReady();
  if (!ready) {
    return (
      <main className="min-h-[65vh] bg-surface pt-[var(--landing-header-height)]">
        <div className="mx-auto max-w-[1360px] px-gutter py-space-xl font-body-md text-on-surface-variant">
          Đang chuẩn bị thanh toán...
        </div>
      </main>
    );
  }

  return <HydratedCheckoutPage />;
}

function HydratedCheckoutPage() {
  const session = useCheckoutSession();
  const sessionKey = session.intent?.sessionId ?? session.receipt?.sessionId ?? "empty";
  return <CheckoutSessionPage key={sessionKey} session={session} />;
}

function CheckoutSessionPage({ session }: { session: CheckoutSessionSnapshot }) {
  const checkout = useCheckoutController(session);
  const router = useRouter();
  if (checkout.receipt) return <CheckoutSuccessModal order={checkout.receipt} onClose={() => { checkout.closeReceipt(); router.replace(checkout.returnTo); }} />;

  if (!checkout.intent) {
    return (
      <main className="min-h-[65vh] bg-surface pt-[var(--landing-header-height)]">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-space-md px-gutter py-space-xl text-center">
          <ShoppingBag aria-hidden="true" className="size-12 text-secondary" />
          <h1 className="font-headline-lg text-headline-md text-primary">Chưa có sản phẩm để thanh toán</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Hãy chọn Mua ngay hoặc chọn sản phẩm trong giỏ hàng trước khi thanh toán.
          </p>
          <Link className="rounded-lg bg-primary px-space-lg py-3 font-label-ui text-on-primary" href={routes.cart}>
            Quay lại giỏ hàng
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[65vh] bg-surface pt-[var(--landing-header-height)]">
      <section className="mx-auto max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop">
        <nav aria-label="Đường dẫn trang" className="mb-space-lg flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <Link href={routes.home}>Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-primary">Thanh toán</span>
        </nav>
        <div className="mb-space-xl">
          <h1 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">
            Thông tin thanh toán
          </h1>
          <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
            {checkout.intent.source === "buy-now" ? "Đơn mua ngay" : "Đơn từ giỏ hàng"}
            {" • "}{checkout.intent.items.length} dòng sản phẩm.
          </p>
        </div>
        <form
          className="grid min-w-0 grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-[minmax(0,1fr)_minmax(310px,400px)]"
          noValidate
          onSubmit={checkout.checkInformation}
        >
          <fieldset disabled={checkout.pending || checkout.blocked || checkout.paymentQr.status === "loading"} className="min-w-0 space-y-space-lg">
            <CheckoutCustomerSection
              draft={checkout.draft}
              errors={checkout.errors}
              onUpdate={checkout.updateDraft}
              onPhoneBlur={checkout.validatePhoneOnBlur}
            />
            <CheckoutFulfillmentSection
              draft={checkout.draft}
              errors={checkout.errors}
              today={checkout.today}
              onUpdate={checkout.updateDraft}
              onFulfillmentChange={checkout.chooseFulfillment}
            />
            <CheckoutPaymentSection
              qrStatus={checkout.paymentQr.status}
              draft={checkout.draft}
              errors={checkout.errors}
              onUpdate={checkout.updateDraft}
            />
          </fieldset>
          <CheckoutOrderSummary
            intent={checkout.intent}
            isDelivery={checkout.draft.fulfillmentMethod === "delivery"}
            pending={checkout.pending}
            blocked={checkout.blocked || checkout.paymentBlocked}
            error={checkout.submitError}
          />
        </form>
        {checkout.transferInput && <CheckoutTransferModal upload={checkout.paymentUpload} qr={checkout.paymentQr} total={checkout.intent.items.reduce((sum, item) => sum + item.effectivePrice * item.quantity, 0)} pending={checkout.pending} blocked={checkout.blocked} error={checkout.submitError} onClose={checkout.closeTransfer} onConfirm={checkout.confirmTransfer} />}
      </section>
    </main>
  );
}
