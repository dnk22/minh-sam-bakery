"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import {
  AlignLeft,
  AlignRight,
  Columns3,
  Laptop,
  LayoutPanelLeft,
  Moon,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import {
  useCmsPreferences,
  type CmsDirection,
  type CmsSidebarLayout,
  type CmsSidebarVariant,
  type CmsTheme,
} from "@/cms/context/cms-preferences";

type OptionsProps = {
  showTheme?: boolean;
  showLayout?: boolean;
  showDirection?: boolean;
};

export function CmsAppearanceControls({ showTheme = true, showLayout = true, showDirection = true }: OptionsProps) {
  const preferences = useCmsPreferences();

  return (
    <div className="cms-preference-stack">
      {showTheme ? (
        <PreferenceSection
          changed={preferences.theme !== "system"}
          onReset={preferences.resetTheme}
          title="Giao diện"
        >
          <PreferenceRadio
            onValueChange={(value) => preferences.setTheme(value as CmsTheme)}
            options={[
              { value: "system", label: "Hệ thống", icon: Laptop },
              { value: "light", label: "Sáng", icon: Sun },
              { value: "dark", label: "Tối", icon: Moon },
            ]}
            value={preferences.theme}
          />
        </PreferenceSection>
      ) : null}

      {showLayout ? (
        <>
          <PreferenceSection
            changed={preferences.sidebarVariant !== "inset"}
            onReset={preferences.resetSidebarVariant}
            title="Kiểu sidebar"
          >
            <PreferenceRadio
              onValueChange={(value) => preferences.setSidebarVariant(value as CmsSidebarVariant)}
              options={[
                { value: "inset", label: "Inset", icon: LayoutPanelLeft },
                { value: "floating", label: "Floating", icon: Columns3 },
                { value: "sidebar", label: "Sidebar", icon: PanelLeft },
              ]}
              value={preferences.sidebarVariant}
            />
          </PreferenceSection>

          <PreferenceSection
            changed={preferences.sidebarLayout !== "default"}
            onReset={preferences.resetSidebarLayout}
            title="Bố cục"
          >
            <PreferenceRadio
              onValueChange={(value) => preferences.setSidebarLayout(value as CmsSidebarLayout)}
              options={[
                { value: "default", label: "Mặc định", icon: PanelLeftOpen },
                { value: "icon", label: "Thu gọn", icon: PanelLeftClose },
                { value: "offcanvas", label: "Ẩn sidebar", icon: PanelLeft },
              ]}
              value={preferences.sidebarLayout}
            />
          </PreferenceSection>
        </>
      ) : null}

      {showDirection ? (
        <PreferenceSection
          changed={preferences.direction !== "ltr"}
          onReset={preferences.resetDirection}
          title="Hướng hiển thị"
        >
          <PreferenceRadio
            onValueChange={(value) => preferences.setDirection(value as CmsDirection)}
            options={[
              { value: "ltr", label: "Trái sang phải", icon: AlignLeft },
              { value: "rtl", label: "Phải sang trái", icon: AlignRight },
            ]}
            value={preferences.direction}
          />
        </PreferenceSection>
      ) : null}
    </div>
  );
}

function PreferenceSection({
  changed,
  children,
  onReset,
  title,
}: {
  changed: boolean;
  children: ReactNode;
  onReset: () => void;
  title: string;
}) {
  return (
    <section className="cms-preference-section">
      <div className="cms-preference-heading">
        <h3>{title}</h3>
        {changed ? (
          <CmsButton aria-label={`Đặt lại ${title}`} onClick={onReset} size="icon" variant="secondary">
            <RotateCcw aria-hidden="true" size={13} />
          </CmsButton>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function PreferenceRadio({
  onValueChange,
  options,
  value,
}: {
  onValueChange: (value: string) => void;
  options: { value: string; label: string; icon: LucideIcon }[];
  value: string;
}) {
  return (
    <RadioGroup.Root className="cms-option-grid" onValueChange={onValueChange} value={value}>
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <RadioGroup.Item className="cms-option-card" key={option.value} value={option.value}>
            <span className="cms-option-preview">
              <Icon aria-hidden="true" size={23} />
              <span className="cms-option-preview-lines" aria-hidden="true"><i /><i /><i /></span>
            </span>
            <span>{option.label}</span>
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}
