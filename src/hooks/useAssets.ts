import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssets,
  searchAssets,
  getAssetById,
  uploadAsset,
  getMyUploads,
  deleteAsset,
  type GetAssetsParams,
  type SearchAssetsParams,
} from "../services/assetAPI";

/**
 * Hook to fetch assets with filters
 */
export const useAssets = (params?: GetAssetsParams) => {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAssets(params),
  });
};

/**
 * Hook to search assets
 */
export const useSearchAssets = (params: SearchAssetsParams) => {
  return useQuery({
    queryKey: ["assets", "search", params],
    queryFn: () => searchAssets(params),
    enabled: !!params.q, // Only run if search query exists
  });
};

/**
 * Hook to get single asset
 */
export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ["assets", id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get user's uploads
 */
export const useMyUploads = () => {
  return useQuery({
    queryKey: ["assets", "my-uploads"],
    queryFn: getMyUploads,
  });
};

/**
 * Hook to upload asset
 */
export const useUploadAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      metadata,
    }: {
      file: File;
      metadata: {
        name?: string;
        category?: string;
        subcategory?: string;
        tags?: string[];
      };
    }) => uploadAsset(file, metadata),
    onSuccess: () => {
      // Invalidate and refetch assets
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};

/**
 * Hook to delete asset
 */
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAsset(id),
    onSuccess: () => {
      // Invalidate and refetch assets
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};
