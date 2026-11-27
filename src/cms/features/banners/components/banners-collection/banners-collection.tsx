"use client";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import type { BannerFilters } from "../../hooks/use-banner-filters";
import type { Banner, BannerList } from "../../types";
import { createBannerColumns, type BannerActionHandlers } from "../banner-columns/banner-columns";
import { BannerListItem } from "../banner-list-item/banner-list-item";
import styles from "./banners-collection.module.css";
export function BannersCollection({ filters, listQuery, onDetail, onDelete }: BannerActionHandlers & { filters: BannerFilters; listQuery: UseQueryResult<BannerList, Error> }) { const actions = useMemo(() => ({ onDetail, onDelete }), [onDelete, onDetail]); const columns = useMemo(() => createBannerColumns(actions), [actions]); const list = listQuery.data; return <ResponsiveCollection<Banner> className={styles.table} columns={columns} data={list?.items ?? []} loading={listQuery.isLoading || (listQuery.isFetching && listQuery.isPlaceholderData)} error={listQuery.error instanceof Error ? listQuery.error.message : undefined} emptyState="Chưa có banner nào." filteredEmptyState="Không có banner phù hợp." isFiltered={filters.isFiltered} onRetry={() => listQuery.refetch()} getItemKey={(item) => item.id} getRowId={(item) => item.id} getItemLabel={(item) => `Xem banner ${item.title}`} onItemClick={onDetail} renderItem={(item) => <BannerListItem banner={item} />} renderAccessory={(item) => <CmsBadge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "Bật" : "Tắt"}</CmsBadge>} pagination={list && !listQuery.isPlaceholderData ? { meta: list.pagination, onPageChange: filters.setPage } : undefined} />; }
