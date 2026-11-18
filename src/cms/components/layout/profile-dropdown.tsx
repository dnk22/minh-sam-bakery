"use client";

import { LoaderCircle, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

export function ProfileDropdown({ user }: { user: CmsProfileUser }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/cms/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const payload = await response.json().catch(() => null) as { revoked?: boolean; localSessionCleared?: boolean } | null;
      if (payload?.localSessionCleared) {
        window.location.replace(payload.revoked ? "/cms/login?notice=logout" : "/cms/login?notice=logout-local");
        return;
      }
      setError("Không thể đăng xuất lúc này. Vui lòng thử lại.");
    } catch {
      setError("Không thể kết nối tới máy chủ để đăng xuất.");
    } finally {
      setPending(false);
    }
  };

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
        <CmsDropdownItem disabled={pending} onSelect={(event) => { event.preventDefault(); void handleLogout(); }}>
          {pending ? <LoaderCircle aria-hidden="true" className="cms-spin" size={16} /> : <LogOut aria-hidden="true" size={16} />}
          {pending ? "Đang đăng xuất…" : "Đăng xuất"}
        </CmsDropdownItem>
        {error ? <p className="cms-profile-error" role="alert">{error}</p> : null}
      </CmsDropdownContent>
    </CmsDropdown>
  );
}
