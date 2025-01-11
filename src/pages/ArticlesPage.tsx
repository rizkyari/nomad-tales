import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

interface Article {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  documentId: string;
  user: {
    username: string;
  };
  category: {
    name: string;
  } | null;
}

interface Category {
  id: number;
  name: string;
}

const ArticlesPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filters, setFilters] = useState<{ title?: string; category?: string }>({
        title: '',
        category: '',
    });
    const [filterInputs, setFilterInputs] = useState<{ title: string; category: string }>({
        title: '',
        category: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                'pagination[page]': String(page),
                'pagination[pageSize]': '5',
                'populate[user]': 'true',
                'populate[category]': 'true',
                ...(filters.title && { 'filters[title][$eqi]': filters.title }),
                ...(filters.category && { 'filters[category][name][$eqi]': filters.category }),
            }).toString();

            const response = await apiClient.get(`/api/articles?${query}`);
            const { data, meta } = response.data;

            setArticles((prev) => (page === 1 ? data : [...prev, ...data]));
            setTotalPages(meta.pagination.pageCount);
        } catch (error: any) {
            setError('Failed to fetch articles');
            console.error(error);
        } finally {
            setLoading(false);
        }
        };

        fetchArticles();
    }, [page, filters]);

    
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
            }
        };

        fetchCategories();
    }, []);

    const loadMore = () => {
        if (page < totalPages) {
        setPage((prevPage) => prevPage + 1);
        }
    };

    if (loading && page === 1) {
        return <div className="min-h-screen bg-background p-6">
                <Loading/>
                </div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className='flex justify-center items-center'>
                <h1 className="text-3xl font-bold text-center mb-6 mr-3">Articles</h1>
                <button
                    onClick={() => navigate('/articles/new')}
                    className="bg-dark text-light px-4 py-2 rounded hover:bg-accent mb-6"
                >
                    + Add
                </button>
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-col">
                    <label htmlFor="search" className="mb-1 text-sm font-medium text-gray-700">
                        Search by title
                    </label>
                    <input
                    id='search'
                    type="text"
                    name="title"
                    placeholder="Search by Title"
                    value={filterInputs.title}
                    onChange={(e) => setFilterInputs((prev) => ({ ...prev, title: e.target.value }))}
                    className="border px-4 py-2 rounded w-full md:w-auto"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">
                        Filter by Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={filterInputs.category}
                        onChange={(e) => setFilterInputs((prev) => ({ ...prev, category: e.target.value }))}
                        className="border px-4 py-2 rounded w-full md:w-auto"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex items-end'>
                    <button
                        onClick={() => {
                            setFilters(filterInputs);
                            setPage(1);
                        }}
                        className="bg-dark text-light px-4 py-2 rounded hover:bg-accent"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <div key={article.id} className="bg-light p-4 rounded shadow-md">
                        <img
                        src={article.cover_image_url || '/default-cover.png'}
                        alt={article.title}
                        className="h-40 w-full object-cover rounded mb-4"
                        />
                        <h2 className="text-xl font-bold">{article.title}</h2>
                        <p className="text-sm text-gray-600">
                            By {article.user.username} on{' '}
                            {new Date(article.createdAt).toLocaleDateString()}
                        </p>
                        {article.category && (
                            <p className="mt-2 text-accent">Category: {article.category.name}</p>
                        )}
                        <button
                        onClick={() => navigate(`/articles/${article.documentId}`)}
                        className="bg-dark text-light px-4 py-2 rounded hover:bg-accent my-3"
                        >
                            See More
                        </button>
                    </div>
                ))}
            </div>

            {page < totalPages && (
                <button
                    onClick={loadMore}
                    className="mt-6 bg-dark text-light py-2 px-4 rounded hover:bg-accent block mx-auto"
                >
                    Load More
                </button>
            )}
        </div>
    );
};

export default ArticlesPage;
