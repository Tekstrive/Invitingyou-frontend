import { useEffect, useState } from "react";
import * as fabric from "fabric";
import type { CanvasDesignData } from "../../types/fabric";

interface TemplatePreviewProps {
  designData: CanvasDesignData;
  fallbackThumbnail?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Renders a Fabric.js template as a preview image
 * Uses canvas to generate a thumbnail from designData
 */
export const TemplatePreview = ({
  designData,
  fallbackThumbnail,
  width = 400,
  height = 600,
  className = "",
}: TemplatePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!designData) {
      setIsLoading(false);
      return;
    }

    const generatePreview = async () => {
      let tempCanvas: fabric.Canvas | null = null;
      let timeoutId: NodeJS.Timeout | null = null;

      try {
        setIsLoading(true);
        setHasError(false);

        // Create a temporary canvas element
        const canvasElement = document.createElement("canvas");
        canvasElement.width = 600;
        canvasElement.height = 800;

        // Create a temporary Fabric canvas
        tempCanvas = new fabric.Canvas(canvasElement, {
          width: 600,
          height: 800,
          backgroundColor: designData.background || "#FFFFFF",
        });

        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.warn("Template preview generation timed out");
          setHasError(true);
          setIsLoading(false);
          if (tempCanvas) {
            tempCanvas.dispose();
          }
        }, 5000); // 5 second timeout

        // Load the design data
        await tempCanvas.loadFromJSON(designData);
        tempCanvas.renderAll();

        // Wait a bit for rendering to complete (images, fonts, etc.)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Clear timeout if successful
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Convert canvas to data URL
        const dataUrl = tempCanvas.toDataURL({
          format: "png",
          quality: 0.8,
          multiplier: 0.5, // Scale down for smaller file size
        });

        setPreviewUrl(dataUrl);
        setIsLoading(false);

        // Cleanup
        tempCanvas.dispose();
      } catch (error) {
        console.error("Failed to generate preview:", error);
        setHasError(true);
        setIsLoading(false);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (tempCanvas) {
          tempCanvas.dispose();
        }
      }
    };

    generatePreview();
  }, [designData]);

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto mb-2"></div>
          <p className="text-xs text-gray-400">Rendering...</p>
        </div>
      </div>
    );
  }

  // Show fallback thumbnail if error or no preview
  if (hasError || !previewUrl) {
    if (fallbackThumbnail && fallbackThumbnail.startsWith("http")) {
      return (
        <img
          src={fallbackThumbnail}
          alt="Template preview"
          className={className}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      );
    }

    // Show placeholder if no valid fallback
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brand-sand to-brand-sea/20 ${className}`}
        style={{ width, height }}
      >
        {fallbackThumbnail && !fallbackThumbnail.startsWith("http") ? (
          // If thumbnail is just a color or invalid string, try to use it as background
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: fallbackThumbnail }}
          >
            <span className="text-6xl drop-shadow-lg">✨</span>
          </div>
        ) : (
          <span className="text-6xl">🎨</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={previewUrl}
      alt="Template preview"
      className={className}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
};
