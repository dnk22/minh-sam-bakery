"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";

import type { OrderFilters } from "../../hooks/use-order-filters";
import { useOrderSearch } from "../../hooks/use-order-search";
import { countOrderAdvancedFilters } from "../../lib/order-data";
import { isValidOrderCreatedRange } from "../../lib/order-format";
import styles from "./orders-toolbar.module.css";

function OrderDateRange({ filters }: { filters: OrderFilters }) {
  const [draft, setDraft] = useState({ createdFrom: filters.createdFrom, createdTo: filters.createdTo });
  const valid = isValidOrderCreatedRange(draft.createdFrom, draft.createdTo);
  const changed = draft.createdFrom !== filters.createdFrom || draft.createdTo !== filters.createdTo;

  return <div className={styles.dateRange} role="group" aria-label="Khoảng ngày tạo đơn">
    <CmsFormField htmlFor="order-created-from" label="Tạo từ ngày" required>
      <CmsInput
        id="order-created-from"
        type="date"
        max={draft.createdTo}
        value={draft.createdFrom}
        onChange={(event) => setDraft((current) => ({ ...current, createdFrom: event.target.value }))}
      />
    </CmsFormField>
    <CmsFormField htmlFor="order-created-to" label="Đến ngày" required>
      <CmsInput
        id="order-created-to"
        type="date"
        min={draft.createdFrom}
        value={draft.createdTo}
        onChange={(event) => setDraft((current) => ({ ...current, createdTo: event.target.value }))}
      />
    </CmsFormField>
    <CmsButton type="button" variant="outline" disabled={!valid || !changed} onClick={() => filters.setCreatedRange(draft)}>
      Áp dụng
    </CmsButton>
    {!valid ? <p className={styles.dateError} role="alert">Chọn đủ hai ngày, đúng thứ tự và không quá 30 ngày.</p> : null}
  </div>;
}

export function OrdersToolbar({ filters }: { filters: OrderFilters }) {
  const search = useOrderSearch({ value: filters.search, onCommit: filters.setSearch });
  const advancedCount = countOrderAdvancedFilters(filters);

  return <section className={styles.toolbar} aria-label="Bộ lọc đơn hàng">
    <OrderDateRange key={`${filters.createdFrom}:${filters.createdTo}`} filters={filters} />
    <div className={styles.controls}>
      <CmsFormField className={styles.searchField} htmlFor="order-search" label="Tìm kiếm">
        <CmsInput id="order-search" containerClassName={styles.search} controlSize="sm"
          leadingIcon={<Search aria-hidden="true" size={17} />}
          onBlur={search.onBlur} onChange={(event) => search.onChange(event.target.value)}
          onFocus={search.onFocus} placeholder="Số điện thoại hoặc email" type="search" value={search.draft} />
      </CmsFormField>
      <CmsFilterGroup activeCount={advancedCount} label="Bộ lọc đơn hàng" onClear={filters.clearAdvancedFilters}>
        <CmsFormField htmlFor="order-delivery-date" label="Ngày giao">
          <CmsInput id="order-delivery-date" containerClassName={styles.date} controlSize="sm"
            onChange={(event) => filters.setDeliveryDate(event.target.value || undefined)}
            type="date" value={filters.deliveryDate ?? ""} />
        </CmsFormField>
        <CmsFormField htmlFor="order-delivery-time" label="Khung giờ">
          <CmsInput id="order-delivery-time" containerClassName={styles.time} controlSize="sm"
            onChange={(event) => filters.setDeliveryTime(event.target.value.trim())}
            placeholder="VD: 09:00-11:00" value={filters.deliveryTime} />
        </CmsFormField>
      </CmsFilterGroup>
      {filters.isFiltered ? <CmsButton className={styles.clearAll} type="button" size="sm"
        variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa bộ lọc</CmsButton> : null}
    </div>
  </section>;
}
