import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import CategoryModal from '../components/CategoryModal';
import Loading from '../components/Loading';

interface Category {
  id: number;
  name: string;
  description: string | null;
  documentId: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/categories');
      setCategories(response.data.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiClient.delete(`/api/categories/${id}`);
        alert('Category deleted successfully.');
        fetchCategories();
      } catch (err) {
        alert('Failed to delete category.');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto bg-light p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <button
            onClick={handleCreate}
            className="bg-dark text-light px-4 py-2 rounded hover:bg-accent"
          >
            Add Category
          </button>
        </div>

        {loading && <div><Loading/></div>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {category.description || 'No description'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-accent text-light px-2 py-1 rounded mr-2 hover:bg-dark"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-600 text-light px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentCategory={currentCategory}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
};

export default CategoryPage;
