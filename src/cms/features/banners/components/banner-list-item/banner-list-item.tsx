import Image from "next/image";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import { getBannerPositionLabel } from "@/lib/banner/positions";
import type { Banner } from "../../types";
import styles from "./banner-list-item.module.css";
export function BannerListItem({ banner }: { banner: Banner }) { return <div className={styles.item}><Image src={cmsAssetUrl(banner.desktopImageUrl)} alt="" width={88} height={52} unoptimized /><span><strong>{banner.title}</strong><small>{getBannerPositionLabel(banner.position)} · Thứ tự {banner.sortOrder}</small></span></div>; }
