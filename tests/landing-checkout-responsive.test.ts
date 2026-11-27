import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { normalizeVietnamMobilePhone, isVietnamMobilePhone } from "../src/lib/contracts/order/vietnam-mobile-phone.ts";
import { isCreateOrderInput } from "../src/lib/contracts/order/order.schema.ts";
import { initialCheckoutDraft, normalizeCheckoutDraft, validateCheckoutPhone, validateCheckoutDraft } from "../src/landing/features/checkout/validation.ts";
import { localCalendarDate, restoreReceiveDate, isValidReceiveDate } from "../src/landing/features/checkout/utils/checkout-date.ts";

test("Vietnam mobile phone normalization accepts domestic and international display formats", () => {
  for (const value of ["0901234567", "+84901234567", "090 123 4567", "090-123-4567", "  +84 90.123.4567  "]) {
    assert.equal(normalizeVietnamMobilePhone(value), "0901234567");
    assert.equal(validateCheckoutPhone(value), undefined);
    assert.equal(normalizeCheckoutDraft({...initialCheckoutDraft(), phone:value}).phone, "0901234567");
  }
  for (const prefix of ["03", "05", "07", "08", "09"]) assert.equal(isVietnamMobilePhone(prefix+"12345678"), true);
  for (const value of ["", "0123456789", "0241234567", "090123456", "09012345678", "abcdefghi", "+840901234567", "090/123/4567", "84901234567"]) {
    assert.equal(normalizeVietnamMobilePhone(value), null);
    assert.ok(validateCheckoutPhone(value));
  }
});

test("order wire contract requires canonical domestic mobile phone", () => {
  const input = {items:[{productId:"p",variantId:"v",quantity:1}],fullName:"Nguyễn An",phone:"0901234567",fulfillmentMethod:"PICKUP",shippingAddress:null,deliveryDate:"2026-11-27",paymentMethod:"AT_STORE"};
  assert.equal(isCreateOrderInput(input),true);
  assert.equal(isCreateOrderInput({...input,phone:"+84901234567"}),false);
  assert.equal(isCreateOrderInput({...input,phone:"0241234567"}),false);
});

test("Vietnam calendar default and restored date are independent of UTC midnight", () => {
  const today = localCalendarDate(new Date("2026-11-26T17:00:00Z"));
  assert.equal(today,"2026-11-27");
  assert.equal(localCalendarDate(new Date("2026-11-26T16:59:59Z")),"2026-11-26");
  assert.equal(initialCheckoutDraft(today).receiveDate,today);
  assert.equal(restoreReceiveDate("",today),today);
  assert.equal(restoreReceiveDate("2026-11-26",today),today);
  assert.equal(restoreReceiveDate("2026-11-30",today),"2026-11-30");
  assert.equal(restoreReceiveDate("2027-02-30",today),today);
  assert.equal(isValidReceiveDate("2028-02-29",today),true);
  const draft={...initialCheckoutDraft(today),fullName:"Nguyễn An",phone:"0901234567"};
  assert.equal(validateCheckoutDraft(draft,today).firstInvalidField,undefined);
  assert.ok(validateCheckoutDraft({...draft,receiveDate:"2026-11-26"},today).errors.receiveDate);
});

test("checkout native date and shared layout constrain intrinsic width; upload row and dialogs follow UX requirements", () => {
  const dir="src/landing/features/checkout/components/";
  const read=(name:string)=>readFileSync(dir+name,"utf8");
  const css=read("checkout-date-input.module.css");
  assert.match(css,/min-width: 0/);
  assert.match(css,/max-width: 100%/);
  assert.match(css,/-webkit-appearance: none/);
  assert.match(read("checkout-field.tsx"),/w-full min-w-0 max-w-full/);
  assert.match(read("checkout-fulfillment-section.tsx"),/<CheckoutDateInput/);
  assert.match(read("checkout-customer-section.tsx"),/onBlur=/);
  assert.match(read("checkout-dialog.tsx"),/text-headline-sm.*sm:text-\[24px\].*lg:text-headline-md/);
  assert.doesNotMatch(read("checkout-success-modal.tsx"),/Minh Sâm Bakery • 1932/);
  const upload=read("payment-qr/payment-proof-upload.tsx");
  assert.doesNotMatch(upload,/upload\.file\.name/);
  assert.match(upload,/items-center justify-between/);
});
