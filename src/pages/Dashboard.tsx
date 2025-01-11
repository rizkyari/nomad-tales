import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { exportToCSV } from '../utils/exportToCSV';
import Loading from '../components/Loading';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [stats, setStats] = useState<{
    totalArticles: number;
    totalCategories: number;
    articleCountsByCategory: { [key: string]: number };
    topContributors: { username: string; articleCount: number }[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  interface Article {
    id: number;
    title: string;
    description: string;
    user: {
      username: string;
    };
    category: {
      name: string;
    } | null;
    createdAt: string;
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
    
        const articlesResponse = await apiClient.get('/api/articles?populate=*');
        const articles: Article[] = articlesResponse.data.data;

        setArticles(articles);

        const categoriesResponse = await apiClient.get('/api/categories');
        const categories = categoriesResponse.data.data;
    
        const totalArticles = articles.length;
        const totalCategories = categories.length;
    
        const articleCountsByCategory: { [key: string]: number } = {};
        articles.forEach((article) => {
          const categoryName = article.category?.name || 'Uncategorized';
          articleCountsByCategory[categoryName] =
            (articleCountsByCategory[categoryName] || 0) + 1;
        });
    
        const contributors: Record<string, number> = {};
        articles.forEach((article) => {
          const username = article.user.username;
          contributors[username] = (contributors[username] || 0) + 1;
        });
    
        const topContributors = Object.entries(contributors)
          .map(([username, articleCount]) => ({ username, articleCount }))
          .sort((a, b) => b.articleCount - a.articleCount)
          .slice(0, 5);
    
        setStats({
          totalArticles,
          totalCategories,
          articleCountsByCategory,
          topContributors,
        });
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const exportToPDF = async () => {
    const dashboardElement = document.getElementById('dashboard-content');
    if (!dashboardElement) {
      console.error('Dashboard content element not found');
      return;
    }
  
    const canvas = await html2canvas(dashboardElement, {
      scale: 2,
    });
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('dashboard.pdf');
  };

  const handleExportCSV = () => {
    const dataToExport = articles.map((article) => ({
      Title: article.title,
      Description: article.description,
      Author: article.user?.username || 'Unknown',
      Category: article.category?.name || 'Uncategorized',
      Published: new Date(article.createdAt).toLocaleDateString(),
    }));
  
    exportToCSV('articles.csv', dataToExport);
  };

  if (loading) {
    return <div className="min-h-screen bg-background p-6">
      <Loading/>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const barData = {
    labels: Object.keys(stats!.articleCountsByCategory),
    datasets: [
      {
        label: 'Articles by Category',
        data: Object.values(stats!.articleCountsByCategory),
        backgroundColor: '#AAB396',
        borderColor: '#674636',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: stats!.topContributors.map((contributor) => contributor.username),
    datasets: [
      {
        label: 'Top Contributors',
        data: stats!.topContributors.map((contributor) => contributor.articleCount),
        backgroundColor: ['#F7EED3', '#FFF8E8', '#AAB396', '#674636', '#F5D6D6'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto bg-light p-6 rounded shadow-md"> 
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
            onClick={() => exportToPDF()}
            className="bg-dark text-light px-4 py-2 rounded hover:bg-accent"
            >
              Export to PDF
            </button>
            <button
            onClick={() => handleExportCSV()}
            className="bg-accent text-light px-4 py-2 rounded hover:bg-dark"
            >
              Export to CSV
            </button>
          </div>
        </div>
        {/* Charts */}
        <div id="dashboard-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Articles by Category</h2>
            <Bar data={barData} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Top Contributors</h2>
            <Pie data={pieData} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

