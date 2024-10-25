import React from 'react';
import { Type, Image, Square, MousePointer } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { ElementType } from '../types/editor';

export const ElementPicker: React.FC = () => {
  const addElement = useEditorStore((state) => state.addElement);

  const handleAddElement = (type: ElementType) => {
    const defaultSizes = {
      text: { width: 200, height: 30 },
      image: { width: 300, height: 80 },
      button: { width: 120, height: 40 },
      shape: { width: 100, height: 60 }
    };

    const { width, height } = defaultSizes[type];

    const element = {
      id: `element-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text' : 
               type === 'button' ? 'Click Me' : 
               type === 'image' ? 'https://source.unsplash.com/random/300x200' : '',
      style: {
        desktop: {
          x: 20,
          y: 10,
          width,
          height,
          color: '#000000',
          backgroundColor: type === 'button' ? '#3B82F6' : undefined,
          fontSize: 16,
          fontFamily: 'Onest',
          fontWeight: 'normal',
          lineHeight: 1.5,
          textTransform: 'none',
          borderRadius: type === 'button' ? 4 : undefined,
          zIndex: 1,
          objectFit: type === 'image' ? 'cover' : undefined,
        }
      }
    };
    addElement(element);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => handleAddElement('text')}
        className="flex items-center justify-center space-x-2 p-3 bg-gray-100 rounded hover:bg-gray-200"
      >
        <Type size={16} />
        <span>Text</span>
      </button>
      <button
        onClick={() => handleAddElement('image')}
        className="flex items-center justify-center space-x-2 p-3 bg-gray-100 rounded hover:bg-gray-200"
      >
        <Image size={16} />
        <span>Image</span>
      </button>
      <button
        onClick={() => handleAddElement('shape')}
        className="flex items-center justify-center space-x-2 p-3 bg-gray-100 rounded hover:bg-gray-200"
      >
        <Square size={16} />
        <span>Shape</span>
      </button>
      <button
        onClick={() => handleAddElement('button')}
        className="flex items-center justify-center space-x-2 p-3 bg-gray-100 rounded hover:bg-gray-200"
      >
        <MousePointer size={16} />
        <span>Button</span>
      </button>
    </div>
  );
};