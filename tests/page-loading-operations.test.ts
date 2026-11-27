import assert from "node:assert/strict";
import test from "node:test";
import { createLoadingOperations } from "../src/shared/stores/page-loading-operations.ts";

test("overlapping operations release independently and idempotently", () => {
  const counts: number[] = [];
  const loading = createLoadingOperations(count => counts.push(count));
  const releaseA = loading.begin();
  const releaseB = loading.begin();
  releaseA();
  releaseA();
  releaseB();
  assert.deepEqual(counts, [1, 2, 1, 0]);
});

test("run preserves return value and releases on errors", async () => {
  const counts: number[] = [];
  const loading = createLoadingOperations(count => counts.push(count));
  assert.equal(await loading.run(async () => 42), 42);
  await assert.rejects(loading.run(async () => { throw new Error("timeout"); }), /timeout/);
  assert.deepEqual(counts, [1, 0, 1, 0]);
});

test("one failing action cannot hide a concurrent pending action", async () => {
  const counts: number[] = [];
  const loading = createLoadingOperations(count => counts.push(count));
  let resolve!: (value: string) => void;
  const slow = loading.run(() => new Promise<string>(done => { resolve = done; }));
  await assert.rejects(loading.run(async () => { throw new Error("network"); }));
  assert.deepEqual(counts, [1, 2, 1]);
  resolve("done");
  assert.equal(await slow, "done");
  assert.deepEqual(counts, [1, 2, 1, 0]);
});
