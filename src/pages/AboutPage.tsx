import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-dark p-6">
      <div className="max-w-3xl mx-auto bg-light p-8 rounded shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-center">About Nomad Tales</h1>
        <p className="text-lg mb-6">
          Welcome to <strong>Nomad Tales</strong>, your ultimate destination for discovering and sharing travel experiences. 
          Whether you're exploring breathtaking landscapes, vibrant cities, or hidden gems, Nomad Tales connects 
          travelers from around the world to inspire new adventures.
        </p>
        <p className="text-lg">
          Our mission is to make travel exploration accessible and enjoyable for everyone. 
          Share your stories, discover new destinations, and connect with like-minded explorers.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
