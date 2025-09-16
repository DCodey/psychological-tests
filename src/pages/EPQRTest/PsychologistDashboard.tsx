import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download, Trash2, Calendar, User, RefreshCw } from 'lucide-react';
import { useTestSync } from './TestSyncManager';
import PageLayout from '../../layouts/PageLayout';
import { toast, Toaster } from 'react-hot-toast';

interface PatientData {
  fullName: string;
  email?: string;
  age?: number | string;
  secretKey?: string;
  // Agrega aquí otros campos que necesites
}

interface TestData {
  encryptedPatientData?: string;
  patientData?: PatientData; 
  testType: string;
  createdAt: string;
  status: string;
  completedAt?: string;
  encryptedResults?: string;
  testUrl?: string;
}

interface TestInfo {
  token: string;
  testType: string;
  createdAt: string;
  status: string;
  completedAt?: string;
  testUrl?: string;
  patientData?: PatientData;
}

interface TestDetailsModalProps {
  test: TestInfo | null;
  onClose: () => void;
}

const TestDetailsModal: React.FC<TestDetailsModalProps> = ({ test, onClose }) => {
  if (!test) return null;

  return (
    <div
      className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-50 w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-400 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">Detalles del Test</h3>
              <p className="text-blue-100 text-sm mt-1">ID: {test.token}</p>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer text-blue-100 hover:text-white transition-colors duration-200 p-1 -mr-2"
            >              
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>

          <div className="space-y-8">
            {/* Información General */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Información General</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Paciente</h4>
                  <p className="text-base font-medium text-gray-900 flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {test.patientData?.fullName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Tipo de Test</h4>
                  <p className="text-base font-medium text-gray-900 flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {test.testType}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Edad</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
                    {test.patientData?.age} años
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Creado</h4>
                  <p className="text-base font-medium text-gray-900 flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(test.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {test.completedAt && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Completado</h4>
                    <p className="text-base font-medium text-gray-900 flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(test.completedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de Acceso */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Información de Acceso</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    URL del Test
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-indigo-300 transition-colors duration-200">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <input
                        type="text"
                        readOnly
                        value={test.testUrl}
                        className="block w-full rounded-none rounded-l-lg pl-4 pr-10 py-3 text-sm bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(test.testUrl || '');
                          toast.success('URL copiada al portapapeles');
                        } catch (error) {
                          toast.error('Error al copiar la URL');
                        }
                      }}
                      className="cursor-pointer inline-flex items-center px-4 py-2 border-l border-gray-200 bg-white text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      title="Copiar al portapapeles"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {test.patientData?.secretKey && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Clave de Acceso
                    </label>
                    <div className="mt-1 flex rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-indigo-300 transition-colors duration-200">
                      <div className="relative flex items-stretch flex-grow focus-within:z-10">
                        <input
                          type="text"
                          readOnly
                          value={test.patientData?.secretKey}
                          className="block w-full rounded-none rounded-l-lg pl-4 pr-10 py-3 text-sm bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        />
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(test.patientData?.secretKey || '');
                          toast.success('Clave copiada al portapapeles');
                        }}
                        className="cursor-pointer inline-flex items-center px-4 py-2 border-l border-gray-200 bg-white text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        title="Copiar al portapapeles"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PsychologistDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<TestInfo | null>(null);
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

          console.log("testDataStr", testDataStr);
          if (testDataStr) {
            try {
              const testData: TestData = JSON.parse(testDataStr);

              let patientData = testData.patientData
              
              // Finalmente, intentar con encryptedPatientData si existe
              if (testData?.encryptedPatientData) {
                try {
                  // Manejar diferentes formatos de datos cifrados
                  let decryptedData;
                  if (typeof testData.encryptedPatientData === 'string') {
                    if (testData.encryptedPatientData.includes('.')) {
                      // Formato JWT
                      const payload = testData.encryptedPatientData.split('.')[1];
                      const decodedPayload = atob(payload);
                      decryptedData = JSON.parse(decodedPayload);

                      // Extraer el nombre del payload decodificado
                      if (decryptedData.patientData?.fullName) {
                        patientData = decryptedData.patientData;
                      }
                    } else {
                      // Intentar parsear directamente como JSON
                      try {
                        const parsed = JSON.parse(testData.encryptedPatientData);
                        if (parsed.patientData?.fullName) {
                          patientData = parsed.patientData;
                        } else if (parsed.fullName) {
                          patientData = parsed.fullName;
                        } else if (parsed.name) {
                          patientData = parsed.name;
                        }
                      } catch (e) {
                        console.error('Error al parsear encryptedPatientData:', e);
                      }
                    }
                  }
                } catch (e) {
                  console.error('Error al procesar datos del paciente:', e);
                }
              }
              

              const testInfo: TestInfo = {
                token: key.replace('test_', ''),
                testType: testData.testType || 'EPQR',
                createdAt: testData.createdAt || new Date().toISOString(),
                status: testData.status || 'pending',
                completedAt: testData.completedAt,
                testUrl: testData.testUrl || `${window.location.origin}/test/${key.replace('test_', '')}`,                
                patientData: patientData,

              };
              allTests.push(testInfo);
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
                console.log(testData);
                allTests.push({
                  token,
                  testType: 'EPQR',
                  createdAt: testData.completedAt || new Date().toISOString(),
                  status: 'completed',
                  completedAt: testData.completedAt,
                  patientData: testData?.patientData,
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
    <PageLayout>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">

          {/* Tests List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Tests Creados</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={syncTests}
                    disabled={isSyncing}
                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Actualizar lista"
                  >
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  </button>
                  <span className="text-sm text-gray-500">{tests.length} tests</span>
                </div>
              </div>
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
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {tests.map((test) => (
                  <div
                    key={test.token}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTest(test)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {test.patientData?.fullName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {new Date(test.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center text-gray-700 text-sm">
                              <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              {test.patientData?.secretKey || 'Sin clave'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadTest(test.token);
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              title="Descargar backup"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTest(test.token);
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              title="Eliminar test"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}            
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
      </div>

      {/* Modal de detalles del test */}
      <TestDetailsModal
        test={selectedTest}
        onClose={() => setSelectedTest(null)}
      />
    </PageLayout >
  );
}
