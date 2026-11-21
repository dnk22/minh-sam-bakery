"use client";
import { useEffect, useState } from "react";
export function usePostSearch({ value, onCommit }: { value: string; onCommit: (value: string) => void }) {
  const [state, setState] = useState({ draft: value, focused: false, syncedValue: value });
  if (value !== state.syncedValue) { const uncommitted = state.draft.trim() !== state.syncedValue; setState({ draft: state.focused && uncommitted ? state.draft : value, focused: state.focused, syncedValue: value }); }
  useEffect(() => { const timer = window.setTimeout(() => { const next = state.draft.trim(); if (next !== value) onCommit(next); }, 400); return () => clearTimeout(timer); }, [onCommit, state.draft, value]);
  return { draft: state.draft, onBlur: () => setState((current) => ({ ...current, focused: false })), onFocus: () => setState((current) => ({ ...current, focused: true })), onChange: (draft: string) => setState((current) => ({ ...current, draft })) };
}
