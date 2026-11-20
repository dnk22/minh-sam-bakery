import type { PaginationMetaDto } from "@/lib/api/types";

export type Permission = {
  id: string;
  code: string;
  module: string;
  action: string;
  description: string | null;
};

export type Role = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RoleDetail = Role & { permissions: Permission[] };
export type RoleList = { items: Role[]; pagination: PaginationMetaDto };
export type RoleListParams = { page: number; limit: number; search?: string };
export type RolePermissions = { permissions: Permission[] };
export type RoleModalMode = "create" | "edit" | "detail";
export type RoleModalState = { mode: RoleModalMode; id?: string } | null;

export type CreateRoleInput = {
  code: string;
  name: string;
  description?: string;
  permissionIds?: string[];
};

export type UpdateRoleInput = Partial<Pick<CreateRoleInput, "code" | "name" | "description">>;
export type RoleFormValues = { code: string; name: string; description: string };

export type PermissionGroup = {
  module: string;
  permissions: Permission[];
};
