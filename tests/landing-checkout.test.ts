import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { initialCheckoutDraft, validateCheckoutDraft } from "../src/landing/features/checkout/validation.ts";

test("pickup and delivery address rules are independent from payment selection", () => {
  const draft = {
    ...initialCheckoutDraft(),
    fullName: "Nguyễn An",
    phone: "0901234567",
    receiveDate: "2026-12-01",
  };
  assert.equal(validateCheckoutDraft(draft, "2026-11-23").firstInvalidField, undefined);
  assert.equal(validateCheckoutDraft({ ...draft, fulfillmentMethod: "delivery", paymentMethod: "BANK_TRANSFER" }, "2026-11-23").errors.deliveryAddress, "Vui lòng nhập địa chỉ giao hàng.");
  assert.equal(validateCheckoutDraft({ ...draft, fulfillmentMethod: "delivery", deliveryAddress: "Hà Nội" }, "2026-11-23").errors.paymentMethod, "Thanh toán tại cửa hàng chỉ áp dụng khi nhận tại cửa hàng.");
});

test("phone, email and delivery date are validated before checkout", () => {
  const draft = {
    ...initialCheckoutDraft(),
    fullName: "Test",
    phone: "invalid",
    email: "not-email",
    receiveDate: "2026-11-20",
  };
  const errors = validateCheckoutDraft(draft, "2026-11-23").errors;
  assert.ok(errors.phone);
  assert.ok(errors.email);
  assert.ok(errors.receiveDate);
});

test("checkout page never creates fake order codes, QR images or calls order API", () => {
  const page = readFileSync("src/landing/features/checkout/components/checkout-page.tsx", "utf8");
  const purchase = readFileSync("src/landing/features/product/components/fixed-price-purchase-experience.tsx", "utf8");
  assert.match(page, /loadCheckoutIntent/);
  assert.match(page, /Kiểm tra thông tin/);
  assert.doesNotMatch(page, /createOrderCode|orders\/create|IllustrativeQr/);
  assert.doesNotMatch(purchase, /Thông tin nhận hàng/);
  assert.match(purchase, /saveBuyNowIntent/);
  assert.equal(existsSync("src/app/(landing)/thanh-toan/page.tsx"), true);
  assert.equal(existsSync("src/landing/features/checkout/components/checkout-flow-provider.tsx"), false);
});
