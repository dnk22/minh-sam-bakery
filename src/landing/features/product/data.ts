import { catalogCategories, catalogProducts } from "../catalog/data.ts";
import { merchandising } from "../catalog/merchandising.ts";
import { getProductById } from "../catalog/selectors.ts";
import { routes } from "../../lib/routes.ts";

import type {
  DetailCatalogProduct,
  FixedPriceProductDetail,
  ProductDetail,
  QuotationProductDetail,
} from "./types";

function requireCatalogProduct(slug: string): DetailCatalogProduct {
  const product = catalogProducts.find((item) => item.slug === slug);
  if (!product?.slug || !product.categorySlug) {
    throw new Error(`Missing canonical catalog product for detail slug: ${slug}`);
  }
  return product as DetailCatalogProduct;
}

const fixedCatalogProduct = requireCatalogProduct("banh-cookie-bo-hat-dinh-duong");
const quotationCatalogProduct = requireCatalogProduct("bo-hop-doanh-nghiep-son-mai-tri-an");

const fixedPriceProduct: FixedPriceProductDetail = {
  catalog: fixedCatalogProduct,
  categoryLabel: "Bánh Cookie",
  heroImage: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO_MFICp0cEDbob2CbDX4haTIZQFw_-tEyYNv9z3ybaDFFLEqtNp9DybL4jZoCclweMfoS3LUT2KdX-DrQEOlbac6PQMmvt0pk9NltpOlTbdOteA54M2gB8p04ygoNfHCRd4FHy4DESfKNRKiAgTlQ26ie6Q8Ag-6gCea3k1jCoTEL70OaGdzPWj_uIutxnJIRw77tig692vHzbpqg7D-pqDDz_T8wPV_S5KOeYrh_ZF6-6KnSkjR0",
    alt: "Bánh Cookie Bơ Hạt Dinh Dưỡng Minh Sâm trên đĩa gốm thủ công viền ánh kim",
  },
  gallery: [
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO_MFICp0cEDbob2CbDX4haTIZQFw_-tEyYNv9z3ybaDFFLEqtNp9DybL4jZoCclweMfoS3LUT2KdX-DrQEOlbac6PQMmvt0pk9NltpOlTbdOteA54M2gB8p04ygoNfHCRd4FHy4DESfKNRKiAgTlQ26ie6Q8Ag-6gCea3k1jCoTEL70OaGdzPWj_uIutxnJIRw77tig692vHzbpqg7D-pqDDz_T8wPV_S5KOeYrh_ZF6-6KnSkjR0", alt: "Toàn cảnh đĩa bánh cookie" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcD5RV4GtqFOAAHbDYmF0tuzxjSNqdnrW0cu_-DgdPUKGI78vWcAz1c4Awc4LsqV78iLT9nSDGVT_tgWrNOrj47-cOMY-T4xgu_ujfXffvvmi4TIk8OXTAIHpv3Hcnjlyy_BXOR078VLvukcmCk_fv6Cqhao3RwiP40Quo9U5-7p4plTycBn-TUDRg-oZt9YJFf2DbL0kAARsz2nFsUludur3DQiKQz079VjuOFAE", alt: "Cận cảnh kết cấu bột bơ Pháp và hạt điều" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMApEJNNg2igOKWvqnB7Q2u9-wworaEs4t3au65mOK0vxbkzEk-5PgEBTltGTBqAsfcRBt_Vi9z9UuEjJJicj29wYw-GFJ_FYw1uEplDmzxBR919RldlpkCngd9ta9KRfUexVwprUmsYRsNbQJob1-59tqiTejqlvRWK18l9AJWp1eguHImAMeG1xAZnNNJsHukfvXM9Q-SdQ1RNjTDtZQiFsEZj2xcpG3XydIdLs", alt: "Lát cắt mặt trong giòn xốp bùi béo" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6U7gUI7iPMNM4mW26BZuidtiYjcVjkoksBuca5fsLcSz-kXVf_IJY44ZCIgJtCKna10osyKdSk3HMY7i5SnJ0udTzzINAF_iQ6h1juGy0XYXidXSCXY6QZGqdHne4dwG035QpuGez6KrdLf7cWD0vVGFKtipi6sKyPBA7mCQrGKtbsbY2GM6SFUJknLRSZW12dUK0_J1QuhULFCLjYBe2kZQHmJgvcH02VqLz3S4", alt: "Bao bì hộp giấy gấm mạ kim" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYfcgSTJ7C-1s1sl8dvioAJ60zif4i57qjL3HWDHqScoya3k_9ze1UIlB5C7ttzI2Yw0WCqDdjxA6k7tpZlEtQQay_uhMao-2t_S3x2o1-Ax42sQsLUxs4utUFwW_MSaFs5rvPIxvaURXrAg_q_yEUnj5hI3iul1YgpGJuwkcTCeEDZCOpAadZp_494zU2G1ZjvXfcuMJx-nQZY-gtlfi-aBVYiFupEQMq4fR81AQ", alt: "Quy cách thưởng trà chiều tao nhã" },
  ],
  pricing: {
    mode: "fixed",
    variants: [
      { id: "standard-220g", label: "Hộp Tiêu Chuẩn 220g", price: 120000, currency: "VND" },
      { id: "premium-450g", label: "Hộp Thượng Hạng 450g", price: 235000, currency: "VND" },
    ],
  },
  presentation: {
    eyebrow: "DÒNG THƯỜNG NHẬT • BÁNH COOKIE THỦ CÔNG",
    priceUnitLabel: "/ hộp tiêu chuẩn",
    productionNote: "Mẻ nướng thủ công",
    availabilityNote: "Mẻ nướng sáng nay sẵn sàng",
    pairingEyebrow: "GỢI Ý KẾT HỢP HOÀN HẢO",
    pairingTitle: "Thức Trà & Hương Bánh Thường Nhật",
    pairingDescription: "Nghệ nhân Minh Sâm gợi ý thưởng thức bánh cookie bơ hạt cùng tách trà mộc thanh hương để tôn vị béo ngậy tao nhã.",
    trustBadges: ["100% bơ Pháp tự nhiên", "Đóng gói giữ nhiệt", "Đổi trả nếu hư tổn"],
  },
  complementaryProducts: [
    { eyebrow: "Trà Quán Cổ Truyền", title: "Trà Sen Tây Hồ Thượng Hạng", description: "Búp trà Tân Cương ủ trong nhụy sen Bách Diệp sớm hạ. Vị chát dịu, hậu ngọt sâu lắng.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZT3AFvx46Ih0q77NM0P4Re6VPtn3Kwpz0IugYlsQa92L48HJdwbM_has8CprEQRhF4DavoBqhsbeME9Pp9aQ-xVYO_FvmMPyrlpEbfqqjfKhvSOW3GTmfkotuGy4CpA4nbLSRY0b0fdudcY3xHx70r-6MRpCgRTMJu1iQHlYno6s9P_ie0oL5wIbti6pFqNi99NfmlhmdOA5UufKmBrBk4mytvgBEiWfxKmjj4y8", imageAlt: "Trà Sen Tây Hồ ướp bông tươi", badge: "Ướp Bông Tươi", price: "180.000đ / Hộp" },
    { eyebrow: "Điểm Tâm Mùa Vụ", title: "Bánh Mochi Gạo Nếp Hoa Vàng", description: "Vỏ nếp nương xay nước dẻo quánh, nhân đậu xanh sên đường phèn bùi thanh không gắt.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgbX7M50YF7tSb-ip60xe7faZG0I6g67GNJ_BK4TPUKT3jQI3mzCe_XvXTF_DmN9T_ma7LwxIogElQ7FHVn9yt1k8I5Owid1wfPdO7A4UAH4258nRI9DhyKlcg4finYdVPJtnfqUo6kJz7kRuO0BiuI1Uf08NzglmgjLhKT_YiLF2F9rf1WEwdipdtl0NvWHnAJaCS39bO36lGoyReEjS1jN2tbRD6QNLGTJQ6TZw", imageAlt: "Bánh Mochi Ngũ Sắc Thủ Công", badge: "Dẻo Thơm Mộc", price: "95.000đ / Khay" },
    { eyebrow: "Đặc Sản Cổ Truyền", title: "Bánh Nướng Cốm Non Sữa Dừa", description: "Vỏ bánh nướng vàng ruộm óng ả, quyện hương cốm non sữa và dừa nạo giòn sần sật.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-o1JJK5Hqb9Jo8jKvbg4GIaQFOj3mr6RNoQ-sEBww_jVtdIdhYTyMQXAIfick2jj0FW_5tkuOiN41JKPQRS2PaPRCKErHPxaJ2UioT-q10Xcs25ySB55626y5FKzmNlzaxIqqEbU3fKdaleMsgszIr9ZzOoE-t085LEkuiqrwkKByAq4XsbLx7Adw9tPkrvZJ4gOAQcJqRrgkCe05KBn8K8t9eSR1j4aIb7lFoZg", imageAlt: "Bánh Nướng Cốm Non Làng Vòng", badge: "Cốm Làng Vòng", price: "125.000đ / Hộp" },
  ],
  relatedProducts: [
    { eyebrow: "", title: "Bánh Chả Lá Chanh Giòn Rụm", description: "Thịt mỡ ủ đường phèn & lá chanh bánh tẻ", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADINwK6idzqCrpcv9syiuYrgzQSG_vjwhlHvV24Jb3-chB-LrFJSpc1a5WAM8u13musRS7ma9c2eUu6iO71HjKEGOQy7jgWt7jrL8yY2FIuwiz8o2ViWdRwy88U6osYz7JWeKJLj8Uc_v0dMiO3gmSnekPtv_gyDEMASH8DWwrXCSAz8w2blkJBRTOpf2VFPEVhzOEqmoEiqqdeAQ3r3v0gp2FAq3SFXUJjklSyGc", imageAlt: "Bánh Chả Nướng Lá Chanh Gia Truyền", badge: "Vị Phố Cổ", price: "85.000đ" },
    { eyebrow: "", title: "Cookie Bơ Matcha Vụ Xuân", description: "Bột matcha thượng hạng & bơ Pháp thơm ngậy", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwfCf3UrMrH2lmScr_nEv6xAWZmRh14bgn-2Aq5afwlVyuXQSdODsJ3cgHbA8OAoNCMr7gBc_jt-zGekFZ9SqwzsOxA5dQWlVFhZvKfqEgWMFV6DJ4Dnel28EvdwwIkKHtsdbAzv8yvfwfR6fNWKIH0d1Jg1iJR76ah24NXcMq88mnLvaPtloNEIC4ZffM8YeLTbtuiIgM9gjLotor8nkdPqYbZJrpf_GeGTfPv0g", imageAlt: "Bánh Quy Bơ Matcha Trà Xanh", badge: "Thanh Tao", price: "135.000đ" },
    { eyebrow: "", title: "Bánh Đậu Xanh Sấy Than Củi", description: "Đậu xanh tiêu xay mịn, tan ngay đầu lưỡi", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9FuX-oQDxR82WxrL-HCYw8Otjxtdq0TzOlJjkKfAKnUFnnHyZuLhD7brdP-Kk8kgSPiHeEvAs4kJG-sFOwvYFpCzcu0zvGQOSlp0MEfQ4qbwr1YzVv_FvwlZvMKafFDvM-MFnARHFVKYO7ZB_l6zo6y53CAr0sMU8gl7S7VPuznagtSwYvtnzYbB7QdEn_sRERx4dAhvyf3f0M-2vaGXP6givLCuAwG3_0ZC1pHA", imageAlt: "Bánh Đậu Xanh Nướng Mộc", badge: "Ngọt Dịu", price: "110.000đ" },
    { eyebrow: "", title: "Bánh Hạt Dẻ Rang Muối Mộc", description: "Vỏ ngàn lớp mỏng tang, nhân hạt dẻ bùi ngậy", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOeT5V5jJN1NYunidbuJUqLrKbJ-01tLjqROHnoe7uHqaP2f6wlpXurvhHcvA4IAvtLDYf42K0PPPCHSwLb0qYfQi1O4-e1xq85f6r4TS_L_pqCf0pV3TElpphR60_tCVipIWbgzL1dxxEwkOXtLZu-A6CmqwwnyGtQal1il9PYRrdrtISsMjSHSCRwfLD0JBD64Xaoso7d_cndZ6JJqg2AF8HaA5PrDaHAqrhXRc", imageAlt: "Bánh Hạt Dẻ Trùng Khánh Nướng", badge: "Hạt Mùa Thu", price: "145.000đ" },
  ],
};

const quotationProduct: QuotationProductDetail = {
  catalog: quotationCatalogProduct,
  categoryLabel: "Quà Tặng Cá Nhân & Doanh Nghiệp",
  heroImage: { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuANXCGZO10N8Bv89RZKVXpoB2x-mG1NGj96hCuS6lqgZBeJjfvxwltRcUNcS8ZcI6hy0_I90VDJw3CAfwcATiRKgFRA2oOR6AT4DmFcLOGG3j4p3ergxHX_nux1o3_9y3wm2Gf-h-DBxeFW-h0gelSaPGYsgHIZzGYXT5s9cui0MOeZagd22R4JtDIwfBxAmavoqKVDeG-A7jGAa5dV-IjimsHoWd7no3QuVZCVB7o", alt: "Bộ hộp quà doanh nghiệp sơn mài đỏ khắc kim" },
  gallery: [
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvAe_dAgsvNlVf5v4pXVkX0ZRvPj6JnO4MvQUShl0jEL6pCwvCSkpR326IeNs4XiLpOjusnLqmzkZrY6UhSHRnSp7hauLKN1c4Xx5X4uiamGIN8_7Y2yGqnG56mbEhpc9-NybFmhbO-M7hS6k1s8gtit7j70NF0JJd7x03z7_2ZY_ZtN_PmqEhvqGyvfXcpt8YOakN7YBwQUZOItr84tYLdtpEPhkuSiT7AsyL_Ok", alt: "Cận cảnh hộp quà sơn mài đỏ với hoa văn dát vàng" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFUfjc_eplZ7GqbtkWTdHFzOdjXV_c1byezd7EBVL39TLe2vkWjr_9_wfpK3lwxJsX3R_r6vNtxRsAse__jNSNit2epssGQsz3gSfv2y0t-pU2BQs7nJTV5jIfQNHw6QympI18lq5o8wlVhN8Nf15JMFX7-cQzFiHsYU89UGlg02U-BYxYsi8-AUBsg_NK6EjmTLp-oRmZgWBOYZLuLuADhD05tM_krnGRAVkab0Q", alt: "Hộp quà mở với bốn bánh di sản và trà Shan Tuyết" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-1i2tuOUTlseocjwD__J-5ZFhQ_JC4ZjKBDwDQoTwjlwSIZfUYjYvYTYyzrAzCY43FuXnXX8PbooBnXx9xE2exaARSf9CADLLDxvGY9tsQc3bvA12GL1o66jDldHr29KRMzaHaAyebjZ3MKX8E3dz6Vcox-VNme_ubldZpTzCHopZN_3llCOwZmSs7J6wg93geXMY1tG4VXxKIblK9uiBEjTOKPNYNxSUjZjV-ps", alt: "Chi tiết logo doanh nghiệp ép kim trên nắp hộp" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuACwkClAdbErGpM6MEaHZD-WdTlHCvrZi-iK2Pt42HbLsqiLLOmjLpFxb7JZeqAcfb2SnAPF8It7ey_71Apn-TGFZS5izkPZ5mc0769cehGxPhv7RIpCcw4Wa4TDAkwDim9c8cnZoJysa142T7LF26FdU35plI1wnKbx0goWAyb2nX5OFdiUYjZ1tyk_AESs7gk8rc0RQhFrXe0x8jq85xomnOpQ7RMU-UXdvY6zZE", alt: "Thiệp giấy Dó viết tay và túi gấm" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7ePbgQDcShz3hgEj95vVovFnlt2QMQQNRfpY47UayufshqI0rTSsTiOieWLXfGjuE_U4yD7x-YnkeNWVLAuYS3JSesUjb95w7JL-pwZiPXc-s1Lgu1j0uk8IYDXtrdK-HomUbW3axXByGS-OZfMjk5DfaSAEvTfRKdErqYRGmbIAk5BpSEe7LG2pw5AMagjNZ38wtJGu2sBgj8TEfN4IYP7OdMaJhkrZ4DdxxvNU", alt: "Toàn bộ quy cách hộp quà doanh nghiệp" },
  ],
  pricing: { mode: "quote" },
  presentation: {
    quotationProfile: "corporate-gift",
    eyebrow: "DỊCH VỤ QUÀ TẶNG DOANH NGHIỆP & SỰ KIỆN CAO CẤP",
    specificationEyebrow: "Quy Cách Chuẩn Phẩm B2B",
    pricingExplanation: "Giá và phương án đóng gói sẽ được tư vấn theo số lượng, quy cách và yêu cầu cá nhân hóa của bạn.",
    serviceBenefits: [
      { icon: "package", title: "Số lượng linh hoạt", text: "Tư vấn quy cách theo nhu cầu của từng chương trình" },
      { icon: "gift", title: "Tư vấn đóng gói", text: "Lựa chọn hộp, phụ kiện và thiệp theo phương án quà tặng" },
      { icon: "brush", title: "Cá nhân hóa theo nhu cầu", text: "Trao đổi phương án nhận diện phù hợp với sản phẩm" },
    ],
    drawerFooter: "Trao đổi về số lượng, ngày nhận và nhu cầu cá nhân hóa.",
    collectionTitle: "Các mẫu quà tặng doanh nghiệp khác",
    experienceTitle: "Hoàn thiện món quà của bạn",
    experienceDescription: "Các thức quà phong vị bổ trợ được tuyển chọn để hoàn thiện phương án quà tặng.",
    mobileLabel: "Quà Tặng Doanh Nghiệp",
  },
  specifications: [
    { label: "Kích thước hộp:", value: "36cm x 24cm x 11cm" },
    { label: "Chất liệu thân hộp:", value: "Gỗ tự nhiên sơn mài 7 lớp" },
    { label: "Thành phần ẩm thực:", value: "4 Bánh di sản (180g) + 1 Hũ trà cổ thụ" },
    { label: "Thời hạn bảo quản:", value: "25 ngày (Bánh tươi không chất bảo quản)" },
    { label: "Phụ kiện đính kèm:", value: "Túi gấm quai da, thiệp Dó, dao cắt gỗ" },
    { label: "Chứng nhận ATVSTP:", value: "Đầy đủ kiểm nghiệm & COA từng mẻ" },
  ],
  addons: [
    { eyebrow: "Danh Trà Thượng Hạng", title: "Trà Shan Tuyết Cổ Thụ Suối Giàng", description: "Búp trà bọc tuyết trắng từ cây trà cổ thụ hơn 300 năm tuổi, nước vàng óng, hậu vị ngọt sâu lưu luyến.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUn-Io3F6Fqigem-CnC7LUt8x2KieEWathhSvuLa5dlvW8QEZgZEqMEFsslVOzuojjbE7LSL_kwX1_a6BY_ryVypg54OnblTZVpI681_EJFayrrn3KBVTIKwH9JuuZU4s32rLFMHcwqK_vrE074W3STe1Dmz0WFMd42CaXPao9WPsymJGgeNYomjhJDecRIfKireMmZcvLaCMRf5bo9-Q6ViVPGJDwIY6v5IpCAyk", imageAlt: "Trà Shan Tuyết cổ thụ trong hộp gốm", meta: "Đã bao gồm hộp gốm" },
    { eyebrow: "Mỹ Tửu Truyền Thống", title: "Rượu Mơ Má Đào Yên Tử Ủ Chum", description: "Ủ thủ công cùng mật mía và thảo mộc tự nhiên hơn 24 tháng, vị ngọt êm dịu thanh mát cho bàn tiệc sum vầy.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDJCttj39J5BhQxEiWQ-EsPtCfNYDenxqyZrjzDbTeXNYZfj2U1B3TIDj-4ClyEmQ3cCKsUFXq4eXhjgGohljKdniHz2eru4FmPzQa4-8g0Gv3cOriQtQPpIQO-9G0K5WPZAp834C6FkeKRMpmdCpH2VDZC5v5Gt4o0TGj2qh-gmb7J6-ewGj9rfRxer_8waEEXdsI6r8BUsiBlKKReYmk25XdkcWNG8p6nEAZtz0", imageAlt: "Rượu mơ Yên Tử trong chai gốm thủ công", meta: "Chai gốm 500ml" },
    { eyebrow: "Gốm Sứ Nghệ Nhân", title: "Bộ Chén Trà Men Rạn Tràng An", description: "Chế tác độc bản bởi nghệ nhân làng nghề, men rạn ngọc cổ kính nâng tầm nghi thức thưởng trà ẩm thực.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQM6kpofR4QU5ECY3OslhSKoUWd_MWP-O8OHsIl0j5mimdakYRVqQ8Scm0CqktaWmG71iBG20yPGMsuTrOX1jSMS-T37tALsB5bEGQRj4zy_7toqaC-5VJszO_uVL3T699hYlv98k4CHESPiLFGB3NuCDcR0nlyCM_zUbM4FeSZHfANAqnYLrJeenI4mbTAak8nNlC7RVbqiNAjIUfU2L06idch6m6sXhGuGA84nI", imageAlt: "Bộ chén trà men rạn thủ công", meta: "Bộ 4 chén kèm khay" },
  ],
  alternatives: [
    { eyebrow: "SET B2B 02", title: "Hộp Quà Di Sản Đoan Viên", description: "Hộp gỗ khảm trai kết hợp 6 thức bánh di sản, đi kèm hũ mứt sen trần Bách Diệp Tây Hồ.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGk3PfwxKsqNPl71poEuFw59pXciAQVCDxt5YtpylKilwZom9y5He5HT0UKMFSxWw67J_dlMrwh6RcmlrHLYWm5UF6eyjKGCpNZ0Q_5ZVuLRKTMQqhzRAiUOy8YHsxj1EwhMKZEhKNvG2q6o-M9_drHQr9X1GwbB4uMasSj4zDhJOGeKwS37wdBhPbImTo-yQ5nNhxV4MapKgq7xDWUV_XaOW6d2f6AWJ9dmZbUc", imageAlt: "Hộp quà sơn mài xanh ngọc", badge: "Dòng Đẳng Cấp", meta: "Báo giá theo số lượng" },
    { eyebrow: "SET B2B 03", title: "Hộp Gỗ Khắc Hoa Sen Cổ", description: "Gỗ óc chó chạm khắc hoa sen trang nhã, thích hợp đối tác quốc tế yêu chuộng sự tinh mộc.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKgeLmkLgyWAOVd_4bEeERWe75puJoTltszKdvSjarMDmOfxbNRRgQVhnzxUxNNIm80SbOeEMDiPWzTUMTL25bFtqrG04Wyrbn8eHijJ5GqO7PCI4OGOxIW1CjxE7Y3SjL0EsgortMdNKUm0M9hTjtmKezPNprbafmS_e5zB0The5hZeYwnhpzpOYdUAp2194dKutnBzlSSAKOCw0j8Ka9nYumILA2WjPxH4bUoBU", imageAlt: "Hộp quà gỗ óc chó khắc hoa sen", badge: "Dòng Mộc Tự Nhiên", meta: "Báo giá theo số lượng" },
    { eyebrow: "SET B2B 04", title: "Set Quà Mộc An Thư Viện", description: "Quy cách thanh nhã, tối ưu chi phí cho các hội nghị quy mô lớn trên 200 nhân sự và khách mời.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_D9BYh3u1KS-uP-6AGWYWaUQv5bn1ofmpV9g_3UzRsJzvXJotTK4t0pM-ntrv8wHxzo10k_Su9QerVlk3ytbR1Pvwu-IiuK4PyrjXj7FsCZzpH09mg99axfHDCcf182vcEom2mmMsIYsr4Q2GMuI1sn8_lGL43hsNz808IInWVzCry-6lFWsCRIWn1m5oXMUhX_64oCGYX2GFIBsezxB5Vnwwalf-ldLK7JGKRjI", imageAlt: "Hộp quà giấy cứng màu ngà", badge: "Dòng Tiêu Chuẩn", meta: "Báo giá theo số lượng" },
  ],
};

function categoryLabel(slug: string) {
  return catalogCategories.find((category) => category.slug === slug)?.name ?? slug;
}

function repeatedGallery(product: DetailCatalogProduct) {
  return Array.from({ length: 5 }, (_, index) => ({
    src: product.image,
    alt: `${product.imageAlt} — ảnh minh họa lặp ${index + 1}/5`,
  }));
}

function productCard(productId: string) {
  const product = getProductById(productId);
  if (!product) throw new Error(`Missing merchandising product: ${productId}`);
  return {
    productId: product.id,
    href: routes.product(product.slug),
    eyebrow: "",
    title: product.name,
    description: product.description,
    image: product.image,
    imageAlt: product.imageAlt,
    badge: product.badge,
    price: product.pricing.mode === "fixed" ? product.pricing.price : "Báo giá theo yêu cầu",
    meta: product.pricing.mode === "quote" ? product.pricing.detail : product.pricing.unit,
  };
}

function uniqueRecommendations(preferredIds: readonly string[], productId: string, mode: "fixed" | "quote", count: number) {
  return [...preferredIds, ...catalogProducts.filter((item) => item.status === "published" && item.pricing.mode === mode).map((item) => item.id)]
    .filter((id, index, ids) => id !== productId && ids.indexOf(id) === index)
    .slice(0, count);
}

function createDetail(product: DetailCatalogProduct): ProductDetail {
  const gallery = repeatedGallery(product);
  if (product.pricing.mode === "fixed") {
    const relatedIds = uniqueRecommendations(merchandising.relatedFixedProductIds, product.id, "fixed", 4);
    return {
      catalog: product,
      categoryLabel: categoryLabel(product.categorySlug),
      heroImage: { src: product.image, alt: product.imageAlt },
      gallery,
      galleryStrategy: "repeated-mock",
      pricing: { mode: "fixed", variants: product.pricing.variants.map((variant) => ({ id: variant.id, label: variant.label, price: variant.amount, currency: variant.currency })) },
      presentation: {
        eyebrow: `DÒNG ${categoryLabel(product.categorySlug).toLocaleUpperCase("vi")} • SẢN PHẨM MINH SÂM`,
        priceUnitLabel: product.pricing.unit,
        productionNote: "Phiên bản minh họa",
        availabilityNote: "Vui lòng xác nhận trước khi đặt",
        pairingEyebrow: "GỢI Ý THƯỞNG THỨC",
        pairingTitle: `Thưởng thức ${product.name}`,
        pairingDescription: `Các gợi ý đi kèm được trình bày theo phong vị của ${product.name}; thông tin bán hàng cần được xác nhận trước khi đặt.`,
        trustBadges: ["Nguyên liệu tuyển chọn", "Đóng gói cẩn thận", "Thông tin demo"],
      },
      complementaryProducts: fixedPriceProduct.complementaryProducts,
      relatedProducts: relatedIds.map(productCard),
    };
  }

  const customEvent = product.pricing.quotationProfile === "custom-event";
  const alternativeIds = uniqueRecommendations(merchandising.alternativeGiftProductIds, product.id, "quote", 3);
  return {
    catalog: product,
    categoryLabel: categoryLabel(product.categorySlug),
    heroImage: { src: product.image, alt: product.imageAlt },
    gallery,
    galleryStrategy: "repeated-mock",
    pricing: { mode: "quote" },
    presentation: {
      quotationProfile: product.pricing.quotationProfile,
      eyebrow: customEvent ? "BÁNH THIẾT KẾ THEO YÊU CẦU CHO SINH NHẬT & SỰ KIỆN" : "DỊCH VỤ QUÀ TẶNG THEO YÊU CẦU",
      specificationEyebrow: customEvent ? "Thông Tin Thiết Kế Dự Kiến" : "Quy Cách Quà Tặng Dự Kiến",
      pricingExplanation: customEvent ? "Giá được tư vấn theo quy mô bánh, phong cách trang trí và yêu cầu của sự kiện." : "Giá và phương án đóng gói được tư vấn theo số lượng, quy cách và nhu cầu cá nhân hóa.",
      serviceBenefits: customEvent
        ? [{ icon: "package", title: "Thiết kế theo dịp", text: "Trao đổi phong cách và quy mô phù hợp với sự kiện" }, { icon: "gift", title: "Tư vấn trình bày", text: "Gợi ý bố cục bánh và bàn tiệc trong phạm vi demo" }, { icon: "brush", title: "Cá nhân hóa", text: "Điều chỉnh màu sắc và thông điệp theo yêu cầu" }]
        : [{ icon: "package", title: "Quy cách linh hoạt", text: "Tư vấn lựa chọn theo nhu cầu chương trình" }, { icon: "gift", title: "Tư vấn đóng gói", text: "Phối hộp và phụ kiện theo phương án quà tặng" }, { icon: "brush", title: "Cá nhân hóa", text: "Trao đổi phương án nhận diện phù hợp" }],
      drawerFooter: customEvent ? "Trao đổi về quy mô, ngày tổ chức và mong muốn thiết kế." : "Trao đổi về số lượng, ngày nhận và nhu cầu cá nhân hóa.",
      collectionTitle: customEvent ? "Các sản phẩm đặt theo yêu cầu khác" : "Các mẫu quà tặng khác",
      experienceTitle: customEvent ? "Gợi ý cho bàn tiệc của bạn" : "Hoàn thiện món quà của bạn",
      experienceDescription: customEvent ? "Các lựa chọn bổ trợ được trình bày để trao đổi khi tư vấn sự kiện." : "Các thức quà phong vị bổ trợ được trình bày để hoàn thiện phương án quà tặng.",
      mobileLabel: customEvent ? "Sinh Nhật & Sự Kiện" : "Quà Tặng Theo Yêu Cầu",
    },
    specifications: customEvent
      ? [{ label: "Loại yêu cầu:", value: "Sinh nhật hoặc sự kiện" }, { label: "Quy mô:", value: "Xác nhận khi tư vấn" }, { label: "Phong cách:", value: "Thiết kế theo yêu cầu" }, { label: "Ngày nhận:", value: "Xác nhận khi tư vấn" }]
      : [{ label: "Quy cách:", value: "Xác nhận khi tư vấn" }, { label: "Thành phần:", value: "Phối theo phương án đã chọn" }, { label: "Cá nhân hóa:", value: "Theo yêu cầu phù hợp" }, { label: "Ngày nhận:", value: "Xác nhận khi tư vấn" }],
    addons: quotationProduct.addons,
    alternatives: alternativeIds.map(productCard),
  };
}

const productByName = new Map(catalogProducts.map((product) => [product.name, product]));
const linkCards = (cards: typeof fixedPriceProduct.relatedProducts) => cards.map((card) => {
  const product = productByName.get(card.title);
  return product ? { ...card, productId: product.id, href: routes.product(product.slug) } : card;
});

fixedPriceProduct.relatedProducts = linkCards(fixedPriceProduct.relatedProducts);
quotationProduct.alternatives = linkCards(quotationProduct.alternatives);

const preservedIds = new Set([fixedPriceProduct.catalog.id, quotationProduct.catalog.id]);
const generatedDetails = catalogProducts
  .filter((product): product is DetailCatalogProduct => product.status === "published" && !preservedIds.has(product.id))
  .map(createDetail);

export const productDetails: ProductDetail[] = [fixedPriceProduct, quotationProduct, ...generatedDetails];

export function findProductDetail(slug: string) {
  return productDetails.find((product) => product.catalog.slug === slug);
}

export const getProductDetailBySlug = findProductDetail;

export function getRelatedProducts(productId: string) {
  const detail = productDetails.find((item) => item.catalog.id === productId);
  if (!detail) return [];
  return isQuotationProduct(detail) ? detail.alternatives : detail.relatedProducts;
}

export function isQuotationProduct(product: ProductDetail): product is QuotationProductDetail {
  return product.pricing.mode === "quote";
}
