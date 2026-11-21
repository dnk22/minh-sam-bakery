export function orderErrorMessage(status: number) {
  if (status === 400) return "Tham số hoặc trạng thái đơn hàng không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền xem hoặc xử lý đơn hàng.";
  if (status === 404) return "Không tìm thấy đơn hàng.";
  if (status === 409) return "Trạng thái đơn hàng đã thay đổi hoặc không thể chuyển theo yêu cầu.";
  if (status === 423) return "Tài khoản đã bị khóa.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Dịch vụ đơn hàng đang tạm thời gián đoạn.";
}
