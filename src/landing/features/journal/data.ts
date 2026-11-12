import type { JournalArticle, JournalTopic } from "./types";
import { routes } from "@/landing/lib/routes";

const images = {
  gift: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4mdErU6r-RaTos9-YqyolB8WSinJR-UTfAsbxPmnsKieX7aAYOOzt_jfTaYMA__1xd6-h8uw42wqH-s_-OWXaALkgC0byOq00NDI7ic4weEl8OnYvPmB2gEOUcbgx32EXpx9wBPQ5d52jkZCoudR6hoQFiREBWWQxY1qy1FeBTkXwdAqYf-5YFGTPxhVOUuWOvx64rj8lZDnBs2Su6FCLOPSz4gMlcBWBAq_r_O8",
  tea: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFqDH3azHZXcKXumANZa8MaxVstc4fhCT4qSMTiUKiH9VwNTYCag3W4ZzP1J_fI8T-NH4xr7aMOsBbLEXcDnR-x44V2EgJ3HgRcsUGIItpc2dD5UftU6QxZM9RZkKN86RwooW5c-ahEhRCFhxTfJxYnVLbqeNV-hSXoHbwjMMClsi4UjnT943VNmYCGPbPpHLdB2uATAh5kGDOPLG1C_aNiA9aSLtB1fkpUox86VE",
  artisan: "https://lh3.googleusercontent.com/aida-public/AB6AXuBopJZXNoAWo2ZeB9vaKBbF3Q3iUeUZ2J00AntRLQJTdV7SPr5S-GfDiP5BMCiRrB_-EDe77oERPBQuyuhDllLKdPSsgxX3TtXryCwDqtfSE0ayGMErzwNCkq4QYHTNjukgB-mLM2mtoTEQ9aAItxDiqGw8b9froZpiH8ZiMRJB25UoelkQhxhdzZ2Xl00YYF4AnGa4LVjAkzBWLaWV6gcLOq0PcS9_d4r2cuWvzgdgdxKnx4NOyhET",
  tet: "https://lh3.googleusercontent.com/aida-public/AB6AXuCebLn7NzNeyfYlnOZYZqkDmqhk4jsjI_DWzPkxHdFCRSm8adorJyXKtyLyLfeQWNnEb7ZmTFpPV8PyUc2vI7XVXfZ4aJz5qjPy0xadCz1hVJXpAqykUJeFGIMKLArwbRptwpM_Mx8-ETO6OAaUyrX8b7izuYd6keAugTXNG5xG-zX84NGciIC4Yam8Zm5hI590PU7XV6nG2lzmIkJlhETJZjVqUPLb76IdYLftRJ1HwGLu1ZAIAeou",
  mochi: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrkcAQU-H4zrQSZc_d4FZ_sdKX6wMi6UVahlv_tCMuOsdY5ynFFLtwG7tlbP8emiS5LN9tVjRv_6Ic2kFlblNpLKNxl7z-nsRDuJ4VNQWjU_heQpz2qoNrtEYujlQ9RYaaC7pLoOQg0ANdPWzMh-YDZA6bN5ylZmpeH9CcCjOkUPtvF68jZ1An5E3MnDU8y1TC6QEXxMSj83mN7Z-VSt3S1ZSCeznRY4k_phEKajcq8h_asJ0dFpW-",
  mooncake: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyj7zSwZ4aCu84aHTtPi5nDCxC_Gjscupmz7Fz1ZYV3HX7F9Rq12yjxt714FccdlhdTEUIKVXiYgcP7if5qEit1oPRpVzDX3x9UceC-NwNvLJovxr5RhtIjLxEreiRCQN9S5VobGafGH9VSS5j7IDBnKIOvX7L7WIP8TIbuLjNz1Mi5heZmbwOmETPZqwZ3Gs-NwZ5VGTv7WyuArlG4AhX3JNs6RRwKQp8XBgf_m-k4lojQnh_m2Cu",
  feast: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgLZC1gzmaKYulHW9-Kd-msfIgXX69bcraeSMBzCzQfNphrv7_uX_KU-0wzB3udSUhIwRE02FZo9bI3inKl2XCa4I0e5VvmgH1t5v8Lz4xalYotJKKe5pp6v8DiOav5YTLcUqIe0qAd3iwiN75xYihoQ5FCS4uLg3mz_kvh2YDNsXQIIaAXJ6rVEnKSAcbNB4yKuKC_eKPQE3G6Dy05wYUIb5N79h9cO5PdJH3ZDA",
} as const;

