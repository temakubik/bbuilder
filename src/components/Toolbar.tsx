import React from 'react';
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Undo, Redo } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const Toolbar: React.FC = () => {
  const { viewportMode, zoom, setViewportMode, setZoom, undo, redo } = useEditorStore();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
      <div className="flex items-center space-x-2">
        <button
          className={`p-2 rounded ${viewportMode === 'desktop' ? 'bg-gray-600' : ''}`}
          onClick={() => setViewportMode('desktop')}
        >
          <Monitor size={20} />
        </button>
        <button
          className={`p-2 rounded ${viewportMode === 'tablet' ? 'bg-gray-600' : ''}`}
          onClick={() => setViewportMode('tablet')}
        >
          <Tablet size={20} />
        </button>
        <button
          className={`p-2 rounded ${viewportMode === 'mobile' ? 'bg-gray-600' : ''}`}
          onClick={() => setViewportMode('mobile')}
        >
          <Smartphone size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2" onClick={() => setZoom(Math.max(25, zoom - 25))}>
          <ZoomOut size={20} />
        </button>
        <span className="min-w-[60px] text-center">{zoom}%</span>
        <button className="p-2" onClick={() => setZoom(Math.min(200, zoom + 25))}>
          <ZoomIn size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2" onClick={undo}>
          <Undo size={20} />
        </button>
        <button className="p-2" onClick={redo}>
          <Redo size={20} />
        </button>
      </div>
    </div>
  );
};