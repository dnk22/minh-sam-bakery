"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { bannerFormSchema, bannerToForm } from "../schemas/banner.schema";
import type { Banner, BannerFormValues, BannerModalState } from "../types";
export function useBannerForm({ state, banner }: { state: BannerModalState; banner?: Banner }) { const source = useRef<{ session: string; version: string } | null>(null); const mode = state?.mode ?? "detail"; const session = useMemo(() => state ? `${state.mode}:${"id" in state ? state.id : "new"}` : "closed", [state]); const version = banner?.updatedAt ?? "new"; const form = useForm<BannerFormValues>({ resolver: zodResolver(bannerFormSchema), defaultValues: bannerToForm() }); useEffect(() => { if (!state) { source.current = null; return; } if (mode === "detail" || (mode === "edit" && !banner)) return; const changed = source.current?.session !== session, versionChanged = source.current?.version !== version; if (!changed && !versionChanged) return; source.current = { session, version }; if (!changed && form.formState.isDirty) return; form.reset(bannerToForm(mode === "edit" ? banner : undefined)); }, [banner, form, mode, session, state, version]); return form; }