export const articles: JournalArticle[] = [
  { id: "gift-guide", slug: "chon-qua-banh-dip-sum-vay", listingTitle: "Chọn quà bánh thế nào cho những dịp sum vầy đầu năm?", listingExcerpt: "Một món quà phù hợp không chỉ nằm ở hình thức tao nhã của lớp sơn mài dát vàng, mà còn ở sự thấu hiểu người nhận, phong vị thảo mộc thanh tao và ý nghĩa trọn vẹn của từng dịp trao tặng trong văn hóa Tràng An ngàn năm văn vật.", detailTitle: "Chọn quà bánh thế nào cho những dịp sum vầy?", category: "Cẩm nang chọn quà", excerpt: "Một món quà tinh tế không chỉ nằm ở vẻ ngoài trau chuốt, mà còn ở sự thấu hiểu người nhận, tôn vinh phong vị truyền thống và gửi gắm trọn vẹn tấm chân tình trong từng khoảnh khắc đoàn viên thiêng liêng.", coverImage: images.gift, imageAlt: "Hộp quà sơn mài Minh Sâm bên ấm trà", publishedAt: "15 Tháng 1, 2026", readingLabel: "6 phút đọc", author: "Minh Sâm Editorial", fullArticle: true },
  { id: "tea-culture", slug: "thuong-banh-cung-tra-thang-long", listingTitle: "Thưởng bánh cùng trà — một nét đẹp của những buổi hàn huyên Thăng Long", category: "Văn Hóa & Nghệ Thuật", excerpt: "Trà ướp búp sen ngậm sương đêm kết hợp cùng miếng bánh dẻo thoảng hương hoa bưởi thanh khiết, mở ra không gian đàm đạo hoài cổ.", coverImage: images.tea, imageAlt: "Nghi thức thưởng bánh cùng trà", publishedAt: "12 Tháng 1, 2026", readingLabel: "4 phút đọc" },
  { id: "artisan-hands", slug: "doi-ban-tay-nguoi-tho", listingTitle: "Một chiếc bánh ngon bắt đầu từ sự tỉ mỉ của đôi bàn tay người thợ", category: "Nghệ Nhân Bánh", excerpt: "Gặp gỡ nghệ nhân với hơn 30 năm lưu giữ khuôn gỗ thị và kỹ thuật ngào đường phèn không phụ gia của gia tộc Minh Sâm.", coverImage: images.artisan, imageAlt: "Bánh thập cẩm nghệ nhân Minh Sâm", publishedAt: "08 Tháng 1, 2026", readingLabel: "5 phút đọc" },
  { id: "tet-modern", slug: "huong-vi-tet-trong-nhip-song-hien-dai", listingTitle: "Hương vị Tết cổ truyền trong nhịp sống hiện đại Tràng An", category: "Mùa Lễ Hội", excerpt: "Khi phố phường nhộn nhịp hối hả, mâm bánh Tết với sắc đỏ sơn mài, vị mứt quất thanh ngọt và hương hoa bưởi vương vấn vẫn luôn là cầu nối thâm tình sưởi ấm những ngày đoàn viên đầu xuân của người Hà Nội.", coverImage: images.tet, imageAlt: "Mâm bánh Tết cổ truyền và hộp quà Minh Sâm", publishedAt: "18 Tháng 1, 2026", readingLabel: "7 phút đọc" },
  { id: "lotus-seed", slug: "hat-sen-tay-ho-com-lang-vong", listingTitle: "Hạt sen Tây Hồ & cốm mộc làng Vòng: Tinh hoa trong từng thớ nhân", category: "Nguyên Liệu", excerpt: "Hành trình tuyển chọn những hạt sen bùi ngậy và cốm non ngậm sương xứ Đoài để dệt nên vị ngọt thanh không gắt.", coverImage: images.mochi, imageAlt: "Bánh mochi nếp dẻo nhân cốm làng Vòng", publishedAt: "14 Tháng 1, 2026", readingLabel: "5 phút đọc" },
  { id: "tea-temperature", slug: "nhiet-do-u-tra-sen-thuong-banh", listingTitle: "Nhiệt độ hoàn hảo để ủ hương trà sen và thưởng thức bánh nướng", category: "Thưởng Vị", excerpt: "Bí quyết căn chỉnh ngọn lửa, nguồn nước giếng ngọc và độ ấm 85 độ C giúp hương trà hòa quyện trọn vẹn cùng lớp vỏ nướng vàng ươm.", coverImage: images.mooncake, imageAlt: "Bánh hạnh nhân nướng mộc mạc Minh Sâm", publishedAt: "10 Tháng 1, 2026", readingLabel: "4 phút đọc" },
  { id: "wooden-molds", slug: "khuon-go-hoa-sen-thang-long", listingTitle: "Hành trình tìm lại những chiếc khuôn gỗ khắc hoa sen Thăng Long", category: "Ký Sự Nghệ Nhân", excerpt: "Chuyện người nghệ nhân mộc bản cuối cùng của phố cổ với những đường đục tinh xảo gìn giữ hình hài chiếc bánh truyền thống.", coverImage: images.artisan, imageAlt: "Bánh thập cẩm nghệ nhân Minh Sâm", publishedAt: "10 Th1, 2026", readingLabel: "8 phút đọc" },
  { id: "modern-mochi", slug: "banh-deo-duong-dai-vi-ngot-ban-dia", listingTitle: "Bánh dẻo đương đại: Khi tinh hoa Á Đông hòa cùng vị ngọt bản địa", category: "Nghiên Cứu Phong Vị", excerpt: "Khám phá sự giao thoa mềm mại giữa nghệ thuật bánh thủ công và nguồn nguyên liệu sen nhài tự nhiên xứ Bắc.", coverImage: images.mochi, imageAlt: "Bánh mochi ngũ sắc hoa quả Minh Sâm", publishedAt: "05 Th1, 2026", readingLabel: "5 phút đọc" },
  { id: "three-regions", slug: "mam-co-tet-ba-mien", listingTitle: "Mâm cỗ Tết ba miền và những phong vị bánh ngọt không thể thiếu", category: "Văn Hóa Ẩm Thực", excerpt: "Ý nghĩa biểu tượng của từng thức bánh ngọt trên bàn thờ gia tiên ngày đầu năm mới của người Việt khắp ba miền.", coverImage: images.feast, imageAlt: "Mâm cỗ Tết truyền thống", publishedAt: "28 Th12, 2025", readingLabel: "7 phút đọc" },
  { id: "young-rice-seasons", slug: "huong-com-moc-lang-vong-mua-banh-giao-thoi", listingTitle: "Hương cốm mộc làng Vòng trong từng mùa bánh giao thời", category: "Chuyện Bánh & Hương Vị", excerpt: "", publishedAt: "", readingLabel: "" },
];

