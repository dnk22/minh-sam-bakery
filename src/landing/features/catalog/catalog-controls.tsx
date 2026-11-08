"use client";

import { ArrowRight, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

const tabs = [
  { label: "Tất cả", note: "12" },
  { label: "Tết Nguyên Đán", note: "Ưu tiên 1" },
  { label: "Trung Thu Đoàn Viên", note: "Ưu tiên 2" },
  { label: "Mỗi ngày & Trà chiều", note: "Thường nhật" },
];

export function CatalogSearchForm({ compact = false }: { compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  if (compact) {
    return (
      <form className="relative flex w-full items-center" onSubmit={handleSubmit}>
        <Search aria-hidden="true" className="pointer-events-none absolute left-space-md size-5 text-secondary" />
        <input
          ref={inputRef}
          aria-label="Tìm sản phẩm"
          className="w-full rounded bg-surface-container-lowest py-space-sm pr-28 pl-12 font-body-md text-body-md text-on-surface shadow-inner placeholder:text-outline focus:bg-surface-bright focus:outline-none"
          placeholder="Tìm bánh, hộp quà, hương vị bạn yêu thích..."
          type="search"
        />
        <button className="absolute right-1 rounded bg-primary px-space-md py-1.5 font-label-ui text-label-ui text-secondary-fixed transition-colors hover:bg-primary-container" type="submit">
          Tìm kiếm
        </button>
      </form>
    );
  }

  return (
    <form className="relative flex min-w-0 items-center overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm" onSubmit={handleSubmit}>
      <Search aria-hidden="true" className="ml-space-md size-[22px] shrink-0 text-outline" />
      <input
        ref={inputRef}
        className="min-w-0 w-full bg-transparent px-space-sm py-3.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
        placeholder="Tìm tên bánh, hương vị, nguyên liệu (ví dụ: Cốm non, Thập cẩm, Sơn mài...)"
        type="search"
      />
      <button aria-label="Xóa tìm kiếm" className="mr-1 p-2 text-outline transition-colors hover:text-on-surface" onClick={() => { if (inputRef.current) inputRef.current.value = ""; }} type="button">
        <X aria-hidden="true" className="size-[18px]" />
      </button>
      <button className="flex shrink-0 items-center gap-space-xs bg-primary px-space-lg py-3.5 font-label-ui text-label-ui text-on-primary transition-colors hover:bg-primary-container" type="submit">
        <span>Tìm kiếm</span><ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </form>
  );
}

export function OccasionTabs() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div aria-label="Dịp thưởng bánh" className="mt-space-lg flex flex-wrap items-center gap-space-sm" role="tablist">
      {tabs.map((tab, index) => {
        const isActive = activeTab === index;
        return (
          <button
            aria-selected={isActive}
            className={`flex items-center gap-space-xs rounded px-space-lg py-2.5 font-label-ui text-label-ui uppercase tracking-wider transition-all ${isActive ? "bg-primary text-secondary-fixed" : "bg-surface-container text-on-surface shadow-sm hover:bg-surface-container-high"}`}
            key={tab.label}
            onClick={() => setActiveTab(index)}
            role="tab"
            type="button"
          >
            <span>{tab.label}</span>
            <span className={`${index === 0 ? "rounded-full bg-primary-container px-1.5 py-0.5 text-secondary-fixed" : index === 3 ? "text-outline" : "text-secondary"} text-[11px] font-semibold`}>{tab.note}</span>
          </button>
        );
      })}
    </div>
  );
}

const typeFilters = [
  ["Tất cả loại bánh", "12"], ["Bánh truyền thống", "8"], ["Dòng sản phẩm mới", "6"],
  ["Cookie thủ công", "5"], ["Bánh hạt dinh dưỡng", "4"], ["Sinh nhật & Sự kiện", "3"],
];
const priceFilters = ["Tất cả mức giá", "Dưới 200.000đ", "200.000đ – 500.000đ", "Trên 500.000đ"];
const orderFilters = ["Tất cả hình thức", "Có giá niêm yết (Mua ngay)", "Liên hệ tư vấn (Bespoke)"];

