import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { parseCheckoutDraft } from "../src/landing/features/checkout/store/checkout-draft.ts";
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

test("persisted checkout draft is parsed without changing the existing session format", () => {
  const saved = {
    ...initialCheckoutDraft(),
    fullName: "Nguyễn An",
    phone: "0901234567",
    receiveDate: "2026-12-01",
    fulfillmentMethod: "delivery" as const,
    paymentMethod: "BANK_TRANSFER" as const,
  };
  assert.deepEqual(parseCheckoutDraft(saved), saved);
  assert.equal(parseCheckoutDraft(null), null);
  assert.equal(parseCheckoutDraft({ ...saved, phone: null }), null);
  assert.equal(parseCheckoutDraft({ ...saved, paymentMethod: "CREDIT_CARD" }), null);
  assert.equal(parseCheckoutDraft({ ...saved, deliveryTime: undefined }), null);
});

test("checkout page delegates form state, sections and summary to focused modules", () => {
  const componentDir = "src/landing/features/checkout/components";
  const page = readFileSync(`${componentDir}/checkout-page.tsx`, "utf8");
  const controller = readFileSync("src/landing/features/checkout/hooks/use-checkout-controller.ts", "utf8");
  const summary = readFileSync(`${componentDir}/checkout-order-summary.tsx`, "utf8");
  const field = readFileSync(`${componentDir}/checkout-field.tsx`, "utf8");
  const draftStorage = readFileSync("src/landing/features/checkout/store/checkout-draft.ts", "utf8");
  const purchase = readFileSync("src/landing/features/product/components/fixed-price-purchase-experience.tsx", "utf8");

  assert.ok(page.split("\n").length < 120, "page must remain an orchestration component");
  for (const section of ["CheckoutCustomerSection", "CheckoutFulfillmentSection", "CheckoutPaymentSection", "CheckoutOrderSummary"]) {
    assert.match(page, new RegExp(section));
  }
  assert.match(controller, /loadCheckoutIntent/);
  assert.match(controller, /validateCheckoutDraft/);
  assert.match(controller, /persistCheckoutDraft/);
  assert.match(controller, /formRef\.current\?\.querySelector/);
  assert.doesNotMatch(controller, /sessionStorage/);
  assert.match(draftStorage, /minh-sam-checkout-contact-v1/);
  assert.match(field, /checkoutInputStyles/);
  assert.match(summary, /Kiểm tra thông tin/);
  for (const source of [page, controller, summary]) {
    assert.doesNotMatch(source, /createOrderCode|orders\/create|IllustrativeQr/);
  }
  assert.doesNotMatch(purchase, /Thông tin nhận hàng/);
  assert.match(purchase, /saveBuyNowIntent/);
  assert.equal(existsSync("src/app/(landing)/thanh-toan/page.tsx"), true);
  assert.equal(existsSync(`${componentDir}/checkout-flow-provider.tsx`), false);
});
