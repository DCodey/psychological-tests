import React from 'react';
import { CheckCircle } from 'lucide-react';
import questions from './epqr-questions';

interface EPQRTestPatientProps {
  currentQuestion: number;
  currentQ: { text: string; scale: string };
  progress: number;
  testStage: string;
  onAnswer: (answer: boolean) => void;
  onPrevious: () => void;
}

const EPQRTestPatient = ({
  currentQuestion,
  currentQ,
  progress,
  testStage,
  onAnswer,
  onPrevious
}: EPQRTestPatientProps) => {
  if (testStage === 'share') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Test Completado!</h2>
          <p className="text-gray-600">
            Gracias por completar el test. Los resultados han sido enviados a tu psicólogo.
          </p>
        </div>
        <button
          onClick={() => window.close()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
            {currentQ.scale}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-center mb-6">
          {currentQ.text}
        </h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onAnswer(true)}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded"
          >
            Sí
          </button>
          <button
            onClick={() => onAnswer(false)}
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded"
          >
            No
          </button>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={onPrevious}
            disabled={currentQuestion === 0}
            className={`text-sm text-indigo-600 hover:underline ${
              currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            ← Anterior
          </button>
        </div>
        <div className="h-2 bg-gray-200 mt-6">
          <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default EPQRTestPatient;
