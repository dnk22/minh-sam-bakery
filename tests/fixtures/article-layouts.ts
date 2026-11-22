import type { ArticleLayoutDocument } from "../../src/article/contracts/article-layout.ts";

export const articleLayoutFixtures: ArticleLayoutDocument[] = [
  { key: "editorial", version: 1, data: { kind: "editorial", introduction: "<p>Hành trình <strong>nghề bánh</strong>.</p>", sections: [
    { id: "section-history", type: "section", title: "Khởi đầu", body: "<p>Ký ức bánh Việt.</p>", imageUrl: "/uploads/posts/khoi-dau.jpg", imageAlt: "Người thợ làm bánh", caption: "Gian bếp đầu tiên", imageSide: "left" },
    { id: "quote-craft", type: "quote", quote: "Mỗi chiếc bánh là một câu chuyện.", attribution: "Minh Sâm" },
  ] } },
  { key: "photo-story", version: 1, data: { kind: "photo-story", introduction: "<p>Một ngày trong xưởng bánh.</p>", chapters: [
    { id: "chapter-morning", heading: "Buổi sớm", body: "<p>Ánh sáng và bột mì.</p>", variant: "two-up", images: [
      { id: "image-flour", url: "/uploads/posts/bot-mi.jpg", alt: "Bột mì trên bàn", caption: "Chuẩn bị nguyên liệu" },
      { id: "image-oven", url: "https://cdn.example.com/oven.jpg", alt: "Lò bánh", caption: "Mẻ bánh đầu ngày" },
    ] },
  ] } },
  { key: "product-story", version: 1, data: { kind: "product-story", introduction: "<p>Món quà dành cho sum vầy.</p>", sections: [
    { id: "story-gift", type: "section", title: "Gói trọn tâm tình", body: "<p>Chọn nguyên liệu theo mùa.</p>", imageUrl: "/uploads/posts/hop-qua.jpg", imageAlt: "Hộp quà", caption: "Bộ quà Minh Sâm", imageSide: "right" },
  ], highlight: { title: "Hộp quà đoàn viên", description: "Thiết kế dành cho dịp sum họp.", imageUrl: "/uploads/posts/doan-vien.jpg", imageAlt: "Hộp quà đoàn viên", ctaLabel: "Khám phá sản phẩm", ctaHref: "/danh-muc/qua-tang/hop-qua-doan-vien" }, benefits: [
    { id: "benefit-craft", title: "Thủ công", description: "Hoàn thiện từng chiếc bánh." }, { id: "benefit-gift", title: "Tinh tế", description: "Bao bì phù hợp làm quà." },
  ] } },
];
