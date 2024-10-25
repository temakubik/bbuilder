import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { Element as ElementType } from '../types/editor';
import { Settings, Copy, Trash2, EyeOff } from 'lucide-react';

interface ElementProps {
  element: ElementType;
}

interface ContextMenu {
  x: number;
  y: number;
  elementId: string;
}

const Element: React.FC<ElementProps> = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });
  const { selectedElement, setSelectedElement, viewportMode, duplicateElement, removeElement, updateElement } = useEditorStore();
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const style = {
    ...element.style.desktop,
    ...element.style[viewportMode],
  };

  if (style.hidden) {
    return null;
  }

  const getElementPosition = () => {
    const { alignment, x, anchor } = style;
    
    if (anchor === 'top-right') {
      return { right: x || 0, left: 'auto', top: style.y || 0 };
    } else if (anchor === 'top-left') {
      return { left: x || 0, right: 'auto', top: style.y || 0 };
    } else if (anchor === 'bottom-right') {
      return { right: x || 0, left: 'auto', bottom: style.y || 0 };
    } else if (anchor === 'bottom-left') {
      return { left: x || 0, right: 'auto', bottom: style.y || 0 };
    } else if (alignment === 'right') {
      return { right: x || 0, left: 'auto' };
    } else if (alignment === 'center') {
      return { left: '50%', transform: 'translateX(-50%)' };
    } else {
      return { left: x || 0, right: 'auto' };
    }
  };

  const elementStyle = {
    transform: transform ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)` : undefined,
    width: `${Math.round(style.width || 100)}px`,
    height: `${Math.round(style.height || 40)}px`,
    top: `${Math.round(style.y || 0)}px`,
    color: style.color || '#000000',
    backgroundColor: style.backgroundColor,
    fontSize: style.fontSize ? `${Math.round(style.fontSize)}px` : '16px',
    fontFamily: style.fontFamily || 'Onest',
    fontWeight: style.fontWeight || 'normal',
    lineHeight: style.lineHeight || 1.5,
    textTransform: style.textTransform || 'none',
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
    zIndex: Math.round(style.zIndex) || 0,
    ...getElementPosition(),
    position: 'absolute' as const,
    cursor: 'move',
    outline: selectedElement === element.id ? '2px solid #3B82F6' : undefined,
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      elementId: element.id,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element.id);
  };

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={elementStyle} 
        {...listeners} 
        {...attributes}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className="hover:outline hover:outline-2 hover:outline-blue-200"
      >
        {element.type === 'text' && (
          <p style={{ margin: 0 }}>{element.content}</p>
        )}
        {element.type === 'image' && (
          <img 
            src={element.content} 
            alt="" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: style.objectFit || 'cover' 
            }}
          />
        )}
        {element.type === 'button' && (
          <button 
            className="w-full h-full px-4 py-2"
            style={{
              backgroundColor: style.backgroundColor,
              color: style.color,
              borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
            }}
          >
            {element.content}
          </button>
        )}
        {element.type === 'shape' && (
          <div className="w-full h-full rounded" />
        )}
      </div>

      {contextMenu && contextMenu.elementId === element.id && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg py-1 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              setSelectedElement(element.id);
              setContextMenu(null);
            }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              duplicateElement(element.id);
              setContextMenu(null);
            }}
          >
            <Copy size={16} />
            <span>Duplicate</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              updateElement(element.id, {
                style: {
                  ...element.style,
                  desktop: {
                    ...element.style.desktop,
                    hidden: true,
                  },
                },
              });
              setContextMenu(null);
            }}
          >
            <EyeOff size={16} />
            <span>Hide</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center space-x-2"
            onClick={() => {
              removeElement(element.id);
              setContextMenu(null);
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

export const Canvas: React.FC = () => {
  const { elements, canvasSize, zoom, viewportMode, updateElement, setSelectedElement, backgroundColor } = useEditorStore();
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const element = elements.find((el) => el.id === active.id);
    if (element) {
      const currentStyle = {
        ...element.style.desktop,
        ...element.style[viewportMode]
      };
      
      const newX = Math.round((currentStyle.x || 0) + delta.x);
      const newY = Math.round((currentStyle.y || 0) + delta.y);
      
      const breakpointStyle = viewportMode === 'desktop' 
        ? { desktop: { ...element.style.desktop, x: newX, y: newY } }
        : { [viewportMode]: { ...element.style[viewportMode], x: newX, y: newY } };

      updateElement(element.id, {
        style: {
          ...element.style,
          ...breakpointStyle
        }
      });
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  const scale = zoom / 100;
  const width = viewportMode === 'mobile' ? 320 : viewportMode === 'tablet' ? 768 : canvasSize.width;
  const height = canvasSize.height;

  return (
    <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-8">
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="banner shadow-lg"
          style={{
            width: `${width * scale}px`,
            height: `${height * scale}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            position: 'relative',
            backgroundColor: backgroundColor || '#ffffff',
          }}
          onClick={handleCanvasClick}
        >
          {elements.map((element) => (
            <Element key={element.id} element={element} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};