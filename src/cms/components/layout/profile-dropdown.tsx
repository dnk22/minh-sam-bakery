"use client";

import { LoaderCircle, LogOut, Settings } from "lucide-react";
import Link from "next/link";

import { CmsButton } from "@/cms/components/ui/button";
import {
  CmsDropdown,
  CmsDropdownContent,
  CmsDropdownItem,
  CmsDropdownLabel,
  CmsDropdownSeparator,
  CmsDropdownTrigger,
} from "@/cms/components/ui/dropdown-menu";
import type { CmsProfileUser } from "@/cms/features/auth/types";
import { useLogout } from "@/cms/features/auth/hooks/use-logout";

export function ProfileDropdown({ user }: { user: CmsProfileUser }) {
  const { error, logout, pending } = useLogout();

  const initials = user.fullName.trim().split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]?.toUpperCase()).join("") || "MS";
  return (
    <CmsDropdown modal={false}>
      <CmsDropdownTrigger asChild>
        <CmsButton aria-label="Mở menu tài khoản" className="cms-avatar-button" size="icon" variant="ghost">
          <span aria-hidden="true" className="cms-avatar-fallback">{initials}</span>
        </CmsButton>
      </CmsDropdownTrigger>
      <CmsDropdownContent align="end" className="cms-profile-menu">
        <CmsDropdownLabel>
          <strong>{user.fullName}</strong>
          <span>{user.email}</span>
          <span className="cms-profile-role">{user.role.name}</span>
        </CmsDropdownLabel>
        <CmsDropdownSeparator />
        <CmsDropdownItem asChild>
          <Link href="/cms/settings/appearance"><Settings aria-hidden="true" size={16} />Cài đặt giao diện</Link>
        </CmsDropdownItem>
        <CmsDropdownSeparator />
        <CmsDropdownItem disabled={pending} onSelect={(event) => { event.preventDefault(); void logout(); }}>
          {pending ? <LoaderCircle aria-hidden="true" className="cms-spin" size={16} /> : <LogOut aria-hidden="true" size={16} />}
          {pending ? "Đang đăng xuất…" : "Đăng xuất"}
        </CmsDropdownItem>
        {error ? <p className="cms-profile-error" role="alert">{error}</p> : null}
      </CmsDropdownContent>
    </CmsDropdown>
  );
}
