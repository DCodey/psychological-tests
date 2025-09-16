import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { EPQRResult, EPQRScaleInterpretation } from '../../types/epqr.types';
import { decryptData, decryptSecretKey } from '../../utils/crypto';
import { useEffect, useState } from 'react';
import { Copy, Share2 } from 'lucide-react';

// Componente de botón simple para reemplazar el de shadcn/ui
const Button = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'default'
}: { 
  children: React.ReactNode; 
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'outline';
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantStyles = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export function EPQRResultView() {
  const { patientName, resultId } = useParams<{ patientName: string; resultId: string }>();
  const [result, setResult] = useState<Omit<EPQRResult, 'answers'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Obtener y descifrar la clave secreta de la URL si existe
  useEffect(() => {
    const keyFromUrl = searchParams.get('key');
    if (keyFromUrl) {
      try {
        const decryptedKey = decryptSecretKey(keyFromUrl);
        setSecretKey(decryptedKey);
      } catch (error) {
        console.error('Error al descifrar la clave secreta:', error);
        setError('La clave de acceso es inválida o está corrupta');
        setShowKeyInput(true);
      }
    } else {
      setShowKeyInput(true);
    }
  }, [location.search]);

  // Decodificar el nombre del paciente para mostrarlo
  const decodedPatientName = patientName 
    ? decodeURIComponent(patientName).replace(/-/g, ' ')
    : 'Paciente';

  useEffect(() => {
    const loadResult = async () => {
      if (!secretKey) {
        setShowKeyInput(true);
        setLoading(false);
        return;
      }

      try {
        // En un entorno real, aquí harías una petición a tu API
        const savedResults = JSON.parse(localStorage.getItem('epqrTests') || '{}');
        
        if (!resultId || !savedResults[resultId]) {
          throw new Error('Resultado no encontrado');
        }
        
        // Verificar si los resultados están cifrados
        const resultData = savedResults[resultId];
        
        // Si los resultados están cifrados, intentar descifrarlos
        if (resultData.encrypted) {
          const decryptedData = decryptData(resultData.encrypted, secretKey);
          setResult(decryptedData);
        } else {
          // Si no están cifrados, usarlos directamente (para compatibilidad con versiones anteriores)
          setResult(resultData);
        }
        const savedResult = savedResults[resultId as string];
        
        if (savedResult) {
          setResult(savedResult);
        } else {
          setError('No se encontraron resultados para este ID');
        }
      } catch (err) {
        console.error('Error al cargar resultados:', err);
        setError('Error al cargar los resultados');
      } finally {
        setLoading(false);
      }
    };

    if (resultId) {
      loadResult();
    }
  }, [resultId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/result/${resultId}`;
    navigator.clipboard.writeText(url);
    // Aquí podrías agregar un toast de confirmación
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Resultados del Test de Personalidad EPQR',
          text: 'Revisa mis resultados del test de personalidad EPQR',
          url: window.location.href,
        });
      } else {
        handleCopyLink();
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey.trim()) {
      setLoading(true);
      setError(null);
      setShowKeyInput(false);
      // El efecto se disparará nuevamente porque cambiamos secretKey
    }
  };

  if (showKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Clave de Seguridad Requerida</h2>
          <p className="text-gray-600 mb-6">
            Por favor, ingrese la clave de seguridad proporcionada por el psicólogo para ver los resultados de {decodedPatientName}.
          </p>
          
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                Clave de seguridad
              </label>
              <input
                type="password"
                id="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese la clave de seguridad"
                required
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
            >
              Ver Resultados
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando resultados de {decodedPatientName}...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Resultados de {decodedPatientName}</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || 'No se encontraron resultados'}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // Función para interpretar los resultados
  const interpretScore = (score: number, scale: keyof EPQRScaleInterpretation) => {
    // Usamos la misma lógica que en el archivo de interpretación
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

  // Función para obtener el nombre completo de la escala
  const getScaleName = (scale: string) => {
    switch (scale) {
      case 'E': return 'Extraversión';
      case 'N': return 'Neuroticismo';
      case 'L': return 'Escala de Mentira';
      default: return scale;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Resultados de {decodedPatientName}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Resultados del Test de Personalidad EPQR</h1>
        <p className="text-gray-600 mb-6">Fecha de realización: {new Date(result.date).toLocaleDateString()}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {result && (['E', 'N', 'L'] as const).map((scale) => (
            <div key={scale} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {getScaleName(scale)}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-indigo-600 h-4 rounded-full" 
                  style={{ width: `${(result[scale] / 12) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Puntuación: {result[scale]}/12</span>
                <span>{interpretScore(result[scale], scale)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Interpretación</h3>
          <p className="text-gray-600 mb-6">
            Estos resultados deben ser interpretados por un profesional de la psicología. 
            Este informe es solo informativo y no constituye un diagnóstico.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Recomendamos compartir estos resultados con un profesional de la psicología para una interpretación adecuada.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button 
            onClick={handleCopyLink}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar enlace
          </Button>
          <Button 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
        </div>
      </div>
    </div>
  );
}
