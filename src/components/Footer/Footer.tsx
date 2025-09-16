import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            hecho con ❤️ por Jian
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
