import { RefreshCw, ShieldX } from "lucide-react";
import Link from "next/link";

export function CmsSessionState({ kind }: { kind: "forbidden" | "unavailable" }) {
  const forbidden = kind === "forbidden";
  return (
    <main className="cms-auth-layout">
      <section className="cms-session-card">
        {forbidden ? <ShieldX aria-hidden="true" size={30} /> : <RefreshCw aria-hidden="true" size={30} />}
        <h1>{forbidden ? "Không có quyền truy cập" : "Hệ thống xác thực đang gián đoạn"}</h1>
        <p>{forbidden ? "Bạn đã đăng nhập nhưng không có quyền truy cập CMS. Vui lòng liên hệ quản trị viên." : "Không thể xác minh phiên lúc này. Thông tin đăng nhập chưa bị xóa; hãy thử tải lại trang."}</p>
        <Link className="cms-button cms-button--default cms-button--size-default" href={forbidden ? "/" : "/cms"}>{forbidden ? "Về trang chủ" : "Thử lại"}</Link>
      </section>
    </main>
  );
}
