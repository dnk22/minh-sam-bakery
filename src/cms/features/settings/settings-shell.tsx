"use client";

import { Monitor, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";

const settingsNavigation = [
  { title: "Giao diện", href: "/cms/settings/appearance", icon: Palette },
  { title: "Hiển thị", href: "/cms/settings/display", icon: Monitor },
];

export function SettingsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <CmsMain fixed>
      <div className="cms-page-heading"><h1>Cài đặt</h1><p>Quản lý giao diện và bố cục hiển thị riêng cho khu vực CMS.</p></div>
      <div className="cms-settings-divider" />
      <div className="cms-settings-shell">
        <select aria-label="Chọn nhóm cài đặt" className="cms-settings-mobile-select" onChange={(event) => router.push(event.target.value)} value={pathname}>
          {settingsNavigation.map((item) => <option key={item.href} value={item.href}>{item.title}</option>)}
        </select>
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
