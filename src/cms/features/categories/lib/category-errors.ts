export function categoryErrorMessage(status: number, operation: "general" | "delete" = "general") {
  if (status === 400 && operation === "delete") return "Không thể xóa danh mục vì dữ liệu không hợp lệ hoặc vẫn còn danh mục con/sản phẩm tham chiếu.";
  if (status === 400) return "Dữ liệu danh mục không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 404) return "Không tìm thấy danh mục.";
  if (status === 409) return "Danh mục đang được tham chiếu và chưa thể xóa.";
  if (status === 423) return "Tài khoản đã bị khóa.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Dịch vụ danh mục đang tạm thời gián đoạn.";
}
