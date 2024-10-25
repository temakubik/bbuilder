import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { X } from 'lucide-react';

export const CodePreview: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { elements, backgroundColor, canvasSize } = useEditorStore();

  const generateHTML = () => {
    const styles = `
.banner-container {
  width: 100%;
  max-width: ${canvasSize.width}px;
  margin: 0 auto;
}
.banner {
  width: 100%;
  height: ${canvasSize.height}px;
  position: relative;
  overflow: hidden;
  background-color: ${backgroundColor};
}
.banner * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .banner {
    width: 100%;
    max-width: 728px;
  }
}
@media (max-width: 480px) {
  .banner {
    width: 100%;
    max-width: 320px;
  }
}`;

    const elementsHTML = elements
      .filter(element => !element.style.desktop.hidden)
      .map(element => {
        const { style, type, content } = element;
        const desktop = style.desktop;
        
        const getPosition = () => {
          if (desktop.anchor === 'top-right') {
            return `right: ${desktop.x}px; left: auto; top: ${desktop.y}px;`;
          } else if (desktop.anchor === 'top-left') {
            return `left: ${desktop.x}px; right: auto; top: ${desktop.y}px;`;
          } else if (desktop.anchor === 'bottom-right') {
            return `right: ${desktop.x}px; left: auto; bottom: ${desktop.y}px;`;
          } else if (desktop.anchor === 'bottom-left') {
            return `left: ${desktop.x}px; right: auto; bottom: ${desktop.y}px;`;
          } else if (desktop.alignment === 'right') {
            return `right: ${desktop.x}px; left: auto;`;
          } else if (desktop.alignment === 'center') {
            return `left: 50%; transform: translateX(-50%);`;
          }
          return `left: ${desktop.x}px;`;
        };

        const elementClass = `banner-element-${element.id}`;
        const elementStyles = `
.${elementClass} {
  position: absolute;
  ${getPosition()}
  width: ${desktop.width}px;
  height: ${desktop.height}px;
  ${desktop.color ? `color: ${desktop.color};` : ''}
  ${desktop.backgroundColor ? `background-color: ${desktop.backgroundColor};` : ''}
  ${desktop.fontSize ? `font-size: ${desktop.fontSize}px;` : ''}
  ${desktop.fontFamily ? `font-family: '${desktop.fontFamily}', sans-serif;` : ''}
  ${desktop.fontWeight ? `font-weight: ${desktop.fontWeight};` : ''}
  ${desktop.lineHeight ? `line-height: ${desktop.lineHeight};` : ''}
  ${desktop.textTransform ? `text-transform: ${desktop.textTransform};` : ''}
  ${desktop.borderRadius ? `border-radius: ${desktop.borderRadius}px;` : ''}
  z-index: ${desktop.zIndex};
  ${type === 'button' ? 'cursor: pointer; border: none; outline: none;' : ''}
  ${type === 'image' ? `object-fit: ${desktop.objectFit || 'cover'};` : ''}
}

${style.tablet ? `
@media (max-width: 768px) {
  .${elementClass} {
    ${style.tablet.width ? `width: ${style.tablet.width}px;` : ''}
    ${style.tablet.height ? `height: ${style.tablet.height}px;` : ''}
    ${style.tablet.x !== undefined ? `left: ${style.tablet.x}px;` : ''}
    ${style.tablet.y !== undefined ? `top: ${style.tablet.y}px;` : ''}
    ${style.tablet.fontSize ? `font-size: ${style.tablet.fontSize}px;` : ''}
  }
}` : ''}

${style.mobile ? `
@media (max-width: 480px) {
  .${elementClass} {
    ${style.mobile.width ? `width: ${style.mobile.width}px;` : ''}
    ${style.mobile.height ? `height: ${style.mobile.height}px;` : ''}
    ${style.mobile.x !== undefined ? `left: ${style.mobile.x}px;` : ''}
    ${style.mobile.y !== undefined ? `top: ${style.mobile.y}px;` : ''}
    ${style.mobile.fontSize ? `font-size: ${style.mobile.fontSize}px;` : ''}
  }
}` : ''}`;

        let elementHTML = '';
        switch (type) {
          case 'text':
            elementHTML = `<p class="${elementClass}">${content}</p>`;
            break;
          case 'image':
            elementHTML = `<img class="${elementClass}" src="${content}" alt="" />`;
            break;
          case 'button':
            elementHTML = `<button class="${elementClass}">${content}</button>`;
            break;
          case 'shape':
            elementHTML = `<div class="${elementClass}"></div>`;
            break;
        }

        return { styles: elementStyles, html: elementHTML };
      });

    const allStyles = `<style>\n${styles}\n${elementsHTML.map(e => e.styles).join('\n')}\n</style>`;
    const allHTML = `<div class="banner-container">\n  <div class="banner">\n    ${elementsHTML.map(e => '    ' + e.html).join('\n')}\n  </div>\n</div>`;

    return allStyles + '\n' + allHTML;
  };

  const formattedCode = generateHTML();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Banner Code</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            <code>{formattedCode}</code>
          </pre>
        </div>
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={() => navigator.clipboard.writeText(formattedCode)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy Code
          </button>
        </div>
      </div>
    </div>
  );
};