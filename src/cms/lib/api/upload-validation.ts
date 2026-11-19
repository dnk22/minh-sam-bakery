export const CMS_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export function validateSingleImageUpload(files: Array<{ size: number; type: string }>) {
  if (files.length !== 1) return "Chỉ được chọn một ảnh.";
  const file = files[0];
  if (!file || file.size <= 0 || file.size > CMS_IMAGE_MAX_BYTES || !file.type.toLowerCase().startsWith("image/")) {
    return "Ảnh phải có dung lượng từ 1 byte đến 10 MB.";
  }
  return null;
}
