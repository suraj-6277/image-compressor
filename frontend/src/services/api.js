const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const parseJsonResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// Upload Image
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return parseJsonResponse(response);
};

// Compress Image
export const compressImageApi = async ({ imageId, quality, format }) => {
  const response = await fetch(`${API_BASE_URL}/compress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageId,
      quality,
      format,
    }),
  });

  return parseJsonResponse(response);
};

// Download URL
export const getDownloadUrl = (fileUrl) => {
  if (!fileUrl) return "";

  return fileUrl.startsWith("http")
    ? fileUrl
    : `${API_BASE_URL}${fileUrl}`;
};