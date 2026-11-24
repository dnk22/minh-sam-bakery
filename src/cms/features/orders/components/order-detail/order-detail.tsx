import { MOCK_PAYMENT_IMAGE_URL } from "@/lib/contracts/order/order.schema";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";

import { getOrderPaymentLabel, getOrderStatusPresentation } from "../../constants";
import { formatCalendarDate, formatOrderDateTime, formatVnd } from "../../lib/order-format";
import type { Order } from "../../types";
import styles from "./order-detail.module.css";

function safeOrderAsset(value: string | null | undefined) {
  return value?.startsWith("/uploads/") ? cmsAssetUrl(value) : null;
}

export function OrderDetail({ order }: { order: Order }) {
  const status = getOrderStatusPresentation(order.status);
  const paymentImage = safeOrderAsset(order.paymentImageUrl);

  return <div className={styles.detail}>
    <section className={styles.section}>
      <div className={styles.sectionHeading}><h2>Đơn hàng</h2><CmsBadge variant={status.variant}>{status.label}</CmsBadge></div>
      <dl className={styles.entries}>
        <DetailEntry label="Mã đơn" value={<code>{order.id}</code>} />
        <DetailEntry label="Ngày tạo" value={<time dateTime={order.createdAt}>{formatOrderDateTime(order.createdAt)}</time>} />
        <DetailEntry label="Cập nhật" value={<time dateTime={order.updatedAt}>{formatOrderDateTime(order.updatedAt)}</time>} />
      </dl>
    </section>

    <section className={styles.section}>
      <h2>Khách hàng</h2>
      <dl className={styles.entries}>
        <DetailEntry label="Họ tên" value={order.fullName || "Chưa cung cấp"} />
        <DetailEntry label="Điện thoại" value={order.phone} />
        <DetailEntry label="Email" value={order.email || "Chưa cung cấp"} />
        <DetailEntry label="Địa chỉ" value={order.shippingAddress || "Nhận tại cửa hàng"} />
        <DetailEntry label="Ghi chú" value={order.note || "—"} />
      </dl>
    </section>

    <section className={styles.section}>
      <h2>Nhận hàng</h2>
      <dl className={styles.entries}>
        <DetailEntry label="Hình thức" value={order.fulfillmentMethod === "PICKUP" ? "Tại cửa hàng" : "Giao tận nơi"} />
        <DetailEntry label="Ngày nhận" value={formatCalendarDate(order.deliveryDate)} />
        <DetailEntry label="Khung giờ" value={order.deliveryTime || "—"} />
      </dl>
    </section>

    <section className={styles.section}>
      <h2>Thanh toán</h2>
      <dl className={styles.entries}>
        <DetailEntry label="Phương thức" value={getOrderPaymentLabel(order.paymentMethod)} />
        <DetailEntry label="Tổng tiền" value={<strong>{formatVnd(order.totalAmount)}</strong>} />
      </dl>
      {order.paymentImageUrl === MOCK_PAYMENT_IMAGE_URL ? <p className={styles.assetNotice}>Minh chứng giả lập — chưa xác minh thanh toán.</p> : paymentImage ? <div className={styles.paymentProof}><span>Ảnh thanh toán</span><Image alt="Ảnh thanh toán của đơn hàng" height={180} src={paymentImage} unoptimized width={320} /></div>
        : order.paymentImageUrl ? <p className={styles.assetNotice}>Ảnh thanh toán dùng URL chưa được xác thực nên không được tải tự động.</p> : null}
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHeading}><h2>Sản phẩm</h2><span className={styles.count}>{order.items.length} bản ghi sản phẩm</span></div>
      {order.items.length ? <ul className={styles.products}>
        {order.items.map((product) => {
          const image = safeOrderAsset(product.imageUrl);
          return <li key={product.id}>
            {image ? <Image alt="" height={56} src={image} unoptimized width={56} /> : <span className={styles.placeholder}><ImageIcon aria-hidden="true" /></span>}
            <div><strong>{product.productName}</strong><code>{product.variantSku}</code><span>{[product.size, product.style].filter(Boolean).join(" • ")} × {product.quantity}</span><span>{formatVnd(product.unitPrice)} / đơn vị</span></div>
            <b>{formatVnd(product.lineTotal)}</b>
          </li>;
        })}
      </ul> : <p className={styles.empty}>Chưa có thông tin sản phẩm trong đơn hàng.</p>}
      
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHeading}><h2>Trạng thái</h2><CmsBadge variant={status.variant}>{status.label}</CmsBadge></div>
      <p className={styles.help}>Chỉ những trạng thái hợp lệ mới có thể được cập nhật.</p>
    </section>
  </div>;
}

function DetailEntry({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}
