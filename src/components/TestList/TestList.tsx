import React from 'react';
import TestCard from '../TestCard/TestCard';
import type { Test } from '../../types/test.types';

interface TestListProps {
  tests: Test[];
  onStartTest?: (testId: string) => void;
  onNavigateTest?: (testId: string) => void;
}

const TestList: React.FC<TestListProps> = ({ tests, onStartTest, onNavigateTest }) => {
  const handleCardClick = (testId: string) => {
    if (onNavigateTest) {
      onNavigateTest(testId);
    }
  };

  return (
    <div className="h-screen max-w-7xl mx-auto">
      <div className="hidden md:block mb-8 text-center">
        <h2 className="md:text-2xl font-semibold text-gray-800 mb-2">Nuestras Pruebas</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Evaluaciones validadas científicamente para un análisis psicológico preciso.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tests.map((test) => (
          <TestCard 
            key={test.id} 
            test={test} 
            onStartTest={onStartTest ? () => onStartTest(test.id) : undefined}
            onClick={onNavigateTest ? () => handleCardClick(test.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default TestList;
