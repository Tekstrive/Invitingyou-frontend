import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as fabric from "fabric";
import axios from "axios";
import { getErrorMessage } from "../../utils/errorHandler";

interface ImageUploaderProps {
  canvas: fabric.Canvas | null;
  onImageAdded?: () => void;
}

/**
 * ImageUploader component - Drag-and-drop image upload for Fabric canvas
 */
export const ImageUploader = ({ canvas, onImageAdded }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!canvas) {
        setError("Canvas not initialized");
        return;
      }

      if (acceptedFiles.length === 0) {
        setError("No valid image file selected");
        return;
      }

      const file = acceptedFiles[0];
      setUploading(true);
      setError(null);

      try {
        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append("image", file);

        // Get token from localStorage
        const token = localStorage.getItem("token");

        // Upload to backend
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (response.data.success && response.data.data.url) {
          const imageUrl = response.data.data.url;

          // Load image into Fabric canvas
          fabric.FabricImage.fromURL(imageUrl, {
            crossOrigin: "anonymous",
          })
            .then((img) => {
              // Scale image to fit canvas if too large
              const maxWidth = canvas.width! * 0.5;
              const maxHeight = canvas.height! * 0.5;

              if (img.width! > maxWidth || img.height! > maxHeight) {
                const scale = Math.min(
                  maxWidth / img.width!,
                  maxHeight / img.height!
                );
                img.scale(scale);
              }

              // Center the image
              img.set({
                left: canvas.width! / 2 - img.getScaledWidth() / 2,
                top: canvas.height! / 2 - img.getScaledHeight() / 2,
              });

              // Add to canvas
              canvas.add(img);
              canvas.setActiveObject(img);
              canvas.renderAll();

              // Wait for render to complete before calling callback (Fix for history/loading race condition)
              setTimeout(() => {
                onImageAdded?.();
                setUploading(false);
                setError(null);
              }, 100);
            })
            .catch((imgErr) => {
              console.error("Error loading image into canvas:", imgErr);
              setError("Failed to load image into canvas");
              setUploading(false);
            });
        } else {
          throw new Error("Upload failed - no URL returned");
        }
      } catch (err: unknown) {
        console.error("Image upload error:", err);
        setError(getErrorMessage(err) || "Failed to upload image");
        setUploading(false);
      }
    },
    [canvas, onImageAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: uploading || !canvas,
  });

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Upload Image
      </h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : uploading
              ? "border-gray-300 bg-gray-50 cursor-wait"
              : !canvas
                ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-blue-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-blue-600 font-medium">Drop image here</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              Drag & drop an image here
            </p>
            <p className="text-xs text-gray-400">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {!canvas && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Canvas not ready
        </p>
      )}
    </div>
  );
};
