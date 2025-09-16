import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import EPQRTest from './pages/EPQRTest/EPQRTest';
import ResultView from './pages/ResultView/ResultView';
import SecurePsychologistCreate from './pages/EPQRTest/SecurePsychologistCreate';
import SecurePatientTest from './pages/EPQRTest/SecurePatientTest';
import SecureResultView from './pages/EPQRTest/SecureResultView';
import PsychologistDashboard from './pages/EPQRTest/PsychologistDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Routes>
          {/* Ruta principal para el psicólogo */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta para el dashboard del psicólogo */}
          <Route path="/psychologist" element={<PsychologistDashboard />} />
          
          {/* Ruta para que el psicólogo cree un nuevo test (SISTEMA SEGURO) */}
          <Route path="/psychologist/epqr" element={<SecurePsychologistCreate />} />
          
          {/* Ruta para que el paciente complete el test EPQR (SISTEMA SEGURO) */}
          <Route path="/test/:token" element={<SecurePatientTest />} />
          
          {/* Ruta para ver resultados (SISTEMA SEGURO) */}
          <Route path="/result/:token" element={<SecureResultView />} />
          
          {/* Rutas legacy (mantener para compatibilidad) */}
          <Route path="/test/epqr" element={
            <div className="max-w-4xl mx-auto p-4">
              <EPQRTest mode="patient" />
            </div>
          } />
          
          <Route path="/test" element={
            <div className="max-w-4xl mx-auto p-4">
              <EPQRTest mode="patient" />
            </div>
          } />
          
          <Route path="/result/:testId" element={
            <div className="max-w-4xl mx-auto p-4">
              <ResultView />
            </div>
          } />
          
          {/* Ruta para el test BDI */}
          <Route path="/test/bdi" element={
            <div className="max-w-4xl mx-auto p-4">
              <h1>Inventario de Depresión de Beck (BDI-II)</h1>
              <p>Próximamente disponible</p>
            </div>
          } />
          
          {/* Ruta para el test de Ansiedad */}
          <Route path="/test/anxiety" element={
            <div className="max-w-4xl mx-auto p-4">
              <h1>Escala de Ansiedad de Hamilton (HARS)</h1>
              <p>Próximamente disponible</p>
            </div>
          } />
          
          {/* Ruta para el test de Rosenberg */}
          <Route path="/test/rosenberg" element={
            <div className="max-w-4xl mx-auto p-4">
              <h1>Escala de Autoestima de Rosenberg</h1>
              <p>Próximamente disponible</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
