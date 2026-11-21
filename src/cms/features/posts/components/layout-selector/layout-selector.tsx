"use client";
import { BookOpenText, Camera, Gift } from "lucide-react";
import { articleLayoutRegistry } from "@/article/registry/article-layout-registry";
import type { ArticleLayoutKey } from "@/article/contracts/article-layout";
import styles from "./layout-selector.module.css";
const icons = { editorial: BookOpenText, "photo-story": Camera, "product-story": Gift };
export function LayoutSelector({ value, onChange }: { value: ArticleLayoutKey; onChange: (key: ArticleLayoutKey) => void }) {
  return <fieldset className={styles.root}><legend>Article Layout</legend><p>Chọn bố cục phù hợp với câu chuyện. Layout và phiên bản được lưu trong trường HTML content.</p><div className={styles.grid}>{articleLayoutRegistry.map((layout) => { const Icon = icons[layout.key]; const active = value === layout.key; return <button aria-pressed={active} className={styles.card} data-active={active || undefined} key={layout.key} onClick={() => onChange(layout.key)} type="button"><span className={styles.preview} data-layout={layout.key}><Icon aria-hidden="true" /><i /><i /><i /></span><strong>{layout.name}</strong><small>{layout.category}</small><span>{layout.description}</span></button>; })}</div></fieldset>;
}
