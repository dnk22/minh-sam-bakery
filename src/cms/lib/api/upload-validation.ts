export const CMS_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export function validateSingleImageUpload(files: Array<{ size: number; type: string }>) {
  if (files.length !== 1) return "Chỉ được chọn một ảnh.";
  const file = files[0];
  if (!file || file.size <= 0 || file.size > CMS_IMAGE_MAX_BYTES || !file.type.toLowerCase().startsWith("image/")) {
    return "Ảnh phải có dung lượng từ 1 byte đến 10 MB.";
  }
  return null;
}

export function validateImageUploadBatch(files: Array<{ size: number; type: string }>) {
  if (!files.length) return "Hãy chọn ít nhất một ảnh.";
  if (files.length > 20) return "Mỗi lần chỉ được tải tối đa 20 ảnh.";
  if (files.some((file) => file.size <= 0 || !file.type.toLowerCase().startsWith("image/"))) return "Tất cả tệp phải là ảnh hợp lệ.";
  if (files.reduce((total, file) => total + file.size, 0) > CMS_IMAGE_MAX_BYTES) return "Tổng dung lượng ảnh trong một lần tải không được vượt quá 10 MB.";
  return null;
}
