"use client";

import { useState } from "react";

/** Keep edits local until the toolbar explicitly applies them. URL changes
 * synchronize the draft without discarding edits on pagination alone. */
export function useToolbarDraft<T extends object>(applied: T) {
  const key = JSON.stringify(applied);
  const [state, setState] = useState({ key, values: applied });
  if (state.key !== key) setState({ key, values: applied });
  const values = state.key === key ? state.values : applied;
  const set = <K extends keyof T>(field: K, value: T[K]) =>
    setState(previous => ({ key, values: { ...(previous.key === key ? previous.values : applied), [field]: value } }));
  const reset = (next: T) => setState({ key, values: next });
  return { values, set, reset, changed: JSON.stringify(values) !== key };
}
