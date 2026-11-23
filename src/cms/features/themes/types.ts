import type { ThemeConfigV1 } from "../../../theme/contracts/theme.types.ts";
import type { PaginationMetaDto } from "../../../lib/api/types.ts";

export type CmsTheme = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  config: unknown;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ThemeList = { items: CmsTheme[]; pagination: PaginationMetaDto };
export type ThemeListParams = { page: number; limit: number; search?: string; isActive?: boolean };
export type ThemeCreateInput = { name: string; code: string; description?: string; config: ThemeConfigV1; isActive: false };
export type ThemePatchInput = Partial<Pick<ThemeCreateInput, "name" | "code" | "description" | "config">>;
export type ThemeFormValues = { name: string; code: string; description: string; config: ThemeConfigV1 };
export type ThemeModalState =
  | { mode: "create" }
  | { mode: "detail" | "edit" | "duplicate"; id: string }
  | null;
