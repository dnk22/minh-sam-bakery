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
  assert.match(controller, /CheckoutSessionSnapshot/);
  assert.match(controller, /validateCheckoutDraft/);
  assert.match(controller, /persistCheckoutDraft/);
  assert.match(controller, /event\.currentTarget\.querySelector/);
  assert.match(controller, /useSyncExternalStore\(subscribeHydration, clientSnapshot, serverSnapshot\)/);
  assert.match(page, /if \(!ready\)/);
  assert.match(page, /<HydratedCheckoutPage \/>/);
  assert.match(page, /key=\{sessionKey\}/);
  assert.doesNotMatch(controller, /formRef/);
  assert.doesNotMatch(controller, /sessionStorage/);
  assert.match(draftStorage, /minh-sam-checkout-contact-v1/);
  assert.match(field, /checkoutInputStyles/);
  assert.match(summary, /Đặt hàng/);
  for (const source of [page, controller, summary]) {
    assert.doesNotMatch(source, /createOrderCode/);
  }
  assert.doesNotMatch(purchase, /Thông tin nhận hàng/);
  assert.match(purchase, /beginBuyNowCheckout/);
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
  assert.match(mutation,/activeAttempt\.current/);
  assert.match(mutation,/markCheckoutSessionPending/);
});

test("checkout return destination preserves shopping query and rejects unsafe or checkout paths", async () => {
  const { safeReturnTo, checkoutReturnTo } = await import("../src/landing/features/checkout/store/checkout-return.ts");
  for (const path of ["/", "/danh-muc/banh-tet", "/danh-muc/banh-tet/banh-a", "/tim-kiem?q=banh&page=2#ket-qua"]) assert.equal(safeReturnTo(path),path);
  for (const path of ["https://evil.example","//evil.example","/don-hang","/thanh-toan","/cms","/api/public/orders/create","/danh-muc/../thanh-toan","/%2f%2fevil.example","/danh-muc/foo%2f..%2f..%2fcms",null]) assert.equal(safeReturnTo(path),null);
  assert.equal(checkoutReturnTo(undefined),"/tim-kiem");
  const page = readFileSync("src/landing/features/checkout/components/checkout-page.tsx","utf8");
  assert.match(page,/router.replace\(checkout.returnTo\)/);
  assert.doesNotMatch(page,/router.replace\(routes.home\)/);
});

test("both cart links capture the source and checkout preserves the destination through receipt cleanup", () => {
  const header = readFileSync("src/landing/components/layout/landing-header.tsx","utf8");
  const session = readFileSync("src/landing/features/checkout/store/checkout-session-store.ts","utf8");
  const controller = readFileSync("src/landing/features/checkout/hooks/use-checkout-controller.ts","utf8");
  assert.equal((header.match(/onNavigate=\{rememberCartOrigin\}/g) ?? []).length,2);
  assert.match(session,/returnTo: cartOrigin\(\)/);
  assert.match(session,/returnTo: currentShoppingUrl\(\)/);
  assert.match(controller,/saveReceiptOrigin\(intent.returnTo\)/);
  assert.match(controller,/intent\?\.returnTo \?\? receiptOrigin\(\)/);
});

