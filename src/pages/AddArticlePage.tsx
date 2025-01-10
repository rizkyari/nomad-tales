import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

const AddArticlePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

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
      setError('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const coverImageUrl = await handleImageUpload();

      const response = await apiClient.post('/api/articles', {
        data: {
          title,
          description,
          cover_image_url: coverImageUrl || null,
          category,
        },
      });
      console.log(response);
      
      alert('Article created successfully!');
      navigate('/articles');
    } catch (error: any) {
      console.error('Failed to create article:', error);
      setError('Failed to create article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto bg-light p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create Article</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-4 py-2 w-full rounded"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border px-4 py-2 w-full rounded"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Category */}
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
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div className="mb-4">
            <label htmlFor="imageFile" className="block mb-2 text-sm font-medium">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              id="imageFile"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="border px-4 py-2 w-full rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-dark text-light px-4 py-2 rounded hover:bg-accent w-full"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddArticlePage;
