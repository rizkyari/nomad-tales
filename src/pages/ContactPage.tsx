import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background text-dark p-6">
      <div className="max-w-3xl mx-auto bg-light p-8 rounded shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-lg mb-6 text-center">
          Feel free to reach out through any of the platforms below:
        </p>
        <div className="flex flex-col items-center space-y-4">
          <div>
            <strong>Email:</strong> 
            <a href="mailto:rizkyari4121@gmail.com" className="text-accent ml-2 hover:underline">
              rizkyari4121@gmail.com
            </a>
          </div>
          <div>
            <strong>GitHub:</strong> 
            <a href="https://github.com/rizkyari" target="_blank" rel="noopener noreferrer" className="text-accent ml-2 hover:underline">
              github.com/rizkyari
            </a>
          </div>
          <div>
            <strong>LinkedIn:</strong> 
            <a href="https://www.linkedin.com/in/rizkyarihar/" target="_blank" rel="noopener noreferrer" className="text-accent ml-2 hover:underline">
              linkedin.com/in/rizkyarihar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
