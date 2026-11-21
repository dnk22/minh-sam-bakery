import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import { getBannerPositionLabel } from "@/lib/banner/positions";
import type { Banner } from "../../types";
import styles from "./banner-columns.module.css";
export type BannerActionHandlers = { onDetail: (banner: Banner) => void; onDelete: (banner: Banner) => void };
export function createBannerColumns(actions: BannerActionHandlers): ColumnDef<Banner, unknown>[] { return [
  { id: "image", header: "Ảnh", size: 88, cell: ({ row }) => <Image className={styles.thumb} src={cmsAssetUrl(row.original.desktopImageUrl)} alt="" width={72} height={42} unoptimized /> },
  { accessorKey: "title", header: "Tiêu đề", size: 180, cell: ({ row }) => <strong className={styles.truncate} title={row.original.title}>{row.original.title}</strong> },
  { accessorKey: "position", header: "Vị trí", size: 165, cell: ({ row }) => <span className={styles.truncate}>{getBannerPositionLabel(row.original.position)}</span> },
  { accessorKey: "isActive", header: "Trạng thái", size: 105, cell: ({ row }) => <CmsBadge variant={row.original.isActive ? "success" : "secondary"}>{row.original.isActive ? "Hoạt động" : "Đang tắt"}</CmsBadge> },
  { accessorKey: "sortOrder", header: "Thứ tự", size: 72 },
  { id: "schedule", header: "Lịch hiển thị", size: 170, cell: ({ row }) => <span className={styles.schedule}>{formatSchedule(row.original)}</span> },
  { id: "actions", header: "Thao tác", size: 82, cell: ({ row }) => <CmsRowActions actions={[{ key: "delete", label: "Xóa banner", icon: <Trash2 aria-hidden="true" size={15} />, destructive: true, onSelect: () => actions.onDelete(row.original) }]} moreLabel={`Mở thao tác cho ${row.original.title}`} onView={() => actions.onDetail(row.original)} viewLabel={`Xem chi tiết ${row.original.title}`} /> },
]; }
function formatSchedule(banner: Banner) { if (!banner.startsAt && !banner.endsAt) return "Không giới hạn"; const date = (v: string) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(v)); return `${banner.startsAt ? date(banner.startsAt) : "Bây giờ"} – ${banner.endsAt ? date(banner.endsAt) : "Không hạn"}`; }
