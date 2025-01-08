import React from 'react';

const LandingPage = () => {
  return (
    <>
        <div className="min-h-screen bg-background text-dark flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-bold text-accent">
                Welcome to Nomad Tales
            </h1>
            <p className="mt-4 text-center text-dark text-sm sm:text-base md:text-lg max-w-2xl">
                Discover, share, and explore captivating travel stories from around the world.
            </p>
            <button className="mt-8 px-6 py-3 bg-dark text-light rounded hover:bg-accent">
                Get Started
            </button>
        </div>
    </>
  );
};

export default LandingPage;
