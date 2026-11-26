import { Skeleton } from "@/landing/components/ui/skeleton";

export function HeaderSkeleton() {
  return <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 bg-primary"><div className="mx-auto flex h-[var(--landing-header-height)] max-w-[1360px] items-center justify-between gap-space-md px-6 md:px-12 lg:px-gutter-desktop"><div className="flex items-center gap-space-sm"><Skeleton className="size-8 rounded-full bg-secondary-fixed/20 md:size-10 lg:size-12" /><Skeleton className="h-4 w-24 bg-secondary-fixed/20" /></div><div className="flex items-center gap-space-md"><div className="hidden gap-space-lg lg:flex">{Array.from({length:4}, (_,i) => <Skeleton key={i} className="h-4 w-20 bg-secondary-fixed/20" />)}</div><Skeleton className="size-11 bg-secondary-fixed/20" /><Skeleton className="size-11 bg-secondary-fixed/20" /></div></div></div>;
}

export function HeroSkeleton() {
  return <section aria-hidden="true" className="relative -mt-[var(--landing-header-height)] flex min-h-[100svh] flex-col justify-between bg-primary px-5 pt-[calc(var(--landing-header-height)+1rem)] pb-6 sm:px-6 md:px-12 lg:min-h-screen lg:px-20 lg:pt-24 lg:pb-10"><Skeleton className="h-4 w-40 bg-secondary-fixed/15" /><div className="mx-auto my-auto w-full max-w-7xl space-y-5"><Skeleton className="h-5 w-2/3 max-w-md bg-secondary-fixed/15" /><Skeleton className="h-12 w-full max-w-3xl bg-secondary-fixed/20 lg:h-20" /><Skeleton className="h-12 w-4/5 max-w-2xl bg-secondary-fixed/20 lg:h-20" /><Skeleton className="h-20 w-full max-w-xl bg-secondary-fixed/15" /><Skeleton className="h-12 w-full max-w-xs bg-secondary-fixed/20" /></div><Skeleton className="h-4 w-32 bg-secondary-fixed/15" /></section>;
}

export function HomeCategoriesSkeleton() {
  return <section aria-hidden="true" className="bg-surface px-6 py-16 md:px-12 lg:px-20"><div className="mx-auto max-w-7xl"><Skeleton className="mb-3 h-4 w-40" /><Skeleton className="mb-8 h-12 w-3/4 max-w-xl" /><div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({length:6},(_,i)=><Skeleton key={i} className="h-[280px] md:h-[260px] lg:h-[300px]" />)}</div></div></section>;
}

export function GiftingSkeleton() {
  return <section aria-hidden="true" className="bg-primary-container px-6 py-16 md:px-12 lg:px-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2"><Skeleton className="h-[380px] bg-secondary-fixed/15 lg:h-[480px]" /><div className="space-y-5"><Skeleton className="h-14 w-4/5 bg-secondary-fixed/20" /><Skeleton className="h-24 bg-secondary-fixed/15" /><Skeleton className="h-12 w-1/2 bg-secondary-fixed/20" /></div></div></section>;
}

export function CatalogSkeleton({ search = false }: { search?: boolean }) {
  return <main aria-busy="true" aria-label="Đang tải sản phẩm" className="min-h-screen bg-surface pt-[var(--landing-header-height)]"><section className="mx-auto w-full max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop"><Skeleton className="mb-space-md h-4 w-40" /><Skeleton className="mb-3 h-10 w-3/4 max-w-lg" /><Skeleton className="mb-space-lg h-6 w-4/5 max-w-xl" /><Skeleton className="mb-space-lg h-14 max-w-3xl" /><div className="flex gap-gutter-desktop">{search && <Skeleton className="hidden h-96 w-72 shrink-0 lg:block" />}<div className="min-w-0 flex-1"><Skeleton className="mb-space-lg h-16" /><div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">{Array.from({length:6},(_,i)=><div key={i} className="space-y-3 rounded-xl bg-surface-container-lowest p-3"><Skeleton className="aspect-square w-full" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-6 w-1/3" /><Skeleton className="h-11" /></div>)}</div></div></div></section></main>;
}

export function ProductDetailSkeleton() {
  return <main aria-busy="true" aria-label="Đang tải sản phẩm" className="min-h-screen bg-surface pt-[var(--landing-header-height)]"><section className="mx-auto max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop"><Skeleton className="mb-6 h-5 w-48" /><div className="grid gap-8 lg:grid-cols-2"><Skeleton className="aspect-square w-full" /><div className="space-y-5"><Skeleton className="h-12 w-4/5" /><Skeleton className="h-8 w-1/3" /><Skeleton className="h-24" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div></div></section></main>;
}

export function JournalSkeleton({ detail = false }: { detail?: boolean }) {
  return <main aria-busy="true" aria-label="Đang tải bài viết" className="min-h-screen bg-surface pt-[var(--landing-header-height)]"><section className="mx-auto max-w-[1360px] space-y-6 px-gutter py-space-xl lg:px-gutter-desktop"><Skeleton className="h-5 w-40" /><Skeleton className="h-14 w-4/5 max-w-2xl" /><Skeleton className="h-6 w-3/4" /><Skeleton className="aspect-[16/9] max-h-[480px] w-full" />{detail ? <div className="mx-auto max-w-3xl space-y-4">{Array.from({length:8},(_,i)=><Skeleton key={i} className="h-5 w-full" />)}</div>:<div className="grid gap-6 md:grid-cols-3">{Array.from({length:3},(_,i)=><Skeleton key={i} className="h-64" />)}</div>}</section></main>;
}

export function FormSkeleton({ cart = false }: { cart?: boolean }) {
  return <main aria-busy="true" aria-label="Đang tải đơn hàng" className="min-h-screen bg-surface pt-[var(--landing-header-height)]"><section className="mx-auto max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop"><Skeleton className="mb-8 h-12 w-48" /><div className="grid gap-6 lg:grid-cols-[2fr_1fr]"><div className="space-y-4">{Array.from({length:4},(_,i)=><Skeleton key={i} className={cart?"h-28":"h-14"} />)}</div><Skeleton className="h-64" /></div></section></main>;
}

export function HomeSkeleton() {
  return <main aria-busy="true" aria-label="Đang tải trang chủ" className="bg-surface pt-[var(--landing-header-height)]"><HeroSkeleton /><HomeCategoriesSkeleton /></main>;
}
