import React, { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { ElementPicker } from './components/ElementPicker';
import { ElementSettings } from './components/ElementSettings';
import { LayerList } from './components/LayerList';
import { CodePreview } from './components/CodePreview';
import { ImageLibrary } from './components/ImageLibrary';
import { TemplateManager } from './components/TemplateManager';
import { LoginForm } from './components/LoginForm';
import { Layers, Code, Image, Layout } from 'lucide-react';
import { useEditorStore } from './store/editorStore';

export function App() {
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'elements' | 'images' | 'templates'>('elements');
  const { elements, setCanvasSize, canvasSize, selectedElement, backgroundColor, setBackgroundColor, isAuthenticated } = useEditorStore();

  const handleSizeChange = (width: number, height: number) => {
    setCanvasSize(width, height);
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <input 
                type="color" 
                className="mt-1 w-full h-8"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Canvas Size</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => handleSizeChange(parseInt(e.target.value) || 728, canvasSize.height)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Width"
                />
                <input
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => handleSizeChange(canvasSize.width, parseInt(e.target.value) || 90)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Height"
                />
              </div>
              <select 
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
                value={`${canvasSize.width}x${canvasSize.height}`}
                onChange={(e) => {
                  if (e.target.value === 'custom') return;
                  const [width, height] = e.target.value.split('x').map(Number);
                  handleSizeChange(width, height);
                }}
              >
                <option value="custom">Custom Size</option>
                <option value="728x90">728 x 90 - Leaderboard</option>
                <option value="300x250">300 x 250 - Medium Rectangle</option>
                <option value="1200x200">1200 x 200 - Wide Banner</option>
                <option value="320x400">320 x 400 - Mobile Banner</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <Canvas />

        {/* Right Sidebar */}
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('elements')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'elements' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Layers size={16} />
                <span>Elements</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'images' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Image size={16} />
                <span>Images</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'templates' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Layout size={16} />
                <span>Templates</span>
              </div>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'elements' && (
              <>
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Add Elements</h3>
                  <ElementPicker />
                </div>

                <div className="p-4 border-b">
                  <h3 className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Layers size={16} />
                    <span>Layers ({elements.length})</span>
                  </h3>
                  <div className="mt-2">
                    <LayerList />
                  </div>
                </div>

                {selectedElement && <ElementSettings />}
              </>
            )}

            {activeTab === 'images' && <ImageLibrary />}
            {activeTab === 'templates' && <TemplateManager />}
          </div>

          <div className="p-4 border-t">
            <button
              onClick={() => setShowCodePreview(true)}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Code size={16} />
              <span>View Code</span>
            </button>
          </div>
        </div>
      </div>

      {showCodePreview && (
        <CodePreview onClose={() => setShowCodePreview(false)} />
      )}
    </div>
  );
}