import React from 'react';
import { Construction } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6 animate-bounce">
          <Construction className="w-16 h-16 text-yellow-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Projects Section Coming Soon
        </h1>
        <p className="text-lg text-black-300 max-w-xl mx-auto">
          We’re working hard to bring you the latest updates on our ongoing and completed construction projects. Stay tuned!
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
