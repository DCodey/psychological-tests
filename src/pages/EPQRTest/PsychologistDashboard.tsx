import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download, Trash2, Calendar, User, RefreshCw } from 'lucide-react';
import { useTestSync } from './TestSyncManager';

interface TestData {
  encryptedPatientData: string;
  testType: string;
  createdAt: string;
  status: string;
  completedAt?: string;
  encryptedResults?: string;
}

interface TestInfo {
  token: string;
  patientName: string;
  testType: string;
  createdAt: string;
  status: string;
  completedAt?: string;
}

export default function PsychologistDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { syncTests, isSyncing, lastSync } = useTestSync();

  useEffect(() => {
    loadTests();
  }, []);

  // Recargar tests cuando se complete la sincronización
  useEffect(() => {
    if (!isSyncing && lastSync) {
      loadTests();
    }
  }, [isSyncing, lastSync]);

  const loadTests = () => {
    try {
      const allTests: TestInfo[] = [];
      
      // Buscar todos los tests en localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('test_')) {
          const testDataStr = localStorage.getItem(key);
          if (testDataStr) {
            try {
              const testData: TestData = JSON.parse(testDataStr);
              const token = key.replace('test_', '');
              
              // Intentar extraer el nombre del paciente de los datos cifrados
              // (esto es solo para mostrar, no desciframos completamente)
              allTests.push({
                token,
                patientName: 'Paciente', // Nombre genérico
                testType: testData.testType,
                createdAt: testData.createdAt,
                status: testData.status,
                completedAt: testData.completedAt
              });
            } catch (error) {
              console.error('Error al procesar test:', error);
            }
          }
        }
      }
      
      // También buscar tests del paciente
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('patient_test_')) {
          const token = key.replace('patient_test_', '');
          
          // Verificar si ya existe en tests del psicólogo
          const exists = allTests.some(t => t.token === token);
          
          if (!exists) {
            const testDataStr = localStorage.getItem(key);
            if (testDataStr) {
              try {
                const testData = JSON.parse(testDataStr);
                allTests.push({
                  token,
                  patientName: 'Paciente',
                  testType: 'EPQR',
                  createdAt: testData.completedAt || new Date().toISOString(),
                  status: 'completed',
                  completedAt: testData.completedAt
                });
              } catch (error) {
                console.error('Error al procesar test del paciente:', error);
              }
            }
          }
        }
      }
      
      // Ordenar por fecha de creación (más recientes primero)
      allTests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setTests(allTests);
    } catch (error) {
      console.error('Error al cargar tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = (token: string) => {
    navigate(`/result/${token}`);
  };

  const handleDeleteTest = (token: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este test? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(`test_${token}`);
      loadTests(); // Recargar la lista
    }
  };

  const handleDownloadTest = (token: string) => {
    try {
      const testDataStr = localStorage.getItem(`test_${token}`);
      if (testDataStr) {
        const testData = JSON.parse(testDataStr);
        const blob = new Blob([JSON.stringify(testData, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test_${token}_backup.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error al descargar test:', error);
      alert('Error al descargar el test');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Panel del Psicólogo</h1>
              <p className="text-gray-600">Gestiona los tests psicológicos de tus pacientes</p>
              {lastSync && (
                <p className="text-sm text-gray-500 mt-1">
                  Última sincronización: {lastSync.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={syncTests}
                disabled={isSyncing}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </button>
              <button
                onClick={() => navigate('/psychologist/epqr')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Crear Nuevo Test
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tests List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Tests Creados</h2>
          </div>
          
          {tests.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tests creados</h3>
              <p className="text-gray-600 mb-4">Crea tu primer test para comenzar a evaluar pacientes.</p>
              <button
                onClick={() => navigate('/psychologist/epqr')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Crear Primer Test
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tests.map((test) => (
                <div key={test.token} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {test.patientName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                          {getStatusText(test.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Creado: {new Date(test.createdAt).toLocaleDateString()}
                        </span>
                        {test.completedAt && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Completado: {new Date(test.completedAt).toLocaleDateString()}
                          </span>
                        )}
                        <span>Token: {test.token.substring(0, 8)}...</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {test.status === 'completed' && (
                        <button
                          onClick={() => handleViewResults(test.token)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                          title="Ver resultados"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDownloadTest(test.token)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="Descargar backup"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTest(test.token)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Eliminar test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Instrucciones:</strong> Los tests se almacenan localmente en tu navegador. 
                Para ver los resultados, necesitarás la clave secreta que usaste al crear el test.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