export function CatalogFilterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const reset = () => formRef.current?.reset();

  return (
    <form ref={formRef} className="w-full min-w-0">
      <div className="flex items-center justify-between pb-space-md">
        <div className="flex items-center gap-space-xs"><SlidersHorizontal className="size-5 text-secondary" /><h2 className="font-headline-sm text-headline-sm text-primary">Bộ Lọc</h2></div>
        <button className="font-body-sm text-body-sm text-secondary underline hover:text-on-secondary-container" onClick={reset} type="button">Đặt lại</button>
      </div>
      <fieldset className="flex min-w-0 flex-col gap-space-sm py-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">Loại Bánh</legend>
        {typeFilters.map(([label, count], index) => (
          <label className="group flex min-w-0 cursor-pointer items-center justify-between gap-space-xs" key={label}>
            <span className="flex min-w-0 items-center gap-space-xs"><input className="size-4 shrink-0 accent-primary" defaultChecked={index < 2} type="checkbox" /><span className={`min-w-0 break-words font-body-md text-body-md ${index === 1 ? "font-medium text-primary" : "text-on-surface group-hover:text-primary"}`}>{label}</span></span>
            <span className="shrink-0 font-body-sm text-body-sm text-outline">{count}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="flex min-w-0 flex-col gap-space-sm py-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">Khoảng Giá</legend>
        {priceFilters.map((label, index) => <label className="flex min-w-0 cursor-pointer items-center gap-space-xs" key={label}><input className="size-4 shrink-0 accent-primary" defaultChecked={index === 0} name="price_range" type="radio" /><span className="min-w-0 break-words font-body-md text-body-md text-on-surface">{label}</span></label>)}
      </fieldset>
      <fieldset className="flex min-w-0 flex-col gap-space-sm py-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">Hình Thức Mua</legend>
        {orderFilters.map((label, index) => <label className="flex min-w-0 cursor-pointer items-center gap-space-xs" key={label}><input className="size-4 shrink-0 accent-primary" defaultChecked={index === 0} name="order_type" type="radio" /><span className="min-w-0 break-words font-body-md text-body-md text-on-surface">{label}</span></label>)}
      </fieldset>
      <button className="mt-space-md w-full rounded bg-surface-container px-space-md py-2.5 text-center font-label-ui text-label-ui text-primary transition-colors hover:bg-surface-container-high" onClick={reset} type="button">Thiết lập lại bộ lọc</button>
    </form>
  );
}

export function CatalogToolbar() {
  const [chips, setChips] = useState(["Tết", "Bánh truyền thống"]);
  return (
    <div className="mb-space-lg flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm md:flex-row md:items-center">
      <div className="flex flex-wrap items-center gap-space-sm">
        <span className="font-body-md text-body-md font-semibold text-primary">Hiển thị 12 sản phẩm</span>
        <div className="hidden h-4 w-px bg-outline-variant sm:block" />
        <div className="flex flex-wrap items-center gap-space-xs">
          {chips.map((chip) => <span className="inline-flex items-center gap-1 rounded bg-surface-container-high px-2.5 py-1 text-body-sm font-medium text-primary" key={chip}>{chip}<button aria-label={`Xóa bộ lọc ${chip}`} onClick={() => setChips((current) => current.filter((item) => item !== chip))} type="button"><X className="size-3.5" /></button></span>)}
          {chips.length > 0 && <button className="ml-1 font-label-ui text-body-sm text-secondary hover:underline" onClick={() => setChips([])} type="button">Xóa tất cả</button>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-space-xs">
        <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="catalog-sort">Sắp xếp:</label>
        <div className="relative"><select className="cursor-pointer appearance-none rounded bg-surface-container-low py-1.5 pr-8 pl-3 font-body-sm text-body-sm text-on-surface focus:outline-none" id="catalog-sort"><option>Mặc định</option><option>Mới nhất</option><option>Giá tăng dần</option><option>Giá giảm dần</option><option>Phổ biến nhất</option></select><ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-[18px] -translate-y-1/2 text-outline" /></div>
      </div>
    </div>
  );
}