export const seasonalStories = [
  { edition: "ẤN BẢN 01", title: "Tết và những hương vị sum vầy: Ký ức bếp than hồng phố cổ", excerpt: "Nhớ về những chiều ba mươi Tết, cả gia đình quây quần quanh nồi bánh chưng, mùi khói thơm quyện cùng vỏ quýt nướng và tiếng cười trẻ thơ.", action: "Đọc câu chuyện ký ức" },
  { edition: "ẤN BẢN 02", title: "Nghệ thuật chọn hộp quà mạ vàng tri ân đối tác đầu năm", excerpt: "Khám phá quy chuẩn quà tặng ngoại giao và cách kết hợp các vị bánh mộc thanh cùng thiệp chúc thủ bút theo phong cách thượng lưu Hà Nội xưa.", action: "Tìm hiểu quy chuẩn" },
  { edition: "ẤN BẢN 03", title: "Bánh khảo, mứt sen và mâm cỗ ngọt truyền thống người Tràng An", excerpt: "Ý nghĩa biểu trưng của năm vị ngọt ngũ hành trên ban thờ gia tiên ngày mùng một: mong ước an khang, hòa thuận và thịnh vượng bền lâu.", action: "Khám phá phong tục" },
];

export const popularStories = [
  { category: "Bảo Quản & Thưởng Vị", views: "8.4k lượt đọc", title: "Bí quyết bảo quản bánh hạt và bánh cookie giữ trọn độ giòn tự nhiên không chất bảo quản", excerpt: "Phương pháp đóng gói chân không kèm gói hút ẩm thảo mộc và cách ủ lò 3 phút trước khi thưởng thức lại để phục hồi mùi bơ thơm lừng." },
  { category: "Mỹ Học Cổ Truyền", views: "6.9k lượt đọc", title: "Ý nghĩa biểu tượng hoa sen và chim hạc trên hộp quà sơn mài Minh Sâm", excerpt: "Nghiên cứu họa tiết mỹ thuật thời Lê - Nguyễn được điêu khắc thủ công tinh xảo trên từng nắp hộp quà gỗ mạ vàng son." },
  { category: "Chuyện Bếp Cũ", views: "5.8k lượt đọc", title: "Hành trình 15 năm tìm lại công thức mứt quất và vỏ bánh nướng gia truyền xứ Kinh Bắc", excerpt: "Những chuyến đi ngược dòng lịch sử tìm về các làng nghề cổ truyền để khôi phục men đường thảo dược đã thất truyền." },
  { category: "Nghệ Thuật Tiệc Trà", views: "5.1k lượt đọc", title: "Gợi ý phối hợp các loại bánh ngọt thanh trong tiệc trà thân mật tại tư gia", excerpt: "Trình tự sắp xếp từ vị trà mộc thanh đạm đến bánh nướng béo bùi hạt dưa, hạt sen tạo nên một bản hòa tấu phong vị trọn vẹn." },
];

