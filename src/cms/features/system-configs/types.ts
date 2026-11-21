import type { PaginationMetaDto } from "@/lib/api/types";

export type SystemConfig = {
  id: string;
  key: string;
  value: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SystemConfigList = { items: SystemConfig[]; pagination: PaginationMetaDto };
export type SystemConfigListParams = { page: number; limit: number; search?: string };
export type CreateSystemConfigInput = { key: string; value: string; description?: string };
export type UpdateSystemConfigInput = { value?: string; description?: string };
export type SystemConfigFormValues = { key: string; value: string; description: string };
export type SystemConfigModalState = { mode: "create" } | { mode: "detail" | "edit"; id: string } | null;
