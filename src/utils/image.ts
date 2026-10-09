const apiUrl = String(
  import.meta.env.VITE_API_URL ?? ""
).replace(/\/+$/, "");

const backendBaseUrl = apiUrl.replace(
  /\/api$/i,
  ""
);

export function resolveImageUrl(
  imageUrl?: string | null
): string | null {
  if (!imageUrl) {
    return null;
  }

  const value = imageUrl.trim();

  if (!value) {
    return null;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  if (!backendBaseUrl) {
    return value;
  }

  return `${backendBaseUrl}${
    value.startsWith("/") ? "" : "/"
  }${value}`;
}
