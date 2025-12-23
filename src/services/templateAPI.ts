import api from "./api";
import type { CanvasDesignData } from "../types/fabric";

export interface Template {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  style?: string;
  thumbnail: string;
  designData?: CanvasDesignData;
  features?: string[];
  isPremium: boolean;
  createdAt: string;
}

export interface TemplatesResponse {
  success: boolean;
  count: number;
  data: Template[];
}

export interface TemplateResponse {
  success: boolean;
  data: Template;
}

/**
 * Fetch all templates with optional category filter
 */
export const getAllTemplates = async (
  category?: string
): Promise<TemplatesResponse> => {
  const params = category ? { category } : {};
  const response = await api.get<TemplatesResponse>("/api/templates", {
    params,
  });
  return response.data;
};

/**
 * Fetch a single template by ID
 */
export const getTemplateById = async (
  id: string
): Promise<TemplateResponse> => {
  const response = await api.get<TemplateResponse>(`/api/templates/${id}`);
  return response.data;
};
