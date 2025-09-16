import React from 'react';
import type { Test } from '../../types/test.types';

interface TestCardProps {
  test: Test;
  onStartTest?: (testId: string) => void;
  onClick?: (testId: string) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onStartTest, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick && onClick(test.id)}
    >
      <div className="p-4 md:p-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 md:px-3 py-1 rounded-full md:uppercase md:tracking-wider">
            {test.category}
          </span>
          <span className="hidden md:flex text-xs font-medium text-gray-500 bg-gray-100 px-2 md:px-2.5 py-1 rounded-full flex items-center">
            <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {test.duration}
          </span>
        </div>
        
        <h2 className="md:text-xl text-lg font-bold text-gray-800 mb-3 leading-tight">{test.title}</h2>
        <p className="text-gray-600 md:text-sm text-xs leading-relaxed mb-4">{test.description}</p>
      </div>
      
      <div className="bg-gray-50 px-4 md:px-6 py-4 flex justify-between items-center border-t border-gray-100">
        <span className="text-xs md:text-sm text-gray-500 flex items-center md:px-2 px-2">
          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          {test.questions} preguntas
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onStartTest && onStartTest(test.id);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white md:text-sm text-xs font-medium md:py-2 md:px-4 py-2 px-2 rounded-lg transition-colors text-sm flex items-center"
        >
          Comenzar
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TestCard;
