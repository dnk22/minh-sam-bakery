"use client";

import { Search } from "lucide-react";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { CmsToolbarField } from "@/cms/components/toolbar/cms-toolbar-field";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";
import type { OrderFilters } from "../../hooks/use-order-filters";
import { getDefaultOrderCreatedRange, isValidOrderCreatedRange } from "../../lib/order-format";

export function OrdersToolbar({ filters }: { filters: OrderFilters }) {
  const draft = useToolbarDraft({ search: filters.search, createdFrom: filters.createdFrom, createdTo: filters.createdTo, deliveryDate: filters.deliveryDate, deliveryTime: filters.deliveryTime });
  const values = draft.values;
  const defaults = getDefaultOrderCreatedRange();
  const valid = isValidOrderCreatedRange(values.createdFrom, values.createdTo);
  const clearAll = () => {
    draft.reset({ search: "", ...getDefaultOrderCreatedRange(), deliveryDate: undefined, deliveryTime: "" });
    filters.clearFilters();
  };
  const clearAdvanced = () => {
    const next = { search: filters.search, ...getDefaultOrderCreatedRange(), deliveryDate: undefined, deliveryTime: "" };
    draft.reset(next);
    filters.applyFilters(next);
  };
  const count = Number(values.createdFrom !== defaults.createdFrom || values.createdTo !== defaults.createdTo) + Number(Boolean(values.deliveryDate)) + Number(Boolean(values.deliveryTime));
  return <CmsToolbar label="Bộ lọc đơn hàng" onSearch={() => { if (valid) filters.applyFilters(values); }} searchDisabled={!valid}
    onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    search={<CmsInput aria-label="Tìm kiếm đơn hàng" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} placeholder="Số điện thoại hoặc email" type="search" value={values.search} onChange={event => draft.set("search", event.target.value)} />}
    filters={<CmsFilterGroup layout="toolbar" activeCount={count} label="Bộ lọc đơn hàng" onClear={clearAdvanced} onApply={() => { if (valid) filters.applyFilters(values); }} applyDisabled={!valid}>
      <CmsToolbarField size="compact" label={<label htmlFor="order-created-from">Từ ngày</label>}><CmsInput id="order-created-from" type="date" controlSize="sm" max={values.createdTo} value={values.createdFrom} onChange={event => draft.set("createdFrom", event.target.value)} /></CmsToolbarField>
      <CmsToolbarField size="compact" label={<label htmlFor="order-created-to">Đến ngày</label>}><CmsInput id="order-created-to" type="date" controlSize="sm" min={values.createdFrom} value={values.createdTo} onChange={event => draft.set("createdTo", event.target.value)} /></CmsToolbarField>
      <CmsToolbarField size="compact" label={<label htmlFor="order-delivery-date">Ngày giao</label>}><CmsInput id="order-delivery-date" aria-label="Ngày giao" title="Ngày giao" type="date" controlSize="sm" value={values.deliveryDate ?? ""} onChange={event => draft.set("deliveryDate", event.target.value || undefined)} /></CmsToolbarField>
      <CmsToolbarField size="compact" label={<label htmlFor="order-delivery-time">Khung giờ giao</label>}><CmsInput id="order-delivery-time" aria-label="Khung giờ giao" placeholder="VD: 09:00-11:00" controlSize="sm" value={values.deliveryTime} onChange={event => draft.set("deliveryTime", event.target.value)} /></CmsToolbarField>
    </CmsFilterGroup>}
    feedback={!valid ? <p role="alert" style={{ color: "var(--cms-destructive)", margin: 0 }}>Chọn đủ hai ngày, đúng thứ tự và không quá 30 ngày.</p> : null}
  />;
}
