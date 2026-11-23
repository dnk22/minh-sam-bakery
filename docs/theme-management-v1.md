# Theme Management V1

## Phase 2 — Landing runtime integration

### Luồng dữ liệu và validation

Mọi route trong route group `(landing)` dùng chung `src/app/(landing)/layout.tsx`. Layout lấy categories và active theme song song trên server. `getActiveLandingTheme()` gọi trực tiếp public Backend endpoint `GET /api/v1/public/theme` qua HTTP transport hiện có; browser không gọi lại endpoint và không nhận access token CMS.

Transport kiểm tra riêng response envelope và metadata bắt buộc (`id`, `name`, `code`, `isActive`, timestamps và sự hiện diện của `config`). `data: null` hoặc record không active được xem là chưa có active theme. Nội dung `data.config` chủ ý vẫn là `unknown` ở lớp HTTP rồi mới được đưa nguyên vẹn vào `resolveTheme(config)`. Nhờ đó config legacy, thiếu field hay schema version chưa hỗ trợ đi đúng cơ chế diagnostic/fallback của Theme Engine thay vì bị nhập nhằng với response metadata lỗi.

Các trạng thái runtime:

- Theme V1 hợp lệ: áp dụng config Backend.
- Theme hợp lệ nhưng contrast thấp: vẫn áp dụng nguyên giá trị và ghi warning; không tự sửa màu.
- Không có active theme: dùng Classic, không xem là lỗi vận hành.
- Network, timeout, HTTP/API error, JSON/envelope/metadata lỗi: dùng Classic và ghi diagnostic giới hạn ở loại lỗi/status.
- Config lỗi hoặc version chưa hỗ trợ: `resolveTheme()` dùng Classic và giữ schema diagnostic.

Không log toàn bộ response hay config theme.

### SSR scope và Tailwind runtime

`LandingThemeRoot` là Server Component bao trọn `LandingHeader`, page content và `LandingFooter`. Map từ `createThemeCssVariables()` được gắn trực tiếp vào thuộc tính `style` của root dưới dạng 47 `--color-*` và 13 `--font-*`; vì vậy HTML đầu tiên đã mang active theme, không cần `useEffect`, DOM mutation, client store hay hydration-time API call. Root cũng gắn `font-body-md` tại chính boundary để font mặc định được tính nơi có 13 font aliases; nếu chỉ đặt ở `body` phía ngoài, text kế thừa font có thể giữ font Classic.

Root chỉ thêm background/text semantic mặc định và `min-height`; không thêm `transform`, `filter`, `contain`, `overflow` hoặc stacking context nên fixed header, sticky content và viewport section giữ nguyên behavior. CMS layout nằm ngoài route group này và không inherit các override Landing.

`globals.css` tiếp tục dùng Tailwind v4 `@theme`, không đổi sang `@theme inline`. Utility như `bg-primary`, opacity modifier, gradient, border và các `font-*` semantic vì thế đọc runtime custom properties. Hai lựa chọn font vẫn chỉ trỏ tới `--font-noto-serif` và `--font-be-vietnam-pro` đã được `next/font` tải ở root layout; API không thể cung cấp font URL.

Audit Phase 2 đổi shadow thương hiệu của header sang `color-mix(... var(--color-primary) ...)` và thay các `font-serif` mang ý nghĩa editorial trong trang About bằng alias Heading tương ứng. `font-mono` cho nội dung kỹ thuật, overlay trung tính, error palette và shadow đen độc lập thương hiệu được giữ nguyên.

### Radix portals

`LandingPortalProvider` tạo một portal container bên trong `LandingThemeRoot`. Search filter drawer và Product variant dialog truyền container này vào `Dialog.Portal`, nên overlay/content inherit đúng CSS variables mà không gắn theme lên `body` và không duplicate theme state. Radix tiếp tục quản lý focus trap, Escape và scroll locking. Container được tạo client-side nhưng dialog chỉ có thể mở sau hydration; nội dung Landing SSR không phụ thuộc container này.

Khi bổ sung portal-based UI mới trong Landing, component phải dùng `useLandingPortalContainer()` thay vì portal mặc định vào `document.body`.

### Cache và invalidation

Active theme dùng một lớp Next.js Cache Components (`"use cache"`) với:

- tag: `landing-active-theme`;
- stale/revalidate: 60 giây;
- hard expire: 300 giây;
- helper server-only `revalidateLandingActiveTheme()` dùng `revalidateTag(..., { expire: 0 })` để Phase 4 gọi sau activation thành công.

