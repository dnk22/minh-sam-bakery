import Link from "next/link";

type ProductBreadcrumbProps = {
  categoryHref: string;
  categoryLabel: string;
  productName: string;
};

export function ProductBreadcrumb({ categoryHref, categoryLabel, productName }: ProductBreadcrumbProps) {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-margin py-space-sm md:px-margin-tablet lg:px-margin-desktop">
      <nav aria-label="Đường dẫn trang" className="flex items-center gap-2 overflow-hidden font-label-ui text-body-sm text-on-surface-variant">
        <Link className="shrink-0 transition-colors hover:text-primary" href="/">Trang chủ</Link>
        <span className="select-none text-outline-variant">/</span>
        <Link className="shrink-0 transition-colors hover:text-primary" href="/san-pham">Sản phẩm</Link>
        <span className="select-none text-outline-variant">/</span>
        <Link className="hidden shrink-0 transition-colors hover:text-primary sm:inline" href={categoryHref}>{categoryLabel}</Link>
        <span className="hidden select-none text-outline-variant sm:inline">/</span>
        <span className="truncate font-medium text-primary">{productName}</span>
      </nav>
    </div>
  );
}
