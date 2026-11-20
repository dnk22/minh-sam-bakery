"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getUser, getUsers } from "../api/users.client";
import { userQueryKeys } from "../lib/user-query-keys";
import type { UserListParams } from "../types";

export function useUsers(params: UserListParams) {
  return useQuery({ queryKey: userQueryKeys.list(params), queryFn: ({ signal }) => getUsers(params, signal), placeholderData: keepPreviousData, staleTime: 20_000 });
}

export function useUserDetail(id?: string) {
  return useQuery({ queryKey: userQueryKeys.detail(id ?? ""), queryFn: ({ signal }) => getUser(id ?? "", signal), enabled: Boolean(id), staleTime: 10_000, retry: false });
}
