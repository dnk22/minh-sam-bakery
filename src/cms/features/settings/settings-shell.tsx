"use client";

import { Palette } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsSelect } from "@/cms/components/ui/select/select";

const settingsNavigation = [
  { title: "Giao diện & hiển thị", href: "/cms/settings/display", icon: Palette },
];

export function SettingsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <CmsMain fixed>
      <div className="cms-page-heading"><h1>Cài đặt</h1><p>Quản lý giao diện và bố cục hiển thị riêng cho khu vực CMS.</p></div>
      <div className="cms-settings-divider" />
      <div className="cms-settings-shell">
        <CmsSelect
          aria-label="Chọn nhóm cài đặt"
          containerClassName="cms-settings-mobile-select"
          options={settingsNavigation.map((item) => ({ label: item.title, value: item.href }))}
          value={pathname}
          onValueChange={(next) => router.push(next)}
        />
        <div className="cms-settings-body">
          <aside>
            <nav aria-label="Điều hướng cài đặt" className="cms-settings-nav">
              {settingsNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link aria-current={pathname === item.href ? "page" : undefined} className="cms-settings-nav-link" data-active={pathname === item.href || undefined} href={item.href} key={item.href}>
                    <Icon aria-hidden="true" size={17} />{item.title}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <div className="cms-settings-content">{children}</div>
        </div>
      </div>
    </CmsMain>
  );
}
