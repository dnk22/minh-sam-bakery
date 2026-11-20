"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./category-search.module.css";

export function CategorySearch({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (value: string) => void;
}) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const normalized = input.trim();
      if (normalized !== value) onCommit(normalized);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [input, onCommit, value]);

  return (
    <label className={styles.search}>
      <Search aria-hidden="true" size={17} />
      <span className={styles.srOnly}>Tìm kiếm</span>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Tìm theo tên hoặc slug"
      />
    </label>
  );
}
