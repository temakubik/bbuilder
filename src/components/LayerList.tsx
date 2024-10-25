import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { Move, Eye } from 'lucide-react';

export const LayerList: React.FC = () => {
  const { elements, selectedElement, setSelectedElement } = useEditorStore();

  return (
    <div className="space-y-1">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`flex items-center justify-between p-2 rounded cursor-pointer ${
            selectedElement === element.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => setSelectedElement(element.id)}
        >
          <div className="flex items-center space-x-2">
            <Move size={14} className="text-gray-400" />
            <span className="text-sm truncate">
              {element.type} - {element.content.substring(0, 15)}
              {element.content.length > 15 && '...'}
            </span>
          </div>
          <Eye size={14} className="text-gray-400" />
        </div>
      ))}
    </div>
  );
};