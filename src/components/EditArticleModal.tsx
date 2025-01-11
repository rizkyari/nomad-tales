import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import apiClient from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  currentData: {
    title: string;
    description: string;
    cover_image_url: string;
    category: number | null;
  };
}

interface Category {
  id: number;
  name: string;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({
  isOpen,
  onClose,
  articleId,
  currentData,
}) => {
  const [editData, setEditData] = useState(currentData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<number | null>(currentData.category);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setEditData(currentData);
      setCategory(currentData.category);
    }
  }, [isOpen, currentData]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const coverImageUrl = await handleImageUpload();
      await apiClient.put(`/api/articles/${articleId}`, {
        data: {
          ...editData,
          category,
          cover_image_url: coverImageUrl || editData.cover_image_url,
        },
      });

      alert('Article updated successfully!');
      onClose();
      navigate(0);
    } catch (error: any) {
      console.error('Failed to update article:', error);
      alert('Failed to update article.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('files', imageFile);

    try {
      const response = await apiClient.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data[0]?.url;
    } catch (error: any) {
      console.error('Image upload failed:', error);
      setError('Failed to upload image.');
      return null;
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/categories');
        const { data } = response.data;
  
        const mappedCategories = data.map((category: any) => ({
          id: category.id,
          name: category.name,
        }));
  
        setCategories(mappedCategories);

        if (currentData.category) {
          const matchingCategory = mappedCategories.find(
            (cat: Category) => cat.id === currentData.category
          );
          if (matchingCategory) {
            setCategory(matchingCategory.id);
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
      }
    };
  
    fetchCategories();
  }, [currentData.category]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Article">
      <form onSubmit={handleEditSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="border px-4 py-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="border px-4 py-2 w-full rounded"
            rows={4}
            required
          ></textarea>
        </div>

        <div className="mb-4">
            <label htmlFor="category" className="block mb-2 text-sm font-medium">
                Category
            </label>
            <select
            id="category"
            name="category"
            value={category || ''}
            onChange={(e) => setCategory(Number(e.target.value) || null)}
            className="border px-4 py-2 w-full rounded"
            >
                <option value="">Select Category</option>
                {categories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>

        <div className="mb-4">
          <label htmlFor="imageFile" className="block mb-2 text-sm font-medium">
            Cover Image
          </label>
          {imageFile || editData.cover_image_url ? (
    <div className="relative">
      <img
        src={
          imageFile
            ? URL.createObjectURL(imageFile)
            : editData.cover_image_url || '/default-cover.png'
        }
        alt="Cover"
        className="h-40 w-full object-cover rounded mb-4"
      />
      <button
        type="button"
        onClick={() => {
          setImageFile(null);
          setEditData((prev) => ({
            ...prev,
            cover_image_url: '',
          }));
        }}
        className="bg-dark text-light px-4 py-2 rounded hover:bg-accent mt-2"
      >
        Change Cover
      </button>
    </div>
  ) : (
    <div>
      <input
        type="file"
        id="imageFile"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="border px-4 py-2 w-full rounded"
      />
    </div>
  )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-dark text-light px-4 py-2 rounded hover:bg-accent w-full"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
};

export default EditArticleModal;
