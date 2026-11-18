import type { ReactNode } from "react";

export function ContentSection({ children, description, title }: { children: ReactNode; description: string; title: string }) {
  return (
    <section className="cms-content-section">
      <header><h2>{title}</h2><p>{description}</p></header>
      <div className="cms-content-divider" />
      {children}
    </section>
  );
}
