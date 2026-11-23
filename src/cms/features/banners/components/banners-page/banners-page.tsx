"use client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { useBannerFilters } from "../../hooks/use-banner-filters";
import { useBanners } from "../../hooks/use-banners";
import type { Banner, BannerModalState } from "../../types";
import { BannerDeleteDialog } from "../banner-delete-dialog/banner-delete-dialog";
import { BannerModal } from "../banner-modal/banner-modal";
import { BannersCollection } from "../banners-collection/banners-collection";
import { BannersToolbar } from "../banners-toolbar/banners-toolbar";
import styles from "./banners-page.module.css";
const PAGE_SIZE = 20;
export function BannersPage() { const filters = useBannerFilters(); const [modal, setModal] = useState<BannerModalState>(null); const [deleting, setDeleting] = useState<Banner | null>(null); const query = useBanners({ page: filters.page, limit: PAGE_SIZE, search: filters.search || undefined, position: filters.position, isActive: filters.isActive }); const open = useCallback((banner: Banner) => setModal({ mode: "detail", id: banner.id }), []); return <CmsMain className={styles.main}><header className={styles.heading}><div><h1>Banner</h1><p>Quản lý hình ảnh quảng bá theo từng vị trí hiển thị.</p></div><CmsButton className="cms-page-header-action" type="button" onClick={() => setModal({ mode: "create" })}><Plus aria-hidden="true" size={17} /> Thêm banner</CmsButton></header><BannersToolbar filters={filters} /><BannersCollection filters={filters} listQuery={query} onDetail={open} onDelete={setDeleting} /><BannerModal state={modal} onStateChange={setModal} onDelete={setDeleting} /><BannerDeleteDialog banner={deleting} onClose={() => setDeleting(null)} onDeleted={() => { setDeleting(null); setModal(null); if ((query.data?.items.length ?? 0) === 1 && filters.page > 1) filters.setPage(filters.page - 1); }} /></CmsMain>; }
