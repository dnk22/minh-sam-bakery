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

  assert.ok(page.split("\n").length < 140, "page must remain an orchestration component");
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
  assert.match(summary, /Đặt hàng/);
  for (const source of [page, controller, summary]) {
    assert.doesNotMatch(source, /createOrderCode/);
  }
  assert.doesNotMatch(purchase, /Thông tin nhận hàng/);
  assert.match(purchase, /saveBuyNowIntent/);
  assert.equal(existsSync("src/app/(landing)/thanh-toan/page.tsx"), true);
  assert.equal(existsSync(`${componentDir}/checkout-flow-provider.tsx`), false);
});

test("order mapper uses real variant IDs, quantities and mock transfer URL only for transfer", async () => {
  const { buildOrderRequest } = await import("../src/landing/features/checkout/utils/order-request-mapper.ts");
  const { MOCK_PAYMENT_IMAGE_URL, isCreateOrderInput } = await import("../src/lib/contracts/order/order.schema.ts");
  const line = { key: '["p","v"]', productId:"p", variantId:"v", quantity:2, categorySlug:"cake", productSlug:"cake", productName:"Bánh", productImage:"", productImageAlt:"", variantLabel:"L", availableVariants:[], originalPrice:100, effectivePrice:90, selected:true };
  const intent = { source:"cart" as const, items:[line] };
  const draft = { ...initialCheckoutDraft(), fullName:"Nguyễn An", phone:"0901234567", receiveDate:"2026-12-01" };
  const pickup = buildOrderRequest(intent,draft);
  assert.deepEqual(pickup.items,[{productId:"p",variantId:"v",quantity:2}]);
  assert.equal(pickup.fulfillmentMethod,"PICKUP");
  assert.equal(pickup.shippingAddress,null);
  assert.equal(pickup.paymentImageUrl,undefined);
  const transfer = buildOrderRequest(intent,{...draft,fulfillmentMethod:"delivery",deliveryAddress:"Hà Nội",paymentMethod:"BANK_TRANSFER"});
  assert.equal(transfer.paymentImageUrl,MOCK_PAYMENT_IMAGE_URL);
  assert.equal(transfer.shippingAddress,"Hà Nội");
  assert.throws(()=>buildOrderRequest({...intent,items:[{...line,variantId:null}]},draft));
  assert.equal(isCreateOrderInput({...pickup,totalAmount:1}),false);
  assert.equal(isCreateOrderInput({...pickup,items:[{...pickup.items[0],quantity:0}]}),false);
  assert.equal(isCreateOrderInput({...pickup,deliveryDate:"2026-02-30"}),false);
});

test("checkout uses centered theme-aware dialogs and preserves uncertain submission guard", () => {
  const dir = "src/landing/features/checkout";
  const dialog = readFileSync(dir+"/components/checkout-dialog.tsx","utf8");
  const controller = readFileSync(dir+"/hooks/use-checkout-controller.ts","utf8");
  const mutation = readFileSync(dir+"/hooks/use-create-order.ts","utf8");
  assert.match(dialog,/top-1\/2 left-1\/2/);
  assert.match(dialog,/useLandingPortalContainer/);
  assert.match(controller,/consumePurchasedItems/);
  assert.match(controller,/intent.source === "cart"/);
  assert.match(mutation,/lock.current/);
  assert.match(mutation,/markPending/);
});

test("checkout return destination preserves shopping query and rejects unsafe or checkout paths", async () => {
  const { safeReturnTo, checkoutReturnTo } = await import("../src/landing/features/checkout/store/checkout-return.ts");
  for (const path of ["/", "/danh-muc/banh-tet", "/danh-muc/banh-tet/banh-a", "/tim-kiem?q=banh&page=2#ket-qua"]) assert.equal(safeReturnTo(path),path);
  for (const path of ["https://evil.example","//evil.example","/don-hang","/thanh-toan","/cms","/api/public/orders/create","/danh-muc/../thanh-toan","/%2f%2fevil.example",null]) assert.equal(safeReturnTo(path),null);
  assert.equal(checkoutReturnTo(undefined),"/tim-kiem");
  const page = readFileSync("src/landing/features/checkout/components/checkout-page.tsx","utf8");
  assert.match(page,/router.replace\(checkout.returnTo\)/);
  assert.doesNotMatch(page,/router.replace\(routes.home\)/);
});
