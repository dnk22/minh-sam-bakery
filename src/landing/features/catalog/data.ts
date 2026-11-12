import type { CatalogCategory, CatalogProduct } from "./types";

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "banh-trung-thu",
    name: "Bánh Trung Thu",
    description: "Bánh nướng, bánh dẻo truyền thống & khuôn gỗ cổ tích thế kỷ 19.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeApUQ-OwxTdniJEoOxtlfwUPREbPRAWxC8D3Y3KsUcZkd5m2rLhCPKklX6ZNaMUz5aA3VlyKEjhILJT-785YEoISsi3zrf5eoZ9Mto7Cei_vMDVAgEiT8dTo8c0mf3xm9fbUTKQW6GHZ1JSu1uO-U3C720lNLmWM1syM_hqmvQm_qdFs0HH4FMygTUiRJfTksRWjoFRCdtl15lus2qFh5iRuOTyhIPtM2t28VXxtxDukphgUXo4n3",
    imageAlt: "Bánh Trung Thu Minh Sâm Bakery",
    badge: "MÙA TRĂNG",
    badgeClassName: "left-2.5 bg-primary/90 text-secondary-fixed",
    number: "01",
    label: "Cổ Truyền",
  },
  {
    slug: "san-pham-truyen-thong",
    name: "Dòng Sản Phẩm Truyền Thống",
    description: "Bánh chả lá chanh, bánh khảo, bánh cốm dẻo thơm hương vị Tràng An.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARumbkFdmF6k9OVND40wCGCr-5rjgPUexiXf9SOkCpA3lFWChHLyVl25T8ALC764CTDKcASMVH24bp_KpHoDYmz6lHOZOl9JBTY-bjhf9TjjhWZ9PT_nwWILk4631CeNwrw8lmjTy6NnRRVLAWoAQ26RQ1wME6ZOxNE7mXOpOqox_XGX-osvH30JkYlFwRt7ZJVeMRyvHbhTdfDYewnM4uox6-RWEBI57Ks-CjARpjoRIApJqNWrSk",
    imageAlt: "Dòng Sản Phẩm Truyền Thống Minh Sâm",
    badge: "DI SẢN HÀ THÀNH",
    badgeClassName: "left-2.5 bg-surface-container-highest/80 text-primary",
    number: "02",
    label: "Hương Vị Xưa",
  },
  {
    slug: "san-pham-moi",
    name: "Dòng Sản Phẩm Mới",
    description: "Bánh mochi ngũ sắc, bánh cuộn ngàn lớp, hương vị hiện đại thanh nhã.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcc9qL9yI-HlwQYsa5NLqCMy3ErhUo3r4_BTK_kuBaMJzHrro1RrCHgpZ5c-YtlahPgBGfBaVyNc_4R-6qT2v0Qt1qwwnJ-xPU1ENyP1Wrt0bpWX20Ui9iF9Ihw0pDCN0ngdzEVgTgv0CiJFpm5339UvbQIKJ60BO89hWqIJftkuwdPycE91tyLGEngw1HuyITJ8cbNDlWjwpBilBuR3KqQgnbhBTRVCPnMmiE6IZEaJwIvheB84xS",
    imageAlt: "Dòng Sản Phẩm Mới Minh Sâm",
    badge: "MỚI RA MẮT",
    badgeClassName: "right-2.5 bg-secondary-container text-on-secondary-container",
    number: "03",
    label: "Đương Đại",
  },
  {
    slug: "banh-cookie",
    name: "Bánh Cookie",
    description: "Cookie bơ Pháp, hạnh nhân rang bùi, cookie yến mạch thủ công giòn rụm.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU62imQ9Iel5KBk2UDvpke9n0WVsBktK-DkQG_y0f7elzNdOV0860-HK3NOD1vaBGdL8HHF0LpXfFFb44FZjwIHSSUzx-_A9rbshdR5GjXA0j9rvne3LAHZhaDM2uob2YzPPIsmQB3sskTO3A7fzS-UwSbqOoGDBYM2VOYoKFxqVDP0rEvlMIoj7oU8cpqdKJxuZ_Jzw6XGq-dnBsLxJTIh4qY47FMBcSE7fkaAtKb9theUqZ406kk",
    imageAlt: "Bánh Cookie Minh Sâm",
    badge: "BƠ PHÁP THỦ CÔNG",
    badgeClassName: "left-2.5 bg-surface-container-highest/80 text-primary",
    number: "04",
    label: "Thủ Công",
  },
  {
    slug: "sinh-nhat-su-kien",
    name: "Sinh Nhật & Sự Kiện",
    description: "Bánh kem tạo hình hoa sen di sản, tháp bánh tiệc trà thiết kế may đo.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4vTLK1GYrepoL8IOIHgnR0hXi7avupvJXe7NzMdQ-xWuk38WTbsT_6VKngyLll_WzZOGTZnPyFqlyELy1uaCDtHY-_7oRqgGZX6eWoMtQmV3mx1Sseuez9aAIdUi7YmGh-BklhJbUfWDZ5MAcay-YYBrxFscNZ33htCx8Nk86JLyzvDPi5fi7ecCDFetTjnazBBb6R2Scjqx0QvLUB3bkDNwAMb8ZpC1eeNDD5PeOvTGdht-pjPg9",
    imageAlt: "Sinh Nhật & Sự Kiện Minh Sâm",
    badge: "ĐẶT TRƯỚC",
    badgeClassName: "left-2.5 bg-secondary/15 text-secondary",
    number: "05",
    label: "Thiết Kế May Đo",
  },
  {
    slug: "banh-hat",
    name: "Bánh Hạt",
    description: "Bánh hạt dinh dưỡng, gạo lứt, ngũ hạt thuần khiết ít ngọt tốt cho sức khỏe.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsP429RJOxTNHeq8UFUDcupugMT2JBdfDGod8VrQPlU32EcLUwh_J38N-e15RmXxJ-UP2vmPGqLmQnjVo8t1Bqb5aecNcUVQC5PgCTqjOKhXtaYmVTEXgZVrb1alTNetFJqy79lJpbxHdmC3wb3GnK6zGYdaCWDzZD6uCVcWkYMm5eqzCv5A7OG3yAG1wF2YnHDqSahd56_aoj6UR4AG_K9bMOhFU7AXTcDFoOPHy0LiRRUo-W82Dx",
    imageAlt: "Bánh Hạt Minh Sâm",
    badge: "DINH DƯỠNG",
    badgeClassName: "left-2.5 bg-surface-container-highest/80 text-primary",
    number: "06",
    label: "Dưỡng Lành",
  },
  {
    slug: "qua-tang",
    name: "Quà Tặng",
    description: "Hộp quà cá nhân và doanh nghiệp được thiết kế, cá nhân hóa theo từng dịp tri ân.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuJnzg1O8twBoUv1KrBl3DQbcxKtg0_f7PV3OT39DEIT_lmsHTF85GOSS_2fZsOkd2iloijm-CmsFB9xXbIY8LS_fkDMsI14ANTKkOGIu99il7vgNLTYxI8hK8YJh0Ci5tgoUv7d1AGjedBoa2HelLrxcBcC-gClVxjgRFCuce2D5YzWrVkqCNxteyiHDp1445-zUMUmBIXBL0SPOa0pw5rRq0Xk8tOSjv2CYosiQ",
    imageAlt: "Hộp quà tri ân Minh Sâm",
    badge: "QUÀ TẶNG TRI ÂN",
    badgeClassName: "left-2.5 bg-secondary-fixed text-on-secondary-fixed",
    number: "07",
    label: "Trao Tặng",
  },
];

