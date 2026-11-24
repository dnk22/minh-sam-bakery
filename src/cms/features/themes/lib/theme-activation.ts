import { parseThemeConfig } from "../../../../theme/contracts/theme-config.schema.ts";
import { validateThemeContrast } from "../../../../theme/colors/contrast-validator.ts";
import { BackendRequestError } from "../../../../lib/api/errors.ts";
import type { CmsTheme, ThemeActivationResult } from "../types.ts";

export class ThemeActivationError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Dependencies = {
  read: () => Promise<CmsTheme>;
  activate: () => Promise<CmsTheme>;
  synchronize: () => void | Promise<void>;
  reportSyncFailure: (error: unknown) => void;
};

export async function executeThemeActivation(id: string, acceptWarnings: boolean, deps: Dependencies, syncOnly = false): Promise<ThemeActivationResult> {
  const current = await deps.read();
  const config = parseThemeConfig(current.config);
  if (current.id !== id || !config.success) throw new ThemeActivationError(422, "Config ThemeConfigV1 không hợp lệ.");
  if (syncOnly && !current.isActive) throw new ThemeActivationError(409, "Theme không còn active. Hãy tải lại danh sách.");
  let active = current;
  let recovered = current.isActive;
  if (!current.isActive) {
    if (!acceptWarnings && validateThemeContrast(config.data).some(item => !item.passed)) {
      throw new ThemeActivationError(422, "Hãy xác nhận cảnh báo tương phản trước khi kích hoạt.");
    }
    try {
      active = await deps.activate();
      if (active.id !== id || !active.isActive) throw new Error("Unconfirmed activation");
    } catch (error) {
      // Explicit client-side rejection is not an ambiguous commit.
      if (error instanceof BackendRequestError) {
        const status = error.code ?? error.status;
        if ((error.kind === "http" || error.kind === "application") && status && status >= 400 && status < 500 && status !== 408 && status !== 409) throw error;
      }
      try { active = await deps.read(); }
      catch { throw new ThemeActivationError(503, "Chưa xác minh được trạng thái kích hoạt. Kiểm tra lại danh sách theme trước khi thử lại."); }
      if (active.id !== id || !active.isActive) throw new ThemeActivationError(503, "Backend chưa xác nhận theme đang active. Kiểm tra lại trạng thái trước khi thử lại.");
      recovered = true;
    }
  }
  try {
    await deps.synchronize();
    return { theme: active, cacheSync: "synced", recovered };
  } catch (error) {
    deps.reportSyncFailure(error);
    return { theme: active, cacheSync: "pending", recovered };
  }
}
