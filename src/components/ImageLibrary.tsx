import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Trash2, Plus, MoveRight } from 'lucide-react';
import axios from 'axios';

export const ImageLibrary: React.FC = () => {
  const { uploadedImages, addUploadedImage, removeUploadedImage, addElement } = useEditorStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        params: {
          key: '9c876b9e8b79280ef7385eda1f9e970e',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      const { data } = response.data;
      addUploadedImage({
        id: data.id,
        url: data.url,
        thumbnail: data.thumb.url,
        name: file.name,
        deleteUrl: data.delete_url,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageDelete = async (id: string) => {
    const image = uploadedImages.find((img) => img.id === id);
    if (!image) return;

    try {
      removeUploadedImage(id);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleAddToCanvas = (image: typeof uploadedImages[0]) => {
    addElement({
      id: `element-${Date.now()}`,
      type: 'image',
      content: image.url,
      style: {
        desktop: {
          x: 20,
          y: 10,
          width: 300,
          height: 80,
          zIndex: 1,
          objectFit: 'cover',
          alignment: 'none',
        }
      }
    });
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Image Library</h3>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Plus size={16} />
            <span>Add Image</span>
          </div>
        </label>
      </div>

      {isUploading && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {uploadedImages.map((image) => (
          <div
            key={image.id}
            className="relative group rounded overflow-hidden bg-gray-100"
          >
            <img
              src={image.thumbnail}
              alt={image.name}
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <button
                onClick={() => handleAddToCanvas(image)}
                className="p-1 text-white hover:text-blue-300"
                title="Add to canvas"
              >
                <MoveRight size={16} />
              </button>
              <button
                onClick={() => handleImageDelete(image.id)}
                className="p-1 text-white hover:text-red-300"
                title="Delete from library"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {uploadedImages.length === 0 && !isUploading && (
        <div className="text-center text-gray-500 py-8">
          No images in library. Upload some images to get started.
        </div>
      )}
    </div>
  );
};