**Phase 2.1:** Cached function chỉ trả về kết quả fetch/resolve thành công (bao gồm `data: null` hợp lệ). Lỗi network, timeout, HTTP hoặc envelope không hợp lệ được throw ra khỏi `"use cache"` và chỉ chuyển thành Classic fallback tại request boundary `getActiveLandingTheme()`. Như vậy Classic do sự cố Backend không được lưu như một cache hit thành công. Khi vẫn còn dữ liệu cache hợp lệ, Next.js có thể tiếp tục phục vụ stale; khi cache hết hạn hoặc một instance chưa có bản hợp lệ, request đó vẫn fallback Classic. Đây không phải cơ chế last-known-good bền vững xuyên instance. Test mô phỏng lỗi và hồi phục đã được bổ sung.

Ở trạng thái bình thường, request đầu tiên sau mốc 60 giây có thể vẫn nhận bản stale trong lúc background revalidation chạy; vì vậy không cam kết theme mới xuất hiện ngay sau activation. Nếu revalidation liên tiếp không thành công, entry hết hạn cứng sau tối đa 5 phút và request kế tiếp phải tính lại. Next client Router Cache cũng có thể giữ payload route đã điều hướng trước đó; cần hard refresh hoặc navigation mới khi kiểm tra TTL. Phase 4 nên gọi helper tag ngay sau Backend xác nhận activation, nhưng tab đang mở vẫn có thể cần refresh/navigation để nhận Server Component payload mới.

### Debug và kiểm tra

Khi theme không áp dụng:

1. Kiểm tra Backend trả envelope đúng và `data.config` đủ ThemeConfigV1.
2. Tìm server log `[landing-theme]`; log chỉ chỉ ra fetch/schema/contrast category, không chứa secret/config.
3. Kiểm tra element `[data-landing-theme-root]` trong HTML/DevTools và giá trị computed của `--color-primary`, `--font-display-hero`.
4. Kiểm tra dialog được mount dưới `[data-landing-portal-root]`.
5. Xác định entry còn trong cửa sổ stale 60 giây hay Router Cache của tab hiện tại.

Test `pnpm test:landing-theme` bao phủ response/fallback, contrast, đủ 47+13 biến, SSR inline variables, CMS isolation, portal scope và cache contract. Phase 3 có thể tái sử dụng contract/schema/diagnostics cho Theme Editor; không được thay runtime fallback thành validation form.

### Phase 2.1 — Browser QA trên bản Preview

Các unit tests kiểm tra dữ liệu, CSS variables và tình huống Backend lỗi → hồi phục; không thay thế browser/computed-style/visual regression tests.

1. Với custom Theme V1 ở môi trường thử nghiệm, kiểm tra computed font-family của Landing root và văn bản chỉ kế thừa font, đồng thời kiểm tra Heading có semantic font class.
2. Kiểm tra /, /ve-minh-sam, /danh-muc/[categorySlug], /tim-kiem, /don-hang, /thanh-toan ở mobile 375px và desktop 1440px; xác minh màu CTA, font, fixed header, hydration và flash.
3. So sánh Classic screenshots trước/sau của /ve-minh-sam (trích dẫn, chú thích ảnh, chữ cái đầu đoạn); Phase 2 có thay generic font-serif bằng Heading aliases nên không được mặc định visual baseline hoàn toàn giữ nguyên.
4. Mở Search Filter Drawer và Product Variant Dialog; kiểm tra computed color variables, focus trap, Escape và scroll lock.
5. Mô phỏng Backend theme timeout sau khi có custom theme, kiểm tra stale cache hoặc per-request fallback; sau khi API phục hồi, theme trở lại theo revalidation. Không cam kết last-known-good xuyên instance.

Nếu chưa chạy được trình duyệt, ghi rõ **chưa xác minh browser** trong PR; Vercel build xanh không có nghĩa visual regression đã pass.
---

## Phase 1 — Theme engine foundation

## 1. Phạm vi

Theme V1 quản lý đúng 14 màu lõi và hai lựa chọn font cho nhóm Heading/Body. Phase 1 chỉ cung cấp contract, preset Classic, bộ resolve màu/font, kiểm tra tương phản, CSS-variable map thuần dữ liệu và tests. Không có API Theme, CMS UI, Landing Provider, DOM side effect, layout/section registry hoặc thay đổi giao diện runtime.

Audit ngày 2026-11-23 xác nhận `src/app/globals.css` có 47 semantic color token, 13 semantic font alias và hai biến font từ `next/font/google`: `--font-noto-serif`, `--font-be-vietnam-pro`. Tailwind CSS v4 sinh utility từ các biến trong `@theme`; vì vậy Phase 2 có thể thay giá trị CSS custom property mà không đổi tên utility hiện tại.

