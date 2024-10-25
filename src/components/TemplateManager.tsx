import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Save, Trash2 } from 'lucide-react';

export const TemplateManager: React.FC = () => {
  const { templates, saveTemplate, loadTemplate, removeTemplate } = useEditorStore();
  const [templateName, setTemplateName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSave = () => {
    if (templateName.trim()) {
      saveTemplate(templateName.trim());
      setTemplateName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="border-t">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Templates</h3>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Save size={16} />
            <span>Save Template</span>
          </button>
        </div>

        {showSaveDialog && (
          <div className="mb-4">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name"
              className="w-full px-3 py-2 border rounded-md mb-2"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
            >
              <span className="text-sm">{template.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadTemplate(template.id)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Load
                </button>
                <button
                  onClick={() => removeTemplate(template.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No saved templates yet
          </p>
        )}
      </div>
    </div>
  );
};