test("new buy-now and cart actions publish isolated reactive sessions without losing customer draft", async () => {
  const { CHECKOUT_INTENT_KEY } = await import("../src/landing/features/checkout/store/checkout-intent.ts");
  const {
    beginBuyNowCheckout,
    beginCartCheckout,
    clearCheckoutSessionPending,
    getCheckoutSessionSnapshot,
    isCheckoutSessionPending,
    markCheckoutSessionPending,
    restoreCheckoutSession,
    subscribeCheckoutSession,
  } = await import("../src/landing/features/checkout/store/checkout-session-store.ts");
  const { CHECKOUT_DRAFT_KEY } = await import("../src/landing/features/checkout/store/checkout-draft.ts");
  const data = new Map<string, string>();
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } };
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { sessionStorage: storage, location: { pathname: "/", search: "", hash: "" } } });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  const line = { key: '["p","v"]', productId: "p", variantId: "v", quantity: 1, categorySlug: "cake", productSlug: "cake", productName: "Bánh", productImage: "", productImageAlt: "", variantLabel: "L", availableVariants: [], originalPrice: 100, effectivePrice: 90, selected: true };
  try {
    const draft = { ...initialCheckoutDraft(), fullName: "Nguyễn An", phone: "0901234567" };
    storage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
    storage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify({ source: "buy-now", items: [line] }));
    storage.setItem("minh-sam-checkout-submit-pending-v1", "1");
    restoreCheckoutSession();
    const legacy = getCheckoutSessionSnapshot().intent!.sessionId;
    assert.equal(isCheckoutSessionPending(legacy), true);

    let publications = 0;
    const unsubscribe = subscribeCheckoutSession(() => { publications += 1; });
    assert.equal(beginBuyNowCheckout(line), true);
    const first = getCheckoutSessionSnapshot().intent!.sessionId;
    assert.equal(isCheckoutSessionPending(first), false);
    assert.equal(markCheckoutSessionPending(first), true);
    assert.equal(markCheckoutSessionPending(first), false, "double submit in one session must be rejected");

    assert.equal(beginBuyNowCheckout(line), true);
    const second = getCheckoutSessionSnapshot().intent!.sessionId;
    assert.notEqual(second, first);
    assert.equal(isCheckoutSessionPending(second), false);
    assert.equal(markCheckoutSessionPending(first), false);
    assert.equal(markCheckoutSessionPending(second), true);
    clearCheckoutSessionPending(first);
    assert.equal(isCheckoutSessionPending(second), true, "late cleanup from A must not clear B");

    assert.equal(beginCartCheckout([line]), true);
    const third = getCheckoutSessionSnapshot().intent!.sessionId;
    assert.notEqual(third, second);
    assert.equal(getCheckoutSessionSnapshot().intent!.source, "cart");
    assert.equal(isCheckoutSessionPending(third), false);
    assert.deepEqual(JSON.parse(storage.getItem(CHECKOUT_DRAFT_KEY)!), draft);
    assert.ok(publications >= 3, "mounted subscribers must receive every explicit checkout action");
    unsubscribe();
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window");
    if (oldStorage) Object.defineProperty(globalThis, "sessionStorage", oldStorage); else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("reload and back-forward restoration keep only the matching session guard", async () => {
  const { beginBuyNowCheckout, getCheckoutSessionSnapshot, isCheckoutSessionPending, markCheckoutSessionPending, restoreCheckoutSession } = await import("../src/landing/features/checkout/store/checkout-session-store.ts");
  const { CHECKOUT_INTENT_KEY } = await import("../src/landing/features/checkout/store/checkout-intent.ts");
  const data = new Map<string, string>();
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } };
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { sessionStorage: storage, location: { pathname: "/danh-muc/cake", search: "", hash: "" } } });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  const line = { key: '["p","v"]', productId: "p", variantId: "v", quantity: 1, categorySlug: "cake", productSlug: "cake", productName: "Bánh", productImage: "", productImageAlt: "", variantLabel: "L", availableVariants: [], originalPrice: 100, effectivePrice: 90, selected: true };
  try {
    restoreCheckoutSession();
    assert.equal(beginBuyNowCheckout(line), true);
    const sessionA = getCheckoutSessionSnapshot().intent!.sessionId;
    const rawA = storage.getItem(CHECKOUT_INTENT_KEY)!;
    assert.equal(markCheckoutSessionPending(sessionA), true);
    restoreCheckoutSession();
    assert.equal(getCheckoutSessionSnapshot().intent!.sessionId, sessionA);
    assert.equal(isCheckoutSessionPending(sessionA), true, "reload must retain uncertain guard for A");

    assert.equal(beginBuyNowCheckout(line), true);
    const sessionB = getCheckoutSessionSnapshot().intent!.sessionId;
    const rawB = storage.getItem(CHECKOUT_INTENT_KEY)!;
    storage.setItem(CHECKOUT_INTENT_KEY, rawA);
    restoreCheckoutSession();
    assert.equal(getCheckoutSessionSnapshot().intent!.sessionId, sessionA);
    storage.setItem(CHECKOUT_INTENT_KEY, rawB);
    restoreCheckoutSession();
    assert.equal(getCheckoutSessionSnapshot().intent!.sessionId, sessionB);
    assert.notEqual(sessionB, sessionA);
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window");
    if (oldStorage) Object.defineProperty(globalThis, "sessionStorage", oldStorage); else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("submission machine ignores late results and cleanup from an abandoned session", async () => {
  const { idleSubmission, submissionReducer } = await import("../src/landing/features/checkout/hooks/checkout-submission-machine.ts");
  let state = submissionReducer(idleSubmission("A"), { type: "start", sessionId: "A", attemptId: 1 });
  state = submissionReducer(state, { type: "uncertain", sessionId: "A", attemptId: 1, error: "timeout" });
  state = submissionReducer(state, { type: "start", sessionId: "B", attemptId: 2 });
  assert.equal(state.sessionId, "B");
  assert.equal(state.status, "submitting");
  assert.strictEqual(submissionReducer(state, { type: "failed", sessionId: "A", attemptId: 1, error: "late A" }), state);
  assert.strictEqual(submissionReducer(state, { type: "succeeded", sessionId: "A", attemptId: 1 }), state);
  assert.strictEqual(submissionReducer(state, { type: "start", sessionId: "B", attemptId: 3 }), state, "double click must not replace active B attempt");
  state = submissionReducer(state, { type: "failed", sessionId: "B", attemptId: 2, error: "retry allowed" });
  assert.equal(state.status, "failed");
  state = submissionReducer(state, { type: "start", sessionId: "B", attemptId: 3 });
  assert.equal(state.status, "submitting");
});

test("successful completion publishes a session-scoped receipt and stale success cannot replace it", async () => {
  const { beginBuyNowCheckout, completeCheckoutSession, getCheckoutSessionSnapshot, markCheckoutSessionPending, restoreCheckoutSession } = await import("../src/landing/features/checkout/store/checkout-session-store.ts");
  const data = new Map<string, string>();
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } };
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { sessionStorage: storage, location: { pathname: "/danh-muc/cake", search: "", hash: "" } } });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  const line = { key: '["p","v"]', productId: "p", variantId: "v", quantity: 1, categorySlug: "cake", productSlug: "cake", productName: "Bánh", productImage: "", productImageAlt: "", variantLabel: "L", availableVariants: [], originalPrice: 100, effectivePrice: 90, selected: true };
  const order = {
    id: "order-1", phone: "0901234567", fullName: "Nguyễn An", paymentMethod: "AT_STORE" as const,
    fulfillmentMethod: "PICKUP" as const, status: "PENDING_CONFIRMATION" as const, totalAmount: "90",
    items: [{ id: "item-1", productId: "p", variantId: "v", quantity: 1, unitPrice: "90", lineTotal: "90", productName: "Bánh", productSku: "P", variantSku: "V", size: "L", style: "" }],
    createdAt: "2026-11-26T00:00:00.000Z", updatedAt: "2026-11-26T00:00:00.000Z",
  };
  try {
    restoreCheckoutSession();
    assert.equal(beginBuyNowCheckout(line), true);
    const sessionA = getCheckoutSessionSnapshot().intent!.sessionId;
    assert.equal(markCheckoutSessionPending(sessionA), true);
    assert.equal(beginBuyNowCheckout(line), true);
    const sessionB = getCheckoutSessionSnapshot().intent!.sessionId;
    assert.equal(completeCheckoutSession(sessionA, { ...order, id: "late-A" }), false);
    assert.equal(getCheckoutSessionSnapshot().intent!.sessionId, sessionB);
    assert.equal(markCheckoutSessionPending(sessionB), true);
    assert.equal(completeCheckoutSession(sessionB, order), true);
    assert.equal(getCheckoutSessionSnapshot().intent, null);
    assert.equal(getCheckoutSessionSnapshot().receipt?.sessionId, sessionB);
    assert.equal(getCheckoutSessionSnapshot().receipt?.order.id, "order-1");
    restoreCheckoutSession();
    assert.equal(getCheckoutSessionSnapshot().receipt?.order.id, "order-1");
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window");
    if (oldStorage) Object.defineProperty(globalThis, "sessionStorage", oldStorage); else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("checkout client distinguishes retryable 4xx from uncertain failures", async () => {
  const { CheckoutSubmitError, createOrder } = await import("../src/landing/features/checkout/api/checkout.client.ts");
  const input = { items: [{ productId: "p", variantId: "v", quantity: 1 }], fullName: "Nguyễn An", phone: "0901234567", fulfillmentMethod: "PICKUP" as const, shippingAddress: null, deliveryDate: "2026-12-01", paymentMethod: "AT_STORE" as const };
  const deterministic = await createOrder(input, (async () => new Response(JSON.stringify({ code: 422, message: "Thông tin chưa hợp lệ", data: null }), { status: 422 })) as typeof fetch).catch(error => error);
  assert.ok(deterministic instanceof CheckoutSubmitError);
  assert.equal(deterministic.uncertain, false);
  const serverFailure = await createOrder(input, (async () => new Response(JSON.stringify({ code: 502, message: "Chưa xác minh", data: null }), { status: 502 })) as typeof fetch).catch(error => error);
  assert.ok(serverFailure instanceof CheckoutSubmitError);
  assert.equal(serverFailure.uncertain, true);
  const networkFailure = await createOrder(input, (async () => { throw new TypeError("offline"); }) as typeof fetch).catch(error => error);
  assert.ok(networkFailure instanceof CheckoutSubmitError);
  assert.equal(networkFailure.uncertain, true);
  const timeoutFailure = await createOrder(input, (async () => { throw new DOMException("timed out", "TimeoutError"); }) as typeof fetch).catch(error => error);
  assert.ok(timeoutFailure instanceof CheckoutSubmitError);
  assert.equal(timeoutFailure.uncertain, true);
});

test("late QR result from session A is discarded and session B can load its own config", async () => {
  const { beginBuyNowCheckout, getCheckoutSessionSnapshot, restoreCheckoutSession } = await import("../src/landing/features/checkout/store/checkout-session-store.ts");
  const { loadPaymentQrForSession } = await import("../src/landing/features/checkout/hooks/use-payment-qr.ts");
  const data = new Map<string, string>();
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } };
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { sessionStorage: storage, location: { pathname: "/danh-muc/cake", search: "", hash: "" } } });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  const line = { key: '["p","v"]', productId: "p", variantId: "v", quantity: 1, categorySlug: "cake", productSlug: "cake", productName: "Bánh", productImage: "", productImageAlt: "", variantLabel: "L", availableVariants: [], originalPrice: 100, effectivePrice: 90, selected: true };
  const config = { accountNumber: "123", accountHolder: "MINH SAM", bankName: "Test Bank", bankBranch: "HN", qrImageUrl: "/uploads/qr.webp" };
  let resolveA!: (value: typeof config) => void;
  try {
    restoreCheckoutSession();
    beginBuyNowCheckout(line);
    const sessionA = getCheckoutSessionSnapshot().intent!.sessionId;
    const requestA = loadPaymentQrForSession(sessionA, new AbortController().signal, () => new Promise(resolve => { resolveA = resolve; }));
    beginBuyNowCheckout(line);
    const sessionB = getCheckoutSessionSnapshot().intent!.sessionId;
    resolveA(config);
    assert.equal(await requestA, null);
    assert.deepEqual(await loadPaymentQrForSession(sessionB, new AbortController().signal, async () => config), config);
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window");
    if (oldStorage) Object.defineProperty(globalThis, "sessionStorage", oldStorage); else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("unavailable sessionStorage rejects a new checkout without corrupting the reactive session", async () => {
  const { beginBuyNowCheckout, getCheckoutSessionSnapshot, restoreCheckoutSession } = await import("../src/landing/features/checkout/store/checkout-session-store.ts");
  const storage = { getItem: () => null, setItem: () => { throw new DOMException("blocked", "SecurityError"); }, removeItem: () => undefined };
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { sessionStorage: storage, location: { pathname: "/", search: "", hash: "" } } });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  const line = { key: '["p","v"]', productId: "p", variantId: "v", quantity: 1, categorySlug: "cake", productSlug: "cake", productName: "Bánh", productImage: "", productImageAlt: "", variantLabel: "L", availableVariants: [], originalPrice: 100, effectivePrice: 90, selected: true };
  try {
    restoreCheckoutSession();
    assert.equal(beginBuyNowCheckout(line), false);
    assert.equal(getCheckoutSessionSnapshot().intent, null);
    assert.equal(getCheckoutSessionSnapshot().receipt, null);
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window");
    if (oldStorage) Object.defineProperty(globalThis, "sessionStorage", oldStorage); else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
