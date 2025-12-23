import { useQuery } from "@tanstack/react-query";
import { getAllTemplates, getTemplateById } from "../services/templateAPI";

/**
 * Hook to fetch all templates with optional category filter
 */
export const useTemplates = (category?: string) => {
  return useQuery({
    queryKey: ["templates", category],
    queryFn: () => getAllTemplates(category),
  });
};

/**
 * Hook to fetch a single template by ID
 */
export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplateById(id),
    enabled: !!id, // Only run query if id is provided
  });
};