export const journalTopics: JournalTopic[] = [
  { number: "01 / Ký ức", label: "Ký ức", title: "Câu chuyện Minh Sâm", description: "Gìn giữ ký ức, gia bảo mộc bản và triết lý làm bánh từ tâm thức xưa.", count: "0 bài viết", icon: "history" },
  { number: "02 / Thưởng vị", label: "Thưởng vị", title: "Văn hóa & Nghệ thuật", description: "Nghệ thuật ủ hương trà sen, thưởng bánh thanh vị và lễ nghi giao đãi.", count: "2 bài viết", icon: "tea" },
  { number: "03 / Đoàn viên", label: "Đoàn viên", title: "Mùa Lễ Hội", description: "Cảm hứng mâm cỗ Tết cổ truyền, Trung Thu đoàn viên và tiết thanh minh.", count: "1 bài viết", icon: "celebration", highlighted: true },
  { number: "04 / Tri ân", label: "Tri ân", title: "Cẩm Nang Chọn Quà", description: "Nghệ thuật biếu tặng tinh tế, quà sơn mài cao cấp cho đối tác & tri kỷ.", count: "1 bài viết", icon: "gift" },
  { number: "05 / Bếp lửa", label: "Bếp lửa", title: "Tin Từ Cửa Hàng", description: "Góc lò bánh, mẻ bánh theo mùa, hoạt động workshop nghệ thuật làm bánh.", count: "0 bài viết", icon: "store" },
];

export const commerceImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuB1HwideL-vOpF18h1_0VmeGzrUw7PWCjkv815q35Z_sFOLOnsQugO0bY7QGcgf0SSEQe5jWjL3u79Ih3552qsOLP9N7kmHC0se5w6EjaFt98DyMgkL7KmNQRwUaKwXeBFhXzNFBi8rcQBcmlV9V-n-XTo9jXu7cXdwHQzreppY_R1g33aTeegXpawx9xHaoVFIZMD1wXLpjqoLWi3qZGtHJcfk25uch1yXTGYw8TM";

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function articleHref(article: JournalArticle) {
  return routes.article(article.slug);
}
