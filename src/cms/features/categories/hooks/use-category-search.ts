"use client";

import { useEffect, useState } from "react";

export function useCategorySearch({
  onCommit,
  value,
}: {
  onCommit: (value: string) => void;
  value: string;
}) {
  const [state, setState] = useState({
    draft: value,
    focused: false,
    syncedValue: value,
  });

  if (value !== state.syncedValue) {
    const hasUncommittedInput = state.draft.trim() !== state.syncedValue;
    setState({
      draft: state.focused && hasUncommittedInput ? state.draft : value,
      focused: state.focused,
      syncedValue: value,
    });
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
    onBlur: () => {
      setState((current) => ({ ...current, focused: false }));
    },
    onChange: (next: string) => {
      setState((current) => ({ ...current, draft: next }));
    },
    onFocus: () => {
      setState((current) => ({ ...current, focused: true }));
    },
  };
}
