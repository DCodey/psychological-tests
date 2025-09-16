import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { EPQRResult } from '../../types/epqr.types';

interface TestResults {
  responses: boolean[];
  patientName: string;
  patientAge: number | string;
  testCompletedAt: string;
  secretKey: string;
  testType: string;
}

const ResultView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<EPQRResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Cargar los resultados automáticamente desde la URL
  useEffect(() => {
    const loadTestData = async () => {
      const encryptedData = searchParams.get('data');
      
      if (!encryptedData) {
        setError('No se encontraron datos de resultados en la URL');
        return;
      }
      
      try {
        // Guardar los datos cifrados en el estado
        setTestResults({
          responses: [],
          patientName: 'Paciente',
          patientAge: 0,
          testCompletedAt: new Date().toISOString(),
          secretKey: '',
          testType: 'EPQR'
        });
      } catch (err) {
        setError('Error al cargar los datos del test');
        console.error(err);
      }
    };
    
    loadTestData();
  }, [searchParams]);

  const calculateResults = (responses: boolean[]): EPQRResult => {
    // Lógica para calcular los resultados basados en las respuestas
    const eCount = responses.filter((r, i) => i < 10 && r).length;
    const nCount = responses.filter((r, i) => i >= 10 && i < 20 && r).length;
    const pCount = responses.filter((r, i) => i >= 20 && i < 30 && r).length;
    
    return {
      E: eCount,
      N: nCount,
      P: pCount,
      L: 0, // Valor por defecto para L (Mentira)
      id: 'temp-id',
      patientId: 'temp-patient-id',
      date: new Date().toISOString(),
      testDate: new Date().toISOString(),
      answers: responses,
      responses: responses,
      patientData: {
        fullName: testResults?.patientName || 'Paciente',
        age: Number(testResults?.patientAge || '0'),
        createdAt: new Date().toISOString(),
        testCompleted: true
      },
      patientName: testResults?.patientName || 'Paciente',
      patientAge: testResults?.patientAge || 0,
      secretKey: secretKey,
      testId: 'temp-test-id'
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      setError('Por favor ingrese la clave secreta');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulamos la verificación de la clave secreta
      // En una implementación real, aquí se descifrarían los datos con la clave
      if (secretKey !== 'clave-secreta-123') { // Clave de ejemplo
        throw new Error('Clave secreta incorrecta');
      }
      
      // Si la clave es correcta, mostramos los resultados
      setShowResults(true);
      
      // Si tenemos datos del test, calculamos los resultados
      if (testResults) {
        const calculatedResult = calculateResults(testResults.responses);
        setResult(calculatedResult);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al verificar la clave: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResults && result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Resultados del Test</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Datos del Paciente</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium">{result.patientName || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Edad</p>
              <p className="font-medium">{result.patientAge || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha del Test</p>
              <p className="font-medium">
                {new Date(result.testDate || result.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Puntuaciones</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-700 font-medium">Extroversión (E)</p>
              <p className="text-2xl font-bold text-blue-800">{result.E}</p>
              <p className="text-xs text-blue-600 mt-1">Alta: {result.E > 12 ? 'Sí' : 'No'}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-purple-700 font-medium">Neuroticismo (N)</p>
              <p className="text-2xl font-bold text-purple-800">{result.N}</p>
              <p className="text-xs text-purple-600 mt-1">Alta: {result.N > 14 ? 'Sí' : 'No'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-700 font-medium">Psicoticismo (P)</p>
              <p className="text-2xl font-bold text-green-800">{result.P}</p>
              <p className="text-xs text-green-600 mt-1">Alta: {result.P > 8 ? 'Sí' : 'No'}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-sm text-yellow-700 font-medium">Mentira (L)</p>
              <p className="text-2xl font-bold text-yellow-800">{result.L}</p>
              <p className="text-xs text-yellow-600 mt-1">Alta: {result.L > 5 ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Ver Resultados del Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
            Clave de acceso
          </label>
          <input
            type="password"
            id="secretKey"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ingrese la clave secreta"
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Verificando...' : 'Ver Resultados'}
        </button>
      </form>
    </div>
  );
};

export default ResultView;
