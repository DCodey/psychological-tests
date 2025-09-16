import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { encryptData } from '../../utils/crypto';
import type { Test } from '../../types/test.types';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TestList from '../../components/TestList/TestList';

interface PatientFormData {
  fullName: string;
  age: string;
  secretKey: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'patient' | 'psychologist'>('patient');
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    age: '',
    secretKey: uuidv4(), // Generar una clave secreta única por defecto
  });
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? value.replace(/\D/g, '') : value,
    }));
  };

  const generateTestLink = () => {
    try {
      const testId = uuidv4();
      const testData = {
        patientName: formData.fullName,
        patientAge: formData.age,
        testId,
        timestamp: new Date().toISOString(),
        secretKey: formData.secretKey // Incluimos la clave secreta en los datos cifrados
      };

      // Cifrar todos los datos del paciente incluyendo la clave secreta
      const encryptedData = encryptData(testData, formData.secretKey);
      
      // Crear la URL con los datos cifrados
      const testUrl = new URL(window.location.origin + '/test');
      testUrl.searchParams.set('data', encodeURIComponent(encryptedData));
      
      // Actualizar el enlace de compartir directamente
      setShareLink(testUrl.toString());
      
      // Guardar los datos en localStorage para referencia futura
      const tests = JSON.parse(localStorage.getItem('psychologistTests') || '{}');
      tests[testId] = {
        ...testData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('psychologistTests', JSON.stringify(tests));
      
    } catch (error) {
      console.error('Error al generar el enlace:', error);
      alert('Ocurrió un error al generar el enlace. Por favor, intente nuevamente.');
    }
  };

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
      // Redirigir al nuevo sistema seguro
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        title="Catálogo de Pruebas Psicológicas"
      />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        
        <TestList 
          tests={tests} 
          onStartTest={handleStartTest} 
        />
      </main>
      
      <Footer />

      {/* Modal de formulario de paciente */}
      {showPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Datos del Paciente</h2>
                <button 
                  onClick={() => setShowPatientForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handlePatientDataSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo del paciente
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={patientData.fullName}
                    onChange={handlePatientDataChange}
                    placeholder="Ej: Juan Pérez"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Edad del paciente
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="120"
                    value={patientData.age}
                    onChange={handlePatientDataChange}
                    placeholder="Ej: 28"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Clave secreta
                  </label>
                  <input
                    type="text"
                    id="secretKey"
                    name="secretKey"
                    value={patientData.secretKey}
                    onChange={handlePatientDataChange}
                    placeholder="Ingrese la clave secreta"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Esta clave se usará para cifrar los resultados del test.</p>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    Generar enlace del test
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para compartir enlace */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Compartir prueba con el paciente</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">Copia el siguiente enlace y compártelo con tu paciente:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 text-sm truncate"
              />
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 disabled:opacity-50"
                disabled={copyStatus === 'copied'}
              >
                {copyStatus === 'copied' ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
