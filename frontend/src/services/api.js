const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const parseJsonResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(`${API_BASE_URL}/upload`, { method: "POST", body: formData });
  return parseJsonResponse(response);
};

export const compressImageApi = async ({ imageId, quality, format }) => {
  const response = await fetch(`${API_BASE_URL}/compress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId, quality, format }),
  });
  return parseJsonResponse(response);
};

export const getDownloadUrl = (fileUrl) =>
  fileUrl.startsWith("http") ? fileUrl : `${API_BASE_URL}${fileUrl}`;
