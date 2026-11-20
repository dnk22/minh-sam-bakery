import type { PaginationMetaDto } from "@/lib/api/types";

export type UserStatus = "ACTIVE" | "LOCKED";

export type UserRole = { id: string; code: string; name: string };

export type CmsUser = {
  id: string;
  email: string;
  fullName: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserList = { items: CmsUser[]; pagination: PaginationMetaDto };
export type UserListParams = { page: number; limit: number; search?: string; status?: UserStatus; roleId?: string };
export type UserModalMode = "create" | "edit" | "detail";
export type UserModalState = { mode: UserModalMode; id?: string; section?: "role" } | null;
export type UserAction = "lock" | "unlock" | "delete";

export type CreateUserInput = { email: string; password: string; fullName: string; roleId: string };
export type UpdateUserInput = Partial<Pick<CreateUserInput, "email" | "password" | "fullName">>;
export type UserFormValues = { email: string; fullName: string; password: string; roleId: string };
