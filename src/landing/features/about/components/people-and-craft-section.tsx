/* eslint-disable @next/next/no-img-element */
import { aboutContent } from "../data/about-content";

export function PeopleAndCraftSection() {
  const content = aboutContent.people;
  return (
    <section className="w-full bg-background py-space-xl lg:py-28">
      <div className="mx-auto max-w-7xl px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col justify-between gap-space-md pb-space-xl md:flex-row md:items-end"><div className="max-w-2xl space-y-space-xs"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">03 / CON NGƯỜI &amp; TAY NGHỀ</span><h2 className="font-headline-lg text-headline-md tracking-tight text-primary lg:text-headline-lg">{content.title}</h2></div><p className="max-w-md font-serif font-subheading text-subheading italic text-on-surface-variant">{content.quote}</p></div>
        <div className="grid grid-cols-1 items-stretch gap-gutter-desktop md:grid-cols-3">{content.cards.map((card) => <article className="group flex flex-col rounded-lg bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md" key={card.index}><div className="relative aspect-[4/5] overflow-hidden rounded bg-surface-container"><img alt={card.image.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={card.image.src} /><span className={`absolute top-space-md left-space-md rounded px-space-sm py-1 font-mono text-label-eyebrow tracking-widest ${card.badgeClassName}`}>{card.index}</span></div><div className="flex flex-1 flex-col justify-between pt-space-md"><div><h3 className="mb-1 font-headline-sm text-headline-sm text-primary">{card.title}</h3><p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{card.description}</p></div><span className="mt-space-md block pt-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">{card.caption}</span></div></article>)}</div>
      </div>
    </section>
  );
}
