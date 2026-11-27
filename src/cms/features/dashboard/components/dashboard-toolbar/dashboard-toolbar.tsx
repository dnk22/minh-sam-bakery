"use client";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { CmsToolbarField } from "@/cms/components/toolbar/cms-toolbar-field";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { DASHBOARD_PRESETS } from "../../constants";
import type { DashboardPreset } from "../../types";
import type { useDashboardFilters } from "../../hooks/use-dashboard-filters";

export function DashboardToolbar({ filters, fetching, onApply }: { filters: ReturnType<typeof useDashboardFilters>; fetching: boolean; onApply: () => void }) {
  const { draft, preset, valid } = filters;
  return <CmsToolbar label="Bộ lọc báo cáo" fetching={fetching} onSearch={onApply} searchDisabled={!valid || fetching}
    search={<CmsToolbarField label={<label htmlFor="report-preset">Khoảng thời gian</label>}><CmsSelect id="report-preset" value={preset} options={DASHBOARD_PRESETS} onValueChange={value => filters.selectPreset(value as DashboardPreset)} disabled={fetching} controlSize="sm" /></CmsToolbarField>}
    filters={<CmsFilterGroup label="Bộ lọc báo cáo" layout="toolbar" activeCount={preset === "custom" ? 1 : 0} onApply={onApply} applyDisabled={!valid || fetching}>
      <CmsToolbarField size="compact" label={<label htmlFor="report-from">Từ ngày</label>}><CmsInput id="report-from" type="date" value={draft.from} onChange={event => filters.setDate("from", event.target.value)} disabled={fetching} controlSize="sm" /></CmsToolbarField>
      <CmsToolbarField size="compact" label={<label htmlFor="report-to">Đến ngày</label>}><CmsInput id="report-to" type="date" value={draft.to} onChange={event => filters.setDate("to", event.target.value)} disabled={fetching} controlSize="sm" /></CmsToolbarField>
      <CmsToolbarField size="compact" label={<label htmlFor="report-top">Top sản phẩm</label>}><CmsInput id="report-top" type="number" min={1} max={50} step={1} value={draft.topLimit || ""} onChange={event => filters.setTopLimit(Number(event.target.value))} disabled={fetching} controlSize="sm" /></CmsToolbarField>
    </CmsFilterGroup>}
    feedback={!valid ? <p role="alert">Chọn khoảng ngày hợp lệ và Top sản phẩm từ 1 đến 50.</p> : null}
  />;
}
