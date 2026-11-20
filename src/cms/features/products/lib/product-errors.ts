export function productErrorMessage(status: number) {
  if (status === 400) return "Tham số hoặc dữ liệu sản phẩm không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền xem dữ liệu sản phẩm.";
  if (status === 404) return "Không tìm thấy sản phẩm.";
  if (status === 423) return "Tài khoản đã bị khóa.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Dịch vụ sản phẩm đang tạm thời gián đoạn.";
}
