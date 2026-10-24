export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export function validatePhoto(
  file: Pick<File, "size" | "type">,
): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Please choose a JPG, PNG or WebP photograph.";
  if (file.size > MAX_PHOTO_BYTES)
    return "Please choose a photograph under 15 MB.";
  if (!file.size)
    return "This photograph is empty. Please choose another file.";
  return null;
}
export function photoDimensions(width: number, height: number) {
  const scale = Math.min(1, 1600 / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
export async function compressPhoto(file: File): Promise<string> {
  const error = validatePhoto(file);
  if (error) throw new Error(error);
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const size = photoDimensions(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = "#fff8ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    throw new Error(
      "We could not read this photograph. Please choose another JPG, PNG or WebP.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
