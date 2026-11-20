"use client";

import { useEffect, useState } from "react";

export function useUserSearch({ value, onCommit }: { value: string; onCommit: (value: string) => void }) {
  const [state, setState] = useState({ draft: value, focused: false, syncedValue: value });
  if (value !== state.syncedValue) {
    const uncommitted = state.draft.trim() !== state.syncedValue;
    setState({ draft: state.focused && uncommitted ? state.draft : value, focused: state.focused, syncedValue: value });
  }
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const normalized = state.draft.trim();
      if (normalized !== value) onCommit(normalized);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [onCommit, state.draft, value]);
  return {
    draft: state.draft,
    onBlur: () => setState((current) => ({ ...current, focused: false })),
    onChange: (draft: string) => setState((current) => ({ ...current, draft })),
    onFocus: () => setState((current) => ({ ...current, focused: true })),
  };
}
