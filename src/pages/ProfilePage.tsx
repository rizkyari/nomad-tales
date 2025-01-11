import React, { useEffect, useState } from 'react';
import {verifyUser} from '../utils/api';
import Loading from '../components/Loading';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await verifyUser();
        setUser(response);
      } catch (error: any) {
        setError('Failed to fetch user data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
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
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {user && (
        <div className="bg-light p-6 rounded shadow-md max-w-sm w-full">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Member Since:</strong>{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
