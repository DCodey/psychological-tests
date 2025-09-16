import React from 'react';
import PageLayout from '../../layouts/PageLayout';

const About: React.FC = () => {
  return (
    <PageLayout className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Acerca de PsicoTest
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Una plataforma integral para la evaluación psicológica
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestro Proyecto</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                PsicoTest es una herramienta diseñada para asistir a los profesionales de la salud mental en su labor, pero no reemplaza el diagnóstico profesional personalizado. Los resultados deben ser interpretados por un psicólogo calificado en el contexto de una evaluación integral del paciente.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Cómo Funciona?</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Elije el Test</h3>
                    <p className="mt-2 text-gray-600">
                      Los psicólogos elige el test que desean aplicar a sus pacientes.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Creación de Pruebas</h3>
                    <p className="mt-2 text-gray-600">
                      Los profesionales pueden crear y personalizar pruebas psicológicas para sus pacientes.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Compartir el link a sus pacientes</h3>
                    <p className="mt-2 text-gray-600">
                      Los psicólogos deben compartir el link a sus pacientes para que realicen el test.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">El paciente realiza el test</h3>
                    <p className="mt-2 text-gray-600">
                      El paciente realiza el test y comparte los resultados con su psicólogo atraves de un link.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      5
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Revisión de Resultados</h3>
                    <p className="mt-2 text-gray-600">
                    Los psicólogos revisan los resultados de los tests realizados por sus pacientes,y es necesario que ingrese la clave de seguridad para ver los resultados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
