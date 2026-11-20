export function userErrorMessage(status: number, operation: "general" | "delete" | "action" = "general") {
  if (status === 400 && operation === "delete") return "Không thể xóa mềm tài khoản này theo trạng thái hoặc ràng buộc hiện tại.";
  if (status === 400 && operation === "action") return "Không thể thay đổi trạng thái hoặc vai trò của tài khoản này.";
  if (status === 400) return "Dữ liệu tài khoản không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 404) return "Không tìm thấy tài khoản hoặc vai trò.";
  if (status === 409) return "Thao tác xung đột với trạng thái tài khoản hiện tại.";
  if (status === 423) return "Tài khoản hiện tại đã bị khóa.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Dịch vụ quản lý tài khoản đang tạm thời gián đoạn.";
}
