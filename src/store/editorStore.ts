import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BannerState, Element, UploadedImage, Template } from '../types/editor';

const initialState: BannerState = {
  elements: [],
  selectedElement: null,
  canvasSize: { width: 728, height: 90 },
  viewportMode: 'desktop',
  zoom: 100,
  history: [[]],
  historyIndex: 0,
  uploadedImages: [],
  templates: [],
  backgroundColor: '#ffffff',
  isAuthenticated: false,
};

export const useEditorStore = create(
  persist<BannerState & {
    addElement: (element: Element) => void;
    updateElement: (id: string, updates: Partial<Element>) => void;
    removeElement: (id: string) => void;
    duplicateElement: (id: string) => void;
    setSelectedElement: (id: string | null) => void;
    setCanvasSize: (width: number, height: number) => void;
    setViewportMode: (mode: Breakpoint) => void;
    setZoom: (zoom: number) => void;
    addUploadedImage: (image: UploadedImage) => void;
    removeUploadedImage: (id: string) => void;
    saveTemplate: (name: string) => void;
    loadTemplate: (templateId: string) => void;
    removeTemplate: (templateId: string) => void;
    setBackgroundColor: (color: string) => void;
    setAuthenticated: (value: boolean) => void;
    undo: () => void;
    redo: () => void;
    reset: () => void;
  }>(
    (set) => ({
      ...initialState,

      addElement: (element) =>
        set((state) => {
          const newElements = [...state.elements, element];
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), newElements];
          return {
            elements: newElements,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      updateElement: (id, updates) =>
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          );
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), newElements];
          return {
            elements: newElements,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      removeElement: (id) =>
        set((state) => {
          const newElements = state.elements.filter((el) => el.id !== id);
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), newElements];
          return {
            elements: newElements,
            selectedElement: state.selectedElement === id ? null : state.selectedElement,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      duplicateElement: (id) =>
        set((state) => {
          const elementToDuplicate = state.elements.find(el => el.id === id);
          if (!elementToDuplicate) return state;

          const newElement = {
            ...elementToDuplicate,
            id: `element-${Date.now()}`,
            style: {
              desktop: {
                ...elementToDuplicate.style.desktop,
                x: (elementToDuplicate.style.desktop.x || 0) + 20,
                y: (elementToDuplicate.style.desktop.y || 0) + 20,
              },
              tablet: elementToDuplicate.style.tablet,
              mobile: elementToDuplicate.style.mobile,
            },
          };

          const newElements = [...state.elements, newElement];
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), newElements];
          
          return {
            elements: newElements,
            selectedElement: newElement.id,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      setSelectedElement: (id) => set({ selectedElement: id }),
      setCanvasSize: (width, height) => set({ canvasSize: { width, height } }),
      setViewportMode: (mode) => set({ viewportMode: mode }),
      setZoom: (zoom) => set({ zoom }),

      addUploadedImage: (image) =>
        set((state) => ({
          uploadedImages: [...state.uploadedImages, image],
        })),

      removeUploadedImage: (id) =>
        set((state) => ({
          uploadedImages: state.uploadedImages.filter((img) => img.id !== id),
        })),

      saveTemplate: (name) =>
        set((state) => ({
          templates: [
            ...state.templates,
            {
              id: `template-${Date.now()}`,
              name,
              elements: state.elements,
              backgroundColor: state.backgroundColor,
            },
          ],
        })),

      loadTemplate: (templateId) =>
        set((state) => {
          const template = state.templates.find((t) => t.id === templateId);
          if (!template) return state;
          return {
            elements: template.elements,
            backgroundColor: template.backgroundColor,
            history: [[...template.elements]],
            historyIndex: 0,
          };
        }),

      removeTemplate: (templateId) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== templateId),
        })),

      setBackgroundColor: (color) => set({ backgroundColor: color }),
      
      setAuthenticated: (value) => set({ isAuthenticated: value }),

      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            return {
              elements: state.history[state.historyIndex - 1],
              historyIndex: state.historyIndex - 1,
            };
          }
          return state;
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            return {
              elements: state.history[state.historyIndex + 1],
              historyIndex: state.historyIndex + 1,
            };
          }
          return state;
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'banner-editor-storage',
      partialize: (state) => ({
        uploadedImages: state.uploadedImages,
        templates: state.templates,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);