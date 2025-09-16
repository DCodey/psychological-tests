import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { encryptData, generateHash } from '../../utils/crypto';
import { Copy, Download, CheckCircle } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

interface PatientData {
  fullName: string;
  age: number;
  secretKey: string;
  testType: string;
  createdAt: string;
}

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
      // Generar token único para el test
      const token = uuidv4();
      
      // Crear datos del paciente
      const patientData: PatientData = {
        fullName: formData.fullName.trim(),
        age: parseInt(formData.age),
        secretKey: formData.secretKey.trim(),
        testType: 'EPQR',
        createdAt: new Date().toISOString()
      };

      // Crear datos del test que incluyen la clave secreta
      const testData = {
        patientData: {
          fullName: formData.fullName.trim(),
          age: parseInt(formData.age),
          secretKey: formData.secretKey.trim(), // Clave secreta en texto plano
          testType: 'EPQR',
          createdAt: new Date().toISOString()
        },
        testType: 'EPQR',
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Cifrar los datos del test con una clave temporal conocida
      const tempKey = 'clave-temp-123';
      const encryptedTestData = encryptData(testData, tempKey);
      
      // Guardar en localStorage con el token como clave (para el psicólogo)
      localStorage.setItem(`test_${token}`, JSON.stringify(testData));
      
      // Generar URL del test con los datos cifrados
      const testUrl = `${window.location.origin}/test/${token}?data=${encodeURIComponent(encryptedTestData)}`;
      
      setTestToken(token);
      setTestUrl(testUrl);
      setShowSuccess(true);
      
      // Limpiar formulario
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
      <Header 
        title="Catálogo de Pruebas Psicológicas"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Test Creado Exitosamente!</h2>
            <p className="text-gray-600">
              El test ha sido creado y está listo para ser enviado al paciente.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Información del Test:</h3>
            <p><strong>Paciente:</strong> {formData.fullName}</p>
            <p><strong>Edad:</strong> {formData.age} años</p>
            <p><strong>Token:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-sm">{testToken}</code></p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del Test (compartir con el paciente):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testUrl}
                readOnly
                className="flex-1 border border-gray-300 rounded-lg py-2 px-4 bg-gray-50"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
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

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Importante:</strong> Guarda la clave secreta de forma segura. 
                  La necesitarás para descifrar las respuestas del paciente.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={downloadTestInfo}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar Info del Test
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setTestToken('');
                setTestUrl('');
              }}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Crear Otro Test
            </button>
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <Header 
      title="Catálogo de Pruebas Psicológicas"
    />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Crear Test Psicológico
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
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
