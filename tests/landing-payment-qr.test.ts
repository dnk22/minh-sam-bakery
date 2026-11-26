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
  assert.match(modal, /qr.status === "ready" && imageState === "loaded"/);
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
  assert.match(controller, /usePaymentQr\(Boolean\(intent\) && !receipt\)/);
  assert.match(controller, /if \(paymentBlocked\)/);
  assert.match(section, /disabled=\{qrStatus !== "ready"\}/);
  assert.match(section, /text-amber-800/);
  assert.match(page, /blocked=\{checkout.blocked \|\| checkout.paymentBlocked\}/);
  assert.match(page, /qr=\{checkout.paymentQr\}/);
  assert.doesNotMatch(modal, /usePaymentQr\(/);
});
