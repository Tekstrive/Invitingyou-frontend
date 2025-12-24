import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

interface FabricCanvasProps {
  designData?: object;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onSelectionChange?: (activeObject: fabric.FabricObject | null) => void;
}

/**
 * FabricCanvas Component - Responsive with proper text editing
 */
export const FabricCanvas = ({
  designData,
  onCanvasReady,
  onSelectionChange,
}: FabricCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  const onCanvasReadyRef = useRef(onCanvasReady);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useEffect(() => {
    onCanvasReadyRef.current = onCanvasReady;
    onSelectionChangeRef.current = onSelectionChange;
  }, [onCanvasReady, onSelectionChange]);

  // Canvas dimensions - design size
  const BASE_WIDTH = 600;
  const BASE_HEIGHT = 800;

  // Initialize canvas
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container || fabricRef.current) return;

    const canvasEl = document.createElement("canvas");
    wrapper.appendChild(canvasEl);

    const initTimer = setTimeout(() => {
      try {
        const canvas = new fabric.Canvas(canvasEl, {
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          backgroundColor: "#ffffff",
          selection: true,
          preserveObjectStacking: true,
        });

        fabricRef.current = canvas;

        // Selection handlers
        canvas.on("selection:created", (e) => {
          onSelectionChangeRef.current?.(e.selected?.[0] || null);
        });
        canvas.on("selection:updated", (e) => {
          onSelectionChangeRef.current?.(e.selected?.[0] || null);
        });
        canvas.on("selection:cleared", () => {
          onSelectionChangeRef.current?.(null);
        });

        // Object modification handlers
        canvas.on("object:modified", () => {
          canvas.requestRenderAll();
        });

        // Scale canvas to fit container
        const resizeCanvas = () => {
          if (!container) return;

          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;

          const scaleX = (containerWidth - 40) / BASE_WIDTH;
          const scaleY = (containerHeight - 40) / BASE_HEIGHT;
          const scale = Math.min(scaleX, scaleY, 1);

          const width = Math.round(BASE_WIDTH * scale);
          const height = Math.round(BASE_HEIGHT * scale);

          // Update wrapper size
          wrapper.style.width = `${width}px`;
          wrapper.style.height = `${height}px`;

          // Set canvas dimensions and zoom
          canvas.setDimensions({ width, height });
          canvas.setZoom(scale);
          canvas.requestRenderAll();
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        setIsReady(true);
        onCanvasReadyRef.current?.(canvas);
      } catch (err) {
        console.error("Failed to initialize Fabric canvas:", err);
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
      while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
      }
      setIsReady(false);
    };
  }, []);

  // Load design data
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!designData || !isReady || !fabricRef.current || loadedRef.current) {
      return;
    }

    loadedRef.current = true;
    const canvas = fabricRef.current;

    canvas
      .loadFromJSON(designData)
      .then(() => {
        canvas.getObjects().forEach((obj) => {
          obj.setCoords();
        });
        canvas.requestRenderAll();
      })
      .catch((err: Error) => {
        console.error("Failed to load design data:", err);
      });
  }, [designData, isReady]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden"
    >
      {!isReady && (
        <div className="absolute flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      )}

      <div ref={wrapperRef} className="bg-white shadow-xl" />
    </div>
  );
};
