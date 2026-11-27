"use client";

import Image from "next/image";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function PaymentQrImage({ url }: { url: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  if (status === "failed") {
    return <p role="status" className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 font-body-sm text-body-sm text-amber-800">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>Ảnh mã QR hiện không khả dụng. Bạn có thể chuyển khoản thủ công theo thông tin tài khoản bên dưới.</span>
    </p>;
  }

  const loaded = status === "loaded";
  return <>
    <div className="relative mx-auto aspect-square w-48 max-w-full rounded-lg bg-white p-2" aria-busy={!loaded}>
      {!loaded ? <div aria-hidden="true" className="absolute inset-2 rounded bg-surface-container-high motion-safe:animate-pulse" /> : null}
      <Image src={url} alt="Mã QR chuyển khoản Minh Sâm" width={192} height={192} unoptimized
        className={`relative h-full w-full object-contain ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setStatus("loaded")} onError={() => setStatus("failed")} />
      {!loaded ? <span className="sr-only" role="status">Đang tải ảnh QR</span> : null}
    </div>
    {loaded ? <p className="text-center font-body-sm text-on-surface-variant">Quét mã QR bằng ứng dụng ngân hàng.</p> : null}
  </>;
}
