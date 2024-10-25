import { create } from 'zustand';

export type ElementType = 'text' | 'image' | 'shape' | 'button';
export type ElementAlignment = 'left' | 'center' | 'right';
export type ElementAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none';
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';
export type Breakpoint = 'desktop' | 'tablet' | 'mobile';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface ElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: 'Onest' | 'Manrope';
  fontWeight?: FontWeight;
  lineHeight?: number;
  textTransform?: 'uppercase' | 'none';
  borderRadius?: number;
  zIndex: number;
  alignment?: ElementAlignment;
  anchor?: ElementAnchor;
  objectFit?: ImageFit;
  hidden?: boolean;
}

export interface Element {
  id: string;
  type: ElementType;
  content: string;
  style: {
    desktop: ElementStyle;
    tablet?: Partial<ElementStyle>;
    mobile?: Partial<ElementStyle>;
  };
}

export interface UploadedImage {
  id: string;
  url: string;
  thumbnail: string;
  name: string;
  deleteUrl?: string;
}

export interface Template {
  id: string;
  name: string;
  elements: Element[];
  backgroundColor: string;
  canvasSize: {
    width: number;
    height: number;
  };
}

export interface BannerState {
  elements: Element[];
  selectedElement: string | null;
  canvasSize: {
    width: number;
    height: number;
  };
  viewportMode: Breakpoint;
  zoom: number;
  history: Element[][];
  historyIndex: number;
  uploadedImages: UploadedImage[];
  templates: Template[];
  backgroundColor: string;
  isAuthenticated: boolean;
}