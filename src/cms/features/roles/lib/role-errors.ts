export function roleErrorMessage(status: number, operation: "general" | "delete" = "general") {
  if (status === 400 && operation === "delete") return "Không thể xóa vai trò vì dữ liệu không hợp lệ hoặc vai trò vẫn đang được sử dụng.";
  if (status === 400) return "Dữ liệu vai trò hoặc phân quyền không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 404) return "Không tìm thấy vai trò hoặc quyền truy cập.";
  if (status === 409) return "Vai trò đang được sử dụng hoặc thay đổi xung đột với dữ liệu hiện tại.";
  if (status === 423) return "Tài khoản đã bị khóa.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Dịch vụ vai trò và phân quyền đang tạm thời gián đoạn.";
}
