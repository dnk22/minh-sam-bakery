export function FinalCtaSection() {
  return (
    <section className="w-full bg-surface-container py-20 px-6 md:px-12 lg:px-20 text-on-surface">
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-[0.3em] block mb-3">Trải Nghiệm Thưởng Vị</span>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Khám phá hương vị phù hợp với bạn.</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">Dù là tách trà chiều tĩnh lặng hay món quà gửi gắm lòng tri ân sâu sắc, Minh Sâm luôn chuẩn bị trọn vẹn sự tinh tế dành riêng cho bạn.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a className="px-8 py-4 bg-primary text-on-primary font-label-ui text-label-ui tracking-wider uppercase rounded hover:bg-primary-container transition-all" href="#danh-muc">Xem các dòng bánh</a>
          <a className="px-8 py-4 bg-surface-container-high text-primary font-label-ui text-label-ui tracking-wider uppercase rounded hover:bg-surface-container-highest transition-all" href="#">Khám phá quà tặng</a>
          <a className="px-8 py-4 bg-transparent text-secondary font-label-ui text-label-ui tracking-wider uppercase rounded hover:bg-surface-container-high transition-all" href="#">Liên hệ Minh Sâm</a>
        </div>
      </div>
    </section>
  );
}
