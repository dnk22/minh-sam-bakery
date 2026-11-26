import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = "src/app/(landing)/";
const read = (path: string) => readFileSync(path, "utf8");

test("shared Landing shell suspends before touching backend data", () => {
  const layout = read(root + "layout.tsx");
  assert.match(layout, /<Suspense fallback=\{null\}>/);
  assert.match(layout, /<LandingRuntimeLayout>\{children\}<\/LandingRuntimeLayout>/);
  assert.match(layout, /async function LandingRuntimeLayout[^]*?await connection\(\);\s*const \[categories, landingTheme\]/);
  assert.match(layout, /getCatalogCategories\(\)\.catch/);
  assert.match(layout, /getActiveLandingTheme\(\)/);
});

test("public pages and dynamic metadata wait for a real request before backend access", () => {
  for (const [path, fn] of [
    ["page.tsx", "HomePage"],
    ["ve-minh-sam/page.tsx", "AboutRoute"],
    ["danh-muc/page.tsx", "CategoriesIndexRoute"],
    ["danh-muc/[categorySlug]/page.tsx", "CategoryRoute"],
    ["danh-muc/[categorySlug]/[productSlug]/page.tsx", "ProductRoute"],
    ["tim-kiem/page.tsx", "SearchPage"],
    ["tin-tuc/page.tsx", "JournalContent"],
    ["tin-tuc/[slug]/page.tsx", "ArticleContent"],
  ]) {
    const source = read(root + path);
    assert.match(source, new RegExp("async function " + fn + "[^]*?\\{\\s*await connection\\(\\);"), path);
  }
  for (const path of ["danh-muc/[categorySlug]/page.tsx", "danh-muc/[categorySlug]/[productSlug]/page.tsx", "tin-tuc/[slug]/page.tsx"]) {
    assert.match(read(root + path), /async function generateMetadata[^]*?\{\s*await connection\(\);/, path);
  }
  assert.match(read(root + "danh-muc/page.tsx"), /export const instant = false/);
  assert.match(read("src/landing/features/banners/public-banners.server.ts"), /await connection\(\);\s*const response = await backendRequest/);
});

test("outage fallback is distinct from an empty catalog, missing product or article", () => {
  const index = read(root + "danh-muc/page.tsx");
  assert.match(index, /categories === null[^]*?LandingDataUnavailable/);
  assert.match(index, /Chưa có danh mục sản phẩm/);
  const category = read(root + "danh-muc/[categorySlug]/page.tsx");
  assert.match(category, /categories === null[^]*?LandingDataUnavailable[^]*?if \(!category\) notFound\(\)/);
  const search = read(root + "tim-kiem/page.tsx");
  assert.match(search, /categories === null[^]*?LandingDataUnavailable[^]*?parseSearchQuery\(raw\)/);
  const product = read(root + "danh-muc/[categorySlug]/[productSlug]/page.tsx");
  assert.match(product, /LandingDataUnavailable title="Chưa thể tải sản phẩm"[^]*?if \(!product\) notFound\(\)/);
  const article = read(root + "tin-tuc/[slug]/page.tsx");
  assert.match(article, /LandingDataUnavailable title="Chưa thể mở bài viết"[^]*?if \(!article \|\| article.status !== "PUBLISHED"\) notFound\(\)/);
  assert.match(read("src/landing/components/ui/landing-data-unavailable.tsx"), /router.refresh\(\)/);
});

test("CI enforces a clean offline build while keeping Next caching enabled", () => {
  const next = read("next.config.ts");
  assert.match(next, /cacheComponents: true/);
  assert.match(next, /partialPrefetching: true/);
  const ci = read(".github/workflows/ci.yml");
  assert.match(ci, /run: pnpm build\s/);
  assert.match(ci, /run: pnpm build:offline/);
  const script = read("scripts/verify-backend-offline-build.mjs");
  assert.match(script, /response.writeHead\(503/);
  assert.match(script, /await rm\("\.next"/);
  assert.match(script, /BACKEND_BASE_URL:/);
  assert.match(script, /if \(backendRequests.length\)/);
});
