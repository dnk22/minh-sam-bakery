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
  const parsed = theme ? parseThemeConfig(theme.config) : null;
  const warnings = parsed?.success ? validateThemeContrast(parsed.data).filter((item) => !item.passed) : [];
  const canActivate = Boolean(theme && !theme.isActive && parsed?.success);

  const confirm = async () => {
    if (!theme || !canActivate || activation.isPending) return;
    setError(null);
    try {
      await activation.mutateAsync(theme.id);
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
          Xác nhận kích hoạt
        </CmsButton>
      </>}
    >
      <div className={styles.activationDetails}>
        <p>Theme: <strong>{theme?.name}</strong></p>
        <p>Theme đang hoạt động sẽ được thay thế. Có thể kích hoạt lại theme Classic để quay về mặc định.</p>
        {!parsed?.success ? <p className={styles.alert} role="alert">Config V1 không hợp lệ, không thể kích hoạt.</p> : null}
        {warnings.length ? <div className={styles.activationWarnings} role="status">
          <strong>{warnings.length} cảnh báo tương phản</strong>
          <p>Hãy xem trước và kiểm tra khả năng đọc trước khi kích hoạt.</p>
          <ul>{warnings.slice(0, 4).map((item) => <li key={item.id}>{item.context} ({item.ratio.toFixed(2)}:1)</li>)}</ul>
        </div> : null}
        {error ? <p className={styles.alert} role="alert">{error}</p> : null}
      </div>
    </ResponsiveModal>
  );
}
