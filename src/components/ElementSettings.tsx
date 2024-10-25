import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Element, ElementAlignment, Breakpoint, ElementAnchor, ImageFit, FontWeight } from '../types/editor';
import { Trash2, Copy, Eye, EyeOff } from 'lucide-react';

export const ElementSettings: React.FC = () => {
  const { selectedElement, elements, updateElement, removeElement, duplicateElement, viewportMode } = useEditorStore();
  const [imageUrl, setImageUrl] = useState('');
  
  const element = elements.find(el => el.id === selectedElement);
  
  if (!element) return null;

  const currentStyle = {
    ...element.style.desktop,
    ...element.style[viewportMode]
  };

  const handleStyleChange = (key: keyof Element['style']['desktop'], value: any) => {
    const breakpointStyle = viewportMode === 'desktop' 
      ? { desktop: { ...element.style.desktop, [key]: value } }
      : { [viewportMode]: { ...element.style[viewportMode], [key]: value } };

    updateElement(element.id, {
      style: {
        ...element.style,
        ...breakpointStyle
      }
    });
  };

  const handleContentChange = (value: string) => {
    updateElement(element.id, { content: value });
  };

  const handleNumericInput = (key: keyof Element['style']['desktop'], value: string) => {
    const numValue = Math.round(parseFloat(value));
    if (!isNaN(numValue) && numValue >= 0) {
      handleStyleChange(key, numValue);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Element Settings ({viewportMode})</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStyleChange('hidden', !currentStyle.hidden)}
            className="p-1 text-gray-500 hover:bg-gray-50 rounded"
            title={currentStyle.hidden ? 'Show element' : 'Hide element'}
          >
            {currentStyle.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => duplicateElement(element.id)}
            className="p-1 text-gray-500 hover:bg-gray-50 rounded"
            title="Duplicate element"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => removeElement(element.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            title="Delete element"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {(element.type === 'text' || element.type === 'button') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.type === 'text' ? 'Text Content' : 'Button Text'}
            </label>
            <textarea
              value={element.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anchor Point</label>
          <select
            value={currentStyle.anchor || 'none'}
            onChange={(e) => handleStyleChange('anchor', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="none">None</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
          <select
            value={currentStyle.alignment || 'left'}
            onChange={(e) => handleStyleChange('alignment', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        {element.type === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Fit</label>
            <select
              value={currentStyle.objectFit || 'cover'}
              onChange={(e) => handleStyleChange('objectFit', e.target.value as ImageFit)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="none">None</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <input
              type="number"
              value={Math.round(currentStyle.width) || 0}
              onChange={(e) => handleNumericInput('width', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input
              type="number"
              value={Math.round(currentStyle.height) || 0}
              onChange={(e) => handleNumericInput('height', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">X Position</label>
            <input
              type="number"
              value={Math.round(currentStyle.x) || 0}
              onChange={(e) => handleNumericInput('x', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Y Position</label>
            <input
              type="number"
              value={Math.round(currentStyle.y) || 0}
              onChange={(e) => handleNumericInput('y', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {(element.type === 'text' || element.type === 'button') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
              <select
                value={currentStyle.fontFamily || 'Onest'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Onest">Onest</option>
                <option value="Manrope">Manrope</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
              <select
                value={currentStyle.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <input
                type="number"
                value={Math.round(currentStyle.fontSize || 16)}
                onChange={(e) => handleNumericInput('fontSize', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
              <input
                type="number"
                step="0.1"
                value={currentStyle.lineHeight || 1.5}
                onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Transform</label>
              <select
                value={currentStyle.textTransform || 'none'}
                onChange={(e) => handleStyleChange('textTransform', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="none">None</option>
                <option value="uppercase">Uppercase</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={currentStyle.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full h-8"
              />
            </div>
          </>
        )}

        {(element.type === 'button' || element.type === 'shape') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={currentStyle.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-full h-8"
              />
            </div>
            {element.type === 'button' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                <input
                  type="number"
                  value={currentStyle.borderRadius || 0}
                  onChange={(e) => handleNumericInput('borderRadius', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
          <input
            type="number"
            value={Math.round(currentStyle.zIndex) || 0}
            onChange={(e) => handleNumericInput('zIndex', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};