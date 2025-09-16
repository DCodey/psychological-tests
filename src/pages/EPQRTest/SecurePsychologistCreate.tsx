import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { encryptData } from '../../utils/crypto';
import { Copy, Download, CheckCircle } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function SecurePsychologistCreate() {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    secretKey: ''
  });
  const [testToken, setTestToken] = useState<string>('');
  const [testUrl, setTestUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.age.trim() || !formData.secretKey.trim()) {
      alert('Por favor, complete todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const token = uuidv4();

      const testData = {
        patientData: {
          fullName: formData.fullName.trim(),
          age: parseInt(formData.age),
          secretKey: formData.secretKey.trim(),
          testType: 'EPQR',
          createdAt: new Date().toISOString()
        },
        testType: 'EPQR',
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      const tempKey = 'clave-temp-123';
      const encryptedTestData = encryptData(testData, tempKey);

      const testUrl = `${window.location.origin}/test/${token}?data=${encodeURIComponent(encryptedTestData)}`;

      const testWithUrl = {
        ...testData,
        testUrl: testUrl
      };

      localStorage.setItem(`test_${token}`, JSON.stringify(testWithUrl));

      setTestToken(token);
      setTestUrl(testUrl);
      setShowSuccess(true);
      setFormData({ fullName: '', age: '', secretKey: '' });

    } catch (error) {
      console.error('Error al crear el test:', error);
      alert('Error al crear el test. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(testUrl);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const downloadTestInfo = () => {
    const testInfo = {
      token: testToken,
      patientName: formData.fullName,
      secretKey: formData.secretKey,
      createdAt: new Date().toISOString(),
      url: testUrl
    };

    const blob = new Blob([JSON.stringify(testInfo, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_info_${testToken}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full max-w-2xl">
            <div className="text-center mb-6">
              <CheckCircle className="md:w-16 md:h-16 w-10 h-10 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
                ¡Test Creado Exitosamente!
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                El test ha sido creado y está listo para ser enviado al paciente.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Test (compartir con el paciente):
              </label>
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <input
                  type="text"
                  value={testUrl}
                  readOnly
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg py-2 px-4 bg-gray-50 overflow-x-auto"
                />
                <button
                  onClick={copyToClipboard}
                  className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  {copyStatus === 'copied' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Crear Test Psicológico
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo del paciente
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ej: Juan Pérez"
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
                value={formData.age}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ej: 25"
                min="1"
                max="120"
                required
              />
            </div>

            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                Clave secreta
              </label>
              <input
                type="password"
                id="secretKey"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Clave para descifrar resultados"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Esta clave será necesaria para descifrar las respuestas del paciente.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando test...' : 'Crear Test'}
            </button>
          </form>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Seguridad:</strong> Los datos del paciente se cifran con la clave secreta. 
                  El paciente no necesita conocer esta clave para responder el test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