export const featuredCategorySlugs = [
  "banh-trung-thu",
  "san-pham-truyen-thong",
  "san-pham-moi",
  "banh-cookie",
  "sinh-nhat-su-kien",
  "banh-hat",
] as const;

export const featuredCatalogCategories = featuredCategorySlugs.map((slug) => {
  const category = catalogCategories.find((item) => item.slug === slug);
  if (!category) throw new Error(`Missing featured catalog category: ${slug}`);
  return category;
});

export const catalogProducts: CatalogProduct[] = [
  {
    id: "traditional-mixed-mooncake",
    categorySlug: "banh-trung-thu",
    name: "Bánh Thập Cẩm Truyền Thống Xưa",
    description: "Vị lạp xưởng, hạt sen & lá chanh cổ truyền theo phương vị Tràng An ngàn năm.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJQGwIMLudL76J0Vg-aCrp-In5Mb1v4PP7JtO8GStOsaj_1Xo70mrFyG6y515oz2wKpa_XF0Kvi8NiKHFsTXFkxBFlPTiE69VQIKniEEKCCsI0_bIPorpnpUNELM7E98Q9ofzUoKUGX2h5qfOMfereb75ICEOGGp1JBxwSBTLV31PtsZH1FzjCoXgw7WVkfURx1PaD7w6x5kJXgJQQRLcAECBvUKo0Mb8ermj_pyQDCipxOaE_A2ne",
    imageAlt: "Bánh Thập Cẩm Truyền Thống Xưa Minh Sâm",
    badge: "Di Sản 2010",
    badgeClassName: "bg-primary text-secondary-fixed",
    pricing: { mode: "fixed", amount: 110000, price: "110.000đ", unit: "/ chiếc (200g)" },
  },
  {
    id: "almond-young-rice-mooncake",
    categorySlug: "banh-trung-thu",
    name: "Bánh Nướng Hạnh Nhân Cốm Non",
    description: "Hạnh nhân giòn ngậy kết hợp cốm non mùa thu Hà Nội ngọt ngào êm dịu.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI978ikhYEOPIC5W3KSdXLGeoX-iF1JeuSb1-p5Nwf1t33lF_CbmtOAzZSJXL_dcnu9DdD9fU7h37s1fKGS5yoK76EdorNBmdZfqvpeZrWELRgFcqKuD9ch6nkJcdOKPGxk4QRXxVEW0L6uFYO37Qk8_lZeULpkFENvfgJaRMUjD_yYm0RGMufNySPbnOHvBDjpaXzYs8GgsBEuRpXXI-0CerLdtTQ2tn6-IiE3iYPV7NQpWpnJ5Z9",
    imageAlt: "Bánh Nướng Hạnh Nhân Cốm Non",
    badge: "Mùa Thu Vàng",
    badgeClassName: "bg-secondary text-on-secondary",
    pricing: { mode: "fixed", amount: 125000, price: "125.000đ", unit: "/ chiếc (200g)" },
  },
  {
    id: "five-color-mochi",
    categorySlug: "san-pham-moi",
    name: "Bánh Mochi Ngũ Sắc Thanh Nhẹ",
    description: "Vỏ dẻo mềm mịn, nhân đậu đỏ hạt sen ít ngọt thanh mát thưởng cùng trà mạn.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYNPfeNMp5D4MtlFQtASKYlbHGSg7Gvw3Atvo2jJ-Rxi9x4MQtz6VF3OU2AFYwQENw8XXVuAbQPLxEedmsBktcriHqI-0oqqAHkRHUm465-0GuV6h0yJW1fXadpmZ0c7jxl6T3NzO_s3hphzQflfFTCJ5-tHWH4UGv1yHYFXJicRb-_TaewyPH4BVuqFYXHq_IfHwbhDIztB1XEqZ-RtsZGqPg9ltsY2Xa6v3PO_uMSsX3wy8uqxh5",
    imageAlt: "Bánh Mochi Ngũ Sắc Thanh Nhẹ",
    badge: "Ít Ngọt",
    badgeClassName: "bg-surface-container-high text-primary",
    pricing: { mode: "fixed", amount: 95000, price: "95.000đ", unit: "/ hộp 4 chiếc" },
  },
  {
    id: "butter-nut-cookie",
    slug: "banh-cookie-bo-hat-dinh-duong",
    categorySlug: "banh-cookie",
    name: "Bánh Cookie Bơ Hạt Dinh Dưỡng",
    description: "Hòa quyện bơ Pháp Elle & Vire thượng hạng, hạt điều Bình Phước tuyển chọn và mật mía thanh dịu.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyP3eyz7QRKK8wMiZaMF20WEZcHPw7aDW8waOktb-uw1Qri3QWkc57KDfOmVFSF39PvUoVxQowRcU4_G47EOt5cDYrJ94yZFO2jet3W8znpWUxQtEr0nkPUjckiB3uvTZ3FaR7aERrKVdJrZEg5dcgaPFQcJC69OJWI7lC_o031-HYqh5xik6dcuBrGIP8Y_0KIYQ911OztWyyccncotbZMtPUhDsgud1grpxhswBJvbi2VwpH-Og0",
    imageAlt: "Hộp Cookie Bơ Hạt Dinh Dưỡng",
    pricing: { mode: "fixed", amount: 120000, price: "120.000đ", unit: "/ hộp tiêu chuẩn" },
  },
  {
    id: "mung-bean-salted-egg-cake",
    categorySlug: "san-pham-truyen-thong",
    name: "Bánh Thơm Dẻo Đậu Xanh Trứng Muối",
    description: "Đậu xanh tán nhuyễn thơm lừng trứng muối bùi béo ủ hương hoa bưởi thanh khiết.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn3jrrW-ZQAE8e-UfaqXtondu3_PTKFsCda2-xq3GZjgrKYc5RPBkRCad6HOVrRGf8Oln6oHMaMDPgcxIkFsBJLAnxGCorGDFafsbMzY7HZj_Gia-dVfXwrBCO5b2jKn8lMmky9AobvfxX4ab114jVYfU8GM_iJoQnA3XmMVmcc265fV25YNfWNjW_POE6cnjSOt_1Z5uv38ypbPbdSKOpKS_HIMVW1AdFbePnI_g",
    imageAlt: "Bánh Thơm Dẻo Đậu Xanh Trứng Muối",
    pricing: { mode: "fixed", amount: 105000, price: "105.000đ", unit: "/ chiếc (180g)" },
  },
  {
    id: "fresh-brioche",
    categorySlug: "san-pham-moi",
    name: "Bánh Mì Hoa Cúc Bơ Tươi Mỗi Ngày",
    description: "Hương bơ men tự nhiên cho bữa sáng thảnh thơi và những buổi trà quây quần.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyeXizj8iWOulS4x4PldKJHIQXPSfwBmucOzB2Rb3Y2HCWCOfedV3MGfhVTAXYTAgoLH84MSxBxlk0dZnpdriVZTzmvAjwRXHuld73HF7Y3d2OzAAY63OhLIhqLSlCin7S5V-68xCRkqEm9AmAjCyvdHUzJ7fAVl9gN4s1o-jPobTIylO90i9sDcAFr_Y22lnldUwOI2SediXNGsrQcTiFQJqL4asaIsJMKloxQwyWZh4BC2u88sEU",
    imageAlt: "Bánh Mì Hoa Cúc & Bánh Mềm Mỗi Ngày",
    badge: "Thường Nhật",
    badgeClassName: "bg-secondary-fixed text-on-secondary-fixed",
    pricing: { mode: "fixed", amount: 85000, price: "85.000đ", unit: "/ ổ (300g)" },
  },
  {
    id: "heritage-reunion-gift-box",
    categorySlug: "qua-tang",
    name: "Hộp Quà Di Sản Đoan Viên",
    description: "Hộp sơn mài thủ công cao cấp kèm 4 vị bánh di sản & trà shan tuyết thượng hạng.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpS1NxldV45SAkIJETOWR5RaBSR7l-pOdN0bbkccOVylUND2DnIVUbaYRI8JrnzgFM054Z0TdIQPj8f33lqIYfOO3QdYLImkW9MhxZBndpvPge61wd3tzRHrC97JaHlgGE8mPvopLiOUemSRTFxBWxhOswigcPNoQtRwdEWrsNvV-Bf-kovruivzGX83L7-srw86L-Klz0XgiJtr7_Rdpwvy1bbimu1GTuiSDxQrP1H8JrcN_jOU33",
    imageAlt: "Hộp Quà Di Sản Đoan Viên (Tết & Trung Thu)",
    badge: "Bespoke Quà Tặng",
    badgeClassName: "bg-secondary-fixed text-on-secondary-fixed",
    pricing: { mode: "quote", detail: "Theo số lượng", icon: "calendar" },
  },
  {
    id: "corporate-lacquer-gratitude-box",
    slug: "bo-hop-doanh-nghiep-son-mai-tri-an",
    categorySlug: "qua-tang",
    name: "Bộ Hộp Doanh Nghiệp Sơn Mài Tri Ân",
    description: "Tác phẩm sơn mài khắc kim tinh xảo kết hợp cùng 4 vị bánh di sản thượng hạng và trà Shan Tuyết cổ thụ Hà Giang. Thiết kế độc bản tôn vinh vị thế thương hiệu và gắn kết tri ân đối tác bền vững.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuJnzg1O8twBoUv1KrBl3DQbcxKtg0_f7PV3OT39DEIT_lmsHTF85GOSS_2fZsOkd2iloijm-CmsFB9xXbIY8LS_fkDMsI14ANTKkOGIu99il7vgNLTYxI8hK8YJh0Ci5tgoUv7d1AGjedBoa2HelLrxcBcC-gClVxjgRFCuce2D5YzWrVkqCNxteyiHDp1445-zUMUmBIXBL0SPOa0pw5rRq0Xk8tOSjv2CYosiQ",
    imageAlt: "Bộ Hộp Doanh Nghiệp Sơn Mài Tri Ân",
    badge: "Quà Doanh Nghiệp",
    badgeClassName: "bg-secondary-fixed text-on-secondary-fixed",
    pricing: { mode: "quote", detail: "Từ 20 bộ", icon: "palette" },
  },
  {
    id: "heritage-birthday-tea-party",
    categorySlug: "sinh-nhat-su-kien",
    name: "Bánh Sinh Nhật Di Sản & Tiệc Trà",
    description: "Bánh kem thủ công tạo hình hoa sen di sản, phối thảo mộc kinh kỳ theo yêu cầu riêng.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6gtgBVnMEeIRb9LvWBqQUzuAp9WhK0N9SFA1Q1WNd3YTiaMWDyiNpThTsM0LAPywSvWEXzADzYhGxc6Gwc-gX24vHhdmqkVM8UnFjV2myVw8UGzTPTpAGM3cPEFZ3nBcELh0bRrQvOQaCTNCtgQmZalRb9IjIRTTAx4lz6XQCQS1rryzgugYlMg9YPXVFSqrhBS02gXtKR4mCjWnr0zb1yaxmGWI7V0jV9QSMIz3OFdbbZfR6-Xb_",
    imageAlt: "Bộ Sưu Tập Bánh Sinh Nhật Nghệ Thuật & Sự Kiện",
    badge: "Nghệ Thuật Sự Kiện",
    badgeClassName: "bg-surface-container-high text-primary",
    pricing: { mode: "quote", detail: "Đặt trước 24h", icon: "cake" },
  },
];

export function findCatalogCategory(slug: string) {
  return catalogCategories.find((category) => category.slug === slug);
}

export function findCatalogProduct(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}
