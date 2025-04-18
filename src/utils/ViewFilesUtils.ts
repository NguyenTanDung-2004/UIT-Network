export const getFileIcon = (fileType?: string): string => {
  if (!fileType) return "/images/files/file-icon.png";
  const lowerType = fileType.toLowerCase();
  if (lowerType.includes("pdf")) return "/images/files/pdf-icon.png";
  if (lowerType.includes("doc") || lowerType.includes("wordprocessingml"))
    return "/images/files/docx-icon.png";
  if (lowerType.includes("txt") || lowerType.includes("plain"))
    return "/images/files/txt-icon.png";
  return "/images/files/file-icon.png";
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const displayIndex = i > 0 ? i - 1 : 0;
  const displaySize = i > 0 ? bytes / Math.pow(k, i) : bytes / k;
  const decimalPlaces = displayIndex > 0 ? 1 : 0;

  return (
    parseFloat(displaySize.toFixed(decimalPlaces)) + " " + sizes[displayIndex]
  );
};
