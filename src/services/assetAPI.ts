import api from "./api";

export interface Asset {
  _id: string;
  name: string;
  category: "background" | "sticker" | "text-decoration";
  subcategory: string;
  type: "image" | "svg" | "pattern";
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  isPremium: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAssetsParams {
  category?: string;
  subcategory?: string;
  tags?: string;
  isPremium?: boolean;
}

export interface SearchAssetsParams {
  q: string;
  category?: string;
}

/**
 * Get all assets with optional filters
 */
export const getAssets = async (params?: GetAssetsParams): Promise<Asset[]> => {
  const response = await api.get("/api/assets", { params });
  return response.data.data;
};

/**
 * Search assets by keyword
 */
export const searchAssets = async (
  params: SearchAssetsParams
): Promise<Asset[]> => {
  const response = await api.get("/api/assets/search", { params });
  return response.data.data;
};

/**
 * Get asset by ID
 */
export const getAssetById = async (id: string): Promise<Asset> => {
  const response = await api.get(`/api/assets/${id}`);
  return response.data.data;
};

/**
 * Upload image asset
 */
export const uploadAsset = async (
  file: File,
  metadata: {
    name?: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
  }
): Promise<Asset> => {
  const formData = new FormData();
  formData.append("image", file);

  if (metadata.name) formData.append("name", metadata.name);
  if (metadata.category) formData.append("category", metadata.category);
  if (metadata.subcategory)
    formData.append("subcategory", metadata.subcategory);
  if (metadata.tags) formData.append("tags", metadata.tags.join(","));

  const response = await api.post("/api/assets/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

/**
 * Get user's uploaded assets
 */
export const getMyUploads = async (): Promise<Asset[]> => {
  const response = await api.get("/api/assets/my-uploads");
  return response.data.data;
};

/**
 * Delete asset
 */
export const deleteAsset = async (id: string): Promise<void> => {
  await api.delete(`/api/assets/${id}`);
};
