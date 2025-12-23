import { useEffect, useState } from "react";
import * as fabric from "fabric";
import { Type, Sparkles } from "lucide-react";
import type { ObjectProperties } from "../../types/fabric";

interface TextToolbarProps {
  selectedObject: fabric.FabricObject | null;
  onUpdate: (properties: ObjectProperties) => void;
}

/**
 * Enhanced text editing toolbar for Fabric.js canvas
 * Provides comprehensive typography controls
 */
export const TextToolbar = ({ selectedObject, onUpdate }: TextToolbarProps) => {
  // Local state for UI synchronization
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState<string | number>("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");
  const [underline, setUnderline] = useState(false);
  const [linethrough, setLinethrough] = useState(false);
  const [charSpacing, setCharSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.16);

  // Text effects
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [strokeEnabled, setStrokeEnabled] = useState(false);

  // Sync state with selected object
  useEffect(() => {
    if (
      selectedObject &&
      (selectedObject.type === "text" || selectedObject.type === "i-text")
    ) {
      const text = selectedObject as fabric.Text;
      setFontFamily(text.get("fontFamily") || "Arial");
      setFontSize(text.get("fontSize") || 16);
      setFontWeight(text.get("fontWeight") || "normal");
      setFontStyle(text.get("fontStyle") || "normal");
      setTextAlign(text.get("textAlign") || "left");
      setUnderline(text.get("underline") || false);
      setLinethrough(text.get("linethrough") || false);
      setCharSpacing(text.get("charSpacing") || 0);
      setLineHeight(text.get("lineHeight") || 1.16);

      const shadow = text.get("shadow");
      setShadowEnabled(!!shadow);

      const strokeWidth = text.get("strokeWidth");
      setStrokeEnabled(!!strokeWidth && strokeWidth > 0);
    }
  }, [selectedObject]);

  if (
    !selectedObject ||
    (selectedObject.type !== "text" && selectedObject.type !== "i-text")
  ) {
    return null;
  }

  // Categorized font families
  const fontCategories = {
    "Sans Serif": [
      "Arial",
      "Helvetica",
      "Verdana",
      "Roboto",
      "Open Sans",
      "Lato",
      "Montserrat",
      "Poppins",
    ],
    Serif: ["Times New Roman", "Georgia", "Garamond", "Palatino"],
    Monospace: ["Courier New", "Consolas", "Monaco"],
    Display: ["Impact", "Comic Sans MS", "Brush Script MT"],
  };

  const fontSizes = [
    8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96, 128,
  ];

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFontFamily(value);
    onUpdate({ fontFamily: value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setFontSize(value);
    onUpdate({ fontSize: value });
  };

  const toggleBold = () => {
    const isBold =
      fontWeight === "bold" || fontWeight === 700 || fontWeight === "700";
    const newWeight = isBold ? "normal" : "bold";
    setFontWeight(newWeight);
    onUpdate({ fontWeight: newWeight });
  };

  const toggleItalic = () => {
    const isItalic = fontStyle === "italic";
    const newStyle = isItalic ? "normal" : "italic";
    setFontStyle(newStyle);
    onUpdate({ fontStyle: newStyle });
  };

  const toggleUnderline = () => {
    const newValue = !underline;
    setUnderline(newValue);
    onUpdate({ underline: newValue });
  };

  const toggleLinethrough = () => {
    const newValue = !linethrough;
    setLinethrough(newValue);
    onUpdate({ linethrough: newValue });
  };

  const handleAlignmentChange = (align: string) => {
    setTextAlign(align);
    onUpdate({ textAlign: align });
  };

  const handleCharSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCharSpacing(value);
    onUpdate({ charSpacing: value });
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLineHeight(value);
    onUpdate({ lineHeight: value });
  };

  const toggleShadow = () => {
    const newValue = !shadowEnabled;
    setShadowEnabled(newValue);

    if (newValue) {
      onUpdate({
        shadow: {
          color: "rgba(0,0,0,0.3)",
          blur: 10,
          offsetX: 5,
          offsetY: 5,
        },
      });
    } else {
      onUpdate({ shadow: null });
    }
  };

  const toggleStroke = () => {
    const newValue = !strokeEnabled;
    setStrokeEnabled(newValue);

    if (newValue) {
      onUpdate({
        stroke: "#000000",
        strokeWidth: 2,
      });
    } else {
      onUpdate({
        stroke: "",
        strokeWidth: 0,
      });
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-white">Typography</h3>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Font Family
        </label>
        <select
          value={fontFamily}
          onChange={handleFontFamilyChange}
          className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-orange appearance-none"
        >
          {Object.entries(fontCategories).map(([category, fonts]) => (
            <optgroup key={category} label={category}>
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Font Size
        </label>
        <select
          value={fontSize}
          onChange={handleFontSizeChange}
          className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      {/* Text Style */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Text Style
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={toggleBold}
            className={`py-2 text-sm font-bold rounded-sm transition-all ${
              fontWeight === "bold" ||
              fontWeight === "700" ||
              fontWeight === 700
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={toggleItalic}
            className={`py-2 text-sm italic rounded-sm transition-all ${
              fontStyle === "italic"
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={toggleUnderline}
            className={`py-2 text-sm underline rounded-sm transition-all ${
              underline
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
            title="Underline"
          >
            U
          </button>
          <button
            onClick={toggleLinethrough}
            className={`py-2 text-sm line-through rounded-sm transition-all ${
              linethrough
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
            title="Strikethrough"
          >
            S
          </button>
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAlignmentChange("left")}
            className={`py-2 flex items-center justify-center rounded-sm transition-all ${
              textAlign === "left"
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handleAlignmentChange("center")}
            className={`py-2 flex items-center justify-center rounded-sm transition-all ${
              textAlign === "center"
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handleAlignmentChange("right")}
            className={`py-2 flex items-center justify-center rounded-sm transition-all ${
              textAlign === "right"
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM10 15a1 1 0 011-1h5a1 1 0 110 2h-5a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Spacing Controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Letter Spacing: {charSpacing}
          </label>
          <input
            type="range"
            min="-200"
            max="1000"
            step="10"
            value={charSpacing}
            onChange={handleCharSpacingChange}
            className="w-full h-2 bg-white/10 rounded-sm appearance-none cursor-pointer accent-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Line Height: {lineHeight.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={lineHeight}
            onChange={handleLineHeightChange}
            className="w-full h-2 bg-white/10 rounded-sm appearance-none cursor-pointer accent-brand-orange"
          />
        </div>
      </div>

      {/* Text Effects */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3 h-3 text-gray-400" />
          <label className="text-xs font-medium text-gray-400">
            Text Effects
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleShadow}
            className={`py-2 px-3 text-xs font-medium rounded-sm transition-all ${
              shadowEnabled
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Shadow
          </button>
          <button
            onClick={toggleStroke}
            className={`py-2 px-3 text-xs font-medium rounded-sm transition-all ${
              strokeEnabled
                ? "bg-brand-orange text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Outline
          </button>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-sm p-3 mt-4">
        <p className="text-xs text-blue-300">
          <strong>Tip:</strong> Double-click text on canvas to edit directly
        </p>
      </div>
    </div>
  );
};
