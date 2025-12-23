// Fabric.js Canvas Design Data Types

export interface FabricObject {
  type: string;
  version?: string;
  originX?: string;
  originY?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string | null;
  strokeWidth?: number;
  strokeDashArray?: number[] | null;
  strokeLineCap?: string;
  strokeDashOffset?: number;
  strokeLineJoin?: string;
  strokeUniform?: boolean;
  strokeMiterLimit?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  flipX?: boolean;
  flipY?: boolean;
  opacity?: number;
  shadow?: object | null;
  visible?: boolean;
  backgroundColor?: string;
  fillRule?: string;
  paintFirst?: string;
  globalCompositeOperation?: string;
  skewX?: number;
  skewY?: number;
  // Text-specific properties
  text?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  fontStyle?: string;
  lineHeight?: number;
  underline?: boolean;
  overline?: boolean;
  linethrough?: boolean;
  textAlign?: string;
  charSpacing?: number;
  // Image-specific properties
  src?: string;
  crossOrigin?: string | null;
  filters?: unknown[];
  // Additional properties
  [key: string]: unknown;
}

export interface CanvasDesignData {
  version?: string;
  objects?: FabricObject[];
  background?: string;
  backgroundImage?: FabricObject | null;
  overlayImage?: FabricObject | null;
  [key: string]: unknown;
}

export interface TextProperties {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fill?: string;
  textAlign?: string;
  underline?: boolean;
  linethrough?: boolean;
  overline?: boolean;
  [key: string]: unknown;
}

export interface ColorProperties {
  fill?: string;
  stroke?: string;
  [key: string]: unknown;
}

export type ObjectProperties = Partial<FabricObject>;
