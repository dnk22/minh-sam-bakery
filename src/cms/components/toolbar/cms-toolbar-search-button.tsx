import { LoaderCircle, Search } from "lucide-react";
import { CmsButton } from "@/cms/components/ui/button";
import styles from "./cms-toolbar.module.css";

export function CmsToolbarSearchButton({ disabled, pending = false, label = "Tìm kiếm" }: { disabled?: boolean; pending?: boolean; label?: string }) {
  return <CmsButton className={styles.submit} type="submit" aria-label={label} title={label} disabled={disabled} aria-busy={pending}>
    {pending ? <LoaderCircle size={17} aria-hidden="true" className={styles.spinner} /> : <Search size={17} aria-hidden="true" />}<span className={styles.submitLabel}>{label}</span>
  </CmsButton>;
}
