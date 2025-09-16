import React, { type ReactNode } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="flex flex-col bg-gray-50">
      <Header />
      <main className={`flex-grow w-full pb-32 md:pb-24 ${className}`}>
        {children}
      </main>
      <Footer className="mt-auto" />
    </div>
  );
};

export default PageLayout;
