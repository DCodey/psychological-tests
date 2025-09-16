import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Test } from '../../types/test.types';
import TestList from '../../components/TestList/TestList';
import PageLayout from '../../layouts/PageLayout';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [tests] = useState<Test[]>([
    {
      id: '1',
      title: 'Test de rasgos de personalidad Eysenck(EPQ-R)',
      description: 'Evalúa rasgos de personalidad en tres dimensiones principales',
      category: 'Personalidad',
      duration: '20 min',
      questions: 47,
      url: '/test/epqr'
    },
    {
      id: '2',
      title: 'Inventario de Depresión de Beck (BDI-II)',
      description: 'Mide la severidad de la depresión en adultos y adolescentes.',
      category: 'Depresión',
      duration: '15 min',
      questions: 21,
      url: '/test/bdi'
    },
    {
      id: '3',
      title: 'Test de Personalidad Big Five',
      description: 'Evalúa los cinco grandes rasgos de personalidad: apertura, responsabilidad, extraversión, amabilidad y neuroticismo.',
      category: 'Personalidad',
      duration: '20 min',
      questions: 50,
      url: '/test/bigfive'
    },
    {
      id: '4',
      title: 'Escala de Autoestima de Rosenberg',
      description: 'Mide la autoestima global mediante 10 ítems de autoevaluación.',
      category: 'Autoestima',
      duration: '5 min',
      questions: 10,
      url: '/test/rosenberg'
    }
  ]);

  const handleStartTest = (testId: string) => {
    if (testId === '1') { // EPQR Test
      navigate('/psychologist/epqr');
    } else {
      console.log('Test ID no válido');
    }
  };

  return (
    <>
    <PageLayout>
        <div className="container mx-auto px-4 py-8 pb-20 md:py-12">
          <TestList
            tests={tests}
            onStartTest={handleStartTest}
          />
        </div>

      </PageLayout>
      </>
  );
};

export default Home;
