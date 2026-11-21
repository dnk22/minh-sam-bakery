export function postErrorMessage(status: number) {
  if (status === 400) return "Tham số hoặc dữ liệu bài viết không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không còn hợp lệ.";
  if (status === 403) return "Bạn không có quyền quản lý bài viết.";
  if (status === 404) return "Không tìm thấy bài viết.";
  if (status === 409) return "Bài viết xung đột với dữ liệu hiện có.";
  if (status === 423) return "Tài khoản đã bị khóa.";
  return "Dịch vụ bài viết đang tạm thời gián đoạn.";
}
