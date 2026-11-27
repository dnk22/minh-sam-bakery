"use client";

import { ArrowRight, LoaderCircle, Search, X } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

export function SearchForm({
  compact = false,
  pending = false,
  value = "",
  ariaLabel = "Tìm sản phẩm",
  placeholder,
  onSearch,
}: {
  compact?: boolean;
  pending?: boolean;
  value?: string;
  ariaLabel?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = useState({ sourceValue: value, draft: value });
  const draft = inputState.sourceValue === value ? inputState.draft : value;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pending) onSearch?.(draft.trim());
  };
  const input = (
    <input
      aria-label={ariaLabel}
      className={
        compact
          ? "w-full rounded bg-surface-container-lowest py-space-sm pr-12 pl-12 md:pr-28 font-body-md text-body-md text-on-surface shadow-inner placeholder:text-outline focus:bg-surface-bright focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          : "min-w-0 w-full bg-transparent px-space-sm py-3.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      }
      disabled={pending}
      maxLength={100}
      name="q"
      onChange={(event) => setInputState({ sourceValue: value, draft: event.target.value })}
      placeholder={
        placeholder ??
        (compact
          ? "Tìm bánh, hộp quà, hương vị bạn yêu thích..."
          : "Tìm tên bánh, hương vị, nguyên liệu (ví dụ: Cốm non, Thập cẩm, Sơn mài...)")
      }
      ref={inputRef}
      type="search"
      value={draft}
    />
  );
  if (compact)
    return (
      <form
        className="relative flex w-full min-w-0 items-center"
        aria-busy={pending} onSubmit={submit}
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-space-md size-5 text-secondary"
        />
        {input}
        <button
          aria-label="Tìm kiếm"
          disabled={pending}
          className="absolute right-1 inline-flex min-h-10 min-w-10 items-center justify-center rounded bg-primary px-2 py-1.5 font-label-ui text-label-ui text-secondary-fixed transition-colors hover:bg-primary-container md:px-space-md"
          type="submit"
        >
          {pending ? <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" /> : <Search aria-hidden="true" className="size-5 md:hidden" />}
          <span className="hidden md:inline">Tìm kiếm</span>
        </button>
      </form>
    );
  return (
    <form
      className="relative flex min-w-0 items-center overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm p-[1px] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      aria-busy={pending} onSubmit={submit}
    >
      <Search
        aria-hidden="true"
        className="ml-3 hidden size-[22px] shrink-0 text-outline md:block"
      />
      {input}
      {draft.length > 0 && (
        <button
          aria-label="Xóa tìm kiếm"
          disabled={pending}
          className="mr-1 p-2 text-outline transition-colors hover:text-on-surface"
          onClick={() => {
            setInputState({ sourceValue: value, draft: "" });
            inputRef.current?.focus();
            onSearch?.("");
          }}
          type="button"
        >
          <X className="size-[18px]" />
        </button>
      )}
      <button
        aria-label="Tìm kiếm"
          disabled={pending}
        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg gap-space-xs bg-primary px-3 py-3.5 font-label-ui text-label-ui text-on-primary transition-colors hover:bg-primary-container md:px-space-lg"
        type="submit"
      >
        {pending ? <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" /> : <Search aria-hidden="true" className="size-5 md:hidden" />}
        <span className="hidden md:inline">Tìm kiếm</span>
        {!pending && <ArrowRight aria-hidden="true" className="hidden size-4 md:block" />}
      </button>
    </form>
  );
}
