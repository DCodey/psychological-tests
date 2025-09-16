import { useNavigate } from 'react-router-dom';
import type { EPQRResult } from '../../types/epqr.types';

interface EPQRTestPsychologistProps {
  result: EPQRResult | null;
  decryptedData: {
    patientName: string;
    patientAge: string;
  } | null;
}

const EPQRTestPsychologist = ({ result, decryptedData }: EPQRTestPsychologistProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Resultados del Test EPQR</h1>
      
      {result ? (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Datos del Paciente</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{decryptedData?.patientName || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Edad</p>
                <p className="font-medium">{decryptedData?.patientAge || 'No disponible'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Puntuaciones</h2>
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

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Volver al inicio
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Imprimir resultados
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay resultados para mostrar.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
};

export default EPQRTestPsychologist;
