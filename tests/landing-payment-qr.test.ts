import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { readQrPaymentValue, QR_PAYMENT_KEY } from "../src/lib/contracts/qr-payment/qr-payment-data.ts";

test("shared payment contract preserves account number and rejects malformed data", () => {
  const config = { accountNumber: "00123", accountHolder: "MINH SAM", bankName: "MB", bankBranch: "", qrImageUrl: "/uploads/qr-payment/qr.png" };
  assert.equal(QR_PAYMENT_KEY, "QR_PAYMENT");
  assert.deepEqual(readQrPaymentValue(JSON.stringify(config)), config);
  assert.equal(readQrPaymentValue("invalid"), null);
  assert.equal(readQrPaymentValue(JSON.stringify({ ...config, accountNumber: 123 })), null);
});
test("payment QR uses public no-store API and fails closed", () => {
  const root = "src/landing/features/checkout/";
  const server = readFileSync(root + "api/payment-qr.server.ts", "utf8");
  const client = readFileSync(root + "api/payment-qr.client.ts", "utf8");
  const modal = readFileSync(root + "components/checkout-transfer-modal.tsx", "utf8");
  assert.match(server, /path: "\/api\/v1\/public\/p-con\/qr"/);
  assert.match(server, /cache: "no-store"/);
  assert.match(client, /response.status !== 200/);
  assert.match(modal, /qr.status === "ready" && !pending && !blocked/);
  assert.match(modal, /<PaymentQrUnavailable/);
  assert.match(modal, /<PaymentQrLoading/);
  assert.doesNotMatch(modal, /IllustrativeQr|thử nghiệm/);
});

test("checkout preloads payment QR and blocks unavailable transfer before modal", () => {
  const root = "src/landing/features/checkout/";
  const controller = readFileSync(root + "hooks/use-checkout-controller.ts", "utf8");
  const page = readFileSync(root + "components/checkout-page.tsx", "utf8");
  const section = readFileSync(root + "components/checkout-payment-section.tsx", "utf8");
  const modal = readFileSync(root + "components/checkout-transfer-modal.tsx", "utf8");
  assert.match(controller, /usePaymentQr\(intent\?\.sessionId \?\? null, !receipt\)/);
  assert.match(controller, /if \(paymentBlocked\)/);
  assert.match(section, /disabled=\{qrStatus !== "ready"\}/);
  assert.match(section, /text-amber-800/);
  assert.match(page, /blocked=\{checkout.blocked \|\| checkout.paymentBlocked\}/);
  assert.match(page, /qr=\{checkout.paymentQr\}/);
  assert.doesNotMatch(modal, /usePaymentQr\(/);
});

test("image failures stay local and preserve manual bank transfer", () => {
  const root = "src/landing/features/checkout/";
  const modal = readFileSync(root + "components/checkout-transfer-modal.tsx", "utf8");
  const image = readFileSync(root + "components/payment-qr/payment-qr-image.tsx", "utf8");
  const hook = readFileSync(root + "hooks/use-payment-qr.ts", "utf8");
  const controller = readFileSync(root + "hooks/use-checkout-controller.ts", "utf8");
  const page = readFileSync(root + "components/checkout-page.tsx", "utf8");
  assert.match(modal, /const unavailable = qr.status === "unavailable";/);
  assert.match(modal, /<PaymentQrDetails config=\{qr.config\}/);
  assert.match(image, /onError=\{\(\) => setStatus\("failed"\)\}/);
  assert.match(image, /chuyển khoản thủ công/);
  assert.doesNotMatch(modal + hook + controller + page, /onQrUnavailable|markQrUnavailable|markUnavailable/);
});

test("payment details use 14px body token and copy the unchanged account number", () => {
  const root = "src/landing/features/checkout/components/";
  const modal = readFileSync(root + "checkout-transfer-modal.tsx", "utf8");
  const details = readFileSync(root + "payment-qr/payment-qr-details.tsx", "utf8");
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.doesNotMatch(modal, /description="Chuyển khoản tiền bánh/);
  assert.match(css, /--text-body-md: 14px/);
  assert.match(details, /font-body-md text-body-md/);
  assert.match(details, /value=\{config.accountNumber\}/);
  assert.match(details, /await navigator.clipboard.writeText\(value\)/);
  assert.match(details, /setStatus\("copied"\)/);
  assert.match(details, /setStatus\("failed"\)/);
  assert.match(details, /aria-label="Sao chép số tài khoản"/);
  assert.match(details, /type="button"/);
});

test("account copy icon precedes the value and uses the landing auto-dismiss toast", () => {
  const details = readFileSync("src/landing/features/checkout/components/payment-qr/payment-qr-details.tsx", "utf8");
  const notifications = readFileSync("src/landing/components/notifications/landing-notifications.tsx", "utf8");
  const styles = readFileSync("src/landing/components/notifications/landing-notifications.module.css", "utf8");
  const layout = readFileSync("src/app/(landing)/layout.tsx", "utf8");
  assert.ok(details.indexOf('aria-label="Sao chép số tài khoản"') < details.indexOf('select-text'));
  assert.match(details, /await navigator.clipboard.writeText\(value\);\s*setStatus\("copied"\);\s*toast.success\("Đã sao chép số tài khoản"/);
  assert.match(notifications, /duration=\{2_000\}/);
  assert.match(styles, /z-index: 110/);
  assert.match(layout, /<LandingNotifications \/>/);
});