Audit cũng ghi nhận một số giá trị trình bày hardcode ngoài token (shadow `rgba(...)` trong header/purchase bar, màu overlay trong Banner CSS Module, và utility chung `font-serif`/`font-mono` tại trang About). Chúng không được sửa trong Phase 1 vì nằm ngoài contract V1 và thay đổi có thể tác động giao diện.

## 2. ThemeConfigV1

```ts
type ThemeConfigV1 = {
  schemaVersion: 1;
  colors: {
    primary: string;
    primaryContainer: string;
    onPrimary: string;
    secondary: string;
    secondaryLight: string;
    onSecondary: string;
    background: string;
    surface: string;
    surfaceMuted: string;
    surfaceElevated: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
  typography: {
    heading: "noto-serif" | "be-vietnam-pro";
    body: "noto-serif" | "be-vietnam-pro";
  };
};
```

Schema Zod là strict ở root và từng object lồng nhau. Màu chỉ nhận `#RRGGBB`, sau đó normalize uppercase. Schema không nhận thiếu field, unknown key, CSS expression hoặc version khác `1`; không merge với Classic và không migrate legacy.

- `parseThemeConfig(input)`: validation nghiêm ngặt cho luồng create/update CMS.
- `resolveThemeConfig(input)`: validation dữ liệu runtime không tin cậy; config lỗi/legacy/version lạ sẽ fallback Classic kèm schema diagnostic.

## 3. Classic baseline

`CLASSIC_THEME` giữ 14 màu lõi được chốt trong contract và font Heading/Body hiện tại. `CLASSIC_SEMANTIC_COLORS` là bản sao đầy đủ, chính xác của 47 màu trong `globals.css`, dùng làm regression baseline.

Phase 1.1 đã sửa mismatch lịch sử: core `surface` và semantic `surface` đều là `#FFF8F7`; `surface-container-lowest` vẫn là `#FFFFFF`. Direct mappings khớp màu trong config, còn các màu dẫn xuất dùng phép biến đổi neo theo Classic baseline. Không phụ thuộc tên/code bản ghi Backend.

Test drift đọc trực tiếp khối `@theme` để phát hiện token hoặc giá trị Classic bị thêm/sửa mà source of truth chưa được cập nhật.

## 4. Semantic colors

47 token canonical:

