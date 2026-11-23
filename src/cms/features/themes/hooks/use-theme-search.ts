"use client";

import { useEffect, useState } from "react";

/** Local debounced search draft; filters remain URL-driven for shareable state. */
export function useThemeSearch({ value, onCommit }: { value: string; onCommit: (value: string) => void }) {
  const [state, setState] = useState({ draft: value, focused: false, synced: value });
  if (state.synced !== value) {
    setState({
      draft: state.focused && state.draft.trim() !== state.synced ? state.draft : value,
      focused: state.focused,
      synced: value,
    });
  }
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = state.draft.trim();
      if (next !== value) onCommit(next);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [onCommit, state.draft, value]);

  return {
    draft: state.draft,
    onFocus: () => setState((s) => ({ ...s, focused: true })),
    onBlur: () => setState((s) => ({ ...s, focused: false })),
    onChange: (draft: string) => setState((s) => ({ ...s, draft })),
  };
}
