import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

test("CMS blocking mutation opt-in excludes notifications and queries", () => {
  for (const [name, hook] of [["users","user-mutations"],["roles","role-mutations"],["posts","post-mutations"],["themes","theme-mutations"],["themes","theme-activation"],["orders","order-mutations"],["banners","banner-mutations"],["products","product-mutations"],["categories","category-mutations"],["system-configs","system-config-mutations"]]) {
    const source = read(`src/cms/features/${name}/hooks/use-${hook}.ts`);
    assert.ok(source.includes("...blockingMutationOptions"), hook);
    assert.equal((source.match(/useMutation\(\{/g) ?? []).length, (source.match(/\.\.\.blockingMutationOptions/g) ?? []).length, hook);
  }
  assert.doesNotMatch(read("src/cms/features/notification-center/hooks/use-notification-mutations.ts"), /pageLoading|blockingMutationOptions/);
  const policy = read("src/cms/lib/blocking-mutation-options.ts");
  assert.match(policy, /meta: \{ pageLoading: true \}/);
  assert.match(policy, /networkMode: "always"/);
  assert.match(read("src/cms/providers/cms-mutation-loading.tsx"), /mutation.state.status === "pending"/);
});

test("refresh and page loading share one native dialog and release queued notifications", () => {
  const modal = read("src/cms/features/auth/components/session-refresh-modal/session-refresh-modal.tsx");
  assert.match(modal, /open=\{recovering \|\| loading\}/);
  assert.match(modal, /status !== "idle"/);
  const shared = read("src/shared/components/page-loading/page-loading.tsx");
  assert.match(shared, /showModal\(\)/);
  assert.match(shared, /onCancel=\{event => event.preventDefault\(\)\}/);
  assert.match(read("src/shared/components/page-loading/page-loading.module.css"), /backdrop-filter: blur\(4px\)/);
  assert.match(read("src/cms/lib/notifications.ts"), /pageLoading.store.subscribe/);
});

test("nine toolbar modules track explicit searches and collections load locally", () => {
  for (const name of ["products","categories","orders","users","roles","posts","banners","themes","system-configs"]) {
    const root = `src/cms/features/${name}/components/`;
    assert.match(read(root+`${name}-toolbar/${name}-toolbar.tsx`), /<CmsToolbar fetching=\{fetching\}/, name);
    assert.match(read(root+`${name}-page/${name}-page.tsx`), /fetching=\{\w+.isFetching\}/, name);
    assert.match(read(root+`${name}-collection/${name}-collection.tsx`), /isLoading \|\| \(\w+.isFetching && \w+.isPlaceholderData\)/, name);
  }
  const toolbar = read("src/cms/components/toolbar/cms-toolbar.tsx");
  assert.match(toolbar, /<fieldset disabled=\{state.pending\}/);
  assert.match(toolbar, /state.run\(onSearch\)/);
  assert.match(read("src/cms/hooks/use-toolbar-search-pending.ts"), /if \(locked.current\) return/);
});
