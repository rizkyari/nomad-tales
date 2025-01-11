import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import apiClient from '../utils/api';
import Loader from './Loader';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategory: {
    id: number;
    name: string;
    description: string | null;
    documentId: string;
  } | null;
  onSuccess: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  currentCategory,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (currentCategory) {
      setName(currentCategory.name);
      setDescription(currentCategory.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [currentCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentCategory) {
        await apiClient.put(`/api/categories/${currentCategory.documentId}`, {
          data: {
            name,
            description
          },
        });
        alert('Category updated successfully.');
      } else {
        await apiClient.post('/api/categories', {
          data: {
            name,
            description
          },
        });
        alert('Category created successfully.');
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentCategory ? 'Edit Category' : 'Create Category'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-4 py-2 w-full rounded"
            rows={3}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-dark text-light px-4 py-2 rounded hover:bg-accent"
          disabled={loading}
        >
          {loading ? (<Loader text='Saving...'/>) : 'Save'}
        </button>
      </form>
    </Modal>
  );
};

export default CategoryModal;