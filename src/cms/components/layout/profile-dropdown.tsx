"use client";

import { LockKeyhole, Settings, UserRound } from "lucide-react";
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

export function ProfileDropdown() {
  return (
    <CmsDropdown modal={false}>
      <CmsDropdownTrigger asChild>
        <CmsButton aria-label="Mở menu tài khoản" className="cms-avatar-button" size="icon" variant="ghost">
          <UserRound aria-hidden="true" size={18} />
        </CmsButton>
      </CmsDropdownTrigger>
      <CmsDropdownContent align="end" className="cms-profile-menu">
        <CmsDropdownLabel>
          <strong>Chưa kết nối tài khoản</strong>
          <span>Dữ liệu người dùng sẽ có ở Phase 2</span>
        </CmsDropdownLabel>
        <CmsDropdownSeparator />
        <CmsDropdownItem asChild>
          <Link href="/cms/settings/appearance"><Settings aria-hidden="true" size={16} />Cài đặt giao diện</Link>
        </CmsDropdownItem>
        <CmsDropdownSeparator />
        <CmsDropdownItem aria-disabled="true" className="cms-dropdown-item--disabled" disabled>
          <LockKeyhole aria-hidden="true" size={16} />Đăng xuất chưa khả dụng
        </CmsDropdownItem>
      </CmsDropdownContent>
    </CmsDropdown>
  );
}
