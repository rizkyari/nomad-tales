import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';

interface Article {
    id: number;
    title: string;
    description: string;
    cover_image_url: string;
    createdAt: string;
}

const ArticleDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
        try {
            const response = await apiClient.get(`/api/articles/${id}?populate=*`);
            setArticle(response.data.data);
        } catch (error: any) {
            setError('Failed to fetch article details');
            console.error(error);
        } finally {
            setLoading(false);
        }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <div className='text-center'>
                    <h2>{error}</h2>
                    <Link to={`/articles`} className="text-dark hover:text-accent">Go Back To Article</Link>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                <div className='text-center'>
                    <h2>Article not found</h2>
                    <Link to={`/articles`} className="text-dark hover:text-accent">Go Back To Article</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto bg-light p-6 rounded shadow-md">
                <button
                    onClick={() => navigate('/articles')}
                    className="bg-dark text-light px-4 py-2 rounded hover:bg-accent mb-6"
                >
                    Back to Articles
                </button>
                <img
                src={article.cover_image_url || '/default-cover.png'}
                alt={article.title}
                className="h-60 w-full object-cover rounded mb-6"
                />

                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Published on {new Date(article.createdAt).toLocaleDateString()}
                </p>

                <p className="text-lg text-gray-700 mb-6">{article.description}</p>
            </div>
        </div>
    );
};

export default ArticleDetailsPage;
