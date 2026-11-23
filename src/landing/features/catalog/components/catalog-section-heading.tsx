export function CatalogSectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-space-lg flex flex-col justify-between gap-space-xs md:flex-row md:items-end">
      <div>
        {eyebrow ? <div className="mb-1 flex items-center gap-2 text-secondary"><span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-[0.2em]">{eyebrow}</span></div> : null}
        <h1 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">{title}</h1>
      </div>
      {description ? <p className="max-w-md font-body-md text-body-md text-on-surface-variant">{description}</p> : null}
    </div>
  );
}
