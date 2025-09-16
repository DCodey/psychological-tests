import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-white border-t border-gray-200 fixed bottom-0 w-full py-1 md:py-4 items-center ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-600 text-sm md:text-md md:mb-0">
            Hecho con ❤️ por Jian
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
