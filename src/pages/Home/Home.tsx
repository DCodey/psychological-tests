import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../../utils/crypto';
import type { Test } from '../../types/test.types';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TestList from '../../components/TestList/TestList';
import PageLayout from '../../layouts/PageLayout';

interface PatientFormData {
  fullName: string;
  age: string;
  secretKey: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const copyLinkToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
      return true;
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
      return false;
    }
  };

  const handleCopyShareLink = () => {
    copyLinkToClipboard(shareLink);
  };
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientFormData>({
    fullName: '',
    age: '',
    secretKey: 'clave-secreta-123' // Valor por defecto
  });

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
      setCurrentTestId(testId);
      setShowPatientForm(true);
    }
  };

  const handlePatientDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestId) return;

    // Obtener la configuración del test actual
    const currentTest = tests.find((test: Test) => test.id === currentTestId);
    if (!currentTest) {
      console.error('No se encontró la configuración del test');
      return;
    }

    const testId = generateTestId();

    // Crear objeto con los datos del paciente
    const patientInfo = {
      name: patientData.fullName,
      age: patientData.age,
      secretKey: patientData.secretKey,
      timestamp: Date.now(),
      testType: currentTestId
    };

    try {
      // Cifrar los datos del paciente
      const encryptedData = encryptData(patientInfo, patientData.secretKey);

      // Generar URL para el paciente
      const patientLink = `${window.location.origin}${currentTest.url}?data=${encodeURIComponent(encryptedData)}`;

      // Guardar los datos en localStorage para referencia del psicólogo
      const savedTests = JSON.parse(localStorage.getItem('psychologistTests') || '{}');
      savedTests[testId] = {
        patientName: patientData.fullName,
        testId,
        testType: currentTestId,
        testTitle: currentTest.title,
        timestamp: Date.now(),
        status: 'pending'
      };
      localStorage.setItem('psychologistTests', JSON.stringify(savedTests));

      // Actualizar el estado
      setShareLink(patientLink);
      setShowPatientForm(false);
      setShowShareModal(true);

      // Reset form
      setPatientData({
        fullName: '',
        age: '',
        secretKey: 'clave-secreta-123' // Mantener el valor por defecto
      });

    } catch (error) {
      console.error('Error al procesar los datos del paciente:', error);
      alert('Ocurrió un error al generar el enlace de la prueba. Por favor, intente nuevamente.');
    }
  };

  const generateTestId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handlePatientDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: name === 'age' ? value.replace(/\D/g, '') : value
    }));
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
