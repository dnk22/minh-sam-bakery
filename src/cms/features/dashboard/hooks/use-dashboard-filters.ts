"use client";
import { useState } from "react";
import { getDashboardRange } from "../lib/dashboard-date-range";
import { validDashboardParams } from "../lib/dashboard-query";
import type { DashboardParams, DashboardPreset } from "../types";

export function useDashboardFilters(initial: DashboardParams) {
  const [applied, setApplied] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [appliedPreset, setAppliedPreset] = useState<DashboardPreset>("month");
  const [preset, setPreset] = useState<DashboardPreset>("month");
  function selectPreset(next: DashboardPreset) {
    setPreset(next);
    if (next !== "custom") setDraft(current => ({ ...current, ...getDashboardRange(next) }));
  }
  function setDate(key: "from" | "to", value: string) {
    setPreset("custom");
    setDraft(current => ({ ...current, [key]: value }));
  }
  return { applied, appliedPreset, draft, preset, selectPreset, setDate, setTopLimit: (topLimit: number) => setDraft(current => ({ ...current, topLimit })), valid: validDashboardParams(draft), apply: () => { setApplied(draft); setAppliedPreset(preset); } };
}
