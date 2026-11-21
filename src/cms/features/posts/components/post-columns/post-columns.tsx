"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Send, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import { getPostStatusPresentation } from "../../constants";
import type { Post } from "../../types";
import styles from "./post-columns.module.css";
const date = (value: string | null | undefined) => value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(value)) : "—";
export function createPostColumns(actions: { onDetail: (post: Post) => void; onEdit: (post: Post) => void; onPublish: (post: Post) => void; onDelete: (post: Post) => void }): ColumnDef<Post, unknown>[] {
  return [
    { id: "post", header: "Bài viết", size: 310, cell: ({ row }) => { const post = row.original; return <div className={styles.post}>{post.thumbnailUrl ? <Image src={cmsAssetUrl(post.thumbnailUrl)} alt="" width={48} height={48} unoptimized /> : <span className={styles.placeholder}><ImageIcon aria-hidden="true" /></span>}<div><strong title={post.title}>{post.title}</strong><span title={post.slug}>{post.slug}</span></div></div>; } },
    { id: "status", header: "Trạng thái", size: 125, cell: ({ row }) => { const status = getPostStatusPresentation(row.original.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; } },
    { id: "landing", header: "Landing", size: 100, cell: ({ row }) => <CmsBadge variant={row.original.showOnLanding ? "warning" : "secondary"}>{row.original.showOnLanding ? "Đã chọn" : "Không"}</CmsBadge> },
    { id: "author", header: "Tác giả", size: 150, cell: ({ row }) => <span className={styles.truncate} title={row.original.author.fullName}>{row.original.author.fullName}</span> },
    { id: "updated", header: "Cập nhật", size: 110, cell: ({ row }) => <time dateTime={row.original.updatedAt}>{date(row.original.updatedAt)}</time> },
    { id: "actions", header: "Thao tác", size: 82, cell: ({ row }) => { const post = row.original; return <CmsRowActions onView={() => actions.onDetail(post)} viewLabel={`Xem chi tiết ${post.title}`} moreLabel={`Mở thao tác cho ${post.title}`} actions={[
      { key: "edit", label: "Chỉnh sửa", icon: <Pencil aria-hidden="true" size={15} />, onSelect: () => actions.onEdit(post) },
      ...(post.status === "DRAFT" ? [{ key: "publish", label: "Xuất bản", icon: <Send aria-hidden="true" size={15} />, onSelect: () => actions.onPublish(post) }] : []),
      { key: "delete", label: "Xóa mềm", icon: <Trash2 aria-hidden="true" size={15} />, destructive: true, separatorBefore: true, onSelect: () => actions.onDelete(post) },
    ]} />; } },
  ];
}
