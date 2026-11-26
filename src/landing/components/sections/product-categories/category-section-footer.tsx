import Link from "next/link";

import { Reveal } from "@/landing/components/motion/reveal";
import { routes } from "@/landing/lib/routes";

export function CategorySectionFooter() {
  return (
    <Reveal className="mx-auto flex w-full max-w-7xl flex-nowrap items-center justify-between gap-2 pt-4 text-on-surface-variant md:gap-3 md:pt-8" delay={0.12} y={14}>
      <div className="flex min-w-0 items-center gap-1.5 md:gap-3">
        <span aria-hidden="true" className="hidden h-px w-3 shrink-0 bg-outline-variant min-[360px]:block md:w-8" />
        <span className="whitespace-nowrap font-label-eyebrow text-[9px] leading-4 font-semibold tracking-normal uppercase sm:text-[10px] md:text-label-eyebrow md:tracking-[0.14em] lg:tracking-[0.18em]">Danh Mục Sản Phẩm</span>
      </div>
      <Link className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded font-label-ui text-[11px] leading-4 font-medium text-primary transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-[12px] md:text-label-ui md:tracking-wider md:uppercase" href={routes.search}>Xem toàn bộ menu bánh →</Link>
    </Reveal>
  );
}
