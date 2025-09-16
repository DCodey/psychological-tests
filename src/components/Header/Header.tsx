import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle = '' }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{title}</h1>
          {subtitle && <p className="text-lg text-indigo-100">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
