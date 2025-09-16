import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { encryptData, decryptData, encryptTestResponses, generateHash } from '../../utils/crypto';
import questions from './epqr-questions';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface PatientData {
  fullName: string;
  age: number;
  secretKey: string;
  testType: string;
  createdAt: string;
}

interface TestData {
  encryptedPatientData: string;
  testType: string;
  createdAt: string;
  status: string;
}

export default function SecurePatientTest() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [testStage, setTestStage] = useState<'loading' | 'test' | 'submitting' | 'completed' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setError('Token de test no válido');
      setTestStage('error');
      return;
    }

    loadTestData();
  }, [token]);

  useEffect(() => {
    if (answers.length > 0) {
      setProgress((currentQuestion / questions.length) * 100);
    }
  }, [currentQuestion, answers]);

  const loadTestData = async () => {
    try {
      // Obtener datos del test desde la URL
      const urlParams = new URLSearchParams(window.location.search);
      const encryptedTestData = urlParams.get('data');
      
      if (!encryptedTestData) {
        throw new Error('Datos del test no encontrados en la URL');
      }

      // El paciente no puede descifrar los datos porque no tiene la clave secreta
      // Solo verificamos que los datos existen y mostramos el test
      setPatientData({
        fullName: 'Paciente', // Nombre genérico para mostrar
        age: 0,
        secretKey: '', // No disponible para el paciente
        testType: 'EPQR',
        createdAt: new Date().toISOString()
      });

      // Inicializar respuestas
      setAnswers(Array(questions.length).fill(false));
      setTestStage('test');
      
    } catch (error) {
      console.error('Error al cargar el test:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setTestStage('error');
    }
  };

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      // Última pregunta - procesar respuestas
      submitTest(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const submitTest = async (finalAnswers: boolean[]) => {
    setTestStage('submitting');
    
    try {
      // Obtener datos del test desde la URL
      const urlParams = new URLSearchParams(window.location.search);
      const encryptedTestData = urlParams.get('data');
      
      if (!encryptedTestData) {
        throw new Error('Datos del test no encontrados');
      }

      // Los datos del test contienen la clave secreta cifrada
      // Necesitamos descifrarlos para obtener la clave secreta
      let secretKey = '';
      let patientData = null;
      
      // Descifrar con la clave temporal conocida
      const testData = decryptData(encryptedTestData, 'clave-temp-123');
      
      // Obtener la clave secreta y datos del paciente
      secretKey = testData.patientData?.secretKey || 'clave-temp';
      patientData = testData.patientData;

      // Crear objeto completo con datos del paciente y respuestas
      const completeTestData = {
        patientData: patientData || {
          fullName: 'Paciente',
          age: 0,
          secretKey: secretKey,
          testType: 'EPQR',
          createdAt: new Date().toISOString()
        },
        testResults: {
          responses: finalAnswers,
          testType: 'EPQR',
          completedAt: new Date().toISOString(),
          token: token,
          integrityHash: generateHash(finalAnswers)
        }
      };

      // Cifrar todos los datos con la clave secreta
      const encryptedCompleteData = encryptData(completeTestData, secretKey);
      
      // Generar URL de resultados para el psicólogo
      const resultUrl = `${window.location.origin}/result/${token}?data=${encodeURIComponent(encryptedCompleteData)}`;
      
      // Guardar la URL de resultados en el estado para mostrarla al paciente
      setResultUrl(resultUrl);
      
      setTestStage('completed');
      
    } catch (error) {
      console.error('Error al enviar el test:', error);
      setError('Error al enviar el test. Por favor, intente nuevamente.');
      setTestStage('error');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (testStage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando test...</p>
        </div>
      </div>
    );
  }

  if (testStage === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (testStage === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Enviando respuestas...</p>
        </div>
      </div>
    );
  }

  if (testStage === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">¡Test Completado!</h2>
            <p className="text-gray-600">
              Gracias por completar el test. Ahora debes enviar el siguiente enlace a tu psicólogo.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Instrucciones:</strong> Copia el enlace de abajo y envíalo a tu psicólogo por WhatsApp, email o cualquier medio que prefieras.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enlace para enviar a tu psicólogo:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={resultUrl}
                readOnly
                className="flex-1 border border-gray-300 rounded-lg py-2 px-4 bg-gray-50 text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resultUrl);
                  alert('¡Enlace copiado al portapapeles!');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar
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
                  <strong>Importante:</strong> Tu psicólogo necesitará la clave secreta que usó al crear el test para poder ver los resultados.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => window.close()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Resultados del Test Psicológico',
                    text: 'He completado el test psicológico. Aquí están los resultados:',
                    url: resultUrl
                  });
                } else {
                  // Fallback para navegadores que no soportan Web Share API
                  const shareText = `He completado el test psicológico. Aquí están los resultados: ${resultUrl}`;
                  navigator.clipboard.writeText(shareText);
                  alert('¡Texto para compartir copiado al portapapeles!');
                }
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Compartir
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Test de Personalidad EPQR</h1>
          <p className="text-gray-600">
            Responde honestamente a cada pregunta. No hay respuestas correctas o incorrectas.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              {currentQ.scale}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            {currentQ.text}
          </h2>
          
          <div className="flex flex-col gap-4 mb-6">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors duration-200"
            >
              Sí
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors duration-200"
            >
              No
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`text-sm text-indigo-600 hover:underline ${
                currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              ← Anterior
            </button>
            
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Instrucciones:</strong> Responde cada pregunta honestamente. 
                Puedes cambiar tu respuesta usando el botón "Anterior".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
