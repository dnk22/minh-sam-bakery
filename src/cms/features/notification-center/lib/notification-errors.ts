export function notificationErrorMessage(status: number) {
  if (status === 400) return "Yêu cầu thông báo không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 404) return "Không tìm thấy thông báo.";
  if (status === 423) return "Tài khoản đã bị khóa.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Dịch vụ thông báo đang tạm thời gián đoạn.";
}
