"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useBannerMutations } from "../../hooks/use-banner-mutations";
import type { Banner } from "../../types";
import styles from "./banner-delete-dialog.module.css";
export function BannerDeleteDialog({ banner, onClose, onDeleted }: { banner: Banner | null; onClose: () => void; onDeleted: () => void }) { const { remove } = useBannerMutations(); const [error, setError] = useState<string | null>(null); const confirm = async () => { if (!banner || remove.isPending) return; setError(null); try { await remove.mutateAsync(banner.id); onDeleted(); } catch (caught) { setError(caught instanceof CmsApiError ? caught.message : "Không thể xóa banner lúc này."); } }; return <ResponsiveModal open={Boolean(banner)} title="Xóa banner" variant="confirm" onBeforeClose={() => !remove.isPending} onOpenChange={(open) => { if (!open && !remove.isPending) { setError(null); onClose(); } }} footer={<><CmsButton type="button" variant="outline" disabled={remove.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" variant="destructive" disabled={remove.isPending} onClick={confirm}>{remove.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xóa</CmsButton></>}><div className={styles.body}><p>Bạn có chắc muốn xóa banner <strong>“{banner?.title}”</strong>?</p><p className={styles.warning}>Banner sẽ không còn khả dụng cho vị trí hiển thị này.</p>{error ? <p className={styles.alert} role="alert">{error}</p> : null}</div></ResponsiveModal>; }
