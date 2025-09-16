import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { decryptData, verifyHash } from '../../utils/crypto';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import TemperamentChart from '../../components/TemperamentChart/TemperamentChart';
import { determineTemperament, TEMPERAMENT_TYPES } from '../../types/temperament.types';

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
  completedAt?: string;
  encryptedResults?: string;
}

interface TestResults {
  responses: boolean[];
  testType: string;
  completedAt: string;
  integrityHash: string;
}

export default function SecureResultView() {
  // Hooks deben ir siempre al principio del componente
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [testData, setTestData] = useState<TestData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [scores, setScores] = useState<{ E: number; N: number; L: number } | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token de test no válido');
      return;
    }

    loadTestData();
  }, [token]);

  const loadTestData = () => {
    try {
      // Obtener datos del test desde la URL
      const urlParams = new URLSearchParams(window.location.search);
      const encryptedData = urlParams.get('data');
      
      if (!encryptedData) {
        throw new Error('Datos del test no encontrados en la URL. Asegúrate de que el enlace sea correcto.');
      }

      // Los datos están cifrados en la URL, necesitamos la clave secreta para descifrarlos
      // Por ahora, solo verificamos que los datos existen
      setTestData({
        encryptedPatientData: encryptedData,
        testType: 'EPQR',
        createdAt: new Date().toISOString(),
        status: 'completed'
      });

    } catch (error) {
      console.error('Error al cargar el test:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      setError('Por favor, ingrese la clave secreta');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (!testData) {
        throw new Error('Datos del test no encontrados');
      }

      // Descifrar los datos completos de la URL
      const decryptedCompleteData = decryptData(testData.encryptedPatientData, secretKey);
      
      // Verificar que los datos tienen la estructura esperada
      if (!decryptedCompleteData.patientData || !decryptedCompleteData.testResults) {
        throw new Error('Los datos del test están corruptos o incompletos');
      }

      // Establecer datos del paciente
      setPatientData(decryptedCompleteData.patientData);

      // Establecer resultados del test
      const testResults = decryptedCompleteData.testResults;
      
      // Verificar integridad de las respuestas
      if (testResults.integrityHash) {
        
        if (!verifyHash(testResults.responses, testResults.integrityHash)) {
          throw new Error('Los datos del test han sido modificados');
        }
      }
      
      setTestResults(testResults);
      
      // Calcular puntuaciones del EPQR
      await calculateScores(testResults.responses);

      setShowKeyInput(false);
      
    } catch (error) {
      console.error('Error al descifrar datos:', error);
      setError('Clave secreta incorrecta o datos corruptos');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScores = async (responses: boolean[]) => {
    try {
      // Importar las preguntas del EPQR
      const module = await import('./epqr-questions');
      const questions = module.default;
      
      const newScores = { E: 0, N: 0, L: 0 };
      
      responses.forEach((answer, index) => {
        const question = questions[index];
        if (!question) return;
        
        const points = question.positive ? (answer ? 1 : 0) : (answer ? 0 : 1);
        
        switch (question.scale) {
          case 'E':
            newScores.E += points;
            break;
          case 'N':
            newScores.N += points;
            break;
          case 'L':
            newScores.L += points;
            break;
        }
      });
      
      setScores(newScores);
    } catch (error) {
      console.error('Error al calcular puntuaciones:', error);
      setError('Error al procesar los resultados del test');
    }
  };

  const getScaleName = (scale: string) => {
    switch (scale) {
      case 'E': return 'Extraversión';
      case 'N': return 'Neuroticismo';
      case 'L': return 'Escala de Mentira';
      default: return scale;
    }
  };

  const interpretScore = (score: number, scale: string) => {
    if (scale === 'E' || scale === 'N') {
      if (score <= 5) return 'Baja';
      if (score <= 15) return 'Media';
      return 'Alta';
    } else { // L
      if (score <= 2) return 'Baja';
      if (score <= 5) return 'Media';
      return 'Alta';
    }
  };

  const calculatePercentage = (score: number, scale: string) => {
    if (scale === 'E' || scale === 'N') {
      return (score / 24) * 100; // 24 es el máximo para E y N
    } else { // L
      return (score / 7) * 100; // 7 es el máximo para L
    }
  };

  if (showKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Acceso a Resultados
          </h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Ingrese la clave secreta para descifrar los resultados del test.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                Clave secreta
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? "text" : "password"}
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese la clave secreta"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Descifrando...' : 'Ver Resultados'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Descifrando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError('');
              setShowKeyInput(true);
              setSecretKey('');
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg mr-2"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // reportRef y patientName ya fueron movidos al principio del componente

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">        
        <div id="report-content" ref={reportRef} className="bg-white md:p-6 p-4 rounded-lg shadow-md">
          {/* Header */}
          <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Resultados del Test EPQR
          </h1>
          {patientData && (
            <div className="text-gray-600 text-sm md:text-base">
              <p><strong>Paciente:</strong> {patientData.fullName}</p>
              <p><strong>Edad:</strong> {patientData.age} años</p>
              <p><strong>Fecha de realización:</strong> {testResults?.completedAt ? new Date(testResults.completedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          )}
        </div>

        {/* Scores */}
        {scores && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Puntuaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(scores).map(([scale, score]) => (
                <div key={scale} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-md md:text-xl font-semibold text-gray-800 mb-2">
                    {getScaleName(scale)}
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-indigo-600 h-4 rounded-full" 
                      style={{ width: `${calculatePercentage(score, scale)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Puntuación: {score}/{scale === 'L' ? 7 : 24}</span>
                    <span className="font-medium">{interpretScore(score, scale)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responses */}
        {testResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Respuestas Detalladas</h2>
            <div className="space-y-2 text-sm md:text-base overflow-y-auto h-[300px]">
              {testResults.responses.map((response, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm md:text-base text-gray-700">Pregunta {index + 1}</span>
                  <span className={`px-2 py-1 rounded text-sm md:text-base font-medium ${
                    response ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {response ? 'Sí' : 'No'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Temperament Chart */}
        {scores && (
          <div className="mb-6">
            <TemperamentChart eScore={scores.E} nScore={scores.N} />
          </div>
        )}

        {/* Temperament Analysis */}
        {scores && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Análisis de Temperamento</h2>
            {(() => {
              const temperamentKey = determineTemperament(scores.E, scores.N);
              const temperament = TEMPERAMENT_TYPES[temperamentKey];
              
              return (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {temperament.name}
                  </h3>
                  <p className="text-gray-700 mb-4">{temperament.description}</p>
                  
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">Características:</h4>
                  <ul className="list-disc pl-5 text-gray-700 mb-4">
                    {temperament.characteristics.map((char, index) => (
                      <li key={index}>{char}</li>
                    ))}
                  </ul>
                  
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">Recomendaciones:</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {temperament.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </>
              );
            })()}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
