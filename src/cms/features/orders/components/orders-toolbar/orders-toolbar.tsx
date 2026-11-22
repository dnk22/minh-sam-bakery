"use client";

import { Search, X } from "lucide-react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { CmsMultiSelect } from "@/cms/components/ui/multi-select/multi-select";
import { useCmsIsMobile } from "@/cms/hooks/use-mobile";

import { ORDER_STATUS_OPTIONS } from "../../constants";
import type { OrderFilters } from "../../hooks/use-order-filters";
import { useOrderSearch } from "../../hooks/use-order-search";
import { countOrderAdvancedFilters } from "../../lib/order-data";
import type { OrderStatus } from "../../types";
import styles from "./orders-toolbar.module.css";

export function OrdersToolbar({ filters }: { filters: OrderFilters }) {
  const search = useOrderSearch({ value: filters.search, onCommit: filters.setSearch });
  const advancedCount = countOrderAdvancedFilters(filters);
  const toggleStatus = (status: OrderStatus, checked: boolean) => {
    const selected = new Set(filters.statuses);
    if (checked) selected.add(status);
    else selected.delete(status);
    filters.setStatuses(ORDER_STATUS_OPTIONS.map((option) => option.value).filter((value) => selected.has(value)));
  };

  return <section className={styles.toolbar} aria-label="Bộ lọc đơn hàng">
    <div className={styles.controls}>
      <CmsFormField className={styles.searchField} htmlFor="order-search" label="Tìm kiếm">
        <CmsInput id="order-search" containerClassName={styles.search} controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} onBlur={search.onBlur} onChange={(event) => search.onChange(event.target.value)} onFocus={search.onFocus} placeholder="Số điện thoại hoặc email" type="search" value={search.draft} />
      </CmsFormField>
      <CmsFilterGroup activeCount={advancedCount} label="Bộ lọc đơn hàng" onClear={filters.clearAdvancedFilters}>
        <OrderStatusFilter selected={filters.statuses} onToggle={toggleStatus} />
        <CmsFormField htmlFor="order-delivery-date" label="Ngày giao">
          <CmsInput id="order-delivery-date" containerClassName={styles.date} controlSize="sm" onChange={(event) => filters.setDeliveryDate(event.target.value || undefined)} type="date" value={filters.deliveryDate ?? ""} />
        </CmsFormField>
        <CmsFormField htmlFor="order-delivery-time" label="Khung giờ">
          <CmsInput id="order-delivery-time" containerClassName={styles.time} controlSize="sm" maxLength={100} onChange={(event) => filters.setDeliveryTime(event.target.value.trim())} placeholder="VD: 09:00-11:00" value={filters.deliveryTime} />
        </CmsFormField>
        <CmsFormField htmlFor="order-sort" label="Ngày tạo">
          <CmsSelect id="order-sort" containerClassName={styles.sort} controlSize="sm" options={[{ value: "desc", label: "Mới nhất trước" }, { value: "asc", label: "Cũ nhất trước" }]} value={filters.sortCreated} onChange={(event) => filters.setSortCreated(event.target.value as "asc" | "desc")} />
        </CmsFormField>
      </CmsFilterGroup>
      {filters.isFiltered ? <CmsButton className={styles.clearAll} type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa tất cả</CmsButton> : null}
    </div>
  </section>;
}

function OrderStatusFilter({ selected, onToggle }: { selected: OrderStatus[]; onToggle: (status: OrderStatus, checked: boolean) => void }) {
  const isMobile = useCmsIsMobile();
  const choices = <div className={styles.statusOptions}>
    {ORDER_STATUS_OPTIONS.map((option) => <label key={option.value}>
      <input checked={selected.includes(option.value)} onChange={(event) => onToggle(option.value, event.target.checked)} type="checkbox" />
      <span>{option.label}</span>
    </label>)}
  </div>;

  if (isMobile) return <fieldset className={styles.statusChecklist}><legend>Trạng thái</legend>{choices}</fieldset>;
  return <fieldset className={styles.statusField}>
    <legend>Trạng thái</legend>
    <CmsMultiSelect
      aria-label="Lọc theo trạng thái đơn hàng"
      controlSize="sm"
      options={ORDER_STATUS_OPTIONS}
      placeholder="Tất cả trạng thái"
      value={selected}
      onValueChange={(next) => {
        const nextSet = new Set(next);
        const changed = ORDER_STATUS_OPTIONS.find((option) => selected.includes(option.value) !== nextSet.has(option.value));
        if (changed) onToggle(changed.value, nextSet.has(changed.value));
      }}
    />
  </fieldset>;
}
