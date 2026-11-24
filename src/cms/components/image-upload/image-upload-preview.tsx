"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import styles from "./image-upload.module.css";

export function ImageUploadPreview({ value, altText = "Ảnh đại diện" }: { value: string | null; altText?: string }) {
  return <Preview key={value ?? "empty"} value={value} altText={altText} />;
}

function Preview({ value, altText }: { value: string | null; altText: string }) {
  const [failed, setFailed] = useState(false);
  return <div className={styles.preview}>
    {value && !failed ? <Image alt={altText} src={cmsAssetUrl(value)} width={640} height={320} unoptimized onError={() => setFailed(true)} /> :
      <div className={styles.placeholder}>
        <ImageIcon aria-hidden="true" />
        <span>{failed ? "Không thể hiển thị ảnh." : "Chưa có ảnh."}</span>
      </div>}
  </div>;
}
