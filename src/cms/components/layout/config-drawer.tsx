"use client";

import { Palette, RotateCcw } from "lucide-react";

import { CmsButton } from "@/cms/components/ui/button";
import {
  CmsSheet,
  CmsSheetContent,
  CmsSheetDescription,
  CmsSheetTitle,
  CmsSheetTrigger,
} from "@/cms/components/ui/sheet";
import { useCmsPreferences } from "@/cms/context/cms-preferences";
import { CmsAppearanceControls } from "@/cms/features/settings/appearance-controls";

export function ConfigDrawer() {
  const { resetAll } = useCmsPreferences();
  return (
    <CmsSheet>
      <CmsSheetTrigger asChild>
        <CmsButton aria-label="Mở cài đặt giao diện" className="cms-round-button" size="icon" variant="ghost">
          <Palette aria-hidden="true" size={18} />
        </CmsButton>
      </CmsSheetTrigger>
      <CmsSheetContent className="cms-config-drawer">
        <div className="cms-sheet-header">
          <CmsSheetTitle>Cài đặt giao diện</CmsSheetTitle>
          <CmsSheetDescription>Điều chỉnh giao diện và bố cục CMS theo nhu cầu của bạn.</CmsSheetDescription>
        </div>
        <div className="cms-config-scroll"><CmsAppearanceControls /></div>
        <div className="cms-sheet-footer">
          <CmsButton onClick={resetAll} variant="destructive">
            <RotateCcw aria-hidden="true" size={16} />
            Đặt lại tất cả
          </CmsButton>
        </div>
      </CmsSheetContent>
    </CmsSheet>
  );
}
