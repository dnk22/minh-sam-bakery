"use client";

import { PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { ConfigDrawer } from "@/cms/components/layout/config-drawer";
import { ProfileDropdown } from "@/cms/components/layout/profile-dropdown";
import { CmsButton } from "@/cms/components/ui/button";
import { useCmsPreferences } from "@/cms/context/cms-preferences";
import type { CmsProfileUser } from "@/cms/features/auth/types";

export function CmsHeader({ user }: { user: CmsProfileUser }) {
  const [scrolled, setScrolled] = useState(false);
  const { toggleSidebar } = useCmsPreferences();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="cms-header" data-scrolled={scrolled || undefined}>
      <div className="cms-header-inner">
        <CmsButton aria-label="Bật hoặc tắt sidebar" onClick={toggleSidebar} size="icon" variant="outline">
          <PanelLeft aria-hidden="true" size={18} />
        </CmsButton>
        <span className="cms-header-separator" />
        <div className="cms-header-context">
          <strong>CMS</strong>
          <span>Quản trị Minh Sâm Bakery</span>
        </div>
        <div className="cms-header-actions">
          <ConfigDrawer />
          <ProfileDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
