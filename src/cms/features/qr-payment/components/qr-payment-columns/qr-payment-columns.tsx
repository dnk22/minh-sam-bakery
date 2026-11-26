import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { CmsButton } from "@/cms/components/ui/button";
import { ImageUploadPreview } from "@/cms/components/image-upload/image-upload-preview";
import type { SystemConfig } from "@/cms/features/system-configs/types";
import { qrPaymentSchema } from "../../schemas/qr-payment.schema";
import { readQrPaymentValue } from "../../utils/qr-payment-data";
import styles from "./qr-payment-columns.module.css";

export function createQrPaymentColumns(
  onEdit: (config: SystemConfig) => void,
): ColumnDef<SystemConfig, unknown>[] {
  return [
    {
      id: "qr",
      header: "Mã QR",
      size: 112,
      cell: ({ row }) => {
        const parsed = qrPaymentSchema.safeParse(
          readQrPaymentValue(row.original.value),
        );
        return parsed.success ? (
          <div className={styles.thumbnail}>
            <ImageUploadPreview
              value={parsed.data.qrImageUrl}
              altText="Mã QR thanh toán"
            />
          </div>
        ) : (
          "—"
        );
      },
    },
    {
      id: "account",
      header: "Thông tin tài khoản",
      cell: ({ row }) => {
        const parsed = qrPaymentSchema.safeParse(
          readQrPaymentValue(row.original.value),
        );
        if (!parsed.success)
          return <span role="status">Dữ liệu không hợp lệ. Cần cập nhật.</span>;
        const value = parsed.data;
        return (
          <div className={styles.account}>
            <strong>{value.bankName}</strong>
            <span>{value.accountNumber}</span>
            <span>{value.accountHolder}</span>
            {value.bankBranch ? (
              <span>Chi nhánh: {value.bankBranch}</span>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      size: 180,
      cell: ({ row }) => (
        <CmsButton
          variant="outline"
          type="button"
          onClick={() => onEdit(row.original)}
        >
          <Pencil size={15} aria-hidden="true" /> Chỉnh sửa
        </CmsButton>
      ),
    },
  ];
}
