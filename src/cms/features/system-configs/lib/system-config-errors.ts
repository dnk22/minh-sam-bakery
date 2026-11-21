export function systemConfigErrorMessage(status: number, operation: "general" | "delete" = "general") {
  if (status === 400 && operation === "delete") return "Không thể xóa cấu hình này.";
  if (status === 400) return "Dữ liệu cấu hình không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 404) return "Không tìm thấy cấu hình hệ thống.";
  if (status === 409) return "Khóa cấu hình đã tồn tại hoặc dữ liệu vừa được thay đổi.";
  if (status === 423) return "Tài khoản đã bị khóa.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Dịch vụ cấu hình hệ thống đang tạm thời gián đoạn.";
}
