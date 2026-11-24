"use client";
import { LoaderCircle, Power } from "lucide-react";
import { useState } from "react";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { parseThemeConfig } from "@/theme/contracts/theme-config.schema";
import { validateThemeContrast } from "@/theme/colors/contrast-validator";
import { useThemeActivation } from "../../hooks/use-theme-activation";
import type { CmsTheme } from "../../types";
import styles from "../theme-ui.module.css";

export function ThemeActivateDialog({ theme, onClose, onActivated }: {
  theme: CmsTheme | null;
  onClose: () => void;
  onActivated: () => void;
}) {
  const activation = useThemeActivation();
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [syncPending, setSyncPending] = useState(false);
  const parsed = theme ? parseThemeConfig(theme.config) : null;
  const warnings = parsed?.success ? validateThemeContrast(parsed.data).filter((item) => !item.passed) : [];
  const canActivate = Boolean(theme && parsed?.success && (syncPending || (!theme.isActive && (!warnings.length || accepted))));

  const confirm = async () => {
    if (!theme || !canActivate || activation.isPending) return;
    setError(null);
    try {
      const result = await activation.mutateAsync({ id: theme.id, acceptWarnings: accepted, syncOnly: syncPending });
      if (result.cacheSync === "pending") { setSyncPending(true); return; }
      onActivated();
    } catch (caught) {
      setError(caught instanceof CmsApiError ? caught.message : "Không thể kích hoạt theme lúc này.");
    }
  };

  return (
    <ResponsiveModal open={Boolean(theme)} variant="confirm" title="Kích hoạt theme trên Landing?"
      description="Thao tác này thay đổi màu và font của website cho khách truy cập."
      onOpenChange={(open) => { if (!open && !activation.isPending) { setError(null); onClose(); } }}
      onBeforeClose={() => !activation.isPending}
      footer={<>
        <CmsButton type="button" variant="outline" disabled={activation.isPending} onClick={() => { setError(null); onClose(); }}>Hủy</CmsButton>
        <CmsButton type="button" disabled={!canActivate || activation.isPending} onClick={confirm}>
          {activation.isPending ? <LoaderCircle className={styles.spin} size={16} aria-hidden="true" /> : <Power size={16} aria-hidden="true" />}
          {syncPending ? "Đồng bộ lại cache" : "Xác nhận kích hoạt"}
        </CmsButton>
      </>}
    >
      <div className={styles.activationDetails}>
        <p>Theme: <strong>{theme?.name}</strong></p>
        {syncPending ? <p role="status">Theme đã được kích hoạt, nhưng cache Landing chưa đồng bộ. Bạn có thể thử đồng bộ lại.</p> : <p>Theme đang hoạt động sẽ được thay thế. Có thể kích hoạt lại theme Classic để quay về mặc định.</p>}
        {!parsed?.success ? <p className={styles.alert} role="alert">Config V1 không hợp lệ, không thể kích hoạt.</p> : null}
        {warnings.length && !syncPending ? <div className={styles.activationWarnings} role="status">
          <strong>{warnings.length} cảnh báo tương phản</strong>
          <p>Hãy xem trước và kiểm tra khả năng đọc trước khi kích hoạt.</p>
          <ul>{warnings.slice(0, 4).map((item) => <li key={item.id}>{item.context} ({item.ratio.toFixed(2)}:1)</li>)}</ul>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginTop: "0.75rem" }}><input type="checkbox" checked={accepted} disabled={activation.isPending} onChange={(event) => setAccepted(event.target.checked)} /> Tôi đã kiểm tra và chấp nhận các cảnh báo tương phản.</label>
        </div> : null}
        {error ? <p className={styles.alert} role="alert">{error}</p> : null}
      </div>
    </ResponsiveModal>
  );
}
