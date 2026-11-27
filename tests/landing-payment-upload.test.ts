import assert from "node:assert/strict";
import test from "node:test";
import { validatePaymentProofFile, isPaymentProofUrl, isPaymentProofUploadResult, hasPaymentProofImageSignature, PAYMENT_PROOF_MAX_BYTES } from "../src/lib/contracts/order/payment-proof.ts";
import { uploadPaymentProof } from "../src/landing/features/checkout/api/payment-upload.client.ts";

const file = new File([new Uint8Array([137,80,78,71,13,10,26,10])], "proof.png", { type: "image/png" });

test("single proof validates raster types, size, signatures and safe URLs", async () => {
  assert.equal(validatePaymentProofFile(file), null);
  assert.ok(validatePaymentProofFile({ type: "image/svg+xml", size: 10 }));
  assert.ok(validatePaymentProofFile({ type: "image/png", size: PAYMENT_PROOF_MAX_BYTES + 1 }));
  assert.ok(validatePaymentProofFile({ type: "image/png", size: 0 }));
  assert.equal(await hasPaymentProofImageSignature(file), true);
  assert.equal(await hasPaymentProofImageSignature(new File(["not an image"],"bad.png",{type:"image/png"})), false);
  for (const value of ["/uploads/payments/qr/receipt.png", "https://cdn.example.com/proof.jpg"]) assert.equal(isPaymentProofUrl(value),true);
  for (const value of ["", "https://example.invalid/checkout/mock-transfer.png", "//evil.example/a", "/uploads/%2e%2e/private", "javascript:alert(1)", "https://u:p@example.com/file", "blob:foo"]) assert.equal(isPaymentProofUrl(value),false);
  assert.equal(isPaymentProofUploadResult([{url:"/uploads/a.png"}]),true);
  assert.equal(isPaymentProofUploadResult([]),false);
  assert.equal(isPaymentProofUploadResult([{url:"/uploads/a.png"},{url:"/uploads/b.png"}]),false);
});

test("upload sends exactly one files part and returns the backend URL unchanged", async () => {
  const url = "/uploads/payments/qr/proof.png";
  const mock: typeof fetch = async (input, init) => {
    assert.equal(input,"/api/public/payment-upload");
    assert.equal(init?.method,"POST");
    assert.equal(init?.headers,undefined);
    assert.ok(init?.body instanceof FormData);
    const form = init.body;
    assert.deepEqual([...form.keys()],["files"]);
    const sent = form.get("files");
    assert.ok(sent instanceof File);
    assert.equal(sent.name,"proof.png");
    return Response.json({code:201,message:"OK",data:[{url}]},{status:201});
  };
  assert.equal(await uploadPaymentProof(file,new AbortController().signal,mock),url);
});

test("upload errors and invalid envelopes never yield a proof URL; retry works", async () => {
  const signal = new AbortController().signal;
  for (const [status, body] of [[400,{code:400,data:null}],[500,{code:500,data:null}],[201,{code:201,data:[]}],[200,{code:200,data:[{url:"/uploads/a.png"}]}]] as const) {
    await assert.rejects(uploadPaymentProof(file,signal,async()=>Response.json(body,{status})));
  }
  await assert.rejects(uploadPaymentProof(file,signal,async()=>{throw new TypeError("offline");}));
  assert.equal(await uploadPaymentProof(file,signal,async()=>Response.json({code:201,data:[{url:"/uploads/a.png"}]},{status:201})),"/uploads/a.png");
});
