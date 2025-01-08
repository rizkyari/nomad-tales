import React from 'react';

const Footer = () => {
  return (
    <>
    <footer className="w-full bg-dark text-light px-6 py-4">
      <div className="text-center">
        &copy; {new Date().getFullYear()} Nomad Tales. All rights reserved.
      </div>
    </footer>
    </>
  );
};

export default Footer;
