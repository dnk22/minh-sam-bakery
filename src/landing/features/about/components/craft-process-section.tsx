import { Flame, Gift, Leaf, Sparkles } from "lucide-react";

import { aboutContent } from "../data/about-content";

const icons = { leaf: Leaf, blend: Sparkles, fire: Flame, gift: Gift } as const;

export function CraftProcessSection() {
  return (
    <section className="relative w-full bg-surface-container-high py-space-xl lg:py-28">
      <div className="mx-auto max-w-7xl px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="mx-auto flex max-w-2xl flex-col space-y-space-xs pb-space-xl text-center"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">04 / NGHỆ THUẬT LÀM BÁNH</span><h2 className="font-headline-lg text-headline-md tracking-tight text-primary lg:text-headline-lg">Sự tinh tế nằm trong từng chi tiết.</h2><p className="font-body-md text-body-md text-on-surface-variant">Bốn giai đoạn tạo tác khắt khe định danh chuẩn mực bánh nghệ nhân Minh Sâm.</p></div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">{aboutContent.process.map((step) => { const Icon = icons[step.icon]; return <article className="group relative flex flex-col justify-between rounded-lg bg-surface-container-lowest p-space-lg shadow-sm transition-transform duration-300 hover:-translate-y-1" key={step.number}><div><div className="mb-space-md flex items-center justify-between"><span className="font-serif font-headline-lg text-headline-lg font-bold text-secondary/30">{step.number}</span><span className="flex size-8 items-center justify-center rounded-full bg-surface-container text-secondary"><Icon className="size-[18px]" /></span></div><h3 className="mb-space-xs font-headline-sm text-headline-sm text-primary">{step.title}</h3><p className="mb-space-md font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{step.description}</p></div><div className="rounded bg-surface-container-low p-space-xs pt-space-sm"><span className="block font-label-eyebrow text-[10px] font-semibold uppercase text-secondary">{step.label}</span></div></article>; })}</div>
      </div>
    </section>
  );
}