- Primary: `primary`, `primary-container`, `on-primary`, `on-primary-container`, `primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`, `on-primary-fixed-variant`, `inverse-primary`, `surface-tint`.
- Secondary: `secondary`, `on-secondary`, `secondary-container`, `on-secondary-container`, `secondary-fixed`, `secondary-fixed-dim`, `on-secondary-fixed`, `on-secondary-fixed-variant`.
- Surface/background: `background`, `on-background`, `surface`, `on-surface`, `surface-bright`, `surface-dim`, `surface-variant`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`, `inverse-surface`, `inverse-on-surface`, `on-surface-variant`.
- Outline: `outline`, `outline-variant`.
- Tertiary: `tertiary`, `on-tertiary`, `tertiary-container`, `on-tertiary-container`, `tertiary-fixed`, `tertiary-fixed-dim`, `on-tertiary-fixed`, `on-tertiary-fixed-variant`.
- Error: `error`, `on-error`, `error-container`, `on-error-container`.

### Mapping trực tiếp

`primary`, `primary-container`, `on-primary`, `secondary`, `on-secondary`, `secondary-fixed-dim`, `secondary-fixed`, `background`, `surface`, `on-background`, `on-surface`, `on-surface-variant`, `surface-container-low`, `surface-container-high`, `outline-variant` lần lượt lấy từ core field đã mô tả trong contract. Classic compatibility rule ở trên được áp dụng trước khi trả semantic baseline.

### Công thức dẫn xuất

Mọi phép trộn dùng nội suy OKLCH qua `culori`, trả về HEX uppercase:

- Primary fixed/fixed-dim: trộn `primary -> onPrimary` ở 86%/70%; tint ở 28%. Fixed foreground chọn candidate có WCAG contrast cao nhất. Variant trộn `primary -> textPrimary` 35%.
- Secondary container: trộn `secondary -> accent` 70%; fixed foreground chọn candidate có contrast cao nhất; fixed variant trộn `secondary -> textPrimary` 25%.
- Surface: bright trộn `surface/background`; dim, variant và các container trộn các core surface theo mức cố định. Inverse surface trộn từ `textPrimary` về `surface` 12%.
- Outline: trộn `border -> textSecondary` 42%.
- Tertiary: trộn `primary/secondary`, xoay hue OKLCH 118 độ, rồi tạo các mức container/fixed bằng core surface; foreground chọn candidate có contrast cao nhất.
- Error: bốn token dùng palette bảo vệ cố định và không phụ thuộc Primary.

Resolver là pure, deterministic, không mutate input, không dùng React/DOM/API/randomness. Khi các core input của một family vẫn giống Classic, family đó trả đúng byte màu Classic; khi input thay đổi, chỉ family liên quan được dẫn xuất lại (Tertiary chủ ý phụ thuộc Primary và Secondary).

## 5. Contrast validation

`validateThemeContrast(config)` resolve palette rồi đo WCAG contrast cho chín cặp:

`on-primary/primary`, `on-secondary/secondary`, `on-background/background`, `on-surface/surface`, `on-surface-variant/surface`, `on-primary-container/primary-container`, `on-secondary-container/secondary-container`, `on-tertiary/tertiary`, `on-error/error`.

Các cặp này được xem là text thường và yêu cầu `4.5:1`. Diagnostic chứa foreground/background token, ratio chính xác, required ratio, trạng thái pass/fail và thông báo tiếng Việt. Validator không tự sửa config. Classic hiện đạt cả chín cặp; nếu baseline tương lai không đạt, kết quả được báo thay vì đổi màu âm thầm. Ngưỡng `3:1` cho large text/UI nên được thêm theo use-case cụ thể ở Phase 3, không áp chung cho mọi token.

## 6. Font registry

Registry chỉ cho phép:

- `noto-serif` → `var(--font-noto-serif)`
- `be-vietnam-pro` → `var(--font-be-vietnam-pro)`

Heading có 8 alias: `font-display-hero`, `font-display-hero-mobile`, `font-headline-lg`, `font-headline-lg-mobile`, `font-headline-md`, `font-headline-sm`, `font-subheading`, `font-price-serif`.

Body có 5 alias: `font-body-lg`, `font-body-md`, `font-body-sm`, `font-label-ui`, `font-label-eyebrow`.

Registry không tải URL/font tùy ý và không thay font size, weight, line-height hoặc letter-spacing.

## 7. API public của Theme Engine

- `parseThemeConfig` — strict CMS validation.
- `resolveThemeConfig` — safe runtime config/fallback.
- `resolveSemanticColors` — 14 core colors → 47 semantic colors.
- `resolveSemanticFonts` — Heading/Body selection → 13 aliases.
- `validateThemeContrast` — accessibility diagnostics.
- `resolveTheme` — trả `{ config, colors, fonts, cssVariables, fallbackUsed, diagnostics }`.
- `createThemeCssVariables` — tạo map `--color-*` và `--font-*`, không áp vào DOM.

## 8. Hướng tích hợp Phase 2 Landing

1. Server lấy active theme từ public API và truyền riêng `config` vào `resolveTheme`.
2. Dùng `cssVariables` trên một Landing wrapper/server-rendered style boundary để tránh flash; không thay CMS theme variables.
3. Khi Backend lỗi/config lỗi, render Classic từ `fallbackUsed` và ghi diagnostic ở server observability, không làm crash Landing.
4. Giữ nguyên token utility Tailwind hiện tại; không đổi layout/content/section.
5. Xác định cache/revalidation cho active theme trước khi nối API.

## 9. Hướng tái sử dụng Phase 3 CMS

1. Form dùng `themeConfigV1Schema`/`parseThemeConfig`, không dùng runtime fallback để hợp thức hóa draft thiếu field.
2. Preview dùng `resolveTheme` trên draft đã parse và hiển thị contrast diagnostics.
3. Chỉ cung cấp 14 color field và hai font select từ registry.
4. Không cho nhập CSS expression, font URL hoặc sửa derived token riêng lẻ.

## 10. Fallback, legacy và giới hạn

Legacy config không có `schemaVersion: 1` không được migrate. Runtime fallback Classic và trả diagnostic; CMS strict parse trả issues. Phase 1 chưa xác minh semantics activation của Backend, quyền activate, khả năng nhiều active theme, cache headers, giá trị `null` khi chưa có theme, hay việc `PATCH isActive` có tự deactivate bản ghi cũ hay không. Các điểm này phải xác nhận trước Phase 2/3.

V1 chưa quản lý hardcoded overlay/shadow, generic `font-serif`/`font-mono`, layout, spacing, typography metrics, animation, scheduling hoặc content. `cssVariables` chỉ là dữ liệu sẵn sàng tích hợp; Phase 1 không thay runtime `globals.css`.
