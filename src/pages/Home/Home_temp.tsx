import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { encryptData } from '../../utils/crypto';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

interface PatientFormData {
  fullName: string;
  age: string;
  secretKey: string;
}

const Home: React.FC = () => {
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    age: '',
    secretKey: uuidv4(),
  });
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [shareLink, setShareLink] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

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
        secretKey: formData.secretKey
      };

      const encryptedData = encryptData(testData, formData.secretKey);
      const testUrl = new URL(window.location.origin + '/test');
      testUrl.searchParams.set('data', encodeURIComponent(encryptedData));
      
      setShareLink(testUrl.toString());
      setShowShareModal(true);
      
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

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(formData.secretKey);
    alert('Clave copiada al portapapeles');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Sistema de Pruebas Psicológicas" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Generar Nueva Prueba
          </h1>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo del Paciente
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Edad
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-20 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="30"
              />
            </div>
            
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                Clave Secreta
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="secretKey"
                  name="secretKey"
                  value={formData.secretKey}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleCopySecretKey}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Copiar
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Guarda esta clave para acceder a los resultados más tarde.
              </p>
            </div>
            
            <div className="pt-4">
              <button
                onClick={generateTestLink}
                disabled={!formData.fullName || !formData.age}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  !formData.fullName || !formData.age
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Generar Enlace de Prueba
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal para compartir enlace */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enlace de Prueba Generado
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Comparte este enlace con el paciente para que pueda realizar la prueba:
            </p>
            
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono overflow-x-auto"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm whitespace-nowrap"
              >
                {copyStatus === 'copied' ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Asegúrate de guardar la clave secreta. Será necesaria para ver los resultados de la prueba.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  // Resetear el formulario
                  setFormData({
                    fullName: '',
                    age: '',
                    secretKey: uuidv4(),
                  });
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Home;
