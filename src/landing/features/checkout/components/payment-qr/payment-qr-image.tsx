"use client";

import Image from "next/image";

export function PaymentQrImage({ url, loaded, onLoad, onError }: {
  url: string; loaded: boolean; onLoad: () => void; onError: () => void;
}) {
  return <div className="relative mx-auto size-48 max-w-full rounded-lg bg-white p-2" aria-busy={!loaded}>
    {!loaded ? <div aria-hidden="true" className="absolute inset-2 rounded bg-surface-container-high motion-safe:animate-pulse" /> : null}
    <Image src={url} alt="Mã QR chuyển khoản Minh Sâm" width={192} height={192} unoptimized
      className={`relative h-full w-full object-contain ${loaded ? "opacity-100" : "opacity-0"}`}
      onLoad={onLoad} onError={onError} />
    {!loaded ? <span className="sr-only" role="status">Đang tải ảnh QR</span> : null}
  </div>;
}
