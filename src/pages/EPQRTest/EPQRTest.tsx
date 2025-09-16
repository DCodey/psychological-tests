import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decryptData } from '../../utils/crypto';
import type { EPQRResult } from '../../types/epqr.types';
import type { TestMode } from '../../types/test.types';
import questions from './epqr-questions';
import EPQRTestPsychologist from './EPQRTestPsychologist';
import EPQRTestPatient from './EPQRTestPatient';

const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

interface PatientData {
  fullName: string;
  age: string;
  secretKey: string;
  encryptedData: string;
}

interface EPQRTestProps {
  mode?: TestMode;
}

const EPQRTest: React.FC<EPQRTestProps> = ({ mode = 'patient' }) => {
  const isPsychologist = mode === 'psychologist';
  const [patientData, setPatientData] = useState<PatientData>({ 
    fullName: '', 
    age: '', 
    secretKey: '',
    encryptedData: '', 
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [testStage, setTestStage] = useState<'test' | 'results' | 'share' | 'secretKey'>('test');
  const [result, setResult] = useState<EPQRResult | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [decryptedData, setDecryptedData] = useState<{
    patientName: string;
    patientAge: string;
    testId: string;
    secretKey: string;
  } | null>(null);

  useEffect(() => {
    const loadTestData = async () => {
      const encryptedData = searchParams.get('data');
      
      if (!encryptedData) {
        console.log('No se encontraron datos cifrados en la URL');
        navigate('/error?message=missing_test_data');
        return;
      }

      try {
        // Decodificar los datos de la URL
        const decodedData = decodeURIComponent(encryptedData);
        
        // Guardar los datos cifrados en el estado
        setPatientData(prev => ({
          ...prev,
          encryptedData: decodedData
        }));
        
        // No pedimos la clave aquí, el test se muestra directamente
        // La clave solo se usará para ver los resultados
        
      } catch (error) {
        console.error('Error al procesar los datos del test:', error);
        navigate('/error?message=invalid_test_data');
      }
    };

    loadTestData();
  }, [location.search, navigate, searchParams]);

  useEffect(() => {
    setAnswers(Array(questions.length).fill(false));
  }, []);

  const calculateResults = (answers: boolean[]) => {
    const result: Omit<EPQRResult, 'id' | 'patientId' | 'patientData'> = {
      E: 0,
      N: 0,
      L: 0,
      date: new Date().toISOString(),
      answers
    };
    answers.forEach((answer, index) => {
      const question = questions[index];
      if (!question) return;
      const points = question.positive ? (answer ? 1 : 0) : (answer ? 0 : 1);
      if (question.scale === 'E') result.E += points;
      else if (question.scale === 'N') result.N += points;
      else if (question.scale === 'L') result.L += points;
    });
    setResult(result as EPQRResult);
    const testId = window.location.pathname.split('/').pop();
    if (testId) {
      const tests = JSON.parse(localStorage.getItem('epqrTests') || '{}');
      if (tests[testId]) {
        const updatedTest = {
          ...tests[testId],
          ...result,
          answers,
          testCompletedAt: new Date().toISOString(),
          testCompleted: true
        };
        tests[testId] = updatedTest;
        localStorage.setItem('epqrTests', JSON.stringify(tests));
        setResult(updatedTest);
      }
    }
  };

  if (isPsychologist && !patientData.fullName) {
    navigate('/');
    return null;
  }

  const handleSecretKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientData.secretKey) {
      alert('Por favor ingresa la clave secreta');
      return;
    }

    try {
      // Descifrar los datos con la clave proporcionada
      const decrypted = await decryptData(patientData.encryptedData, patientData.secretKey);
      
      if (!decrypted) {
        throw new Error('No se pudieron descifrar los datos');
      }

      // Verificar que los datos descifrados tengan la estructura esperada
      const { name, age, secretKey } = decrypted;
      
      if (!name || !age || !secretKey) {
        throw new Error('Datos descifrados inválidos');
      }

      // Guardar los datos descifrados en el estado
      setDecryptedData({
        patientName: name,
        patientAge: age,
        testId: generateId(),
        secretKey: secretKey
      });
      setTestStage('test');
    } catch (error) {
      alert('Clave secreta incorrecta. Por favor, verifique e intente nuevamente.');
    }
  };

  const handleAnswer = async (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    // Si es la última pregunta, generar URL de resultados
    if (currentQuestion === questions.length - 1) {
      try {
        // Obtener los datos del paciente desde la URL
        const patientInfo = await decryptData(patientData.encryptedData, patientData.secretKey);
        
        if (!patientInfo) {
          throw new Error('No se pudieron obtener los datos del paciente');
        }

        const resultId = generateId();
        
        // Guardar los resultados en localStorage (opcional, para referencia local)
        const tests = JSON.parse(localStorage.getItem('epqrTests') || '{}');
        tests[resultId] = { 
          id: resultId,
          patientName: patientInfo.name,
          completedAt: new Date().toISOString(),
          status: 'completed'
        };
        localStorage.setItem('epqrTests', JSON.stringify(tests));        
     
        // Mostrar resultados al paciente
        calculateResults(newAnswers);
        setTestStage('share');
        
      } catch (error) {
        console.error('Error al procesar el test:', error);
        alert('Ocurrió un error al procesar el test. Por favor, intente nuevamente.');
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progress = (currentQuestion / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  // Mostrar formulario para ingresar la clave secreta si es necesario
  if (testStage === 'secretKey' && patientData.encryptedData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Ingrese la clave de acceso</h2>
        <p className="mb-4 text-gray-600">Por favor, ingrese la clave proporcionada por su psicólogo para continuar con el test.</p>
        
        <form onSubmit={handleSecretKeySubmit} className="space-y-4">
          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
              Clave de acceso
            </label>
            <input
              type="password"
              id="secretKey"
              name="secretKey"
              value={patientData.secretKey}
              onChange={(e) => setPatientData(prev => ({...prev, secretKey: e.target.value}))}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar al test
          </button>
        </form>
      </div>
    );
  }

  // Mostrar el componente correspondiente según el modo
  if (isPsychologist) {
    return (
      <EPQRTestPsychologist 
        result={result} 
        decryptedData={decryptedData} 
      />
    );
  }

  // Vista del paciente
  return (
    <EPQRTestPatient
      currentQuestion={currentQuestion}
      currentQ={currentQ}
      progress={progress}
      testStage={testStage}
      onAnswer={handleAnswer}
      onPrevious={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
    />
  );
};

export default EPQRTest;
