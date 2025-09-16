import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testStorage, type Test } from '../../services/testStorage';

// Icons from lucide-react
import { Trash2, Eye, FileStack } from 'lucide-react';

import PageLayout from '../../layouts/PageLayout';

const TestsPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = () => {
    const savedTests = testStorage.getAllTests();
    setTests(savedTests);
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta prueba?')) {
      testStorage.deleteTest(id);
      loadTests();
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (isLoading) {
    return (
      <PageLayout className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pruebas...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Pruebas Generadas</h1>
            <p className="mt-2 text-sm text-gray-700">
              Lista de todas las pruebas psicológicas que has generado.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/psychologist"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Crear nueva prueba
            </Link>
          </div>
        </div>

        {tests.length === 0 ? (
          <div className="mt-8 text-center bg-white shadow rounded-lg p-8">
            <FileStack className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pruebas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aún no has generado ninguna prueba. Crea tu primera prueba para comenzar.
            </p>
            <div className="mt-6">
              <Link
                to="/psychologist"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="mr-2">+</span> Nueva Prueba
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Paciente
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Prueba
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Fecha
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {tests.map((test) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {test.patientName || 'Sin nombre'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {test.testName || 'Prueba sin nombre'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(test.date)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/result/${test.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Ver resultados"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => handleDelete(test.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Eliminar prueba"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TestsPage;
