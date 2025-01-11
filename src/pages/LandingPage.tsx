import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faUsers, faCompass } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
  // Check if the user is authenticated
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-background text-dark">
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 md:px-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Nomad Tales</h1>
        <p className="text-lg md:text-xl mb-8">
          Discover unique travel destinations and share your experiences with the world.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/articles"
                className="bg-dark text-light px-6 py-3 rounded hover:bg-accent transition"
              >
                Explore Articles
              </Link>
              <Link
                to="/dashboard"
                className="bg-accent text-light px-6 py-3 rounded hover:bg-dark transition"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-accent text-light px-6 py-3 rounded hover:bg-dark transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-dark text-light px-6 py-3 rounded hover:bg-accent transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>
      <section className="py-16 px-4 md:px-10 bg-light">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Nomad Tales?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <FontAwesomeIcon icon={faGlobe} className="text-accent text-5xl mb-4" />
            <h3 className="text-xl font-bold">Inspiring Destinations</h3>
            <p>Discover new travel ideas from our growing collection of articles.</p>
          </div>
          <div className="text-center">
          <FontAwesomeIcon icon={faUsers} className="text-accent text-5xl mb-4" />
            <h3 className="text-xl font-bold">Community Driven</h3>
            <p>Share your own travel stories and connect with fellow explorers.</p>
          </div>
          <div className="text-center">
          <FontAwesomeIcon icon={faCompass} className="text-accent text-5xl mb-4" />
            <h3 className="text-xl font-bold">Easy to Use</h3>
            <p>Our user-friendly platform makes exploring and sharing a breeze.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
