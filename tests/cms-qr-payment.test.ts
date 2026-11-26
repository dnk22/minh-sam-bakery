import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createQrPaymentInput, updateQrPaymentInput, readQrPaymentValue, selectQrPayment } from "../src/cms/features/qr-payment/utils/qr-payment-data.ts";
import { QR_PAYMENT_DESCRIPTION } from "../src/cms/features/qr-payment/constants.ts";
import { isAllowedCmsUploadFolder } from "../src/cms/lib/api/upload-validation.ts";

const config = { accountNumber: "001234", accountHolder: "MINH SAM", bankName: "MB", bankBranch: "", qrImageUrl: "/uploads/qr-payment/qr.png" };
test("QR config serializes string value and preserves leading zeroes", () => {
  const input = createQrPaymentInput(config);
  assert.equal(input.key, "QR_PAYMENT");
  assert.equal(input.description, QR_PAYMENT_DESCRIPTION);
  assert.deepEqual(readQrPaymentValue(input.value), config);
  assert.deepEqual(updateQrPaymentInput(config), { value: input.value });
});
test("singleton uses exact key and rejects malformed values", () => {
  assert.deepEqual(selectQrPayment([{ key: "QR_PAYMENT_OTHER" }, { key: "QR_PAYMENT" }]), [{ key: "QR_PAYMENT" }]);
  for (const value of ["broken", "null", "[]", "{}", JSON.stringify({ ...config, accountNumber: 123 })]) assert.equal(readQrPaymentValue(value), null);
});
test("QR upload uses the existing single-image folder whitelist", () => {
  assert.equal(isAllowedCmsUploadFolder("qr-payment"), true);
});
test("QR page is table only and creation waits for confirmed absence", () => {
  const root = "src/cms/features/qr-payment/components/";
  const page = readFileSync(root + "qr-payment-page/qr-payment-page.tsx", "utf8");
  assert.match(page, /query.isSuccess && !query.isFetching && items.length === 0/);
  assert.doesNotMatch(page, /Toolbar|DeleteDialog/);
  assert.match(readFileSync(root + "qr-payment-collection/qr-payment-collection.tsx", "utf8"), /<DataTable/);
  assert.match(readFileSync(root + "qr-payment-fields/qr-payment-fields.tsx", "utf8"), /<ImageUpload/);
});
